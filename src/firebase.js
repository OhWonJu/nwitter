import firebase from "firebase/app";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyADU2QKL0NBDKZRZZrdnryWBZygQr4rMbI",
//   authDomain: "nwitter-e50a1.firebaseapp.com",
//   projectId: "nwitter-e50a1",
//   storageBucket: "nwitter-e50a1.appspot.com",
//   messagingSenderId: "1002505245092",
//   appId: "1:1002505245092:web:b89bbe196a8d4c53bf3131",
// };
const firebaseConfig = {
  // 완전한 보안은 아님.. 환경변수를 github에서나 가려주는거..
  // firebase client 상에서는 js로 변환되면서 원래 값이 노출됨.
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
