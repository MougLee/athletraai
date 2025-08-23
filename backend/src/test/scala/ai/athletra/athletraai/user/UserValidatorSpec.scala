package ai.athletra.athletraai.user

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class UserValidatorSpec extends AnyFlatSpec with Matchers:
  // Create a minimal UserService instance for testing
  private val userService = new UserService(
    userModel = null, // Not used in validation tests
    emailScheduler = null, // Not used in validation tests
    emailTemplates = null, // Not used in validation tests
    apiKeyService = null, // Not used in validation tests
    idGenerator = null, // Not used in validation tests
    clock = null, // Not used in validation tests
    config = null, // Not used in validation tests
    messageService = null // Not used in validation tests
  )

  private def validate(userName: String, email: String, password: String) = 
    userService.validateUserData(Some(userName), Some(email), Some(password))

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
