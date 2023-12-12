import {getAPI} from '../APIUtils.js';
import resource from './resource';

const mapping = {
  'get_feature_function'  : resource.getFeatureFunction,
  'get_past_results'      : resource.getPastResults,
  'send_feature_function' : resource.sendFeatureFunction
};

const featureFunctionAPI = getAPI('featureFunction', mapping);

export default {
  mapping: mapping,

  getFeatureFunction: (featureId) => {
    return featureFunctionAPI.get('get_feature_function', {featureId: featureId});
  },
  getPastResults: () => {
    return featureFunctionAPI.get('get_past_results');
  },
  sendFeatureFunction: (values: Object) => {
    return featureFunctionAPI.post('send_feature_function', values);
  }
};
