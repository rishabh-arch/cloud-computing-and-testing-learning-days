# I got many errors when I tried to install the package on my docker container

## first error was: package installation error

- I solved it by installing the package with `npm install --legacy-peer-deps` option in dockerfile because of the peer dependencies.(many dependencies are not compatible with the latest version of react and nodejs) in both backend and frontend.

- Then i got bcrypt error. I have solved it by ignoring the node_modules package in .dockerignore for both backend and frontend.

## second error was: connecting to mongodb error

- I solved it by changing the mongodb connection string. I have changed the `localhost` to `mongo` because of the docker-compose file.

```js
const url = "mongodb://localhost:27017"; // before

const url = "mongodb://mongo:27017/docker-db"; // after
```

## third error was: connecting to Nodejs server proxy error

- I solved it by changing the proxy in package.json file in frontend folder.

```js
  "proxy":"localhost:5000/", // before

  "proxy":"http://host.docker.internal:5000/", // after 
```

## fourth error was: connecting to Nodejs to host error

- I need to change my hostname `127.0.0.1 to 0.0.0.0` in backend/routes/User.js file

```js
app.listen(PORT, '0.0.0.0',() => {
    console.log(`heyyyyy , connected to database, app listening on port ${PORT}`);
});  
```

## Dockerfile and .dockerignore files

### frontend

```dockerfile
FROM node:14.21.1

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 80

CMD ["npm", "start"]
```

```dockerignore
/node_modules
/build
/Dockerfile
/.git;
```

### backend

```dockerfile
FROM node:15.14.0

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```dockerignore
/node_modules
Dockerfile
.git;
```

## docker-compose.yml file

```yml
version: '3.8'
services:
  mongodb:
    image: "mongo"
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - data:/data/db
  mongo-express: 
    container_name: mongo-express
    image: mongo-express
    ports: 
      - '8083:8081'
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - logs:/app/logs
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mongodb
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    stdin_open: true
    tty: true
    depends_on:
      - backend

volumes:
  data:
  logs:
```

## Instruction to run the project

- clone the project

```bash
git clone --single-branch --branch First-docker-container https://github.com/rishabh-arch/cloud-computing-and-testing-learning-days.git
```

- create these 3 folders inside backend folder `frontend/build/uploads`

- Download docker and run on your system

- run the following command in the root directory of the project

```bash
docker-compose up
```

- open the browser and go to

[localhost:3000](http://localhost:3000/)

# HAVE FUN