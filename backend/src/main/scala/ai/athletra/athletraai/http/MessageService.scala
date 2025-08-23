package ai.athletra.athletraai.http

import java.util.{Locale, ResourceBundle}
import scala.util.{Try, Success, Failure}

class MessageService:
  private val bundleCache = scala.collection.mutable.Map[String, ResourceBundle]()

  def getMessage(key: String, language: String, args: Any*): String =
    val safeLanguage = Option(language).filter(_.nonEmpty).getOrElse("en")
    val bundle = getBundle(safeLanguage)
    val message = Try(bundle.getString(key)).getOrElse(key)

    if args.isEmpty then message
    else formatMessage(message, args.toArray)

  private def getBundle(language: String): ResourceBundle =
    bundleCache.getOrElseUpdate(
      language, {
        val locale = Locale.of(language)
        Try(ResourceBundle.getBundle("messages", locale)) match
          case Success(bundle) => bundle
          case Failure(_)      =>
            // Fallback to English if the requested language bundle is not found
            ResourceBundle.getBundle("messages", Locale.of("en"))
      }
    )

  private def formatMessage(message: String, args: Array[Any]): String =
    var formatted = message
    args.zipWithIndex.foreach { case (arg, index) =>
      formatted = formatted.replace(s"{$index}", arg.toString)
    }
    formatted
end MessageService

object MessageService:
  val instance = new MessageService()

  def apply(): MessageService = instance
end MessageService


