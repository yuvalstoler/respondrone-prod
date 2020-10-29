#!/bin/bash
cd /home/drones/respondrone-master/;
git fetch --all;
git reset --hard origin/master;
cd dockerBuildScript/;
node index.js ip=10.111.185.4;
cd ../../RD;
docker-compose down;
docker-compose up -d --build
