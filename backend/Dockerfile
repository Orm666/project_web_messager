FROM node:14.16.0

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json /usr/app

RUN yarn install

COPY . /usr/app

EXPOSE 3000

CMD ["yarn", "launch"]