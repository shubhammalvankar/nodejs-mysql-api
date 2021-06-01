FROM node:15-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

EXPOSE 3000

VOLUME [ "/app/node_modules" ]

CMD ["npm", "start"]
