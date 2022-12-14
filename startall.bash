#!/usr/bin/env bash

home=$(pwd);
echo $home

pm2 delete Auth;
pm2 delete CCGW;
pm2 delete DBS;
pm2 delete ES;
pm2 delete FRS;
pm2 delete FS;
pm2 delete videoStream;
pm2 delete GS;
pm2 delete MS;
pm2 delete RS;
pm2 delete StatusService;
#pm2 delete TMM;
pm2 delete TS;

pm2 delete webServer;
pm2 delete UI7777;



cd $home/back/Auth;
tsc;
cd dist/back/Auth/src
pm2 start index.js -n Auth

cd $home/back/CCGW;
tsc;
cd dist/back/CCGW/src
pm2 start index.js -n CCGW

cd $home/back/DBS;
tsc;
cd dist/back/DBS/src
pm2 start index.js -n DBS

cd $home/back/ES;
tsc;
cd dist/back/ES/src
pm2 start index.js -n ES

cd $home/back/FRS;
tsc;
cd dist/back/FRS/src
pm2 start index.js -n FRS

cd $home/back/FS;
tsc;
cd dist/back/FS/src
pm2 start index.js -n FS

cd $home/back/FS;
pm2 start videoStream.js -n videoStream;

cd $home/back/GS;
tsc;
cd dist/back/GS/src
pm2 start index.js -n GS

cd $home/back/MS;
tsc;
cd dist/back/MS/src
pm2 start index.js -n MS

cd $home/back/RS;
tsc;
cd dist/back/RS/src
pm2 start index.js -n RS

cd $home/back/StatusService;
tsc;
cd dist/back/StatusService/src
pm2 start index.js -n StatusService

cd $home/back/TS;
tsc;
cd dist/back/TS/src
pm2 start index.js -n TS



cd $home/front/webServer;
tsc;
cd dist/front/webServer/src
pm2 start index.js -n webServer

cd $home/front/oscc;
ng build;
cd ../UI;
pm2 start www.js -n UI7777;


#cd $home/back/TMM;
#tsc;
#cd dist/back/TMM/src
#pm2 start index.js -n TMM
