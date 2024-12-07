#!/bin/bash

OUTPUT=.run.n3s

if [ "$1" == "" ]; then
  echo "usage: $0 file"
  exit 1
fi

eye --nope --no-bnode-relabeling --quiet compiler.n3s "$@" > ${OUTPUT}
eye --nope --no-bnode-relabeling --quiet deontic.n3s ${OUTPUT}
