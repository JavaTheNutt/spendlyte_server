import * as admin from 'firebase-admin';

export const validateFirebaseIdToken = async (req, res, next): Promise<any> => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
		!req.cookies.__session) {
		console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
			'Make sure you authorize your request by providing the following HTTP header:',
			'Authorization: Bearer <Firebase ID Token>',
			'or by passing a "__session" cookie.');
		res.status(403).send('Unauthorized');
		return null;
	}
	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		console.log('Found "Authorization" header');
		// Read the ID Token from the Authorization header.
		idToken = req.headers.authorization.split('Bearer ')[1];
	} else {
		console.log('Found "__session" cookie');
		// Read the ID Token from cookie.
		idToken = req.cookies.__session;
	}
	admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
		console.log('ID Token correctly decoded', decodedIdToken);
		req.user = decodedIdToken;
		return next();
	}).catch(error => {
		console.error('Error while verifying Firebase ID token:', error);
		return res.status(403).send('Unauthorized');
	});
};
