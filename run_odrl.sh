#!/bin/bash

usage() { echo "Usage: $0 [-d <data-file>] odrl-file ['check']" 1>&2; exit 1; }

while getopts "d:" o; do
    case "${o}" in
        d)
            DATA=${OPTARG}
            ;;
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))

FILE=$1
RUN=$2

if [ "${FILE}" == "" ]; then
    usage
fi

data=$(mktemp)

if [ "${DATA}" != "" ]; then
    eye --nope --quiet --pass-only-new data2deo.n3 ${DATA} > ${data}
fi

if [ "${RUN}" == "check" ]; then
    temp=$(mktemp)
    eye --nope --quiet ${FILE} odrl2deo.n3 ${data} --query odrl_query.n3 > ${temp}
    ./run.sh ${temp}
    rm ${temp}
else
   eye --nope --quiet ${FILE} odrl2deo.n3 ${data} --query odrl_query.n3
fi 

rm ${data}