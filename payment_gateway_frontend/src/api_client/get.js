import WebApiClient from './web';

let _apiClient = null;
export function getApiClient() {
  if (_apiClient === null) {
    _apiClient = new WebApiClient();
  }
  return _apiClient;
}

// This function MUST guarantee that it will call displayErrorFn exactly once.
export function handleApiError(error, displayErrorFn, kickUserOut = null) {
  if (error.response) {
    if (error.response.status === 400) {
      displayErrorFn('Bad Request (400): ' + error.response.data.message);
    } else if (error.response.status === 401) {
      displayErrorFn('Error (401): ' + error.response.data.message);
    } else if (error.response.status === 403) {
      displayErrorFn('Forbidden (403): ' + error.response.data.message);
    } else if (error.response.status === 404) {
      displayErrorFn('Not Found (404)');
    } else if (error.response.status === 405) {
      displayErrorFn('Method Not Allowed (405): This endpoint does not exist.');
    } else if (error.response.status === 413) {
      displayErrorFn('File Too Big (413): The upload limit is around 16MB.');
    } else if (error.response.status === 429) {
      // We hit the rate limits.
      displayErrorFn(
        'Too Many Requests (429): Please wait and try again, this operation is being done too frequently.');
    } else {
      displayErrorFn('Something went wrong on our end.');
    }
  } else if (error.request) {
    displayErrorFn('Please check your connection and try again.');
  } else {
    displayErrorFn('Error: ' + error.message);
  }
}

export function makeStandardApiErrorHandler(displayErrorFn, kickUserOut = null) {
  return (error) => {
    handleApiError(error, displayErrorFn, kickUserOut);
  };
}
