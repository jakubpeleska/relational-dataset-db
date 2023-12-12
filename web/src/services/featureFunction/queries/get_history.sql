-- Get history

select max(feature_id) as feature_id
  , max(feature_name) as feature_name
	, max(feature_description) as feature_description
	, max(example_usage) as example_usage
	, max(author) as author
	, GROUP_CONCAT(t2.DATA_TYPE SEPARATOR ', ') as col1_data_type
	, GROUP_CONCAT(t3.DATA_TYPE SEPARATOR ', ') as col2_data_type
	, avg(chi2) as chi2_avg
	, max(chi2) as chi2_max
	, avg(run_time) as run_time_avg
	, max(run_time) as run_time_max
	, max(sql_original) as sql_original
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
where chi2 is not null
group by feature_id
order by feature_id desc

