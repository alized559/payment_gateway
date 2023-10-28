const validateCreditCardExpirationDate = (expirationDate) => {
  const pattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
  if (pattern.test(expirationDate)) {
    return true;
  }
  return false;
};

module.exports = { validateCreditCardExpirationDate };
