import {Record} from 'immutable';

const SummaryRecord = Record({
  title: '',
  tableCount: null,
  columnCount: null,
  rowCount: null,
  instanceCount: null,
  databaseSize: null,
  isArtificial: null,
  domain: null,
  task: null,
  missingValues: null,
  loops: null,
  compositeKeys: null
});

export default class Summary extends SummaryRecord {

  static fromDB = (props) => {
    return new Summary({
      title: props.get('dataset_name'),
      tableCount: props.get('table_count'),
      columnCount: props.get('column_count'),
      rowCount: props.get('row_count'),
      instanceCount: props.get('instance_count'),
      databaseSize: props.get('database_size'),
      isArtificial: props.get('is_artificial'),
      domain: props.get('domain'),
      task: props.get('task'),
      missingValues: props.get('null_count') > 0,
      loops: props.get('has_loop') > 0,
      compositeKeys: props.get('composite_foreign_key_count') > 0
    });
  }

  static revive = (props) => {
    return new Summary(props);
  }

}
