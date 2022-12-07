FROM node:14.21.1

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 80

CMD ["npm", "start"]