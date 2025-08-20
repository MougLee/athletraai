---
layout: default
title:  "Production deployment"
---

## Docker

To build a docker image, run `docker/Docker/publishLocal`. This will create the `docker:latest` image.

You can test the image by using the provided `docker-compose.yml` file.

## Kubernetes

Use [Helm](https://helm.sh/) to easily deploy Athletraai into [Kubernetes](https://kubernetes.io/) cluster.

### Add SoftwareMill Helm repository

```
helm repo add softwaremill https://charts.softwaremill.com/
helm repo update
```

### Fetch and Customize Athletraai chart

```
helm fetch softwaremill/athletraai --untar
```

### Install Athletraai chart

```
helm install --generate-name athletraai
```

Please see [Athletraai Helm Chart
documentation](https://github.com/softwaremill/athletraai/blob/master/helm/athletraai/README.md) for more information,
including configuration options.
