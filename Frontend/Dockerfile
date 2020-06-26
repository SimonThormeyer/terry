FROM node:12

WORKDIR /app

COPY package.json ./

RUN rm -rf node_modules

RUN yarn

RUN yarn global add react-scripts

RUN yarn global add nodemon

RUN yarn install

COPY . .

ENV PORT 3000

EXPOSE 3000

CMD ["yarn", "run", "start"]
