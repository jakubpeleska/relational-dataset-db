-- Get summary

select t2.data_type as col1_data_type
	, t3.data_type as col2_data_type
	, sum(error_message is null) as applied_count
	, max(t4.cnt) as applicable_count
	, avg(chi2) as chi2_avg
	, max(chi2) as chi2_max
	, avg(run_time) as run_time_avg
	, max(run_time) as run_time_max
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
left join
(
	select DATA_TYPE
		, count(*) as cnt
	from information_schema.`COLUMNS`
	where TABLE_SCHEMA = 'ctu_feature_data' and COLUMN_NAME not in ('id', 'target', 'timestamp')
	group by data_type
) t4
on  t2.DATA_TYPE = t4.DATA_TYPE
where feature_id = @feature_id
group by t2.DATA_TYPE
