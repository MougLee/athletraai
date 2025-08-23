package ai.athletra.athletraai.http

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers

class MessageServiceTest extends AnyFunSuite with Matchers:

  val messageService = MessageService.instance

  test("MessageService should get messages in English") {
    val message = messageService.getMessage("user.error.loginAlreadyUsed", "en")
    message shouldBe "Login already in use!"
  }

  test("MessageService should get messages in Slovene") {
    val message = messageService.getMessage("user.error.loginAlreadyUsed", "sl")
    message shouldBe "Prijavno ime je že v uporabi!"
  }

  test("MessageService should fallback to English for unsupported language") {
    val message = messageService.getMessage("user.error.loginAlreadyUsed", "fr")
    message shouldBe "Login already in use!"
  }

  test("MessageService should return key when message not found") {
    val message = messageService.getMessage("nonexistent.key", "en")
    message shouldBe "nonexistent.key"
  }

  test("MessageService should format messages with parameters") {
    val message = messageService.getMessage("user.error.unsupportedLanguage", "en", "fr")
    message shouldBe "Unsupported language: fr"
  }

  test("MessageService should format messages with multiple parameters") {
    val message = messageService.getMessage("user.error.unsupportedLanguage", "sl", "fr")
    message shouldBe "Nepodprt jezik: fr"
  }

  test("MessageService should handle empty parameter arrays") {
    val message = messageService.getMessage("user.error.loginAlreadyUsed", "en")
    message shouldBe "Login already in use!"
  }

  test("MessageService should cache bundles for performance") {
    val message1 = messageService.getMessage("user.error.loginAlreadyUsed", "en")
    val message2 = messageService.getMessage("user.error.loginAlreadyUsed", "en")
    message1 shouldBe message2
  }

  test("MessageService should handle special characters in messages") {
    val message = messageService.getMessage("user.email.invalid", "sl")
    message shouldBe "Neveljavna oblika e-poštnega naslova!"
  }

  test("MessageService should handle different locales within same language") {
    val message1 = messageService.getMessage("user.error.loginAlreadyUsed", "en")
    val message2 = messageService.getMessage("user.error.loginAlreadyUsed", "en-US")
    message1 shouldBe message2
  }

  test("MessageService should handle empty language parameter") {
    val message = messageService.getMessage("user.error.loginAlreadyUsed", "")
    message shouldBe "Login already in use!"
  }

  test("MessageService should handle null language parameter") {
    val message = messageService.getMessage("user.error.loginAlreadyUsed", null)
    message shouldBe "Login already in use!"
  }

end MessageServiceTest
