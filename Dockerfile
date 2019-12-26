FROM node:13.3.0

MAINTAINER asmundh <github.com/asmundh>

RUN mkdir -p /app/coffeescoreboard/server 

COPY . /app/coffeescoreboard/server

WORKDIR /app/coffeescoreboard/server

RUN npm install


CMD [ "npm", "start" ]
