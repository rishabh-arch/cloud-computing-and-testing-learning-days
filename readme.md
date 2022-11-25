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
    ```
- dockerfile instructions

    ```dockerfile
    
    ```