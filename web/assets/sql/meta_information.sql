/** This script produces meta.information table. Required input tables are meta.background and meta.background_origin. **/

/* Back up */
drop table if EXISTS meta.information_bkp;
create table meta.information_bkp as
select *
from meta.information;

/* Get count of tables */
drop table if EXISTS meta.table_count;

create table meta.table_count as
select TABLE_SCHEMA as database_name
	 , count(*) as table_count
from information_schema.`tables`
group by TABLE_SCHEMA;

/* Get size of the database */
drop table if EXISTS meta.`database_size`;

create table meta.`database_size` as
SELECT table_schema  as database_name
	 , Round(Sum(data_length + index_length) / 1024 / 1024, 1) as database_size
FROM   information_schema.tables 
GROUP BY table_schema; 

/* Get count of rows */
/* Note: on innodb tables this is just an estimate */
drop table if EXISTS meta.`row_count`;

create table meta.`row_count` as
select TABLE_SCHEMA  as database_name
	 , sum(TABLE_ROWS) as `row_count`
from information_schema.`TABLES`
group by TABLE_SCHEMA;


/* Get count of rows */
drop table if EXISTS meta.`row_max`;

create table meta.`row_max` as
select TABLE_SCHEMA as database_name
	 , max(TABLE_ROWS) as `row_max`
from information_schema.`TABLES`
group by TABLE_SCHEMA;


/* Get count of columns */
drop table if EXISTS meta.column_count;

create table meta.column_count as
select table_schema as database_name
	 , count(*) as column_count
from information_schema.`columns`
group by table_schema;


/* Get count of geo columns */
drop table if EXISTS meta.geo_count;

create table meta.geo_count as
select TABLE_SCHEMA as database_name
	 , count(*) as geo_count
from information_schema.`COLUMNS` t1
where (DATA_TYPE like "%geometry%")
group by TABLE_SCHEMA;


/* Get count of date columns */
drop table if EXISTS meta.date_count;

create table meta.date_count as
select TABLE_SCHEMA as database_name
	 , count(*) as date_count
from information_schema.`COLUMNS` t1
where (DATA_TYPE like "%date%" or DATA_TYPE like "%time%" or DATA_TYPE like "%year%")
group by TABLE_SCHEMA;

/* Get count of lob columns */
drop table if EXISTS meta.lob_count;

create table meta.lob_count as
select TABLE_SCHEMA as database_name
	 , count(*) as lob_count
from information_schema.`COLUMNS` t1
where (DATA_TYPE like "%lob%")
group by TABLE_SCHEMA;


/* Get count of numeric columns */
drop table if EXISTS meta.numeric_count;

create table meta.numeric_count as
select TABLE_SCHEMA as database_name
	 , count(*) as numeric_count
from information_schema.`COLUMNS` t1
where (DATA_TYPE like "%int%" or DATA_TYPE like "%decimal%" or DATA_TYPE like "%float%" or DATA_TYPE like "%double%" or DATA_TYPE like "%numeric%"  or DATA_TYPE like "%bit%")
group by TABLE_SCHEMA;


/* Get count of string columns */
drop table if EXISTS meta.string_count;

create table meta.string_count as
select TABLE_SCHEMA as database_name
	 , count(*) as string_count
from information_schema.`COLUMNS` t1
where (DATA_TYPE like "%char%" or DATA_TYPE like "%text%" or DATA_TYPE like "%enum%" or DATA_TYPE like "%set%")
group by TABLE_SCHEMA;


/* Get count of primary keys. */
drop table if EXISTS meta.primary_key_count;

create table meta.primary_key_count as
select TABLE_SCHEMA as database_name
	 , count(*) as primary_key_count
from information_schema.KEY_COLUMN_USAGE
where CONSTRAINT_NAME = 'PRIMARY'
and ORDINAL_POSITION = 1 /* Because we want to count composite keys just once */
group by TABLE_SCHEMA;


/* Get count of foreign keys */
drop table if EXISTS meta.foreign_key_count;

create table meta.foreign_key_count as
select TABLE_SCHEMA as database_name
	 , count(*) as foreign_key_count
from INFORMATION_SCHEMA.KEY_COLUMN_USAGE
where REFERENCED_TABLE_NAME is not null
and ORDINAL_POSITION = 1
group by TABLE_SCHEMA;


/* Get count of self referencing tables */
drop table if EXISTS meta.self_referencing_table_count;

create table meta.self_referencing_table_count as
select constraint_schema as database_name
	 , count(DISTINCT TABLE_NAME) as self_referencing_table_count
from INFORMATION_SCHEMA.KEY_COLUMN_USAGE
where REFERENCED_TABLE_NAME = TABLE_NAME
group by constraint_schema;


/* Get count of composite foreign keys */
drop table if EXISTS meta.composite_key;

create table meta.composite_key as
select a.CONSTRAINT_SCHEMA as database_name
	 , count(*) as composite_foreign_key_count
from (
	select CONSTRAINT_SCHEMA 
		 , CONSTRAINT_NAME
	from information_schema.KEY_COLUMN_USAGE
	where REFERENCED_TABLE_NAME is not null
	group by CONSTRAINT_SCHEMA, CONSTRAINT_NAME
	having count(*)>1
) a
group by a.CONSTRAINT_SCHEMA;


/* Get count of rows in target table */
drop table if EXISTS meta.instance_count;

create table meta.instance_count as
select t1.database_name
	 , t2.TABLE_ROWS as instance_count
from meta.database t1
join information_schema.`TABLES` t2
on t1.database_name = t2.TABLE_SCHEMA
and t1.target_table = t2.TABLE_NAME;


/* Is the dataset imbalanced? */
drop table if exists meta.balance;

SET group_concat_max_len=1500000; -- By default the limit is too small
set @sql = 'create table meta.balance as ';
select group_concat('
	select "', database_name,'" as database_name, max(cnt)/sum(cnt) as majority_class_ratio, count(cnt) as class_count
	from (
		SELECT count(*) as cnt
		FROM ', database_name,'.', target_table,'
		group by ', target_column,'
		order by 1 desc
	) t ' SEPARATOR '	
    union all ')
into @select
from meta.database
where task = 'classification';
set @sql = concat(@sql, @select);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


/* Does the target table contain duplicate tableID? */
drop table if exists meta.duplicate_target_id;

SET group_concat_max_len=1500000; -- By default the limit is small
 
SET @SQL = 'create table meta.duplicate_target_id as ';

select group_concat(' select ''', database_name, ''' as database_name, exists(
	select count(*) 
	from `', database_name, '`.`', target_table, '` GROUP BY `', replace(target_id, ', ', '`, `'), '` having count(*)>1) as duplicate_target_id' SEPARATOR '	
    union all ')
INTO @SELECT
from meta.database;

SET @SQL = concat(@SQL, @SELECT);
 
PREPARE stmt FROM @SQL;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


/* Estimate, whether the problem is single entity problem or an edge property estimation */
drop table if exists meta.has_target_table_loop;

SET group_concat_max_len=1500000; -- By default the limit is small
 
SET @SQL = 'create table meta.has_target_table_loop as ';

select group_concat(' select ''', database_name, ''' as database_name, exists(
	select 1 
	from information_schema.KEY_COLUMN_USAGE where REFERENCED_TABLE_NAME is not null and TABLE_SCHEMA = ''', database_name, ''' and TABLE_NAME = ''', target_table, ''' group by REFERENCED_TABLE_NAME having count(*)>1) as has_target_table_loop' SEPARATOR '	
    union all ')
INTO @SELECT
from meta.database;

SET @SQL = concat(@SQL, @SELECT);
 
PREPARE stmt FROM @SQL;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;




/* Join collected data and background data together */
drop table if EXISTS meta.information;

/* Bypass bad join size estimate */
SET SQL_BIG_SELECTS=1;

create table meta.information as
select database_name
	 , dataset_name
	 , is_primary_version
	 , is_hidden
	 , is_artificial
	 , domain
	 , description
	 , alternative_names
	 , publication_count
	 , database_size
	 , table_count
	 , row_count
	 , row_max
	 , null_count
	 , column_count
	 , coalesce(geo_count, 0) geo_count
	 , coalesce(date_count, 0) date_count
	 , coalesce(lob_count, 0) lob_count
	 , coalesce(string_count, 0) string_count
	 , coalesce(numeric_count, 0) numeric_count
	 , coalesce(primary_key_count, 0) primary_key_count
	 , coalesce(foreign_key_count, 0) foreign_key_count
	 , coalesce(composite_foreign_key_count, 0) composite_foreign_key_count
	 , coalesce(self_referencing_table_count, 0) self_referencing_table_count
	 , has_loop
	 , target_table
	 , target_column
	 , target_id
	 , target_timestamp
	 , task
	 , instance_count
	 , duplicate_target_id
	 , has_target_table_loop
	 , class_count
	 , majority_class_ratio
	 , uploader_name
	 , uploader_url
	 , upload_date
	 , download_url
	 , modifications
	 , bibtex_filename
	 , null as img_filename
	 , null as mwb_filename
from meta.table_count
left outer join meta.`database_size`	/* Left joins because there can be null values */
using (database_name)
left outer join meta.`row_count`	
using (database_name)
left outer join meta.`row_max`
using (database_name)
left outer join meta.column_count
using (database_name)
left outer join meta.geo_count
using (database_name)
left outer join meta.date_count
using (database_name)
left outer join meta.lob_count
using (database_name)
left outer join meta.string_count
using (database_name)
left outer join meta.numeric_count
using (database_name)
left outer join meta.primary_key_count
using (database_name)
left outer join meta.foreign_key_count
using (database_name)
left outer join meta.self_referencing_table_count
using (database_name)
left outer join meta.instance_count
using (database_name)
left outer join meta.composite_key
using (database_name)
left outer join meta.balance
using (database_name)
left outer join meta.duplicate_target_id
using (database_name)
left outer join meta.has_target_table_loop
using (database_name)
left join meta.database
using (database_name)
left join meta.dataset
using (dataset_name)
where database_name <> "information_schema"
	and database_name <> "performance_schema"
	and database_name <> "predictor_factory"
	and database_name <> "mysql"
	and database_name <> "meta"
order by database_name;

ALTER TABLE meta.information ADD PRIMARY KEY (database_name);


/* Cleaning */
drop table if EXISTS meta.database_size;
drop table if EXISTS meta.table_count;
drop table if EXISTS meta.column_count;
drop table if EXISTS meta.geo_count;
drop table if EXISTS meta.date_count;
drop table if EXISTS meta.lob_count;
drop table if EXISTS meta.numeric_count;
drop table if EXISTS meta.`row_count`;
drop table if EXISTS meta.row_max;
drop table if EXISTS meta.string_count;
drop table if EXISTS meta.instance_count;
drop table if EXISTS meta.primary_key_count;
drop table if EXISTS meta.foreign_key_count;
drop table if EXISTS meta.self_referencing_table_count;
drop table if EXISTS meta.composite_key;
drop table if EXISTS meta.balance;
drop table if EXISTS meta.duplicate_target_id;
drop table if EXISTS meta.has_target_table_loop;

/** Summary and Quality Control **/

/* Does the schema contain an empty table? */
drop table if EXISTS meta.qc_has_empty_table;

create table meta.qc_has_empty_table as
select TABLE_SCHEMA as database_name
	 , min(TABLE_ROWS)=0 as `qc_has_empty_table`
from information_schema.`TABLES`
group by TABLE_SCHEMA;

/* Write down the quality control table */
drop table if EXISTS meta.qc;

create table meta.qc as
select t1.database_name 
  , (table_count>1)				as has_tables  
  , (row_count>0) 				as has_records
  , coalesce(row_count=original_row_count, 0) as matches_expected_row_count /* Note: if it was calculating the row count exactly... */
  , (primary_key_count>0) 		as has_primary_keys
  , (column_count - coalesce(geo_count, 0) - coalesce(date_count, 0) - coalesce(lob_count, 0) - coalesce(string_count, 0) - coalesce(numeric_count, 0))=0 as has_normal_column 
  , (target_table is not null) 	as has_target_table
  , (t1.description is not null)	as has_description
  , (task is not null)			as has_task
  , (t1.bibtex_filename is not null)	as has_bibtex
  , (table_count>1)
  	+ (row_count>0) 
  	+ coalesce(row_count=original_row_count, 0)
	+ (primary_key_count>0)
	+ ((column_count - coalesce(geo_count, 0) - coalesce(date_count, 0) - coalesce(lob_count, 0) - coalesce(string_count, 0) - coalesce(numeric_count, 0) - coalesce(primary_key_count, 0))=0)
	+ (target_table is not null)
	+ (t1.description is not null)
	+ (task is not null) 
	+ (t1.bibtex_filename is not null)	as qc 
from meta.information t1
left join meta.qc_has_empty_table t2
using(database_name)
left join meta.dataset t3
using(dataset_name)
order by qc desc;

drop table if EXISTS meta.qc_has_empty_table;
ALTER TABLE meta.qc ADD PRIMARY KEY (database_name);

/** Add table comments **/
ALTER TABLE meta.algorithm COMMENT = 'Hand entered data about relational algorithms/implementations.';
ALTER TABLE meta.database COMMENT = 'Hand entered data about individual versions of the datasets.';
ALTER TABLE meta.dataset COMMENT = 'Hand entered data about the datasets.';
ALTER TABLE meta.information COMMENT = 'Automatically generated meta data about the datasets.';
ALTER TABLE meta.qc COMMENT = 'Automatically generated quality control overview.';
ALTER TABLE meta.measure COMMENT = 'Hand entered model accuracie\'s on the datasets.';
ALTER TABLE meta.reference COMMENT = 'Hand entered refereces to datasets (beyond origin url).';

/** Add column comments  **/
ALTER TABLE meta.information CHANGE `database_name` `database_name` VARCHAR(64) NOT NULL COMMENT 'Name of database on MySQL server.' ;
ALTER TABLE meta.information CHANGE `table_count` `table_count` bigint(21) DEFAULT '0'  COMMENT 'Count of the tables in the database.';
ALTER TABLE meta.information CHANGE `database_size` `database_size` decimal(46,1) DEFAULT NULL  COMMENT 'Database size in MB as reported by MariaDB. The size includes indexes.' ;
ALTER TABLE meta.information CHANGE `row_count` `row_count` decimal(43,0) DEFAULT NULL  COMMENT 'Count of rows over all the tables in the database.';
ALTER TABLE meta.information CHANGE `row_max` `row_max` bigint(21) unsigned DEFAULT NULL  COMMENT 'Count of rows in the tallest table in the database.';
ALTER TABLE meta.information CHANGE `column_count` `column_count` bigint(21) DEFAULT '0'  COMMENT 'Count of columns over all the tables in the database.' ;
ALTER TABLE meta.information CHANGE `date_count` `date_count` bigint(21) DEFAULT NULL  COMMENT 'Count of time, date, datetime and timestamp columns in the database.' ;
ALTER TABLE meta.information CHANGE `geo_count` `geo_count` bigint(21) DEFAULT NULL  COMMENT 'Count of geography related data types in the database.' ;
ALTER TABLE meta.information CHANGE `string_count` `string_count` bigint(21) DEFAULT NULL  COMMENT 'Count of string columns in the database.';
ALTER TABLE meta.information CHANGE `numeric_count` `numeric_count` bigint(21) DEFAULT NULL  COMMENT 'Count of numerical attributes in the database. Includes integers, floats,...' ;
ALTER TABLE meta.information CHANGE `lob_count` `lob_count` bigint(21) DEFAULT NULL  COMMENT 'Count of large objects in the database like images or text attributes.' ;
ALTER TABLE meta.information CHANGE `null_count` `null_count` int(11) DEFAULT NULL  COMMENT 'Count of missing values in the database.' ;
ALTER TABLE meta.information CHANGE `primary_key_count` `primary_key_count` bigint(21) DEFAULT NULL  COMMENT 'Count of indexes in the database.' ;
ALTER TABLE meta.information CHANGE `foreign_key_count` `foreign_key_count` bigint(21) DEFAULT NULL  COMMENT 'Count of foreign keys.' ;
ALTER TABLE meta.information CHANGE `composite_foreign_key_count` `composite_foreign_key_count` bigint(21) DEFAULT NULL  COMMENT 'Count of primary keys that are composed of two or more columns.' ;
ALTER TABLE meta.information CHANGE `self_referencing_table_count` `self_referencing_table_count` bigint(21) DEFAULT NULL  COMMENT 'Count of tables, whose foreign key references the primary key of the table.';
ALTER TABLE meta.information CHANGE `has_loop` `has_loop` int(1) DEFAULT NULL  COMMENT 'Does there exist a loop over more than a single table if we treat foreign keys as an undirected graph?' ;
ALTER TABLE meta.information CHANGE `instance_count` `instance_count` bigint(21) unsigned DEFAULT NULL  COMMENT 'Count of rows in the target table.' ;
ALTER TABLE meta.information CHANGE `has_loop` `has_loop` int(1) DEFAULT NULL  COMMENT 'Does there exist a loop over more than a single table if we treat foreign keys as an undirected graph?' ;
ALTER TABLE meta.information CHANGE `duplicate_target_id` `duplicate_target_id` int(1) DEFAULT NULL COMMENT 'Does the target table contain duplicate target_id?';
ALTER TABLE meta.information CHANGE `has_target_table_loop` `has_target_table_loop` int(1) DEFAULT NULL COMMENT 'Does the target table and some other table create a loop?';
ALTER TABLE meta.information CHANGE `majority_class_ratio` `majority_class_ratio` DECIMAL(24,4) DEFAULT NULL COMMENT 'Proportion of majority class in the target column.' ;
