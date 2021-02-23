import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { authService, dbService } from "../firebase";

const Profile = ({ userObj, refreshUser }) => {
  // 각 routes에서 직접 rediect하는 방법. -> router를 hook으로써 사용
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onSignOutClick = () => {
    authService.signOut();
    history.push("/");
    refreshUser();
  };

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
    }
    refreshUser();
  };

  const getMyNweets = async () => {
    // 해당 user의 nweet에 해당하는 것만 가져옴
    // creatorId가 user.uid와 같은거만.
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get();
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          placeholder="Display Name"
          onChange={onChange}
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onSignOutClick}>
        Sign Out
      </span>
    </div>
  );
};

export default Profile;
