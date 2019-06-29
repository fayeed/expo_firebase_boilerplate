import immutablePersistenceTransform from "../services/ImmutablePersistenceTransform";
import { AsyncStorage } from "react-native";

const REDUX_PERSIST = {
  active: true,
  reducerVersion: "1.02",
  storeConfig: {
    key: "primary",
    storage: AsyncStorage,
    blacklist: [],
    whitelist: ["auth"],
    transforms: [immutablePersistenceTransform]
  }
};

export default REDUX_PERSIST;
