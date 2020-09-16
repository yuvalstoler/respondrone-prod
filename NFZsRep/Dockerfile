FROM node:12-alpine
WORKDIR /usr/src/NFZsRep
RUN ls
COPY /package*.json ./
COPY /tsconfig.json ./

RUN npm install
ADD . /usr/src/NFZsRep
RUN ls

#COPY  ./classes commRelayMissionRequestsRep/src/classes
#COPY  ./config commRelayMissionRequestsRep/src/config
# TypeScript
RUN npm run tsc
CMD ["npm", "start" ]
EXPOSE 4601
