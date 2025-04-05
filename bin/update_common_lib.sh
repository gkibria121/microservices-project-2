#!/bin/sh

icommand="npm install @_gktickets/common"
rcommand="npm remove @_gktickets/common" 
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

for dir in auth client ticket order expiration payment; do
  cd "./$dir" || exit 1 
  $rcommand
  $icommand
  cd ..
done
