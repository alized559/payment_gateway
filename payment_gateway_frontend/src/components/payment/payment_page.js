import React, { useReducer, useCallback } from 'react';
import { Form } from 'semantic-ui-react';
import Cards from 'react-credit-cards-2';
import styled from 'styled-components';
import { getApiClient, makeStandardApiErrorHandler } from '../../api_client/get';
import ThankYouPopup from './thank_you_popup';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'card-number-changed': return { ...state, cardNumber: action.cardNumber, errorMessage: null };
    case 'cvv-changed': return { ...state, cvv: action.cvv, errorMessage: null };
    case 'card-holder-name-changed': return { ...state, cardHolderName: action.cardHolderName, errorMessage: null };
    case 'expiration-date-changed': return { ...state, expirationDate: action.expirationDate, errorMessage: null };
    case 'focus-changed': return { ...state, cardFocus: action.cardFocus, errorMessage: null };
    case 'submit-start': return { ...state, loading: true, errorMessage: null };
    case 'submit-fail': return { ...state, loading: false, errorMessage: action.message };
    case 'submit-success': return { ...state, loading: false, submitSuccess: true };
    case 'close-popup': return { ...state, submitSuccess: false };
    default: throw new Error('Unhandled action type: ' + action.type);
  };
};

const PaymentPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    errorMessage: null,
    cardNumber: '',
    cvv: '',
    cardHolderName: '',
    expirationDate: '',
    cardFocus: '',
    submitSuccess: false
  });
  const {
    loading,
    errorMessage,
    cardNumber,
    cvv,
    cardHolderName,
    expirationDate,
    cardFocus,
    submitSuccess
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

  const onChangeFocus = useCallback((e) => {
    dispatch({ type: 'focus-changed', cardFocus: e.target.name });
  }, []);

  const validate = useCallback(() => {
    if (!cardNumber || !cvv || !cardHolderName || !expirationDate) {
      dispatch({ type: 'submit-fail', message: 'Please enter all fields.' });
      return false;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ''))) {
      dispatch({ type: 'submit-fail', message: 'Invalid card number.' });
      return false;
    }
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      dispatch({ type: 'submit-fail', message: 'Invalid cvv.' });
      return false;
    }
    const expirationDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expirationDatePattern.test(expirationDate)) {
      dispatch({ type: 'submit-fail', message: 'Expiration date must be in this format: MM/YY.' });
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
  }, [cardNumber, cvv, cardHolderName, expirationDate, validate]);

  const closePopup = useCallback(() => {
    dispatch({ type: 'close-popup' });
  }, []);

  return (
    <>
      <CardContainer clasName="rccs__card rccs__card--unknown">
        <Cards number={cardNumber} name={cardHolderName} expiry={expirationDate} cvc={cvv} focused={cardFocus} />
      </CardContainer>
      <PaymentForm>
        <Form {...{ error: !!errorMessage }} {...{ loading: loading }} unstackable onSubmit={onSubmit}
          id='payment-form'>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Form.Field>
            <label>Card Number:</label>
            <Form.Input type='text' name='number' placeholder='**** **** **** ****' value={cardNumber}
              onChange={onChangeCardNumber} onFocus={onChangeFocus} />
          </Form.Field>
          <Form.Field>
            <label>Card Holder Name:</label>
            <Form.Input type='text' name='name' placeholder='John Doe' value={cardHolderName}
              onChange={onChangeCardHolderName} onFocus={onChangeFocus} />
          </Form.Field>
          <FlexWrapper>
            <Form.Field>
              <label>Expiration Date:</label>
              <Form.Input type='text' name='expiry' placeholder='mm/yy' value={expirationDate}
                onChange={onChangeExpirationDate} onFocus={onChangeFocus} />
            </Form.Field>
            <Form.Field>
              <label>CVV:</label>
              <Form.Input type='text' name='cvc' placeholder='123' value={cvv} onChange={onChangeCVV}
                onFocus={onChangeFocus} />
            </Form.Field>
          </FlexWrapper>
          <ButtonContainer>
            <Form.Button type='submit' form='payment-form' content='Submit Payment' color='blue' />
          </ButtonContainer>
        </Form>
      </PaymentForm>
      <ThankYouPopup showPopup={submitSuccess} closePopup={closePopup} />
    </>
  );
};

const CardContainer = styled.div`
  position: relative;
  width: 290px;
  height: 182px;
  margin-top: 10;
  margin-bottom: 10;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transition: all 0.4s linear;
  transition: all 0.4s linear;
  margin: 30px auto 0;
`;

const PaymentForm = styled.div`
  margin: 30px auto 0;
  max-width: 400px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default PaymentPage;
