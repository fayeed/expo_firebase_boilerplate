import { call, put, select } from "redux-saga/effects";
import AuthActions from "../redux/AuthRedux";
import MainActions from "../redux/MainRedux";
import { NetInfo, Alert, AsyncStorage } from "react-native";
import {
  Permissions,
  Location,
  ImagePicker,
  Google,
  Notifications
} from "expo";
import firebase from "firebase";
import Colors from "../constants/Colors";

/*--------------------------------- Variables ------------------------------------*/

// colors used for randomly assigning to the user
const colors = [Colors.red, Colors.blue, Colors.green, Colors.yellow];

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

export function* loginRequest(action) {
  const { email, password, navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const response = yield firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      const { user } = response;

      const collection = firestore.collection("users");
      const res = yield collection.doc(`${user.uid}`).get();

      yield put(AuthActions.loginResponse(false, res.data().d));
      yield put(MainActions.setEventResponse(res.data().d.event));
      yield put(AuthActions.setUserStatusResponse(res.data().d.online));
      yield put(
        AuthActions.setPushTokenResponse(
          res.data().d.pushToken ? res.data().d.pushToken : undefined
        )
      );

      if (res.data().d.firstName !== undefined) {
        navigate("Menu", { second: true });
        yield AsyncStorage.setItem("miingle:loggedIn", "true");
      } else {
        navigate("Profile", { first: true });
      }
    } catch (e) {
      try {
        yield firebase.auth().createUserWithEmailAndPassword(email, password);

        yield put(AuthActions.loginResponse(true, undefined));

        navigate("Profile", { first: true });
      } catch (e) {
        const message = e.message !== undefined ? e.message : e;

        yield put(AuthActions.loginError(message));

        Alert.alert(
          "Sign In failed",
          "Something went wrong during signing in in your account please check if it's your correct email and password",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }
    }
  } else {
    yield put(AuthActions.loginError("Internet connection Problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* setProfile(action) {
  const {
    firstName,
    lastName,
    jobTitle,
    cityName,
    facebookUrl,
    instagramUrl,
    linkedInUrl,
    websiteUrl,
    navigate,
    first
  } = action;

  const {
    auth: { pictureUrl, google, online }
  } = yield select();

  const connection = yield NetInfo.isConnected.fetch();
  const geocollection = geofirestore.collection("users");

  if (connection) {
    try {
      let { status } = yield Permissions.askAsync(Permissions.LOCATION);

      if (status === "granted") {
        const location = yield Location.getCurrentPositionAsync({});
        const user = yield firebase.auth().currentUser;

        let url = null;

        if (google) {
          url = pictureUrl;
        }

        const color = colors[getRandomInt(0, 3)];

        const obj = {
          coordinates: new firebase.firestore.GeoPoint(
            location.coords.latitude, // 19.1728201
            location.coords.longitude // 73.0266053
          ),
          fullName: `${firstName} ${lastName}`,
          email: user.email,
          firstName,
          lastName,
          jobTitle,
          cityName,
          facebookUrl,
          instagramUrl,
          linkedInUrl,
          websiteUrl,
          online: true,
          uid: user.uid,
          color
        };

        const res = yield geocollection.doc(user.uid).set(
          google
            ? {
                ...obj,
                photoURL: url
              }
            : obj,
          {
            merge: true
          }
        );

        if (first) {
          const miingleUser = yield firestore
            .collection("miingle")
            .doc(user.uid)
            .set({ list: [] });
        }

        const userResponse = yield user.updateProfile({
          photoURL: url,
          displayName: firstName
        });

        yield put(
          AuthActions.setProfileResponse({
            firstName,
            lastName,
            email: user.email,
            jobTitle,
            cityName,
            facebookUrl,
            instagramUrl,
            websiteUrl,
            linkedInUrl,
            photoURL: url,
            uid: user.uid,
            color
          })
        );

        yield AsyncStorage.setItem("miingle:loggedIn", "true");

        navigate();
      } else {
        yield put(AuthActions.setProfileError("Error while saving profile"));

        Alert.alert(
          "Something went wrong",
          "An error occured while saving you profile to the server. Please try again later",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }
    } catch (e) {
      yield put(AuthActions.setProfileError("Error while saving profile"));

      const message = e.message !== undefined ? e.message : e;

      Alert.alert(
        "Something went wrong",
        message,
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.setProfileError("Internet connection problem"));

    Alert.alert(
      "Internet connection Error",
      "There was something wrong with your internet connect please check if you are connected to the internet and try again",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* setProfilePicture(action) {
  const { camera } = action;
  const connection = yield NetInfo.isConnected.fetch();
  const cameraStatus = yield Permissions.askAsync(Permissions.CAMERA);
  const cameraRollStatus = yield Permissions.askAsync(Permissions.CAMERA_ROLL);
  const geocollection = geofirestore.collection("users");

  try {
    if (connection) {
      if (camera) {
        if (cameraStatus.status === "granted") {
          const res = yield ImagePicker.launchCameraAsync({
            quality: 1,
            allowsEditing: true
          });

          if (res.cancelled === false) {
            yield put(AuthActions.setProfilePictureResponse(res.uri));
            const user = yield firebase.auth().currentUser;
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(
              `profile_pictures/${user.uid}.jpg`
            );

            const blob = yield _urlToBlob(res.uri);
            const result = yield imageRef.put(blob);
            const url = yield result.ref.getDownloadURL();

            yield user.updateProfile({
              photoURL: url
            });

            yield geocollection.doc(user.uid).set(
              {
                photoURL: url
              },
              {
                merge: true
              }
            );
          } else {
            yield put(
              AuthActions.setProfilePictureError("ImagePicker cancelled")
            );
          }
        } else {
          const message = e.message !== undefined ? e.message : e;

          yield put(AuthActions.setProfilePictureError(message));

          Alert.alert(
            "Permission not granted",
            "This app needs camera permissions which you have not granted, you grant permission by going to the setting and manually setting it there.",
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        }
      } else {
        if (cameraRollStatus.status === "granted") {
          const res = yield ImagePicker.launchImageLibraryAsync({
            quality: 1,
            allowsEditing: true
          });

          if (res.cancelled === false) {
            yield put(AuthActions.setProfilePictureResponse(res.uri));
            const user = yield firebase.auth().currentUser;
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(
              `profile_pictures/${user.uid}.jpg`
            );

            const blob = yield _urlToBlob(res.uri);
            const result = yield imageRef.put(blob);
            const url = yield result.ref.getDownloadURL();

            yield user.updateProfile({
              photoURL: url
            });

            yield geocollection.doc(user.uid).set(
              {
                photoURL: url
              },
              {
                merge: true
              }
            );

            yield put(AuthActions.uploadedUrl(url));
          } else {
            yield put(
              AuthActions.setProfilePictureError("ImagePicker cancelled")
            );
          }
        } else {
          yield put(AuthActions.setProfilePictureError(message));

          Alert.alert(
            "Permission not granted",
            "This app needs camera permissions which you have not granted, you grant permission by going to the setting and manually setting it there.",
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        }
      }
    } else {
      yield put(AuthActions.setProfilePictureError("Internet Problem"));

      Alert.alert(
        "Internet connection Error",
        "There was something wrong with your internet connect please check if you are connected to the internet and try again",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } catch (e) {
    const message = e.message !== undefined ? e.message : e;

    yield put(AuthActions.setProfilePictureError(e.message));

    Alert.alert(
      "Something went wrong",
      "Something went wrong during uploading your file to the servers, please try again later",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }
}

export function* setUserStatus(action) {
  const { online } = action;
  const geocollection = geofirestore.collection("users");
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const user = yield firebase.auth().currentUser;

      const res = yield geocollection.doc(user.uid).update({
        online
      });

      yield put(AuthActions.setUserStatusResponse(online));
    } catch (e) {
      yield put(AuthActions.setUserStatusError("Error while upding status"));
    }
  } else {
    yield put(AuthActions.setUserStatusError("Internet problem"));
  }
}

export function* googleAuthRequest(action) {
  const { navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const result = yield Google.logInAsync({
        androidClientId:
          "994294135037-qlgrklm17jfe2ub1qs3bmr0cvrs9o2r4.apps.googleusercontent.com",
        iosClientId:
          "994294135037-h0eov2skdkeqdk2kj7lbfcr091i0irlr.apps.googleusercontent.com",
        behavior: "web"
      });

      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken
        );

        const res = yield firebase.auth().signInWithCredential(credential);

        const collection = firestore.collection("users");

        const resUser = yield collection.doc(`${res.uid}`).get();

        if (resUser.data() !== undefined) {
          yield put(
            AuthActions.googleAuthResponse(
              false,
              resUser.data().d,
              res.photoURL
            )
          );

          yield put(MainActions.setEventResponse(resUser.data().d.event));

          if (resUser.data().d.firstName !== undefined) {
            navigate("Menu", { second: true });
            yield AsyncStorage.setItem("miingle:loggedIn", "true");
          } else {
            navigate("Profile", { first: true });
          }
        } else {
          const name = res.displayName.split(" ");

          yield put(
            AuthActions.googleAuthResponse(
              true,
              {
                firstName: name[0],
                lastName: name[1],
                photoURL: res.photoURL
              },
              res.photoURL
            )
          );

          navigate("Profile", {
            first: true,
            firstName: name[0],
            lastName: name[1]
          });
        }
      } else {
        yield put(AuthActions.googleAuthError("Cancelled"));
      }
    } catch (e) {
      const message = e.message !== undefined ? e.message : e;

      yield put(AuthActions.googleAuthError(message));

      Alert.alert(
        "SignIn failed",
        "Something went wrong during signing in in your account please check if it's your correct email and password",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  } else {
    yield put(AuthActions.googleAuthError("Internet probelm"));

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

export function* setForgotPassword(action) {
  const { email, navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const res = yield firebase.auth().sendPasswordResetEmail(email);

      yield put(AuthActions.setForgotPasswordResponse());

      navigate();
    } catch (e) {
      yield put(AuthActions.setForgotPasswordError("something went wrong"));

      const message = e.message !== undefined ? e.message : e;

      Alert.alert(
        "Something went wrong",
        "Something went wrong while a sending email to your email.",
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

export function* setForgotPasswordComplete(action) {
  const { code, newPassword, navigate } = action;
  const connection = yield NetInfo.isConnected.fetch();

  if (connection) {
    try {
      const res = yield firebase.auth().confirmPasswordReset(code, newPassword);

      yield put(AuthActions.setForgotPasswordCompleteResponse());

      navigate();
    } catch (e) {
      yield put(
        AuthActions.setForgotPasswordCompleteError("something went wrong")
      );

      const message = e.message !== undefined ? e.message : e;

      Alert.alert(
        "Something went wrong",
        "Something went wrong while a reseting your new password",
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
