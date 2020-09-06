FROM node:12-alpine
WORKDIR /usr/src/scanMissionRequestRep
RUN ls
COPY scanMissionRequestRep/package*.json ./
COPY scanMissionRequestRep/tsconfig.json ./
#COPY commRelayMissionRequestsRep/.env ./

RUN npm install
ADD . /usr/src/scanMissionRequestRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4607
