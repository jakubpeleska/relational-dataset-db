-- Get columns

select COLUMN_NAME as col1
  , DATA_TYPE as col1_data_type
  , NULL as col2
  , NULL as col2_data_type
from information_schema.`COLUMNS`
where TABLE_SCHEMA = 'ctu_feature_data'
  and TABLE_NAME = @table_name
  and COLUMN_NAME NOT IN ('id', 'target', 'timestamp');
