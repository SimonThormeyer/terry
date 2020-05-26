FROM node:10-slim

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm ci \
 && npm cache clean --force \
 && mv /app/node_modules /node_modules

COPY . .

ENV PORT 3000

EXPOSE 3000

CMD ["node", "index.js"]

#CMD ["yarn", "start"]

