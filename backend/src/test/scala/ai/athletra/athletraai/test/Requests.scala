package ai.athletra.athletraai.test

import ai.athletra.athletraai.Fail
import ai.athletra.athletraai.passwordreset.PasswordResetApi
import ai.athletra.athletraai.passwordreset.PasswordResetApi.*
import ai.athletra.athletraai.user.UserApi
import ai.athletra.athletraai.user.UserApi.*
import ai.athletra.athletraai.util.Strings.asId
import sttp.client4.*
import sttp.tapir.client.sttp4.SttpClientInterpreter

import scala.util.Random

class Requests(backend: SyncBackend):
  private val random = new Random()

  def randomLoginEmailPassword(): (String, String, String) =
    val timestamp = System.currentTimeMillis()
    val randomSuffix = random.nextInt(9000)
    (s"testuser${timestamp}${randomSuffix}", s"user${timestamp}${randomSuffix}@athletraai.com", s"password${timestamp}${randomSuffix}")

  private val basePath = Some(uri"http://localhost:8080/api/v1")

  def registerUser(login: String, email: String, password: String): Response[Either[Fail, Register_OUT]] =
    SttpClientInterpreter()
      .toRequestThrowDecodeFailures(UserApi.registerUserEndpoint, basePath)
      .apply(Register_IN(login, email, password))
      .send(backend)

  def registerUser(login: String, email: String, password: String, language: String): Response[Either[Fail, Register_OUT]] =
    SttpClientInterpreter()
      .toRequestThrowDecodeFailures(UserApi.registerUserEndpoint, basePath)
      .apply(Register_IN(login, email, password, language))
      .send(backend)

  def newRegisteredUsed(): RegisteredUser =
    val (login, email, password) = randomLoginEmailPassword()

    val apiKey = SttpClientInterpreter()
      .toRequestThrowErrors(UserApi.registerUserEndpoint, basePath)
      .apply(Register_IN(login, email, password))
      .send(backend)
      .body
      .apiKey

    RegisteredUser(login, email, password, apiKey)
  end newRegisteredUsed

  def loginUser(loginOrEmail: String, password: String, apiKeyValidHours: Option[Int] = None): Response[Either[Fail, Login_OUT]] =
    SttpClientInterpreter()
      .toRequestThrowDecodeFailures(UserApi.loginEndpoint, basePath)
      .apply(Login_IN(loginOrEmail, password, apiKeyValidHours))
      .send(backend)

  def logoutUser(apiKey: String): Response[Either[Fail, Logout_OUT]] =
    SttpClientInterpreter()
      .toSecureRequestThrowDecodeFailures(UserApi.logoutEndpoint, basePath)
      .apply(apiKey.asId)
      .apply(Logout_IN(apiKey))
      .send(backend)

  def getUser(apiKey: String): Response[Either[Fail, GetUser_OUT]] =
    SttpClientInterpreter()
      .toSecureRequestThrowDecodeFailures(UserApi.getUserEndpoint, basePath)
      .apply(apiKey.asId)
      .apply(())
      .send(backend)

  def changePassword(apiKey: String, password: String, newPassword: String): Response[Either[Fail, ChangePassword_OUT]] =
    SttpClientInterpreter()
      .toSecureRequestThrowDecodeFailures(UserApi.changePasswordEndpoint, basePath)
      .apply(apiKey.asId)
      .apply(ChangePassword_IN(password, newPassword))
      .send(backend)

  def updateUser(apiKey: String, login: String, email: String): Response[Either[Fail, UpdateUser_OUT]] =
    SttpClientInterpreter()
      .toSecureRequestThrowDecodeFailures(UserApi.updateUserEndpoint, basePath)
      .apply(apiKey.asId)
      .apply(UpdateUser_IN(login, email))
      .send(backend)

  def updateUser(apiKey: String, login: String, email: String, language: Option[String], timezone: Option[String]): Response[Either[Fail, UpdateUser_OUT]] =
    SttpClientInterpreter()
      .toSecureRequestThrowDecodeFailures(UserApi.updateUserEndpoint, basePath)
      .apply(apiKey.asId)
      .apply(UpdateUser_IN(login, email, language, timezone))
      .send(backend)

  def updateUser(apiKey: String, login: String, email: String, language: Option[String], timezone: Option[String], unitSystem: Option[String]): Response[Either[Fail, UpdateUser_OUT]] =
    SttpClientInterpreter()
      .toSecureRequestThrowDecodeFailures(UserApi.updateUserEndpoint, basePath)
      .apply(apiKey.asId)
      .apply(UpdateUser_IN(login, email, language, timezone, unitSystem))
      .send(backend)

  def forgotPassword(loginOrEmail: String): Response[Either[Fail, ForgotPassword_OUT]] =
    SttpClientInterpreter()
      .toRequestThrowDecodeFailures(PasswordResetApi.forgotPasswordEndpoint, basePath)
      .apply(ForgotPassword_IN(loginOrEmail))
      .send(backend)

  def resetPassword(code: String, password: String): Response[Either[Fail, PasswordReset_OUT]] =
    SttpClientInterpreter()
      .toRequestThrowDecodeFailures(PasswordResetApi.passwordResetEndpoint, basePath)
      .apply(PasswordReset_IN(code, password))
      .send(backend)
end Requests
