#!/bin/sh

command="npm i @_gktickets/common"
removeCommand="npm remove @_gktickets/common"
# cd ./common && npm run pub && cd ../;
cd ./auth && $removeCommand && $command && cd ../;
cd ./client && $removeCommand && $command && cd ../;
cd ./ticket && $removeCommand && $command && cd ../;