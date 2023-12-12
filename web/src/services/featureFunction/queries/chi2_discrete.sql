-- Linearly regularized against columns with high cardinality
select sum(chi2)/count(distinct(bin)) AS chi2
	from (
		select (expected.expected-measured.count) * (expected.expected-measured.count) / expected.expected AS chi2
	 , expected.bin AS bin
		from (
			select expected_bin.count*expected_target.prob AS expected
				 , bin
				 , target
			from (
				select @target target
					 , cast(count(*) as DECIMAL)/max(t2.nrow) AS prob
				from @table, (
					select cast(count(*) as DECIMAL) AS nrow
					from @table
				) t2
				GROUP BY @target
			) expected_target, (
				select cast(count(*) as DECIMAL) AS count
					 , @column AS bin
				from @table
				group by @column
			) expected_bin
		) expected
		left join (
			select @target AS target
				 , cast(count(*) as DECIMAL) AS count
				 , @column AS bin
			from @table
			group by @column, @target
		) measured
		on expected.bin = measured.bin
		and expected.target = measured.target
	) chi2;
