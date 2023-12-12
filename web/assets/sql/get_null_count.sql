-- Count null records in the whole MySQL server per each database.
-- Note: The runtime for the whole database is high (around half an hour). 

set group_concat_max_len=1500000;

set @subSQL = '(select "@table_schema" as table_schema, count(*) as cnt from `@table_schema`.`@table_name` where `@column_name` is null)';

select @subSQL := group_concat(replace(replace(replace(@subSQL, '@table_schema', table_schema
                                                      ), '@table_name', table_name
                                              ), '@column_name', column_name
                                      ) separator ' union all '
                              )
from information_schema.columns
join meta.database 
on database_name = table_schema
where null_count is null; -- Only for databases where we miss the null count.

set @SQL = concat('select table_schema, sum(cnt) as NumNulls from (',
                  @subSQL,
                  ') t group by table_schema');

select @SQL;

PREPARE stmt FROM @SQL;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;