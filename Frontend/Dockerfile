FROM node:12

WORKDIR /app

COPY package.json ./

RUN rm -rf node_modules

RUN yarn install && \
    yarn global add \
    react-scripts 


COPY . .

ENV PORT 3000

EXPOSE 3000

CMD ["yarn", "run", "start"]
