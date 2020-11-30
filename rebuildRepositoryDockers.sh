#!/bin/bash
cd /home/ymarkin/git/respondrone/;
git fetch --all;
git reset --hard origin/master;
cd dockerBuildScript/;
node index.js ip=10.111.185.4;
cd ../../RD;
docker-compose down;
#rm -rf data
docker-compose up -d --build
