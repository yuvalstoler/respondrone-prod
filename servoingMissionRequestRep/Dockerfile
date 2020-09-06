FROM node:12-alpine
WORKDIR /usr/src/servoingMissionRequestRep
RUN ls
COPY servoingMissionRequestRep/package*.json ./
COPY servoingMissionRequestRep/tsconfig.json ./
#COPY commRelayMissionRequestsRep/.env ./

RUN npm install
ADD . /usr/src/servoingMissionRequestRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4608
