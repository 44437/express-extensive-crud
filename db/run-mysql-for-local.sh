# !/bin/sh

docker run --name local-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=admin -d mysql:8

until docker exec local-mysql mysqladmin ping -u root -padmin --silent; do
  echo "The status is being checked"
  sleep 5
done

docker cp db/users.sql local-mysql:/users.sql
docker exec -it local-mysql mysql -u root -padmin -e "SOURCE users.sql"
