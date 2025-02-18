"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const serviceAccount = {
    "type": "service_account",
    "project_id": "inkhub-admin-v2",
    "private_key_id": "9372da8c1d5a232b354d9b160a4483fe86d2fd6e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdnj7mDSZ8hmFo\nbMd0Lkq0c/R4NKeBcidF0QbavAEp9xM9ANXgK0OITDuos0hzSPkiyxQMFMI2ajk9\nNW/YZb5O/pK2jd6vSXswEiIHfMgHsbQsYHutBWPDFb3Hz/6cplCCgciVLR+bGemr\n9DroLkSzqx3fG7W5Z0EElGdv/SbWvWstXvGj8SAruhelc8Cq2MqIB1Hn9IO0A7cz\n48d4uZ00WfTljS+ikPZTUh4lnJ79ZOHCdjriFY64VJ50Ss883LgUH6sn1WkmgVbe\nJaMeq1dxuqkOdcilEA1QYvoBG2kxZmAEfNAtOfCEw+tz9xsWLg2yzGFTM2iyc0YL\neEW7vYA1AgMBAAECggEADJ2VYDluOqpQ0pheUHzCCvZ6+0IPpCs8XHiyCUDiAPdf\nKVNPSw17bsXXQpXy9xNAqZnChYMF1nAjG7SSuqnOFSmIGad6SuJhQ0Q4SAwjQIZn\nKuQgEgWr6fnsAjmyIdyn9gIoSVRewr3Mt7ApJNtLMWxBTFG99lR+3jx4mPyUprxL\nTDA0huvKJSpDGzNgLhHxKEK5lA3UjuNOdETDsGHJ6VpbKu+jZmm7jKq0DmO1wbAt\ng7gJ3xUFvuSoVMp3m6L8d2GH1mTMqF2YhbNd3L3InWHYmqg7zB95CUEETcdak+H3\nQBx07if6eHyfG7ylVEzZl4e+3lsun6loXBLZKSqKMwKBgQDTobk//ZM/lCG59MOD\nrf+y8FqJU70pSlkNTJT2YIHEXcfEV8ZhM04dlc4Mg7rIxc0qOdF68hp82aZew/H9\npqPQ4dH7UEOL9FD0mkj5QWA2u28PfU0iJ62z8CJPknK+bsDbAmBqNIC3PkQfYgaZ\nV/H0Ynr6+ePuyFXDRIWRt5ckXwKBgQC+qZzTV7p6qvNMalz14h88huqmbVk3raHp\nP0QU/3OLSDjN+vwCrS/EJmg9Z582ag8UusMsqpAG92FMelr+0qL/ViAkcBljtyq0\nJK6KenVymL8edZ3zzUmAEPflhOfZuO63+uC71hPMGmaJXL5Cl/0APAYHAXxT7a0p\n4c3rCq4D6wKBgQCc6BT/OrSHuP5gbvbelI02UDnwA2QGTxdDYvo2yUqtGpLYIfP1\ncSKDkOQaJzi/TthUbFXB/+pfksdlD4ZFd92RKzySReouw8+Z6yIbm7sIGWO4akBc\nCGsjM/FcacolItxeBJ8TXyXntoSvd/BIlQnRFYr0tX2nNmVPx2f4p9OppQKBgFZA\nxQGXHnWAALEBLSzPLvJi1qSTs1jM5AJw7IvTRKIt+gS1FmzfjExgU6fzyMMFF+14\nz/LU9nMwVoQSljfRcouwmrnhPJsvsdHtBkj/PUKqd0uASgSRSj71bjAXAAwu7U+t\n3x0aq7oZ92kM28WknIAOp2tj8KrHSx83V8CNBEwhAoGAeDn7fA4mQDBYqF2t7X3O\nhA/QB1cL/67TyPDtCvLzdMXyeVkzGBljonw7VIvLwASfTYBz29IZ/qv9AuNz0olK\nQ0GEPgCQ2nYOD6mRZu1UDHMAdzKzQmvStAj53EQJocu1cuF0nzdbNQftRQK0OvAA\nV98hOd5l/Bqsa4Nud0mSrGo=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-oz31j@inkhub-admin-v2.iam.gserviceaccount.com",
    "client_id": "105472760379739090825",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-oz31j%40inkhub-admin-v2.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const db = firebase_admin_1.default.firestore();
exports.db = db;
