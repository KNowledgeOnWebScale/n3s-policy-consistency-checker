#!/bin/bash

RED="\033[31m"
PINK="\033[35m"
GREEN="\033[32m"
NORMAL="\033[0;39m"

for f in examples/odrl/*_{FAIL,OK}.ttl; do
    echo -n "$f ..."

    BASE=$(echo $f | sed -E 's/(_OK|_FAIL).*//g')

    if [[ -f "${BASE}_data.ttl" ]] || [[ -f "${BASE}_data.n3s" ]]; then
        ./bin/run_odrl.sh -d ${BASE}_data.* $f check > $f.out 2>&1 
    else
        ./bin/run_odrl.sh $f check > $f.out 2>&1 
    fi

    if [ $? -eq 0 ]; then
        if [[ $f =~ OK ]]; then
            echo -e "${GREEN}OK${NORMAL}"
        else
            echo -e "${RED}FAIL${NORMAL}"
        fi
    else
        if [[ $f =~ FAIL ]]; then
            echo -e "${GREEN}OK${NORMAL}"
        else
            echo -e "${RED}FAIL${NORMAL}"
        fi
    fi
done