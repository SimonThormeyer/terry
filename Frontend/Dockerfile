FROM node:12

WORKDIR /app

COPY package.json ./

RUN rm -rf node_modules

RUN yarn

RUN npm install -g react-scripts

RUN npm install -g nodemon

RUN npm install

RUN npm ci \
 && npm cache clean --force \
 && mv /app/node_modules /node_modules

COPY . .

ENV PORT 3000

EXPOSE 3000

CMD ["yarn", "run", "start"]
