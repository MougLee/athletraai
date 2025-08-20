package ai.athletra.athletraai

import ai.athletra.athletraai.config.Config
import com.softwaremill.quicklens.*

import scala.concurrent.duration.*

package object test:
  val DefaultConfig: Config = Config.read
  val TestConfig: Config = DefaultConfig.modify(_.email.emailSendInterval).setTo(100.milliseconds)
