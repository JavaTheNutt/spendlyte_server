import * as functions from 'firebase-functions';
import financeApp from './finance';

export const finance = functions.https.onRequest(financeApp.bootstrap().app);
