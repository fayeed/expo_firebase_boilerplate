import ReduxPersist from "../config/ReduxPersist";
import { AsyncStorage } from "react-native";
import { persistStore } from "redux-persist";
import DebugConfig from "../config/DebugConfig";

const updateReducers = store => {
  const reducerVersion = ReduxPersist.reducerVersion;

  AsyncStorage.getItem("reducerVersion")
    .then(localVersion => {
      if (localVersion !== reducerVersion) {
        if (DebugConfig.useReactotron) {
          console.tron.display({
            name: "PURGE",
            value: {
              "Old Version:": localVersion,
              "New Version:": reducerVersion
            },
            preview: "Reducer Version Change Detected",
            important: true
          });
        }
        persistStore(store, null).purge();
        AsyncStorage.setItem("reducerVersion", reducerVersion);
      } else {
        persistStore(store, null);
      }
    })
    .catch(() => {
      persistStore(store, null);
      AsyncStorage.setItem("reducerVersion", reducerVersion);
    });
};

export default { updateReducers };
