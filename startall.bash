#!/usr/bin/env bash

home=$(pwd);
echo $home

pm2 delete webServer;
pm2 delete RS;
pm2 delete ES;
pm2 delete FS;
pm2 delete DBS;
pm2 delete videoStream;


cd $home/back/FS;
tsc;
cd dist/back/FS/src
pm2 start index.js -n FS

cd $home/back/FS;
pm2 start videoStream.js -n videoStream;

cd $home/back/RS;
tsc;
cd dist/back/RS/src
pm2 start index.js -n RS

cd $home/back/ES;
tsc;
cd dist/back/ES/src
pm2 start index.js -n ES

cd $home/back/DBS;
tsc;
cd dist/back/DBS/src
pm2 start index.js -n DBS

cd $home/front/webServer;
tsc;
cd dist/front/webServer/src
pm2 start index.js -n webServer

cd $home/front/oscc;
ng build;
cd ../UI;
pm2 start www.js -n UI7777;
