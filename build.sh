#!/bin/bash
set -e

echo "Building Customer Module Plugin..."

case "$(uname -s)" in
    Linux*)     EXT=".so";;
    Darwin*)    EXT=".dylib";;
    MINGW*|MSYS*|CYGWIN*) EXT=".dll";;
    *)          EXT=".so";;
esac

cd handlers
go build -buildmode=plugin -o ../customer${EXT} *.go
echo "✓ Plugin built successfully: customer${EXT}"

