#!/usr/bin/env bash

home=$(pwd);
echo $home

cd $home/back/FS;
npm i;

cd $home/back/RS;
npm i;

cd $home/back/ES;
npm i;

cd $home/back/DBS;
npm i;

cd $home/front/webServer;
npm i;

cd $home/front/UI;
npm i;

cd $home/front/oscc;
npm i;
