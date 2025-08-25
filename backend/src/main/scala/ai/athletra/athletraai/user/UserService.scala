package ai.athletra.athletraai.user

import com.augustnagro.magnum.DbTx
import ai.athletra.athletraai.*
import ai.athletra.athletraai.email.{EmailData, EmailScheduler, EmailTemplates}
import ai.athletra.athletraai.http.LanguageContext
import ai.athletra.athletraai.http.LanguageContext.{DefaultLanguage, SupportedLanguages}
import ai.athletra.athletraai.http.MessageService
import ai.athletra.athletraai.logging.Logging
import ai.athletra.athletraai.security.{ApiKey, ApiKeyService}
import ai.athletra.athletraai.util.*
import ai.athletra.athletraai.util.Strings.{Id, toLowerCased}
import ox.*
import ox.either.ok

import scala.concurrent.duration.Duration

class UserService(
    userModel: UserModel,
    emailScheduler: EmailScheduler,
    emailTemplates: EmailTemplates,
    apiKeyService: ApiKeyService,
    idGenerator: IdGenerator,
    clock: Clock,
    config: UserConfig,
    messageService: MessageService
) extends Logging:
  // the message keys that are translated for the user in case of validation failures
  private val LoginAlreadyUsed = "user.error.loginAlreadyUsed"
  private val EmailAlreadyUsed = "user.error.emailAlreadyUsed"
  private val IncorrectLoginOrPassword = "user.error.incorrectLoginOrPassword"

  def registerNewUser(login: String, email: String, password: String, language: String = DefaultLanguage, timezone: String = "UTC")(using
      DbTx
  ): Either[Fail, ApiKey] =
    val loginClean = login.trim()
    val emailClean = email.trim()
    
    // Validate language and reject unsupported languages
    if !LanguageContext.isSupported(language) then
      return Left(Fail.IncorrectInput(messageService.getMessage("validation.unsupportedLanguage", language, language, SupportedLanguages.mkString(", "))))

    def failIfDefined(op: Option[User], msgKey: String): Either[Fail, Unit] =
      if op.isDefined then Left(Fail.IncorrectInput(messageService.getMessage(msgKey, language))) else Right(())

    def checkUserDoesNotExist(): Either[Fail, Unit] = for
      _ <- failIfDefined(userModel.findByLogin(loginClean.toLowerCased), LoginAlreadyUsed)
      _ <- failIfDefined(userModel.findByEmail(emailClean.toLowerCased), EmailAlreadyUsed)
    yield ()

    def doRegister(): ApiKey =
      val id = idGenerator.nextId[User]()
      val now = clock.now()
      val user =
        User(
          id,
          loginClean,
          loginClean.toLowerCased,
          emailClean.toLowerCased,
          User.hashPassword(password), // TODO: validate password
          language,
          timezone,
          "metric",
          now,
          now
        )
      val confirmationEmail = emailTemplates.registrationConfirmation(loginClean, language)
      logger.debug(s"Registering new user: ${user.emailLowerCase}, with id: ${user.id}")
      userModel.insert(user)
      emailScheduler.schedule(EmailData(emailClean, confirmationEmail))
      apiKeyService.create(user.id, config.defaultApiKeyValid)
    end doRegister

    either:
      validateUserData(Some(loginClean), Some(emailClean), Some(password), Some(language)).ok()
      // performing explicit checks in the DB to get nice, user-friendly error messages
      checkUserDoesNotExist().ok()
      doRegister()
  end registerNewUser

  def findById(id: Id[User])(using DbTx): Either[Fail, User] = userOrNotFound(userModel.findById(id))

  def login(loginOrEmail: String, password: String, apiKeyValid: Option[Duration])(using DbTx): Either[Fail, ApiKey] = either:
    val loginOrEmailClean = loginOrEmail.trim()
    val user = userOrNotFound(userModel.findByLoginOrEmail(loginOrEmailClean.toLowerCased)).ok()
    verifyPassword(user, password, validationErrorMsg = messageService.getMessage(IncorrectLoginOrPassword, user.language)).ok()
    apiKeyService.create(user.id, apiKeyValid.getOrElse(config.defaultApiKeyValid))

  def logout(id: Id[ApiKey])(using DbTx): Unit = apiKeyService.invalidate(id)

  def changeUser(
    userId: Id[User],
    newLogin: String,
    newEmail: String,
    language: Option[String] = None,
    timezone: Option[String] = None,
    unitSystem: Option[String] = None
  )(using DbTx): Either[Fail, Unit] =
    val newLoginClean = newLogin.trim()
    val newEmailClean = newEmail.trim()
    val newEmailtoLowerCased = newEmailClean.toLowerCased

    val lang = language.getOrElse {
      findById(userId).map(_.language).getOrElse(throw new RuntimeException(messageService.getMessage("user.does.not.exists", DefaultLanguage)))
    }

    def changeLogin(): Either[Fail, Boolean] =
      val newLoginToLowerCased = newLoginClean.toLowerCased
      userModel.findByLogin(newLoginToLowerCased) match
        case Some(user) if user.id != userId => Left(Fail.IncorrectInput(messageService.getMessage(LoginAlreadyUsed, lang)))
        case Some(user) if user.login == newLoginClean => Right(false)
        case _ =>
          either:
            validateLogin().ok()
            logger.debug(s"Changing login for user: $userId, to: $newLoginClean")
            userModel.updateLogin(userId, newLoginClean, newLoginToLowerCased)
            true
      end match
    end changeLogin

    def validateLogin() = validateUserData(Some(newLoginClean), languageOpt = Some(lang))

    def changeEmail(): Either[Fail, Boolean] =
      userModel.findByEmail(newEmailtoLowerCased) match
        case Some(user) if user.id != userId => Left(Fail.IncorrectInput(messageService.getMessage(EmailAlreadyUsed, lang)))
        case Some(user) if user.emailLowerCase == newEmailtoLowerCased => Right(false)
        case _ =>
          either:
            validateEmail().ok()
            logger.debug(s"Changing email for user: $userId, to: $newEmailClean")
            userModel.updateEmail(userId, newEmailtoLowerCased)
            true

    def validateEmail() = validateUserData(emailOpt = Some(newEmailtoLowerCased), languageOpt = Some(lang))

    def changeLanguage(): Either[Fail, Boolean] =
      language match
        case None => Right(false)
        case Some(lang) =>
          either:
            validateUserData(languageOpt = Some(lang)).ok()
            logger.debug(s"Changing language for user: $userId, to: $lang")
            userModel.updateLanguage(userId, lang)
            true

    def changeUnitSystem(): Either[Fail, Boolean] =
      unitSystem match
        case None => Right(false)
        case Some(units) =>
          either:
            validateUnitSystem().ok()
            logger.debug(s"Changing unit system for user: $userId, to: $units")
            userModel.updateUnitSystem(userId, units)
            true

    def validateUnitSystem() =
      unitSystem match
        case Some(units) if !List("metric", "imperial").contains(units) =>
          Left(Fail.IncorrectInput(messageService.getMessage("user.error.unsupportedUnitSystem", lang, units)))
        case _ => Right(())

    def sendMail(user: User): Unit =
      val confirmationEmail = emailTemplates.profileDetailsChangeNotification(user.login, user.language)
      emailScheduler.schedule(EmailData(user.emailLowerCase, confirmationEmail))

    either:
      val loginUpdated = changeLogin().ok()
      val emailUpdated = changeEmail().ok()
      val languageUpdated = changeLanguage().ok()
      val unitSystemUpdated = changeUnitSystem().ok()

      // Update timezone if provided
      timezone.foreach(tz => userModel.updateTimezone(userId, tz))

      val anyUpdate = loginUpdated || emailUpdated || languageUpdated || unitSystemUpdated || timezone.isDefined
      if anyUpdate then sendMail(findById(userId).ok())
  end changeUser

  def changePassword(userId: Id[User], currentPassword: String, newPassword: String)(using DbTx): Either[Fail, ApiKey] =
    def validateUserPassword(userId: Id[User], currentPassword: String): Either[Fail, User] =
      for
        user <- userOrNotFound(userModel.findById(userId))
        _ <- verifyPassword(user, currentPassword, validationErrorMsg = "Incorrect current password")
      yield user

    def validateNewPassword(userLanguage: String): Either[Fail, Unit] = validateUserData(None, None, Some(newPassword), languageOpt = Some(userLanguage))

    def updateUserPassword(user: User, newPassword: String): Unit =
      logger.debug(s"Changing password for user: ${user.id}")
      userModel.updatePassword(user.id, User.hashPassword(newPassword))
      val confirmationEmail = emailTemplates.passwordChangeNotification(user.login, user.language)
      emailScheduler.schedule(EmailData(user.emailLowerCase, confirmationEmail))

    def invalidateKeysAndCreateNew(user: User): ApiKey =
      apiKeyService.invalidateAllForUser(user.id)
      apiKeyService.create(user.id, config.defaultApiKeyValid)

    either:
      val user = validateUserPassword(userId, currentPassword).ok()
      validateNewPassword(user.language).ok()
      updateUserPassword(user, newPassword)
      invalidateKeysAndCreateNew(user)
  end changePassword

  private def userOrNotFound(u: Option[User]): Either[Fail, User] = u match
    case Some(user) => Right(user)
    case None       => Left(Fail.Unauthorized(messageService.getMessage(IncorrectLoginOrPassword, DefaultLanguage)))

  private def verifyPassword(user: User, password: String, validationErrorMsg: String): Either[Fail, Unit] =
    if user.verifyPassword(password) == PasswordVerificationStatus.Verified then Right(()) else Left(Fail.Unauthorized(validationErrorMsg))

  private[user] def validateUserData(
    loginOpt: Option[String] = None, 
    emailOpt: Option[String] = None, 
    passwordOpt: Option[String] = None,
    languageOpt: Option[String] = None
  ): Either[Fail, Unit] =
    val userLanguage = languageOpt.getOrElse(DefaultLanguage)
    def validateLogin(loginOpt: Option[String]): Either[String, Unit] =
      loginOpt.map(_.trim) match
        case Some(login) => if login.length >= MinLoginLength then ValidationOk else Left(messageService.getMessage("user.error.loginTooShort", userLanguage))
        case None        => ValidationOk

    def validateEmail(emailOpt: Option[String]): Either[String, Unit] =
      emailOpt.map(_.trim) match
        case Some(email) => if emailRegex.findFirstMatchIn(email).isDefined then ValidationOk else Left(messageService.getMessage("user.error.invalidEmail", userLanguage))
        case None        => ValidationOk

    def validatePassword(passwordOpt: Option[String]): Either[String, Unit] =
      passwordOpt.map(_.trim) match
        case Some(password) => if password.nonEmpty then ValidationOk else Left(messageService.getMessage("user.error.passwordEmpty", userLanguage))
        case None           => ValidationOk

    def validateLanguage(languageOpt: Option[String]): Either[String, Unit] =
      languageOpt match
        case Some(lang) if !LanguageContext.isSupported(lang) => Left(messageService.getMessage("validation.unsupportedLanguage", userLanguage, lang, SupportedLanguages.mkString(", ")))
        case _ => ValidationOk

    (for
      _ <- validateLogin(loginOpt)
      _ <- validateEmail(emailOpt)
      _ <- validatePassword(passwordOpt)
      _ <- validateLanguage(languageOpt)
    yield ()).left.map(Fail.IncorrectInput(_))

  private val ValidationOk = Right(())
  private[user] val MinLoginLength = 3
  private val emailRegex =
    """^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$""".r
end UserService


