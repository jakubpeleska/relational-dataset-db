import {getAPI} from '../APIUtils.js';
import resource from './resource';

const mapping = {
  'get_datasets'       : resource.getDatasets,
  'get_dataset'        : resource.getDataset,
  'get_top_datasets'   : resource.getTopDatasets,
  'get_search_results' : resource.getSearchResults
};

const datasetAPI = getAPI('dataset', mapping);

export default {
  mapping: mapping,

  getDatasets: () => {
    return datasetAPI.get('get_datasets');
  },
  getDataset: (dataset: string) => {
    return datasetAPI.get('get_dataset', {dataset: dataset});
  },
  getTopDatasets: (count: string) => {
    return datasetAPI.get('get_top_datasets', {count: count});
  },
  getSearchResults: (params: Object) => {
    return datasetAPI.get('get_search_results', params);
  }
};
