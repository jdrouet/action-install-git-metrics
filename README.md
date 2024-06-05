# `git-metrics` installation action

This action is made to install [`git-metrics`](https://github.com/jdrouet/git-metrics). Once installed using this action, you can use `git-metrics` directly.

## Usage

```yaml
name: using git-metrics

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  run-on-linux-x64:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jdrouet/action-install-git-metrics
      - name: execute git-metrics
        run: git-metrics add my-metric 12.34
```
