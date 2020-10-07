FROM node:latest

COPY . /home/node/increment.build

WORKDIR /home/node/increment.build

RUN npm i && npm run build

USER node

EXPOSE 8000

ENTRYPOINT ["npm", "start"]
