import React, { useEffect, useState } from "react";

import { authService } from "../firebase"
import AppRouter from "./Router";

function App() {
  // firebase가 초기화 하기를 기다리는 state
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // 초기화는 useEffect를 이용
  useEffect(() => {
    // user 변화에 대한 listener
    authService.onAuthStateChanged((user) => {
      // 기본적으로 event listener 인셈 (evet=user)
      if(user) { // user Logged In
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    })
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing ..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
