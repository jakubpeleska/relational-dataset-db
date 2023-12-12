import {getAPI} from '../APIUtils.js';
import resource from './resource';

const mapping = {
  'send_contribution' : resource.sendContribution
};

const contributeAPI = getAPI('contribute', mapping);

export default {
  mapping: mapping,

  sendContribution: (values: Object) => {
    return contributeAPI.post('send_contribution', values);
  }
};
