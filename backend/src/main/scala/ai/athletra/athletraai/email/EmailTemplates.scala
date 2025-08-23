package ai.athletra.athletraai.email

class EmailTemplates:
  def registrationConfirmation(userName: String, language: String = "en"): EmailSubjectContent =
    EmailTemplateRenderer("registrationConfirmation", Map("userName" -> userName), language)

  def passwordReset(userName: String, resetLink: String, language: String = "en"): EmailSubjectContent =
    EmailTemplateRenderer("resetPassword", Map("userName" -> userName, "resetLink" -> resetLink), language)

  def passwordChangeNotification(userName: String, language: String = "en"): EmailSubjectContent =
    EmailTemplateRenderer("passwordChangeNotification", Map("userName" -> userName), language)

  def profileDetailsChangeNotification(userName: String, language: String = "en"): EmailSubjectContent =
    EmailTemplateRenderer("profileDetailsChangeNotification", Map("userName" -> userName), language)
end EmailTemplates
