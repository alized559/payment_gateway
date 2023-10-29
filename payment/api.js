const { router } = require('../index');
const { requireStringParam } = require('../decorators/require_param');
const { validateCreditCardExpirationDate } = require('../decorators/validators');
const db = require('../database/db');
const bcrypt = require('bcrypt');

const isCreditCardValid = (cardNumber) => {
	let nbOfDigits = cardNumber.length;
	let sum = 0;
	let isSecond = false;
	for (var i = nbOfDigits - 1; i >= 0; i--) {
		// Convert the character digit to an actual integer (e.g., '0' to 0).
		let d = cardNumber[i].charCodeAt() - '0'.charCodeAt();

		// If the current digit is at an even position, double it.
		if (isSecond == true) {
			d = d * 2;
		}
		// If doubling the digit results in a two-digit number, add the digits separately
		// (e.g., 12 should be treated as 1 + 2)
		sum += parseInt(d / 10, 10);
		sum += d % 10;
		// Toggle the isSecond flag to switch between even and odd positions.
		isSecond = !isSecond;
	}
	return (sum % 10 == 0);
};

router.post(
	'/accept_payment',
  requireStringParam('cardNumber', x => x.replace(/\s/g, '').length === 16),
  requireStringParam('cvv', x => x.length === 3),
  requireStringParam('cardHolderName'),
  requireStringParam('expirationDate', x => validateCreditCardExpirationDate(x)),
  async (request, response) => {

  const { cardNumber, cvv, cardHolderName, expirationDate } = request.body;
	try {
		const updatedCardNumber = cardNumber.replace(/\s/g, '');
		if (!isCreditCardValid(updatedCardNumber)) {
			return response.json({ success: false, message: 'Invalid credit card.' });
		}
		// Hash cardNumber and cvv using bcrypt.
		const hashedCardNumber = await bcrypt.hash(updatedCardNumber, 10);
		const hashedCVV = await bcrypt.hash(cvv, 10);
		await db.query('INSERT INTO credit_cards (hashed_card_number, hashed_cvv, card_holder_name, ' +
			'expiration_date) VALUES ($1, $2, $3, $4)', [hashedCardNumber, hashedCVV, cardHolderName, expirationDate]);
		return response.json({ success: true });
	} catch (error) {
		console.log(error);
		return response.status(500).send();
	}
});

module.exports = router;
