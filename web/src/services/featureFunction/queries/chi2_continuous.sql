-- Chi2 is divided by 10 to match the regularization of nominal columns
select sum(chi2)/10  
	from ( 
		select (expected.expected-measured.count) * (expected.expected-measured.count) / expected.expected AS chi2 
		from ( 
			select expected_bin.count*expected_target.prob AS expected 
				 , bin 
				 , target 
			from ( 
				select @target AS target 
					 , cast(count(*) as DECIMAL)/max(t2.nrow) AS prob 
				from @table, ( 
					select cast(count(*) as DECIMAL) AS nrow 
					from @table 
				) t2 
				GROUP BY @target 
			) expected_target, ( 
				select cast(count(*) as DECIMAL) AS count 
					 , floor((@column-t2.min_value) / (t2.bin_width + 0.0000001)) AS bin  -- Bin really into 10 bins.
				from @table, ( 
						select (max(@column)-min(@column)) / 10 AS bin_width 
							 , min(@column) AS min_value 
						from @table 
					) t2 
				group by floor((@column-t2.min_value) / (t2.bin_width + 0.0000001)) 	-- And avoid division by zero.
			) expected_bin 
		) expected 
		left join ( 
			select @target target 
				 , cast(count(*) as DECIMAL) AS count 
				 , floor((@column-t2.min_value) / (t2.bin_width + 0.0000001)) AS bin 
			from @table, ( 
					select (max(@column)-min(@column)) / 10 AS bin_width 
						 , min(@column) AS min_value 
					from @table 
				) t2 
			group by floor((@column-t2.min_value) / (t2.bin_width + 0.0000001)), @target 
		) measured 
		on expected.bin = measured.bin 
		and expected.target = measured.target 
	) chi2;