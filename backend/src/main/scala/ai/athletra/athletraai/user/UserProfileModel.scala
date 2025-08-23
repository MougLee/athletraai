package ai.athletra.athletraai.user

import com.augustnagro.magnum.{DbCodec, DbTx, Frag, PostgresDbType, Repo, Spec, SqlName, SqlNameMapper, Table, TableInfo, sql}
import ai.athletra.athletraai.infrastructure.Magnum.given
import ai.athletra.athletraai.util.Strings.Id
import ox.discard

import java.time.{Instant, LocalDate}

class UserProfileModel:
  private val userProfileRepo = Repo[UserProfile, UserProfile, Id[UserProfile]]
  private val up = TableInfo[UserProfile, UserProfile, Id[UserProfile]]

  export userProfileRepo.{insert, findById, update}

  def findByUserId(userId: Id[User])(using DbTx): Option[UserProfile] = findBy(
    Spec[UserProfile].where(sql"${up.userId} = $userId")
  )

  private def findBy(by: Spec[UserProfile])(using DbTx): Option[UserProfile] =
    userProfileRepo.findAll(by).headOption

  def deleteByUserId(userId: Id[User])(using DbTx): Unit =
    sql"""DELETE FROM $up WHERE ${up.userId} = $userId""".update.run().discard

end UserProfileModel

@Table(PostgresDbType, SqlNameMapper.CamelToSnakeCase)
@SqlName("user_profiles")
case class UserProfile(
    id: Id[UserProfile],
    @SqlName("user_id") userId: Id[User],
    name: Option[String],
    @SqlName("date_of_birth") dateOfBirth: Option[LocalDate],
    gender: Option[String],
    height: Option[Int],
    @SqlName("unit_system") unitSystem: Option[String],
    timezone: Option[String],
    bio: Option[String],
    @SqlName("avatar_url") avatarUrl: Option[String],
    language: Option[String],
    @SqlName("created_at") createdAt: Instant,
    @SqlName("updated_at") updatedAt: Instant
):
  def isValidLanguage: Boolean = language match {
    case Some(lang) => List("en", "sl").contains(lang)
    case None => true
  }
end UserProfile
