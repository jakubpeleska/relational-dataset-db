#!/bin/bash

FOLDER=./datasets/

migrate_dbs(){
  echo "Creating new database $1 in Postgres"
  docker exec dataset-db-postgres createdb $1
  echo "Migrating $1 data from MariaDB to Postgres"
  pgloader mysql://root:password@0.0.0.0:3306/$1 postgresql://root:password@0.0.0.0:5432/$1
  echo "Finished migrating $1 to Postgres"
}

DATASETS=("Accidents" "Ad" "AdventureWorks2014" "Airline" "arnaud_citeseer" "arnaud_DSSTOX" "arnaud_NWEcensusMid2014" "Atherosclerosis" "AustralianFootball" "Bench2" "Bench3" "Bupa" "CraftBeer" "Bench" "Chinook" "Basketball_women" "Carcinogenesis" "ccs" "ctu_adult" "CORA" "Countries" "ctu_datatype_benchmark" "cs" "CiteSeer" "Credit" "Chess" "ctu_ecoli" "Basketball_men" "ConsumerExpenditures" "Bench6" "CDESchools" "ctu_fairytale" "ctu_feature_data" "Biodegradability" "ctu_crossSchema1" "classicmodels" "ctu_auta" "ctu_gaussian" "ctu_phishing" "ctu_feature_temp" "FlexiBee" "GOSales" "imdb_small" "Bench4" "ChEMBL" "Bench5" "ctu_deals" "employee" "Financial_std" "Elti" "ctu_KDD_Cup_2009" "DCG" "ctu_metalearning" "Hepatitis_std" "ctu_mushrooms" "ctu_outliers" "ctu_20news" "Grants" "genes" "Hockey" "ctu_titanic" "medical" "Hockey_Yeti" "Mesh" "Mondial_geo" "Facebook" "Financial_ijs" "imdb_ijs" "KRK" "meta" "lahman_2014" "ftp" "MuskLarge" "Dunur" "Mondial" "Dallas" "MuskSmall" "FNHK" "geneea" "IMDB_1R" "imdb_full" "ctu_vondreli" "imdb_MovieLens" "legalActs" "Mondial_Tutorial" "mutagenesis_42" "Mooney_Family" "ErgastF1" "mutagenesis" "nations" "nhl_draft" "OpenML_2016" "northwind" "PTE" "PubMed_Diabetes" "Student_loan" "pubs" "Pyrimidine" "TubePricing" "Pima" "PremierLeague" "ctu_crossSchema2" "financial" "SalesDB" "Same_gen" "university" "WebKP" "Seznam" "TalkingData" "UW_std" "VisualGenome" "NCAA" "mutagenesis_188" "restbase" "NBA" "sakila" "stats_CEB" "SAT" "Telstra" "SAP" "stats" "Shakespeare" "Simpsons" "ctu_feature_func" "SFScores" "ctu_financial" "Walmart_2014" "YelpDataset3" "Yelp" "voc" "tmp" "tpcc" "Toxicology" "YelpDataset3_disc_clean" "tpce" "trains" "Walmart" "world" "Triazine" "UTube")

for DATABASE in ${DATASETS[@]}; do
  migrate_dbs $DATABASE &
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
