import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const _post = (endpoint, data) => {
  return axios.post(REACT_APP_API_URL + endpoint, data);
};

class WebApiClient {
}

export default WebApiClient;
