#!/bin/sh

command="npm i @_gktickets/common"
removeCommand="npm remove @_gktickets/common"

read -p "Should publish (yes/no): " shouldPublish

if [ "$shouldPublish" = "yes" ]; then
  cd ./common || exit 1

  read -p "Should commit (yes/no): " shouldCommit

  if [ "$shouldCommit" = "yes" ]; then
    git add .
    read -p "Commit message: " commitMessage
    git commit -m "$commitMessage"
    npm run pub
  fi

  cd ..
fi

for dir in auth client ticket; do
  cd "./$dir" || exit 1
  $removeCommand
  $command
  cd ..
done
