FROM node:15.14.0

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN mkdir -p frontend/build/uploads

COPY . .

EXPOSE 5000

CMD ["npm", "start"]