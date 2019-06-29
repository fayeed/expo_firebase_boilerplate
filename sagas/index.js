import { takeLatest, all, take, takeEvery } from "redux-saga/effects";
import API from "../services/Api";
import {
  logInWithEmail,
  logInWithFacebook,
  logInWithGoogle,
  logoutRequest,
  registerWithEmail,
  setPushToken,
  forgotPassword
} from "./AuthSagas";

/* ------------- Types ------------- */

import { AuthTypes } from "../redux/AuthRedux";

/* ------------- Sagas ------------- */

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(AuthTypes.LOG_IN_WITH_EMAIL_REQUEST, logInWithEmail),
    takeLatest(AuthTypes.LOG_IN_WITH_FACEBOOK_REQUEST, logInWithFacebook),
    takeLatest(AuthTypes.LOG_IN_WITH_GOOGLE_REQUEST, logInWithGoogle),
    takeLatest(AuthTypes.REGISTER_WITH_EMAIL_REQUEST, registerWithEmail),
    takeLatest(AuthTypes.LOGOUT_REQUEST, logoutRequest),
    takeLatest(AuthTypes.SET_PUSH_TOKEN_REQUEST, setPushToken),
    takeLatest(AuthTypes.FORGOT_PASSWORD_REQUEST, forgotPassword)
  ]);
}
