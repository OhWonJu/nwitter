import React from "react";
import { useHistory } from "react-router-dom";

import { authService } from "../firebase";

const Profile = () => {
  // 각 routes에서 직접 rediect하는 방법. -> router를 hook으로서 사용
  const history = useHistory();
  const onSignOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  return (
    <>
      <button onClick={onSignOutClick}>Sign Out</button>
    </>
  );
};

export default Profile;
