#!/bin/bash

##Install Node, NPM, NVM
#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
#. ~/.nvm/nvm.sh
##

##Remotely clear previous deploys
ssh ubuntu@pidgeon.remote <<EOF
 sudo rm -rf ~/pidgeons
 sudo mkdir ~/pidgeons
 exit
EOF


rsync -av -e ssh ../../pidgeons-front/dist/pidgeons-front/ ubuntu@pidgeon.remote:~/pidgeons/public

##Copy Backend Files to server
rsync -av -e ssh --exclude='node_modules/*' --exclude='*.iml' --exclude='*-lock.json' --exclude='.idea/*' ../../pidgeons ubuntu@pidgeon.remote:~/

##Remotely reinstall dependencies and restart service
ssh ubuntu@pidgeon.remote <<EOF
 cd ~/pidgeons
 npm install
 pm2 restart npm -- start
 exit
EOF

