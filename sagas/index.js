import { takeLatest, all, take, takeEvery } from "redux-saga/effects";
import API from "../services/Api";
import DebugConfig from "../config/DebugConfig";

/* ------------- Types ------------- */

/* ------------- Sagas ------------- */

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([]);
}
