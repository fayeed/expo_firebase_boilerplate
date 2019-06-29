import { call, put, select } from "redux-saga/effects";
import AuthActions from "../redux/AuthRedux";
// import MainActions from "../redux/MainRedux";
import { NetInfo, Alert, AsyncStorage } from "react-native";
import { Permissions, Google, Notifications, Facebook } from "expo";
import firebase from "firebase";
import "firebase/firestore";
import Colors from "../constants/Colors";

/*--------------------------------- Variables ------------------------------------*/

// colors used for randomly assigning to the user
// const colors = [Colors.red, Colors.blue, Colors.green, Colors.yellow];

/* -------------------------------- helper functions --------------------------------- */

// converts the file URL to a binary object
function _urlToBlob(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}

// generates a random integer between lower and upper bound
// min - lower bound number
// max - upper bound number
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* -------------------------------- generator saga functions --------------------------*/

export function* logInWithEmail(action) {
  const { email, password, actions, navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const response = yield firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      const { user } = response;

      const collection = firestore.collection("users");
      const res = yield collection.doc(`${user.uid}`).get();

      yield put(AuthActions.logInWithEmailResponse(res.data().d));

      actions();

      navigate("Main", { second: true });

      yield AsyncStorage.setItem("miingle:loggedIn", "true");
    } catch (e) {
      Alert.alert(
        "Sign In failed",
        "Something went wrong during signing in in your account please check if it's your correct email and password",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.logInWithEmailError("Internet connection Problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* logInWithGoogle(action) {
  const { navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const result = yield Google.logInAsync({
        androidClientId:
          "994294135037-qlgrklm17jfe2ub1qs3bmr0cvrs9o2r4.apps.googleusercontent.com",
        iosClientId:
          "994294135037-h0eov2skdkeqdk2kj7lbfcr091i0irlr.apps.googleusercontent.com",
        behavior: "system"
      });

      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken
        );

        const res = yield firebase.auth().signInWithCredential(credential);

        const collection = firestore.collection("users");

        const resUser = yield collection.doc(`${res.uid}`).get();

        if (resUser.data() !== undefined) {
          yield put(AuthActions.logInWithGoogle(resUser.data().d));

          navigate("Main");

          yield AsyncStorage.setItem("miingle:loggedIn", "true");
        } else {
          // get teh valur from res like name/photoURL etc
          // and create a entry in user collection in firebase
          let user = {};

          yield put(AuthActions.logInWithGoogle(user));

          navigate("Main");

          yield AsyncStorage.setItem("miingle:loggedIn", "true");
        }
      } else {
        yield put(AuthActions.logInWithGoogleError("Cancelled"));
      }
    } catch (e) {
      const message = e.message !== undefined ? e.message : e;

      yield put(AuthActions.logInWithGoogleError(message));

      Alert.alert(
        "SignIn failed",
        "Something went wrong during signing in in your account please check if it's your correct email and password",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.logInWithGoogleError("Internet probelm"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* logInWithFacebook(action) {
  const { navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const result = yield Facebook.logInWithReadPermissionsAsync(
        "401229977326813",
        {
          permissions: ["public_profile", "email"]
        }
      );

      if (result.type === "success") {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          result.token
        );

        const res = yield firebase.auth().signInWithCredential(credential);

        const response = yield fetch(
          `https://graph.facebook.com/me?access_token=${auth.token}`
        );

        const data = yield response.json();

        const collection = firestore.collection("users");

        const resUser = yield collection.doc(`${res.uid}`).get();

        if (resUser.data() !== undefined) {
          yield put(AuthActions.logInWithFacebookResponse(resUser.data().d));

          navigate("Main");

          yield AsyncStorage.setItem("miingle:loggedIn", "true");
        } else {
          // same as google login

          let user = {};

          yield put(AuthActions.logInWithFacebookResponse(user));

          navigate("Main");

          yield AsyncStorage.setItem("miingle:loggedIn", "true");
        }
      } else {
        yield put(AuthActions.logInWithFacebookError("Cancelled"));
      }
    } catch (e) {
      const message = e.message !== undefined ? e.message : e;

      yield put(AuthActions.logInWithFacebookError(message));

      Alert.alert(
        "SignIn failed",
        "Something went wrong during signing in in your account please check if it's your correct email and password",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.logInWithFacebookError("Internet probelm"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* registerWithEmail(action) {
  const { email, password, actions, navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();
  const firestore = firebase.firestore();

  if (connection) {
    try {
      const response = yield firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const { user } = response;

      const collection = firestore.collection("users");

      const res = yield collection.doc(`${user.uid}`).get();

      console.log(res.data());

      if (res.data() === undefined) {
        // save user

        yield put(AuthActions.registerWithEmailResponse({}));

        actions();

        navigate("Main", { second: true });
      }

      yield AsyncStorage.setItem("miingle:loggedIn", "true");
    } catch (e) {
      console.log(e);
      actions();
      Alert.alert(
        "Sign In failed",
        "Something went wrong during signing in in your account please check if it's your correct email and password",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(
      AuthActions.registerWithEmailError("Internet connection Problem")
    );

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* logoutRequest(action) {
  const { navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      yield firebase.auth().signOut();

      yield put(AuthActions.logoutResponse());

      yield AsyncStorage.removeItem("miingle:loggedIn");

      navigate();

      yield put(MainActions.purge());

      yield put(AuthActions.purge());
    } catch ({ message }) {
      yield put(AuthActions.logoutError(message));
    }
  } else {
    yield put(AuthActions.logoutError("Internet problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* getUserProfile(action) {
  const geocollection = geofirestore.collection("users");
  const connection = yield NetInfo.isConnected.fetch();
  if (connection) {
    try {
      const user = yield firebase.auth().currentUser;

      const res = yield geocollection.doc(user.uid).get();

      yield put(AuthActions.getUserProfileResponse(res.data()));

      yield put(MainActions.setEventResponse(res.data().event));
    } catch (e) {
      yield put(AuthActions.getUserProfileError(e.message));
    }
  } else {
    yield put(AuthActions.getUserProfileError("Internet Problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* setPushToken(action) {
  const connection = yield NetInfo.isConnected.fetch();
  if (connection) {
    try {
      const user = yield firebase.auth().currentUser;
      const geocollection = geofirestore.collection("users");
      const collection = firestore.collection("token");
      const { status } = yield Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status === "granted") {
        const pushToken = yield Notifications.getExpoPushTokenAsync();

        const res = yield geocollection.doc(user.uid).set(
          {
            pushToken
          },
          {
            merge: true
          }
        );

        const tokenRes = yield collection.doc(user.uid).set({
          pushToken
        });

        yield put(AuthActions.setPushTokenResponse(pushToken));
      } else {
        yield put(AuthActions.setPushTokenError("Permission not granted"));

        Alert.alert(
          "Permission not granted",
          "This app requires Notifications permission on your device to function properly, you can set the permission manually by going to settings > Apps > miingle",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }
    } catch (e) {
      yield put(AuthActions.setPushTokenError("Something went wrong"));

      const message = e.message !== undefined ? e.message : e;

      Alert.alert(
        "Something went wrong",
        "Something went wrong while setting up push notificatiosn on your device please try again",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.setPushTokenError("Internet Problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* forgotPassword(action) {
  const { email, actions, navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const res = yield firebase.auth().sendPasswordResetEmail(email);

      yield put(AuthActions.forgotPasswordResponse());

      actions();

      navigate();
    } catch (e) {
      yield put(AuthActions.forgotPasswordError("something went wrong"));

      const message = e.message !== undefined ? e.message : e;

      Alert.alert(
        "Something went wrong",
        "Something went wrong while a sending email to your email.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.forgotPasswordError("Internet Problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}
