FROM node:12-alpine
WORKDIR /usr/src/missionsRep
RUN ls
COPY missionsRep/package*.json ./
COPY missionsRep/tsconfig.json ./
#COPY commRelayMissionRequestsRep/.env ./

RUN npm install
ADD . /usr/src/missionsRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4605
