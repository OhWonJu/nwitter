import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { authService, dbService } from "../firebase";

const Profile = ({ userObj }) => {
  // 각 routes에서 직접 rediect하는 방법. -> router를 hook으로써 사용
  const history = useHistory();
  const onSignOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    // 해당 user의 nweet에 해당하는 것만 가져옴  
    // creatorId가 user.uid와 같은거만.
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get();

    console.log(nweets.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <button onClick={onSignOutClick}>Sign Out</button>
    </>
  );
};

export default Profile;
