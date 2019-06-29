import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  logInWithEmailRequest: ["ermail", "password"],
  logInWithEmailResponse: ["user"],
  logInWithEmailError: ["error"]
});

export const MainTypes = Types;
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

export const logInRequest = state => state.merge({ loading: true });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOG_IN_WITH_EMAIL_REQUEST]: logInRequest
});
