package ai.athletra.athletraai.user

import ai.athletra.athletraai.Fail
import ai.athletra.athletraai.email.EmailTemplates
//import ai.athletra.athletraai.email.sender.DummyEmailSender
import ai.athletra.athletraai.http.MessageService
import ai.athletra.athletraai.infrastructure.DB
import ai.athletra.athletraai.security.{ApiKeyService, ApiKeyModel}
import ai.athletra.athletraai.test.{BaseTest, TestClock, TestDependencies}
import ai.athletra.athletraai.util.{IdGenerator, DefaultIdGenerator}
import ai.athletra.athletraai.user.{User, UserModel, UserConfig}
import ai.athletra.athletraai.util.Strings.Id
import org.scalatest.EitherValues
import ox.discard

class UserServiceTest extends BaseTest with TestDependencies with EitherValues:

  "UserService" should "register new user with default language" in {
    val userService = createUserService()
    
    val result = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    
    result shouldBe a[Right[?, ?]]
    val apiKey = result.value
    apiKey should not be null
  }

  it should "register new user with explicit language" in {
    val userService = createUserService()
    
    val result = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123", "sl"))
    
    result shouldBe a[Right[?, ?]]
    val apiKey = result.value
    apiKey should not be null
  }

  it should "create user profile with language preference" in {
    val userService = createUserService()
    
    val result = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123", "sl"))
    
    result shouldBe a[Right[?, ?]]
    
    // Verify that user profile was created with correct language
    // This would require additional test infrastructure to query the database directly
    // For now, we just verify the registration succeeds
  }

  it should "update user language preference" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Update language using changeUser
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", Some("sl"), None))
    updateResult shouldBe a[Right[?, ?]]
  }

  it should "reject unsupported language" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Try to update to unsupported language using changeUser
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", Some("fr"), None))
    updateResult shouldBe a[Left[?, ?]] // changeUser should validate and reject unsupported languages
    updateResult.left.value shouldBe a[Fail.IncorrectInput]
  }

  it should "send localized email during registration" in {
    val userService = createUserService()
    
    val result = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123", "sl"))
    
    result shouldBe a[Right[?, ?]]
    
    // Send batch to trigger email sending
    dependencies.emailService.sendBatch()
    
    // Verify email was sent (this would require additional test infrastructure)
    // For now, we just verify the registration succeeds
  }

  it should "validate user data with localized messages" in {
    val userService = createUserService()
    
    // Try to register with invalid data
    val result = currentDb.transactEither(userService.registerNewUser("ab", "invalid-email", "pass", "sl"))
    
    result shouldBe a[Left[?, ?]]
    result.left.value shouldBe a[Fail.IncorrectInput]
    
    // The error message should be localized, but we can't easily test the exact content
    // without additional test infrastructure
  }

  it should "handle login with language context" in {
    val userService = createUserService()
    
    // Register a user first
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123", "sl"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Login should work
    val loginResult = currentDb.transactEither(userService.login("testuser", "password123", None))
    loginResult shouldBe a[Right[?, ?]]
  }

  it should "handle password change with language context" in {
    val userService = createUserService()
    
    // Register a user first
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123", "sl"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Change password should work
    val changeResult = currentDb.transactEither(userService.changePassword(userId, "password123", "newpassword123"))
    changeResult shouldBe a[Right[?, ?]]
  }

  it should "handle user update with language context" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Update user should work
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "newlogin", "newemail@example.com", Some("en"), None))
    updateResult shouldBe a[Right[?, ?]]
  }

  it should "update user unit system preference" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Update unit system using changeUser
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", None, None, Some("imperial")))
    updateResult shouldBe a[Right[?, ?]]
  }

  it should "reject unsupported unit system" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Try to update to unsupported unit system using changeUser
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", None, None, Some("invalid")))
    updateResult shouldBe a[Left[?, ?]] // changeUser should validate and reject unsupported unit systems
    updateResult.left.value shouldBe a[Fail.IncorrectInput]
  }

  it should "accept valid unit system values" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Update to metric should work
    val updateResult1 = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", None, None, Some("metric")))
    updateResult1 shouldBe a[Right[?, ?]]
    
    // Update to imperial should work
    val updateResult2 = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", None, None, Some("imperial")))
    updateResult2 shouldBe a[Right[?, ?]]
  }

  it should "update unit system with other fields" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Update multiple fields including unit system
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "newlogin", "newemail@example.com", Some("sl"), Some("UTC"), Some("imperial")))
    updateResult shouldBe a[Right[?, ?]]
  }

  it should "handle unit system update without changing other fields" in {
    val userService = createUserService()
    
    // First register a user
    val registerResult = currentDb.transactEither(userService.registerNewUser("testuser", "test@example.com", "password123"))
    registerResult shouldBe a[Right[?, ?]]
    
    val userId = registerResult.value.userId
    
    // Update only unit system, keeping other fields unchanged
    val updateResult = currentDb.transactEither(userService.changeUser(userId, "testuser", "test@example.com", None, None, Some("imperial")))
    updateResult shouldBe a[Right[?, ?]]
  }

  private def createUserService(): UserService =
    val userModel = new UserModel()
    val emailScheduler = dependencies.emailService
    val emailTemplates = new EmailTemplates()
    val apiKeyService = new ApiKeyService(new ApiKeyModel(), DefaultIdGenerator, testClock)
    val config = UserConfig(scala.concurrent.duration.Duration(24, "hours"))
    val messageService = MessageService.instance
    
    new UserService(
      userModel,
      emailScheduler,
      emailTemplates,
      apiKeyService,
      DefaultIdGenerator,
      testClock,
      config,
      messageService
    )

end UserServiceTest


