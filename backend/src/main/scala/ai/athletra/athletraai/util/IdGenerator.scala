package ai.athletra.athletraai.util

import ai.athletra.athletraai.util.Strings.{asId, Id}

trait IdGenerator:
  def nextId[U](): Id[U]

object DefaultIdGenerator extends IdGenerator:
  override def nextId[U](): Id[U] = SecureRandomIdGenerator.Strong.generate.asId[U]
