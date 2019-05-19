#!/bin/bash

##Install Node, NPM, NVM
#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
#. ~/.nvm/nvm.sh
##


##Copy Files to server
rsync -av -e ssh --exclude='node_modules/*' ././../../pidgeons/ ubuntu@pidgeon.remote:~/pidgeons

##Remotely reinstall dependencies and restart service
ssh ubuntu@pidgeon.remote <<EOF
 cd ~/pidgeons
 npm install
 pm2 restart npm -- start
 exit
EOF

