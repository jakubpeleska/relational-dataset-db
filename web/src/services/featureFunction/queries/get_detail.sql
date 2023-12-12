-- Get detail

select max(feature_id) as feature_id
  , max(feature_name) as feature_name
  , max(feature_description) as feature_description
  , max(example_usage) as example_usage
  , max(author) as author
  , avg(chi2) as chi2_avg
  , max(chi2) as chi2_max
  , avg(run_time) as run_time_avg
  , max(run_time) as run_time_max
  , max(sql_original) as sql_original
from result_list
where feature_id=@feature_id