#!/bin/bash
cd /home/drones/respondrone-master/; 
git fetch --all; 
git reset --hard origin/master; 
cd dockerBuildScript/; 
node index.js; 
cd ../../RD; 
docker-compose down; 
docker-compose up -d --build
