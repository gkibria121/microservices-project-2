FROM node:22-alpine

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=0 
ENV TAILWIND_IGNORE_MISSING_OXIDE=1
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1 

WORKDIR /app
COPY package.json .



RUN npm install  

RUN apk update
RUN apk add curl 
COPY . .

CMD [ "npm","run" ,"dev"]


