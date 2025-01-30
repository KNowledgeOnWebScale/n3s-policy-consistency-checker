#!/bin/bash

FILE=$1
RUN=$2

if [ "${FILE}" == "" ]; then
    echo "usage: $0 file ['check'/]"
    exit 1
fi

if [ "${RUN}" == "check" ]; then
    temp=$(mktemp)
    eye --nope --quiet ${FILE} odrl2deo.n3 --query odrl_query.n3 > ${temp}
    ./run.sh ${temp}
    rm ${temp}
else
   eye --nope --quiet ${FILE} odrl2deo.n3 --query odrl_query.n3
fi 