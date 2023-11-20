#!/bin/bash

FILEID="1BqQwPtOoWLiF_XbpyEgH8hFpcdTpS3Fg"
FILENAME=datasets.zip
FOLDER=./datasets


if [ -z "$(ls -A $FOLDER)" ]; then
  wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=$FILEID' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=$FILEID" -O $FILENAME && rm -rf /tmp/cookies.txt

  unzip $FILENAME
fi

docker pull dimitri/pgloader:v3.6.7

migrate_db(){
  db=${1#"$FOLDER/"}
  db=${db%".sql"}
  echo "Importing $db to MariaDB"
  docker exec -i dataset-db-mariadb mariadb -u root --password=password -t < $1
  echo "Finished importing $db to MariaDB"
  echo "Creating new database $db in Postgres"
  docker exec dataset-db-postgres createdb $db
  echo "Migrating $db data from MariaDB to Postgres"
  docker run --rm --network=dataset-db-net dimitri/pgloader:v3.6.7 pgloader --with "batch size = 10MB" mysql://root:password@dataset-db-mariadb:3306/$db postgresql://root:password@dataset-db-postgres:5432/$db
  echo "Finished migrating $db to Postgres"
}

for FILE in $FOLDER/*
do
  migrate_db $FILE &
  pids+=($!)
done


for pid in "${pids[@]}"; do
    wait "${pid}"
    status+=($?)
done

for i in "${!status[@]}"; do
    echo "job $i exited with ${status[$i]}"
done

echo "All done"
