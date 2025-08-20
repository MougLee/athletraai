package ai.athletra.athletraai.config

import ai.athletra.athletraai.email.EmailConfig
import ai.athletra.athletraai.http.HttpConfig
import ai.athletra.athletraai.infrastructure.DBConfig
import ai.athletra.athletraai.logging.Logging
import ai.athletra.athletraai.passwordreset.PasswordResetConfig
import ai.athletra.athletraai.user.UserConfig
import ai.athletra.athletraai.version.BuildInfo
import pureconfig.{ConfigReader, ConfigSource}

import scala.collection.immutable.TreeMap

/** Maps to the `application.conf` file. Configuration for all modules of the application. */
case class Config(db: DBConfig, api: HttpConfig, email: EmailConfig, passwordReset: PasswordResetConfig, user: UserConfig)
    derives ConfigReader

object Config extends Logging:
  def log(config: Config): Unit =
    val baseInfo = s"""
                      |Athletraai configuration:
                      |-----------------------
                      |DB:             ${config.db}
                      |API:            ${config.api}
                      |Email:          ${config.email}
                      |Password reset: ${config.passwordReset}
                      |User:           ${config.user}
                      |
                      |Build & env info:
                      |-----------------
                      |""".stripMargin

    val info = TreeMap(BuildInfo.toMap.toSeq*).foldLeft(baseInfo) { case (str, (k, v)) =>
      str + s"$k: $v\n"
    }

    logger.info(info)
  end log

  def read: Config = ConfigSource.default.loadOrThrow[Config]
end Config
