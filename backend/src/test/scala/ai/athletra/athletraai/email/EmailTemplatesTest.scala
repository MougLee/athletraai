package ai.athletra.athletraai.email

import ai.athletra.athletraai.test.BaseTest
import org.scalatest.EitherValues

class EmailTemplatesTest extends BaseTest with EitherValues:

  "EmailTemplates" should "generate registration confirmation email in English" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser", "en")
    
    email.subject should include("Athletra AI - registration confirmation for user")
    email.content should include("testuser")
  }

  it should "generate registration confirmation email in Slovene" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser", "sl")
    
    email.subject should include("Athletra AI - potrditev registracije za uporabnika")
    email.content should include("Hvala za registracijo v naši aplikaciji.")
    email.content should include("testuser")
  }

  it should "generate password reset email in English" in {
    val templates = EmailTemplates()
    
    val email = templates.passwordReset("testuser", "http://example.com/reset", "en")
    
    email.subject should include("Athletra AI password reset")
    email.content should include("testuser")
    email.content should include("http://example.com/reset")
  }

  it should "generate password reset email in Slovene" in {
    val templates = EmailTemplates()
    
    val email = templates.passwordReset("testuser", "http://example.com/reset", "sl")
    
    email.subject should include("Athletra AI - ponastavitev gesla za uporabnika")
    email.content should include("testuser")
    email.content should include("http://example.com/reset")
  }

  it should "generate password change notification email in English" in {
    val templates = EmailTemplates()
    
    val email = templates.passwordChangeNotification("testuser", "en")
    
    email.subject should include("Athletra AI - password change notification")
    email.content should include("testuser")
  }

  it should "generate password change notification email in Slovene" in {
    val templates = EmailTemplates()
    
    val email = templates.passwordChangeNotification("testuser", "sl")
    
    email.subject should include("Athletra AI - obvestilo o spremembi gesla")
    email.content should include("testuser")
  }

  it should "generate profile details change notification email in English" in {
    val templates = EmailTemplates()
    
    val email = templates.profileDetailsChangeNotification("testuser", "en")
    
    email.subject should include("Athletra AI - profile details change notification")
    email.content should include("testuser")
  }

  it should "generate profile details change notification email in Slovene" in {
    val templates = EmailTemplates()
    
    val email = templates.profileDetailsChangeNotification("testuser", "sl")
    
    email.subject should include("Athletra AI - obvestilo o posodobitvi profila")
    email.content should include("testuser")
  }

  it should "fallback to English for unsupported language" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser", "fr")
    
    email.subject should include("Athletra AI - registration confirmation for user")
    email.content should include("testuser")
  }

  it should "use default language (en) when no language specified" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser")
    
    email.subject should include("Athletra AI - registration confirmation for user")
    email.content should include("Thank you for registering in our application.")
    email.content should include("testuser")
  }

  it should "handle empty language parameter" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser", "")
    
    email.subject should include("Athletra AI - registration confirmation for user")
    email.content should include("testuser")
  }

  it should "handle null language parameter" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser", null)
    
    email.subject should include("Athletra AI - registration confirmation for user")
    email.content should include("testuser")
  }

  it should "generate email content with proper formatting" in {
    val templates = EmailTemplates()
    
    val email = templates.registrationConfirmation("testuser", "en")
    
    email.content should include("testuser")
    email.content should include("Thank you for registering in our application.")
    email.content should not include("{{userName}}")
  }

end EmailTemplatesTest
