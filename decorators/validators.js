// This is a function that validates a credit card expiration date in the MM/YY format
const validateCreditCardExpirationDate = (expirationDate) => {
  const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (pattern.test(expirationDate)) {
    return true;
  }
  return false;
};

module.exports = { validateCreditCardExpirationDate };
