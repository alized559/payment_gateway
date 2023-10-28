const { router } = require('../index');
const { requireStringParam } = require('../decorators/require_param');
const { validateCreditCardExpirationDate } = require('../decorators/validators');
const db = require('../db');

router.post(
	'/accept_payment',
  requireStringParam('cardNumber', x => x.length === 16),
  requireStringParam('cvv', x => x.length === 3),
  requireStringParam('cardHolderName'),
  requireStringParam('expirationDate', x => validateCreditCardExpirationDate(x)),
  async (request, response) => {

  const { cardNumber, cvv, cardHolderName, expirationDate } = request.body;
	try {
		const hashedCardNumber = await bcrypt.hash(cardNumber, 10);
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
