package ai.athletra.athletraai.user

import pureconfig.ConfigReader

import scala.concurrent.duration.Duration

case class UserConfig(defaultApiKeyValid: Duration) derives ConfigReader
