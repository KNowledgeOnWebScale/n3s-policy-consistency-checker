#!/bin/bash

POLICY_WORLD=.compiled.n3s
NORMATIVE_WORLD=.world.n3s

if [ "$1" == "" ]; then
  echo "usage: $0 file"
  exit 1
fi

# Compile policies into RDF Surfaces
eye --nope --quiet compiler.n3 "$@" --query query.n3 > ${POLICY_WORLD}

# Run RDF Surfaces with deontic rules (check policy inconsistencies)
eye --nope --no-bnode-relabeling --quiet deontic.n3s ${POLICY_WORLD} > ${NORMATIVE_WORLD}

if [ $? -eq 0 ]; then
  # Run RDF Surfaces on the next world (check consequence of policies for inconsistencies)
  eye --nope --no-bnode-relabeling --quiet ${NORMATIVE_WORLD}
else
  exit 2
fi 
