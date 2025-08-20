package ai.athletra.athletraai.admin

import com.github.plokhotnyuk.jsoniter_scala.macros.ConfiguredJsonValueCodec
import ai.athletra.athletraai.http.Http.*
import ai.athletra.athletraai.http.{EndpointsForDocs, ServerEndpoints}
import ai.athletra.athletraai.version.BuildInfo
import sttp.shared.Identity
import sttp.tapir.*
import sttp.tapir.json.jsoniter.*
import sttp.tapir.server.ServerEndpoint

/** Defines an endpoint which exposes the current application version information. */
class VersionApi extends ServerEndpoints:
  import VersionApi.*

  private val versionServerEndpoint: ServerEndpoint[Any, Identity] = versionEndpoint.handleSuccess { _ =>
    Version_OUT(BuildInfo.lastCommitHash)
  }

  override val endpoints = List(versionServerEndpoint)
end VersionApi

object VersionApi extends EndpointsForDocs:
  private val AdminPath = "admin"

  private val versionEndpoint = baseEndpoint.get
    .in(AdminPath / "version")
    .out(jsonBody[Version_OUT])

  override val endpointsForDocs = List(versionEndpoint).map(_.tag("admin"))

  case class Version_OUT(buildSha: String) derives ConfiguredJsonValueCodec, Schema
end VersionApi
