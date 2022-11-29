# docker

- install docker
- some docker commands

  ```bash
  docker run <image_name>
  docker run -d <image_name> # run in background
  docker run -p <host_port>:<container_port> <image_name> # map port
  docker run -v <host_dir>:<container_dir> <image_name> # map volume
  docker run -it <image_name> # interactive mode
  docker run -it --rm <image_name> # remove container after exit
  docker run -it --name <container_name> <image_name> # set container name
  docker run -it --name <container_name> -h <hostname> <image_name> # set hostname
  docker run -it --name <container_name> -h <hostname> -e <env_name>=<env_value> <image_name> # set env
  docker pull <image_name> # pull image
  docker images # list images
  docker ps # list running containers
  docker ps -a # list all containers
  docker stop <container_name> # stop container
  docker rm <container_name> # remove container
  docker rmi <image_name> # remove image
  docker exec -it <container_name> <command> # execute command in container
  docker exec -it <container_name> /bin/bash # enter container bash (linux shell)

  docker run -d -p6001:6379 --name redis-rk redis:4.0


  ```

# Commands

## create docker network

```bash
docker network create mongo-network
```

## start mongodb and mongo-express

```bash
    docker run -p 27017:27017 -d -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password --name mongodb --net mongo-network mongo

    docker run -p 8081:8081 -d -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=password -e ME_CONFIG_MONGODB_SERVER=mongodb -e ME_CONFIG_MONGODB_URL= mongo://admin:password@mongodb:27017/ --name mongo-express --net mongo-network mongo-express

```

## Error I got while create creating docker-compose file

```yaml
version: '3'
services:
mongodb:
  image: mongo
  ports:
    - 27017:27017
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=password
mongo-express:
  image: mongo-express
  restart: always
  ports:
    - 8080:8081
  environment:
    - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
    - ME_CONFIG_MONGODB_ADMINPASSWORD=password
    # - ME_CONFIG_MONGODB_URL=mongodb://admin:password@mongodb:27017/
    - ME_CONFIG_MONGODB_SERVER=mongodb
```
## Now I am gonna create My own IMAGE

We need AWS ECR to store our image
create a repository in ECR 
follow the steps to push the image to ECR - https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html

