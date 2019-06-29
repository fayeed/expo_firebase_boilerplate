import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  logInWithEmailRequest: ["email", "password", "actions", "navigate"],
  logInWithEmailResponse: ["user"],
  logInWithEmailError: ["error"],
  logInWithGoogleRequest: ["navigate"],
  logInWithGoogleResponse: ["user"],
  logInWithGoogleError: ["error"],
  logInWithFacebookRequest: ["navigate"],
  logInWithFacebookResponse: ["user"],
  logInWithFacebookError: ["error"],
  registerWithEmailRequest: ["email", "password", "actions", "navigate"],
  registerWithEmailResponse: ["user"],
  registerWithEmailError: ["error"],
  logoutRequest: null,
  logoutResponse: null,
  logoutError: ["error"],
  onBoardedShown: null,
  forgotPasswordRequest: ["email", "actions", "navigate"],
  forgotPasswordResponse: null,
  forgotPasswordError: ["error"],
  purge: null,
  setPushTokenRequest: null,
  setPushTokenResponse: ["token"],
  setPushTokenError: ["error"]
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isOnBoarded: false,
  loggedIn: false,
  user: null,
  loading: false,
  error: null
});

/* ------------- Reducers ------------- */

export const logInWithEmailRequest = state => state.merge({ loading: true });

export const logInWithEmailResponse = (state, { user }) =>
  state.merge({ loading: false, error: null, user, loggedIn: true });

export const logInWithEmailError = (state, { error }) =>
  state.merge({ loading: false, error });

export const logInWithFacebookRequest = state => state.merge({ loading: true });

export const logInWithFacebookResponse = (state, { user }) =>
  state.merge({ loading: false, error: null, user });

export const logInWithFacebookError = (state, { error }) =>
  state.merge({ loading: false, error });

export const logInWithGoogleRequest = state => state.merge({ loading: true });

export const logInWithGoogleResponse = (state, { user }) =>
  state.merge({ loading: false, error: null, user });

export const logInWithGoogleError = (state, { error }) =>
  state.merge({ loading: false, error });

export const registerWithEmailRequest = state => state.merge({ loading: true });

export const registerWithEmailResponse = (state, { user }) =>
  state.merge({ loading: false, error: null, user, loggedIn: true });

export const registerWithEmailError = (state, { error }) =>
  state.merge({ loading: false, error });

export const logoutResponse = state =>
  state.merge({ error: null, user: null, loggedIn: false });

export const logoutError = (state, { error }) =>
  state.merge({ error, loading: false });

export const onBoardedShown = state => state.merge({ isOnBoarded: true });

export const forgotPasswordRequest = state => state.merge({ loading: true });

export const forgotPasswordResponse = state =>
  state.merge({ loading: true, error: null });

export const forgotPasswordError = (state, { error }) =>
  state.merge({ loading: false, error });

export const purge = state =>
  state.merge({
    isOnBoarded: false,
    loggedIn: false,
    user: null,
    loading: false,
    error: null
  });

export const setPushTokenResponse = (state, { token }) =>
  state.merge({ user: { ...state.user, pushToken: token } });

export const setPushTokenError = (state, { error }) => state.merge({ error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOG_IN_WITH_EMAIL_REQUEST]: logInWithEmailRequest,
  [Types.LOG_IN_WITH_EMAIL_RESPONSE]: logInWithEmailResponse,
  [Types.LOG_IN_WITH_EMAIL_ERROR]: logInWithEmailError,
  [Types.LOG_IN_WITH_FACEBOOK_REQUEST]: logInWithFacebookRequest,
  [Types.LOG_IN_WITH_FACEBOOK_RESPONSE]: logInWithFacebookResponse,
  [Types.LOG_IN_WITH_FACEBOOK_ERROR]: logInWithFacebookError,
  [Types.LOG_IN_WITH_GOOGLE_REQUEST]: logInWithGoogleRequest,
  [Types.LOG_IN_WITH_GOOGLE_RESPONSE]: logInWithGoogleResponse,
  [Types.LOG_IN_WITH_GOOGLE_ERROR]: logInWithGoogleError,
  [Types.LOGOUT_RESPONSE]: logoutResponse,
  [Types.LOGOUT_ERROR]: logoutError,
  [Types.REGISTER_WITH_EMAIL_REQUEST]: registerWithEmailRequest,
  [Types.REGISTER_WITH_EMAIL_RESPONSE]: registerWithEmailResponse,
  [Types.REGISTER_WITH_EMAIL_ERROR]: registerWithEmailError,
  [Types.ON_BOARDED_SHOWN]: onBoardedShown,
  [Types.FORGOT_PASSWORD_REQUEST]: forgotPasswordRequest,
  [Types.FORGOT_PASSWORD_RESPONSE]: forgotPasswordResponse,
  [Types.FORGOT_PASSWORD_ERROR]: forgotPasswordError,
  [Types.PURGE]: purge,
  [Types.SET_PUSH_TOKEN_RESPONSE]: setPushTokenResponse,
  [Types.SET_PUSH_TOKEN_ERROR]: setPushTokenError
});
