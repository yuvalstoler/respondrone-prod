FROM node:12-alpine
WORKDIR /usr/src/commRelayMissionRequestsRep
RUN ls
COPY commRelayMissionRequestsRep/package*.json ./
COPY commRelayMissionRequestsRep/tsconfig.json ./
#COPY commRelayMissionRequestsRep/.env ./

RUN npm install
ADD . /usr/src/commRelayMissionRequestsRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4600
