FROM node:5.3.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules
RUN npm install
COPY . /usr/src/app
RUN npm run build

EXPOSE 8080 3030
ENV NODE_ENV production
ENV NODE_PATH /usr/src/app
ENV NPM_CONFIG_PRODUCTION false

CMD [ "npm", "start" ]