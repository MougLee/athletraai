package ai.athletra.athletraai.user

import com.augustnagro.magnum.{DbCodec, DbTx, Frag, PostgresDbType, Repo, Spec, SqlName, SqlNameMapper, Table, TableInfo, sql}
import com.password4j.{Argon2Function, Password}
import ai.athletra.athletraai.infrastructure.Magnum.given
import ai.athletra.athletraai.user.User.PasswordHashing
import ai.athletra.athletraai.user.User.PasswordHashing.Argon2Config.*
import ai.athletra.athletraai.util.PasswordVerificationStatus
import ai.athletra.athletraai.util.Strings.{Hashed, Id, LowerCased, asHashed}
import ox.discard

import java.time.Instant

class UserModel:
  private val userRepo = Repo[User, User, Id[User]]
  private val u = TableInfo[User, User, Id[User]]

  export userRepo.{insert, findById}

  def findByEmail(email: LowerCased)(using DbTx): Option[User] = findBy(
    Spec[User].where(sql"${u.emailLowerCase} = $email")
  )
  def findByLogin(login: LowerCased)(using DbTx): Option[User] = findBy(
    Spec[User].where(sql"${u.loginLowerCase} = $login")
  )
  def findByLoginOrEmail(loginOrEmail: LowerCased)(using DbTx): Option[User] =
    findBy(Spec[User].where(sql"${u.loginLowerCase} = ${loginOrEmail: String} OR ${u.emailLowerCase} = $loginOrEmail"))

  private def findBy(by: Spec[User])(using DbTx): Option[User] =
    userRepo.findAll(by).headOption

  def updatePassword(userId: Id[User], newPassword: Hashed)(using DbTx): Unit =
    sql"""UPDATE $u SET ${u.passwordHash} = $newPassword WHERE ${u.id} = $userId""".update.run().discard

  def updateLogin(userId: Id[User], newLogin: String, newLoginLowerCase: LowerCased)(using DbTx): Unit =
    sql"""UPDATE $u SET ${u.login} = $newLogin, login_lowercase = ${newLoginLowerCase: String} WHERE ${u.id} = $userId""".update
      .run()
      .discard

  def updateEmail(userId: Id[User], newEmail: LowerCased)(using DbTx): Unit =
    sql"""UPDATE $u SET ${u.emailLowerCase} = $newEmail WHERE ${u.id} = $userId""".update.run().discard

  def updateLanguage(userId: Id[User], newLanguage: String)(using DbTx): Unit =
    sql"""UPDATE $u SET language = $newLanguage WHERE ${u.id} = $userId""".update.run().discard

  def updateTimezone(userId: Id[User], newTimezone: String)(using DbTx): Unit =
    sql"""UPDATE $u SET timezone = $newTimezone WHERE ${u.id} = $userId""".update.run().discard
  end updateTimezone

  def updateUnitSystem(userId: Id[User], newUnitSystem: String)(using DbTx): Unit =
    sql"""UPDATE $u SET unit_system = $newUnitSystem WHERE ${u.id} = $userId""".update.run().discard
  end updateUnitSystem

end UserModel

@Table(PostgresDbType, SqlNameMapper.CamelToSnakeCase)
@SqlName("users")
case class User(
    id: Id[User],
    login: String,
    @SqlName("login_lowercase") loginLowerCase: LowerCased,
    @SqlName("email_lowercase") emailLowerCase: LowerCased,
    @SqlName("password") passwordHash: Hashed,
    language: String = "en",
    timezone: String = "UTC",
    unitSystem: String = "metric",
    createdAt: Instant,
    updatedAt: Instant
):
  def verifyPassword(password: String): PasswordVerificationStatus =
    if Password.check(password, passwordHash).`with`(PasswordHashing.Argon2) then PasswordVerificationStatus.Verified
    else PasswordVerificationStatus.VerificationFailed
end User

object User:
  private[user] object PasswordHashing:
    val Argon2: Argon2Function =
      Argon2Function.getInstance(MemoryInKib, NumberOfIterations, LevelOfParallelism, LengthOfTheFinalHash, Type, Version)

    object Argon2Config:
      val MemoryInKib = 12
      val NumberOfIterations = 20
      val LevelOfParallelism = 2
      val LengthOfTheFinalHash = 32
      val Type = com.password4j.types.Argon2.ID
      val Version = 19
  end PasswordHashing

  def hashPassword(password: String): Hashed = Password.hash(password).`with`(PasswordHashing.Argon2).getResult.asHashed
end User
