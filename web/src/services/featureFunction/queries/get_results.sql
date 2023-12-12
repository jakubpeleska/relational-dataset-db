-- Detail results

select t1.table_name
	, col1
	, col2
	, t2.DATA_TYPE as col1_data_type
	, t3.DATA_TYPE as col2_data_type
	, `sql`
	, error_message
	, chi2
	, run_time
from result_list t1
join (
	select TABLE_NAME
		, COLUMN_NAME
		, DATA_TYPE
	from information_schema.`COLUMNS`
	where TABLE_SCHEMA = 'ctu_feature_data'
) t2
on t1.table_name = t2.TABLE_NAME and t1.col1 = t2.COLUMN_NAME
left join (
	select TABLE_NAME
		, COLUMN_NAME
		, DATA_TYPE
	from information_schema.`COLUMNS`
	where TABLE_SCHEMA = 'ctu_feature_data'
) t3
on t1.table_name = t3.TABLE_NAME and t1.col2 = t3.COLUMN_NAME
where feature_id = @feature_id
