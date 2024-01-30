#!/bin/bash

# User name and host
GUEST_USER="guest@'%'"
GUEST_PASSWORD="ctu-relational"
GUEST_GRANTS="SELECT, SHOW VIEW"

docker exec -i dataset-db-mariadb mariadb -e "CREATE OR REPLACE USER $GUEST_USER IDENTIFIED BY '$GUEST_PASSWORD';"

# Get the list of databases, excluding the ones you don't want to grant access to
databases=$(docker exec -i dataset-db-mariadb mariadb -e "SHOW DATABASES;" | grep -v -E 'Database|information_schema|performance_schema|mysql|test|test_db')

# Loop through and grant SELECT on each database
for db in $databases; do
    echo "Granting $GUEST_GRANTS on $db to $GUEST_USER"
    docker exec -i dataset-db-mariadb mariadb -e "GRANT $GUEST_GRANTS ON \`$db\`.* TO $GUEST_USER;"
done

docker exec -i dataset-db-mariadb mariadb -e "FLUSH PRIVILEGES;"

echo "Permissions granted."
