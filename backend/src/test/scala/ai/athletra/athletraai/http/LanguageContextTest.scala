package ai.athletra.athletraai.http

import ai.athletra.athletraai.test.BaseTest
import ai.athletra.athletraai.user.User
import ai.athletra.athletraai.util.Strings.{asHashed, toLowerCased}
import ai.athletra.athletraai.util.DefaultIdGenerator
import org.scalatest.EitherValues

class LanguageContextTest extends BaseTest with EitherValues:

  private val userId = DefaultIdGenerator.nextId[User]()
  private val now = java.time.Instant.now()
  private val userEn = User(
    userId,
    "testuser",
    "testuser".toLowerCased,
    "test@example.com".toLowerCased,
    "hashedpassword".asHashed,
    "en",
    "UTC",
    "metric",
    now,
    now
  )
  private val userSl = userEn.copy(language = "sl")

  "LanguageContext" should "support English and Slovene languages" in {
    LanguageContext.SupportedLanguages should contain("en")
    LanguageContext.SupportedLanguages should contain("sl")
    LanguageContext.SupportedLanguages.size shouldBe 2
  }

  it should "use English as default language" in {
    LanguageContext.DefaultLanguage shouldBe "en"
  }

  it should "detect language from Accept-Language header" in {
    LanguageContext.fromAcceptLanguageHeader(Some("en-US,en;q=0.9,sl;q=0.8")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("sl-SI,sl;q=0.9,en;q=0.8")) shouldBe "sl"
    LanguageContext.fromAcceptLanguageHeader(Some("fr-FR,fr;q=0.9,en;q=0.8")) shouldBe "en" // fallback
    LanguageContext.fromAcceptLanguageHeader(Some("de-DE,de;q=0.9,sl;q=0.8")) shouldBe "sl" // second choice
  }

  it should "handle complex Accept-Language headers" in {
    LanguageContext.fromAcceptLanguageHeader(Some("en-US,en;q=0.9,sl;q=0.8,de;q=0.7")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("sl-SI,sl;q=0.9,en-US;q=0.8")) shouldBe "sl"
    LanguageContext.fromAcceptLanguageHeader(Some("fr-FR,fr;q=0.9,sl;q=0.8,en;q=0.7")) shouldBe "sl"
  }

  it should "fallback to English for unsupported languages" in {
    LanguageContext.fromAcceptLanguageHeader(Some("fr-FR,fr;q=0.9")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("de-DE,de;q=0.9")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("it-IT,it;q=0.9")) shouldBe "en"
  }

  it should "handle None Accept-Language header" in {
    LanguageContext.fromAcceptLanguageHeader(None) shouldBe "en"
  }

  it should "extract language from user" in {
    LanguageContext.fromUser(Some(userEn)) shouldBe "en"
    LanguageContext.fromUser(Some(userSl)) shouldBe "sl"
  }

  it should "fallback to English for invalid user language" in {
    val userInvalid = userSl.copy(language = "de")
    LanguageContext.fromUser(Some(userInvalid)) shouldBe "en"
  }

  it should "fallback to English for None user" in {
    LanguageContext.fromUser(None) shouldBe "en"
  }

  it should "get preferred language with user priority" in {
    // User should take priority over Accept-Language header
    LanguageContext.getPreferredLanguage(Some("en-US,en;q=0.9"), Some(userSl)) shouldBe "sl"
  }

  it should "fallback to Accept-Language header when user is default" in {
    // When user is default (en), use Accept-Language header
    LanguageContext.getPreferredLanguage(Some("sl-SI,sl;q=0.9"), Some(userEn)) shouldBe "sl"
  }

  it should "fallback to English when both user and header are default" in {
    LanguageContext.getPreferredLanguage(Some("en-US,en;q=0.9"), Some(userEn)) shouldBe "en"
  }

  it should "fallback to English when no user and unsupported header" in {
    LanguageContext.getPreferredLanguage(Some("fr-FR,fr;q=0.9"), None) shouldBe "en"
  }

  it should "handle edge cases in Accept-Language parsing" in {
    LanguageContext.fromAcceptLanguageHeader(Some("")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("en")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("sl")) shouldBe "sl"
    LanguageContext.fromAcceptLanguageHeader(Some("en-US")) shouldBe "en"
    LanguageContext.fromAcceptLanguageHeader(Some("sl-SI")) shouldBe "sl"
  }

end LanguageContextTest
