package ai.athletra.athletraai.metrics

import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.api.metrics.{DoubleGauge, LongCounter}

class Metrics(otel: OpenTelemetry):
  private val meter = otel.meterBuilder("athletraai").setInstrumentationVersion("1.0").build()

  lazy val registeredUsersCounter: LongCounter =
    meter
      .counterBuilder("athletraai_registered_users_counter")
      .setDescription("How many users registered on this instance since it was started")
      .build()

  lazy val emailQueueGauge: DoubleGauge =
    meter
      .gaugeBuilder("athletraai_email_queue_gauge")
      .setDescription("How many emails are waiting to be sent")
      .build()
end Metrics
