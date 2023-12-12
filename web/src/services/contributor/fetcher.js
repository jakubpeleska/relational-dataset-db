import {getAPI} from '../APIUtils.js';
import resource from './resource';

const mapping = {
  'get_contributors' : resource.getContributors
};

const contributorAPI = getAPI('contributor', mapping);

export default {
  mapping: mapping,

  getContributors: () => {
    return contributorAPI.get('get_contributors');
  }
};
