import {getAPI} from '../APIUtils.js';
import resource from './resource';

const mapping = {
  'get_summary' : resource.getSummary,
  'get_classifiers' : resource.getClassifiers
};

const statisticsAPI = getAPI('statistics', mapping);

export default {
  mapping: mapping,

  getSummary: () => {
    return statisticsAPI.get('get_summary');
  },
  getClassifiers: () => {
    return statisticsAPI.get('get_classifiers');
  }
};
