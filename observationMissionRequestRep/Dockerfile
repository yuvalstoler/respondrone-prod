FROM node:12-alpine
WORKDIR /usr/src/observationMissionRequestRep
RUN ls
COPY observationMissionRequestRep/package*.json ./
COPY observationMissionRequestRep/tsconfig.json ./
#COPY commRelayMissionRequestsRep/.env ./

RUN npm install
ADD . /usr/src/observationMissionRequestRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4606
