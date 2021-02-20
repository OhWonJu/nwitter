import React, { useEffect, useState } from "react";

import { authService } from "../firebase";
import AppRouter from "./Router";

function App() {
  // firebase가 초기화 하기를 기다리는 state
  const [init, setInit] = useState(false); // 어떤 상황에서든 onAuthStateChanged 이 실행되게 하기 위해서.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // 초기화는 useEffect를 이용
  useEffect(() => {
    // user 변화에 대한 listener
    authService.onAuthStateChanged(user => {
      // 기본적으로 event listener 인셈 (evet=user)
      if (user) {
        // user Logged In
        setIsLoggedIn(true);
        //setUserObj(user)
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  // user 변경점에 대해 refresh
  const refreshUser = () => {
    const user = authService.currentUser;
    //setUserObj(Object.assign({}, user));
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} refreshUser={refreshUser} />
      ) : (
        "Initializing ..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
