package ai.athletra.athletraai.http

import ai.athletra.athletraai.user.User

trait LanguageContext:
  def getLanguage: String

object LanguageContext:
  val SupportedLanguages: Set[String] = Set("en", "sl")
  val DefaultLanguage: String = "en"

  def isSupported(language: String): Boolean = SupportedLanguages.contains(language)

  def fromAcceptLanguageHeader(acceptLanguage: Option[String]): String =
    acceptLanguage match
      case None         => DefaultLanguage
      case Some(header) =>
        // Parse Accept-Language header (e.g., "en-US,en;q=0.9,sl;q=0.8")
        val languages = header
          .split(",")
          .map(_.trim.split(";").head.trim)
          .map(_.split("-").head.toLowerCase) // Extract primary language code
          .filter(SupportedLanguages.contains)

        languages.headOption.getOrElse(DefaultLanguage)

  def fromUser(user: Option[User]): String =
    user
      .flatMap(u => Some(u.language).filter(SupportedLanguages.contains))
      .getOrElse(DefaultLanguage)

  def getPreferredLanguage(
      acceptLanguage: Option[String],
      user: Option[User]
  ): String =
    // Priority: 1. User preference, 2. Accept-Language header, 3. Default
    fromUser(user) match
      case lang if lang != DefaultLanguage => lang
      case _                               => fromAcceptLanguageHeader(acceptLanguage)

end LanguageContext


