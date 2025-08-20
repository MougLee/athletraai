package ai.athletra.athletraai.infrastructure

import ai.athletra.athletraai.config.Sensitive
import pureconfig.ConfigReader

case class DBConfig(username: String, password: Sensitive, url: String, migrateOnStart: Boolean, driver: String) derives ConfigReader
