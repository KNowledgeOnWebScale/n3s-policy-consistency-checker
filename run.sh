#!/bin/bash

OUTPUT=.run.n3s

if [ "$1" == "" ]; then
  echo "usage: $0 file"
  exit 1
fi

# Compile to RDF Surfaces
eye --nope --quiet compiler.n3 "$@" --query query.n3 > ${OUTPUT}

# Run RDF Surfaces with deontic rules
eye --nope --no-bnode-relabeling --quiet deontic.n3s ${OUTPUT}
