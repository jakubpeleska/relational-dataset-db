import {List} from 'immutable';
import {capitalize, getSizeWithUnit} from '../../../lib/helpers';
import Tag from './tag';

export function getTagsFromDataset(dataset) {
  let tags = List();

  if (dataset.databaseSize)
    tags = tags.push(getDatabaseSizeTag(dataset.databaseSize));
  if (dataset.tableCount)
    tags = tags.push(getTableCountTag(dataset.tableCount));
  if (dataset.isArtificial)
    tags = tags.push(getArtificialTag());
  if (dataset.domain)
    tags = tags.push(getDomainTag(dataset.domain));
  if (dataset.task)
    tags = tags.push(getTaskTag(dataset.task));
  if (dataset.missingValues)
    tags = tags.push(getMissingValuesTag());
  tags = tags.concat(getDataTypeTags(dataset.dataTypes));

  return tags;
}

export function getDataTypeText(dataType) {
  switch (dataType) {
    case 'date': return 'Temporal';
    case 'geo': return 'Spatial';
    case 'lob': return 'LOB';
    default:
      return capitalize(dataType);
  }
}

export function getTableCountValue(tableCount) {
  return tableCount <= 10
    ? ['0-10']
    : tableCount <= 30
      ? ['10-30']
      : ['30+'];
}

function getDatabaseSizeTag(databaseSize) {
  const size = getSizeWithUnit(databaseSize);
  const unit = size.slice(-2);

  return new Tag({
    type: 'databaseSize',
    value: [unit],
    name: 'Size',
    text: size
  });
}

function getTableCountTag(tableCount) {
  return new Tag({
    type: 'tableCount',
    value: getTableCountValue(tableCount),
    name: 'Table count',
    text: tableCount + ' Tables'
  });
}

function getArtificialTag() {
  return new Tag({
    type: 'type',
    value: ['Synthetic'],
    name: 'Type',
    text: 'Synthetic'
  });
}

function getDomainTag(domain) {
  return new Tag({
    type: 'domain',
    value: [domain],
    name: 'Domain',
    text: domain
  });
}

function getTaskTag(task) {
  return new Tag({
    type: 'task',
    value: [capitalize(task)],
    name: 'Task',
    text: capitalize(task)
  });
}

function getMissingValuesTag() {
  return new Tag({
    type: 'missingValues',
    value: ['With missing values'],
    name: 'Missing values',
    text: 'Missing values'
  });
}

function getDataTypeTags(dataTypes) {
  let tags = List();

  dataTypes.map(dataType => {
    tags = tags.push(new Tag({
      type: 'dataType',
      value: [getDataTypeText(dataType)],
      name: 'Data type',
      text: getDataTypeText(dataType)
    }));
  });

  return tags;
}
