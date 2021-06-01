Using docker-compose:

  To start:
    docker-compose up
  
  To stop:
    docker-compose down

----------------------------------------------------
----------------------------------------------------

Using other method:

  To build the image:
    docker build -t nodejs-mysql-api:1.0 .

  To create the network:
    docker network create nodejs-api-network

  To start MYSQL:
    docker run \
    --rm \ 
    --name mysql \
    -e MYSQL_ROOT_PASSWORD='root' \
    -e MYSQL_DATABASE='employee_db' \
    --network nodejs-api-network \
    mysql:8.0.23

    --
    docker run --rm --name mysql -e MYSQL_ROOT_PASSWORD='root' -e MYSQL_DATABASE='employee_db' --network nodejs-api-network mysql:8.0.23

  To start nodejs-api:
    docker run \
    --rm \ 
    --name nodejs-app\
    --network nodejs-api-network \
    -p 3000:3000 \
    -v ${pwd}:/app \
    nodejs-mysql-api:1.0

    --
    docker run --rm --name nodejs-app --network nodejs-api-network -p 3000:3000 -v ${pwd}:/app nodejs-mysql-api:1.0

  To stop the containers:
    docker stop nodejs-app
    docker stop mysql
