# athletraai

![Version: 0.3.0](https://img.shields.io/badge/Version-0.3.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0](https://img.shields.io/badge/AppVersion-1.0-informational?style=flat-square)

A Helm chart for Athletraai

**Homepage:** <https://softwaremill.github.io/athletraai/>

## Installation

### Add Helm repository

```
helm repo add softwaremill https://charts.softwaremill.com/
helm repo update
```

## Fetch and Customize Athletraai chart
```
helm fetch softwaremill/athletraai --untar
```

## Install Athletraai chart

```
helm install --generate-name athletraai
```

## Configuration

The following table lists the configurable parameters of the chart and the default values.

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| athletraai.affinity | object | `{}` |  |
| athletraai.fullnameOverride | string | `""` |  |
| athletraai.image.pullPolicy | string | `"Always"` |  |
| athletraai.image.repository | string | `"softwaremill/athletraai"` |  |
| athletraai.image.tag | string | `"latest"` |  |
| athletraai.ingress.annotations."kubernetes.io/ingress.class" | string | `"nginx"` |  |
| athletraai.ingress.annotations."kubernetes.io/tls-acme" | string | `"true"` |  |
| athletraai.ingress.enabled | bool | `true` |  |
| athletraai.ingress.hosts[0].host.domain | string | `"athletraai.example.com"` |  |
| athletraai.ingress.hosts[0].host.path | string | `"/"` |  |
| athletraai.ingress.hosts[0].host.pathType | string | `"ImplementationSpecific"` |  |
| athletraai.ingress.hosts[0].host.port | string | `"http"` |  |
| athletraai.ingress.tls[0].hosts[0] | string | `"athletraai.example.com"` |  |
| athletraai.ingress.tls[0].secretName | string | `"athletraai-tls"` |  |
| athletraai.ingress.tls_enabled | bool | `false` |  |
| athletraai.java_opts | string | `"-XX:MaxRAMPercentage=60"` |  |
| athletraai.liveness_initial_delay | int | `60` |  |
| athletraai.logback_json_encode | bool | `false` |  |
| athletraai.nameOverride | string | `""` |  |
| athletraai.nodeSelector | object | `{}` |  |
| athletraai.otel.enabled | bool | `false` |  |
| athletraai.otel.endpoint | string | `""` |  |
| athletraai.otel.metric_export_interval | string | `"60s"` |  |
| athletraai.otel.protocol | string | `""` |  |
| athletraai.otel.service_name | string | `"athletraai"` |  |
| athletraai.readiness_initial_delay | int | `60` |  |
| athletraai.replicaCount | int | `1` |  |
| athletraai.reset_password_url | string | `"https://athletraai.example.com/password-reset?code=%s"` |  |
| athletraai.resources | object | `{}` |  |
| athletraai.service.port | int | `8080` |  |
| athletraai.service.type | string | `"ClusterIP"` |  |
| athletraai.smtp.enabled | bool | `true` |  |
| athletraai.smtp.from | string | `"hello@athletraai.example.com"` |  |
| athletraai.smtp.host | string | `"server.example.com"` |  |
| athletraai.smtp.password | string | `"athletraai"` |  |
| athletraai.smtp.port | int | `465` |  |
| athletraai.smtp.ssl | string | `"true"` |  |
| athletraai.smtp.ssl_ver | string | `"false"` |  |
| athletraai.smtp.username | string | `"server.example.com"` |  |
| athletraai.sql.host | string | `"{{ .Values.postgresql.fullnameOverride }}"` | Value will be taken from 'postgresql.fullnameOverride' setting |
| athletraai.sql.name | string | `"{{ .Values.postgresql.auth.database }}"` | Value will be taken from 'postgresql.postgresqlDatabase' setting |
| athletraai.sql.password | string | `"{{ .Values.postgresql.auth.password }}"` | Value will be taken from 'postgresql.postgresqlPassword' setting |
| athletraai.sql.port | string | `"{{ .Values.postgresql.service.port }}"` | Value will be taken from 'postgresql.service.port' setting |
| athletraai.sql.username | string | `"{{ .Values.postgresql.auth.username }}"` | Value will be taken from 'postgresql.postgresqlUsername' setting |
| athletraai.tolerations | list | `[]` |  |
| postgresql.auth.database | string | `"athletraai"` | Database name for Athletraai |
| postgresql.auth.password | string | `"athletraai"` | Password for PostgreSQL user |
| postgresql.auth.username | string | `"postgres"` | Username for PostgreSQL user |
| postgresql.connectionTest.image.pullPolicy | string | `"IfNotPresent"` |  |
| postgresql.connectionTest.image.repository | string | `"bitnami/postgresql"` |  |
| postgresql.connectionTest.image.tag | int | `11` |  |
| postgresql.enabled | bool | `true` | Disable if you already have PostgreSQL running in cluster where Athletraai chart is being deployed |
| postgresql.fullnameOverride | string | `"athletraai-pgsql-postgresql"` |  |
| postgresql.service.port | int | `5432` |  |
