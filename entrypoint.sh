#!/bin/bash

set -xe

if [[ "$RUNNER_OS" == "Linux" ]]; then
    if [[ "$RUNNER_ARCH" == "X64" ]]; then
        export REMOTE_FILENAME=git-metrics_linux-x86_64
    elif [[ "$RUNNER_ARCH" == "ARM64" ]]; then
        export REMOTE_FILENAME=git-metrics_linux-aarch64
    else
        echo "::error title=⛔ platform arch ($RUNNER_ARCH) not yet supported"
    fi
    export TARGET_FILE=$HOME/.local/bin/git-metrics
elif [[ "$RUNNER_OS" == "macOS" ]]; then
    if [[ "$RUNNER_ARCH" == "X64" ]]; then
        export REMOTE_FILENAME=git-metrics_darwin-x86_64
    elif [[ "$RUNNER_ARCH" == "ARM64" ]]; then
        export REMOTE_FILENAME=git-metrics_darwin-aarch64
    else
        echo "::error title=⛔ platform arch ($RUNNER_ARCH) not yet supported"
    fi
    export TARGET_FILE=$HOME/.local/bin/git-metrics
else
    echo "::error title=⛔ platform os ($RUNNER_OS) not yet supported"
    exit 1
fi

mkdir -p $HOME/.local/bin
if [ -z "$( echo $GITHUB_PATH | grep $HOME/.local/bin )" ]; then
    echo "$HOME/.local/bin" >> $GITHUB_PATH
fi

releases=$(curl -L -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/jdrouet/git-metrics/releases)
binary_url=$(echo $releases | jq --raw-output ".[0].assets | map(select(.name == \"$REMOTE_FILENAME\")) | first | .browser_download_url")

curl -L -o $TARGET_FILE $binary_url
chmod +x $TARGET_FILE
