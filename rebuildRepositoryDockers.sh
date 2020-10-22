#!/bin/bash
cd /home/drones/respondrone-master/;
git fetch --all;
git reset --hard origin/master;
cd dockerBuildScript/;
node index.js ip=192.168.8.100;
cd ../../RD;
docker-compose down;
docker-compose up -d --build
