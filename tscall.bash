#!/usr/bin/env bash

home=$(pwd);
echo $home

cd $home/back/Auth;
tsc;

cd $home/back/CCGW;
tsc;

cd $home/back/DBS;
tsc;

cd $home/back/ES;
tsc;

cd $home/back/FRS;
tsc;

cd $home/back/FS;
tsc;

cd $home/back/GS;
tsc;

cd $home/back/MS;
tsc;

cd $home/back/RS;
tsc;

cd $home/back/StatusService;
tsc;

#cd $home/back/TMM;
#tsc;

cd $home/back/TS;
tsc;

cd $home/front/webServer;
tsc;

cd $home/front/oscc;
ng build;

