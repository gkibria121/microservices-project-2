FROM node:22-alpine

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=0 
WORKDIR /app

COPY package.json .



RUN npm install  

RUN apk update
RUN apk add curl
RUN  npm install  
COPY . .

CMD [ "npm","run" ,"dev"]


