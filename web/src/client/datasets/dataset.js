import {List, Map, Record} from 'immutable';
import {dataTypes} from '../datasets/store';

const ReferenceRecord = Record({
  text: null,
  url: null
});

class Reference extends ReferenceRecord {
  static revive = (props) => {
    return new Reference(props);
  }
}

const AlgorithmRecord = Record({
  datasetVersion: null,
  target: null,
  algorithm: null,
  authorText: null,
  authorUrl: null,
  measure: null,
  value: null
});

class Algorithm extends AlgorithmRecord {
  static revive = (props) => {
    return new Algorithm(props);
  }
}

const DatasetRecord = Record({
  title: null,
  alternativeNames: null,
  description: null,
  databaseSize: null,
  tableCount: null,
  rowCount: null,
  columnCount: null,
  isArtificial: null,
  domain: null,
  task: null,
  missingValues: null,
  dataTypes: List(),
  bibtexPath: null,
  imgPath: null,
  mwbPath: null,
  origin: null,
  schema: null,
  versions: List(),
  modifications: null,
  uploader: null,
  compositeKeys: null,
  loops: null,
  instanceCount: null,
  targetTable: null,
  targetColumn: null,
  targetId: null,
  targetTimestamp: null,
  references: List(),
  algorithms: List()
});

export default class Dataset extends DatasetRecord {

  static fromDB = (props) => {
    return new Dataset({
      title: props.get('dataset_name'),
      alternativeNames: props.get('alternative_names'),
      description: props.get('description'),
      databaseSize: props.get('database_size'),
      tableCount: props.get('table_count'),
      rowCount: props.get('row_count'),
      columnCount: props.get('column_count'),
      isArtificial: props.get('is_artificial'),
      domain: props.get('domain'),
      task: props.get('task'),
      missingValues: props.get('null_count') > 0,
      dataTypes: dataTypes.filter((dataType) => {
        return props.get(dataType + '_count') > 0;
      }),
      bibtexPath: props.get('bibtex_filename'),
      imgPath: props.get('img_filename'),
      mwbPath: props.get('mwb_filename'),
      origin: props.get('download_url'),
      schema: props.get('database_name'),
      versions: props.get('versions')
        ? props.get('versions').map(version => Dataset.fromDB(version))
        : List(),
      modifications: props.get('modifications'),
      uploader: props.get('uploader_name'),
      compositeKeys: props.get('composite_foreign_key_count') > 0,
      loops: props.get('has_loop') > 0,
      instanceCount: props.get('instance_count'),
      targetTable: props.get('target_table'),
      targetColumn: props.get('target_column'),
      targetId: props.get('target_id'),
      targetTimestamp: props.get('target_timestamp'),
      references: props.get('references')
        ? props.get('references').map(reference => new Reference(reference))
        : List(),
      algorithms: props.get('algorithms')
        ? props.get('algorithms').map(algorithm => new Algorithm({
          datasetVersion: algorithm.get('dataset_version'),
          target: algorithm.get('target'),
          algorithm: algorithm.get('algorithm'),
          authorText: algorithm.get('author_text'),
          authorUrl: algorithm.get('author_url'),
          measure: algorithm.get('measure'),
          value: algorithm.get('value'),
        })) : List()
    });
  }

  static revive = (props) => {
    if (props instanceof Map) {
      props = props
        .set('versions', props.get('versions')
          ? props.get('versions').map(version => Dataset.revive(version))
          : List())
        .set('references', props.get('references')
          ? props.get('references').map(reference => Reference.revive(reference))
          : List())
        .set('algorithms', props.get('algorithms')
          ? props.get('algorithms').map(algorithm => Algorithm.revive(algorithm))
          : List());
    }
    return new Dataset(props);
  }

}
