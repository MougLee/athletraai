package ai.athletra.athletraai.user

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import ai.athletra.athletraai.http.MessageService

class UserValidatorSpec extends AnyFlatSpec with Matchers:
  // Create a mock MessageService for testing
  private val mockMessageService = new MessageService:
    override def getMessage(key: String, language: String, args: Any*): String = 
      key match
        case "user.error.loginTooShort" => "Login is too short!"
        case "user.error.invalidEmail" => "Invalid e-mail format!"
        case "user.error.passwordEmpty" => "Password cannot be empty!"
        case "validation.unsupportedLanguage" => s"Unsupported language: ${args.head}"
        case _ => key

  // Create a minimal UserService instance for testing
  private val userService = new UserService(
    userModel = null, // Not used in validation tests
    emailScheduler = null, // Not used in validation tests
    emailTemplates = null, // Not used in validation tests
    apiKeyService = null, // Not used in validation tests
    idGenerator = null, // Not used in validation tests
    clock = null, // Not used in validation tests
    config = null, // Not used in validation tests
    messageService = mockMessageService
  )

  private def validate(userName: String, email: String, password: String) = 
    userService.validateUserData(Some(userName), Some(email), Some(password), languageOpt = Some("en"))

  "validate" should "accept valid data" in:
    val dataIsValid = validate("login", "admin@athletraai.com", "password")

    dataIsValid shouldBe Right(())

  it should "not accept login containing only empty spaces" in:
    val dataIsValid = validate("   ", "admin@athletraai.com", "password")

    dataIsValid.isLeft shouldBe true

  it should "not accept too short login" in:
    val tooShortLogin = "a" * (userService.MinLoginLength - 1)
    val dataIsValid = validate(tooShortLogin, "admin@athletraai.com", "password")

    dataIsValid.isLeft shouldBe true

  it should "not accept too short login after trimming" in:
    val loginTooShortAfterTrim = "a" * (userService.MinLoginLength - 1) + "   "
    val dataIsValid = validate(loginTooShortAfterTrim, "admin@athletraai.com", "password")

    dataIsValid.isLeft shouldBe true

  it should "not accept missing email with spaces only" in:
    val dataIsValid = validate("login", "   ", "password")

    dataIsValid.isLeft shouldBe true

  it should "not accept invalid email" in:
    val dataIsValid = validate("login", "invalidEmail", "password")

    dataIsValid.isLeft shouldBe true

  it should "not accept password with empty spaces only" in:
    val dataIsValid = validate("login", "admin@athletraai.com", "    ")

    dataIsValid.isLeft shouldBe true
end UserValidatorSpec
