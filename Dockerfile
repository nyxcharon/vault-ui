FROM node:5.3.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
RUN npm run build

EXPOSE 8080 3030

CMD [ "npm", "run", "start" ]