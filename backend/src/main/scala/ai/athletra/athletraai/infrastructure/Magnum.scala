package ai.athletra.athletraai.infrastructure

import com.augustnagro.magnum.DbCodec
import ai.athletra.athletraai.logging.Logging
import ai.athletra.athletraai.util.Strings.*

import java.sql.Date as SqlDate
import java.time.{Instant, LocalDate, OffsetDateTime, ZoneOffset}

/** Magnum codecs for custom types, useful when writing SQL queries. */
object Magnum extends Logging:
  given DbCodec[Instant] = summon[DbCodec[OffsetDateTime]].biMap(_.toInstant, _.atOffset(ZoneOffset.UTC))

  given idCodec[T]: DbCodec[Id[T]] = DbCodec.StringCodec.biMap(_.asId[T], _.toString)
  given DbCodec[Hashed] = DbCodec.StringCodec.biMap(_.asHashed, _.toString)
  given DbCodec[LowerCased] = DbCodec.StringCodec.biMap(_.toLowerCased, _.toString)

  // Custom codec for LocalDate using SQL DATE type
  given DbCodec[LocalDate] = DbCodec.SqlDateCodec.biMap(_.toLocalDate, SqlDate.valueOf)

//  // Custom codec for Option[LocalDate] to handle nullable date fields
//  given DbCodec[Option[LocalDate]] = DbCodec.DateCodec.biMap(
//    date => if (date == null) None else Some(date.toLocalDate),
//    _.map(SqlDate.valueOf).orNull
//  )
end Magnum
