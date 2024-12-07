#!/bin/bash

RED="\033[31m"
PINK="\033[35m"
GREEN="\033[32m"
NORMAL="\033[0;39m"

for f in examples/*.n3s; do
    echo -n "$f ..."
    ./run.sh $f > $f.out 2>&1 
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