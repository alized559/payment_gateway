import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const _post = (endpoint, data) => {
  return axios.post(REACT_APP_API_URL + endpoint, data);
};

class WebApiClient {
  acceptPayment(cardNumber, cvv, cardHolderName, expirationDate) {
    const data = new FormData();
    data.append('cardNumber', cardNumber);
    data.append('cvv', cvv);
    data.append('cardHolderName', cardHolderName);
    data.append('expirationDate', expirationDate);
    return _post('/api/payment/accept_payment', data);
  }
}

export default WebApiClient;
