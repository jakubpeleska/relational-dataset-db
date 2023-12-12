import {getAPI} from '../APIUtils.js';
import resource from './resource';

const mapping = {
  'send_contact' : resource.sendContact
};

const contactAPI = getAPI('contact', mapping);

export default {
  mapping: mapping,

  sendContact: (values: Object) => {
    return contactAPI.post('send_contact', values);
  }
};
