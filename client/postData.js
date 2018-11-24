import axios from 'axios';

export default (url, data, _interface) => {
  return axios.post(url, data, {
    headers: {
      interface: _interface
    }
  });
};
