import * as functions from 'firebase-functions';
import financeApp from './finance';
import tagsApp from './tags';
import itemsApp from './items';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export const finance = functions.https.onRequest(financeApp.bootstrap().app);
export const tags = functions.https.onRequest(tagsApp.bootstrap().app);
export const items = functions.https.onRequest(itemsApp.bootstrap().app);

