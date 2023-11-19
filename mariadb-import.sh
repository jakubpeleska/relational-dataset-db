#!/bin/bash

FOLDER=./datasets/

mariadb_import(){
  f=${1#"$FOLDER"}
  output=${f%".sql"}
  echo "Importing $f to MariaDB"
  docker exec -i dataset-db-mariadb mariadb -u root --password=password -t < $1
  echo "Finished importing $f to MariaDB"
}

for FILE in $FOLDER*
do
  mariadb_import $FILE &
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
