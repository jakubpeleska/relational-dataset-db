-- Get columns

select t1.COLUMN_NAME as col1
  , t1.DATA_TYPE as col1_data_type
  , t2.COLUMN_NAME as col2
  , t2.DATA_TYPE as col2_data_type
from information_schema.`COLUMNS` t1
cross join (
  select COLUMN_NAME
    , DATA_TYPE
  from information_schema.`COLUMNS`
  where TABLE_SCHEMA = 'ctu_feature_data'
    and TABLE_NAME = @table_name
    and COLUMN_NAME NOT IN ('id', 'target', 'timestamp')
) t2
where TABLE_SCHEMA = 'ctu_feature_data'
  and TABLE_NAME = @table_name
  and t1.COLUMN_NAME NOT IN ('id', 'target', 'timestamp')
  and t1.COLUMN_NAME != t2.COLUMN_NAME;
