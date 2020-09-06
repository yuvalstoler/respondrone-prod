FROM node:12-alpine
WORKDIR /usr/src/followPathMissionRep
RUN ls
COPY followPathMissionRep/package*.json ./
COPY followPathMissionRep/tsconfig.json ./
#COPY commRelayMissionRequestsRep/.env ./

RUN npm install
ADD . /usr/src/followPathMissionRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4602
