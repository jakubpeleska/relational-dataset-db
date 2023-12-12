import {List, Record} from 'immutable';
import {round} from '../../lib/helpers';

const ResultRecord = Record({
  tableName: '',
  col1: '',
  col2: '',
  col1DataType: '',
  col2DataType: '',
  sql: '',
  chi2: 0.0,
  runTime: 0.0,
  errorMessage: ''
});

class Result extends ResultRecord {
  static revive = (props) => {
    return new Result(props);
  }
}

const SummaryRecord = Record({
  col1DataType: '',
  col2DataType: '',
  appliedCount: 0,
  applicableCount: 0,
  chi2Avg: 0.0,
  chi2Max: 0.0,
  runTimeAvg: 0.0,
  runTimeMax: 0.0
});

class Summary extends SummaryRecord {
  static revive = (props) => {
    return new Summary(props);
  }
}

const FeatureFunctionRecord = Record({
  author: '',
  col1DataType: '',
  col2DataType: '',
  chi2Avg: 0.0,
  chi2Max: 0.0,
  runTimeAvg: 0.0,
  runTimeMax: 0.0,
  featureId: 0,
  featureName: '',
  featureDescription: '',
  featureApplication: '',
  sqlOriginal: '',
  sqlOriginalLen: '',
  results: List(),
  summary: List()
});

export default class FeatureFunction extends FeatureFunctionRecord {

  static fromDB = (props) => {
    return new FeatureFunction({
      author: props.get('author'),
      col1DataType: props.get('col1_data_type'),
      col2DataType: props.get('col2_data_type'),
      chi2Avg: round(props.get('chi2_avg'), 2),
      chi2Max: round(props.get('chi2_max'), 2),
      runTimeAvg: round(props.get('run_time_avg'), 2),
      runTimeMax: round(props.get('run_time_max'), 2),
      featureId: props.get('feature_id'),
      featureName: props.get('feature_name'),
      featureDescription: props.get('feature_description'),
      featureApplication: props.get('example_usage'),
      sqlOriginal: props.get('sql_original'),
      sqlOriginalLen: props.get('sql_original').length,
      summary: props.get('summary')
        ? props.get('summary').map(summary => new Summary({
          col1DataType: summary.get('col1_data_type'),
          col2DataType: summary.get('col2_data_type'),
          appliedCount: summary.get('applied_count'),
          applicableCount: summary.get('applicable_count'),
          chi2Avg: round(summary.get('chi2_avg'), 2),
          chi2Max: round(summary.get('chi2_max'), 2),
          runTimeAvg: round(summary.get('run_time_avg'), 2),
          runTimeMax: round(summary.get('run_time_max'), 2)
        })) : List(),
      results: props.get('results')
        ? props.get('results').map(result => new Result({
          tableName: result.get('table_name'),
          col1: result.get('col1'),
          col2: result.get('col2'),
          col1DataType: result.get('col1_data_type'),
          col2DataType: result.get('col2_data_type'),
          sql: result.get('sql'),
          chi2: round(result.get('chi2'), 2),
          runTime: round(result.get('run_time'), 2),
          errorMessage: result.get('error_message')
        })) : List()
    });
  }

  static revive = (props) => {
    if (props instanceof Map) {
      props = props
        .set('results', props.get('results')
          ? props.get('results').map(result => Result.revive(result))
          : List())
        .set('summary', props.get('summary')
          ? props.get('summary').map(summary => Summary.revive(summary))
          : List());
    }
    return new FeatureFunction(props);
  }

}
