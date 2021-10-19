#!/usr/bin/env bash

home=$(pwd);
echo $home

#pm2 delete all;
#pm2 flush;


cd $home/CommRelay;
npm i;
###############################
cd $home/FollowPath;
npm i;
###############################
cd $home/Observation;
npm i;
###############################
cd $home/Scan;
npm i;
###############################
cd $home/Servoing;
npm i;
###############################
cd $home/GraphicOverlay;
npm i;
###############################
cd $home/MissionRoute;
npm i;
###############################
cd $home/Mission;
npm i;
###############################
cd $home/NFZ;
npm i;
###############################
cd $home/Discovery;
npm i;

