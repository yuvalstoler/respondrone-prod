#!/usr/bin/env bash

home=$(pwd);
echo $home

pm2 delete CommRelay;
pm2 delete FollowPath;
pm2 delete Observation;
pm2 delete Scan;
pm2 delete Servoing;
pm2 delete GraphicOverlay;
pm2 delete MissionRoute;
pm2 delete Mission;
pm2 delete NFZ;
pm2 delete Logger;
pm2 delete Discovery;
pm2 flush;


cd $home/CommRelay;
tsc;
cd dist;
pm2 start index.js -n CommRelay
###############################
cd $home/FollowPath;
tsc;
cd dist;
pm2 start index.js -n FollowPath
###############################
cd $home/Observation;
tsc;
cd dist;
pm2 start index.js -n Observation
###############################
cd $home/Scan;
tsc;
cd dist;
pm2 start index.js -n Scan
###############################
cd $home/Servoing;
tsc;
cd dist;
pm2 start index.js -n Servoing
###############################
cd $home/GraphicOverlay;
tsc;
cd dist;
pm2 start index.js -n GraphicOverlay
###############################
cd $home/MissionRoute;
tsc;
cd dist;
pm2 start index.js -n MissionRoute
###############################
cd $home/Mission;
tsc;
cd dist;
pm2 start index.js -n Mission
###############################
cd $home/NFZ;
tsc;
cd dist;
pm2 start index.js -n NFZ
###############################
cd $home/Logger;
tsc;
cd dist;
pm2 start index.js -n Logger
###############################
cd $home/Discovery;
tsc;
cd dist;
pm2 start index.js -n Discovery

###############################
#cd $home/TelemRcvDrones;
#tsc;
#cd dist;
#pm2 start index.js -n TelemRcvDrones
###############################
#cd $home/TelemSndDrones;
#tsc;
#cd dist;
#pm2 start index.js -n TelemSndDrones
###############################
#cd $home/TelemRcvFRs;
#tsc;
#cd dist;
#pm2 start index.js -n TelemRcvFRs
###############################
#cd $home/TelemSndFRs;
#tsc;
#cd dist;
#pm2 start index.js -n TelemSndFRs
###############################
#cd $home/TelemRcvGimbals;
#tsc;
#cd dist;
#pm2 start index.js -n TelemRcvGimbals
###############################
#cd $home/TelemSndGimbals;
#tsc;
#cd dist;
#pm2 start index.js -n TelemSndGimbals

