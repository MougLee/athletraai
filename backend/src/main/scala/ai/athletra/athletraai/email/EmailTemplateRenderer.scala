package ai.athletra.athletraai.email

import ai.athletra.athletraai.http.LanguageContext
import ai.athletra.athletraai.http.LanguageContext.{DefaultLanguage}
import scala.io.Source

object EmailTemplateRenderer:
  def apply(templateNameWithoutExtension: String, params: Map[String, String], language: String = "en"): EmailSubjectContent =
    val template = prepareTemplate(templateNameWithoutExtension, params, language)
    addSignature(splitToContentAndSubject(template), language)

  private def prepareTemplate(templateNameWithoutExtension: String, params: Map[String, String], language: String): String =
    // Try to load language-specific template first, fallback to default if not found
    val lang = if(LanguageContext.isSupported(language)) language else DefaultLanguage
    val templatePath = s"/templates/email/$lang/$templateNameWithoutExtension.txt"

    val source = Source.fromURL(getClass.getResource(templatePath), "UTF-8")

    try
      val rawTemplate = source.getLines().mkString("\n")
      params.foldLeft(rawTemplate) { case (template, (param, paramValue)) =>
        template.replaceAll(s"\\{\\{$param\\}\\}", paramValue.toString)
      }
    finally source.close()
  end prepareTemplate

  private def splitToContentAndSubject(template: String): EmailSubjectContent =
    // First line of template is used as an email subject, rest of the template goes to content
    val emailLines = template.split('\n')
    require(
      emailLines.length > 1,
      "Invalid email template. It should consist of at least two lines: one for subject and one for content"
    )

    EmailSubjectContent(emailLines.head, emailLines.tail.mkString("\n"))
  end splitToContentAndSubject

  private def getSignature(language: String): String =
    try
      val resource = getClass.getResource(s"/templates/email/$language/emailSignature.txt")
      if resource != null then
        val source = Source.fromURL(resource, "UTF-8")
        try source.getLines().mkString("\n")
        finally source.close()
      else
        // Fallback to default signature
        val fallbackResource = getClass.getResource("/templates/email/en/emailSignature.txt")
        if fallbackResource != null then
          val source = Source.fromURL(fallbackResource, "UTF-8")
          try source.getLines().mkString("\n")
          finally source.close()
        else
          "" // Return empty string if no signature found
    catch
      case _: Exception =>
        // Fallback to default signature
        val fallbackResource = getClass.getResource("/templates/email/en/emailSignature.txt")
        if fallbackResource != null then
          val source = Source.fromURL(fallbackResource, "UTF-8")
          try source.getLines().mkString("\n")
          finally source.close()
        else
          "" // Return empty string if no signature found

  private def addSignature(email: EmailSubjectContent, language: String): EmailSubjectContent =
    val signature = getSignature(language)
    email.copy(content = s"${email.content}\n$signature")
end EmailTemplateRenderer
