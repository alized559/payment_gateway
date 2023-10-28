import React, { useReducer, useCallback } from 'react';

const reducer = (state, action) => {
  switch (action) {
    case 'card-number-changed': return { ...state, cardNumber: action.cardNumber };
    case 'cvv-changed': return { ...state, cvv: action.cardNumber };
    case 'card-holder-name-changed': return { ...state, cardHolderName: action.cardNumber };
    case 'expiration-date-changed': return { ...state, expirationDate: action.cardNumber };
    case 'submit-start': return { ...state, loading: true };
  };
};

const PaymentPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    errorMessage: null,
    cardNumber: '',
    cvv: '',
    cardHolderName: '',
    expirationDate: ''
  });
  const {
    loading,
    errorMessage,
    cardNumber,
    cvv,
    cardHolderName,
    expirationDate
  } = state;

  const onChangeCardNumber = useCallback((e) => {
    dispatch({ type: 'card-number-changed', cardNumber: e.target.value });
  }, []);

  const onChangeCVV = useCallback((e) => {
    dispatch({ type: 'cvv-changed', cvv: e.target.value });
  }, []);

  const onChangeCardHolderName = useCallback((e) => {
    dispatch({ type: 'card-holder-name-changed', cardHolderName: e.target.value });
  }, []);

  const onChangeExpirationDate = useCallback((e) => {
    dispatch({ type: 'expiration-date-changed', expirationDate: e.target.value });
  }, []);

  const validate = useCallback(() => {
    if (!cardNumber || !cvv || !cardHolderName || !expirationDate) {
      dispatch({ type: 'submit-fail', message: 'Please enter all fields.' });
      return false;
    }
    if (cardNumber.length !== 16) {
      dispatch({ type: 'submit-fail', message: 'Invalid card number.' });
      return false;
    }
    if (cvv.length !== 3) {
      dispatch({ type: 'submit-fail', message: 'Invalid cvv.' });
      return false;
    }
    const pattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!expirationDate.test(pattern)) {
      dispatch({ type: 'submit-fail', message: 'Expiration date must be in this format: MM/YYYY.' });
      return false;
    }
    return true;
  }, [cardNumber, cvv, cardHolderName, expirationDate]);

  const onSubmit = useCallback(() => {
    if (validate()) {
      dispatch({ type: 'submit-start' });
      getApiClient().acceptPayment(cardNumber, cvv, cardHolderName, expirationDate)
        .then(response => {
          if (response.data.success) {
            dispatch({ type: 'submit-success' });
          } else {
            dispatch({ type: 'submit-fail', message: response.data.message });
          }
        })
        .catch(makeStandardApiErrorHandler(error => dispatch({ type: 'submit-fail', message: error })));
    }
  }, [cardNumber, cvv, cardHolderName, expirationDate]);

  return (
    <div>
      <h1>Payment Gateway</h1>
      <div>
        <label>Card Number:</label>
        <input type='text' value={cardNumber} onChange={onChangeCardNumber} />
      </div>
      <div>
        <label>CVV:</label>
        <input type='text' value={cvv} onChange={onChangeCVV} />
      </div>
      <div>
        <label>Card Holder Name:</label>
        <input type='text' value={cardHolderName} onChange={onChangeCardHolderName} />
      </div>
      <div>
        <label>Expiration Date:</label>
        <input type='text' value={expirationDate} onChange={onChangeExpirationDate} />
      </div>
      <button onClick={onSubmit}>Submit Payment</button>
    </div>
  );
};

export default PaymentPage;
