import React, { useEffect, useState } from "react";

import Nweet from "../Components/Nweet";
import { dbService } from "../firebase";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();

  // #3.3 이 방식은 오래된 데이터를 다시 불러온다.. 즉 쌓여서 새로고침이 필요함..
  // const getNweets = async () => {
  //   setNweets([]); // 불러올 때 초기화 하고 load ... > prev가 꼬이지 않게 하기 위해서..?
  //   // nweets collection에 해당하는 것의 전체를 get -> QuerySnapshot 형태.
  //   const nweetsData = await dbService.collection("nweets").get();
  //   nweetsData.forEach(document => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     //                 [ current + prev ]
  //     setNweets(prev => [nweetObject, ...prev]);
  //   });
  // };

  useEffect(() => {
    //getNweets();
    // onSnapshot 내에서 nweets를 realtime으로 받아오자.
    dbService
      .collection("nweets")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        const nweetsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // 정렬 진행하고 set 하자
        setNweets(nweetsArray);
        // 이 방식이 re-render를 덜 하기 때문에
        // nweets에 중복으로 쌓이지 않는듯...
      });
    // clean up func 똑같은 함수를 클린업에 넘겨야지, setNweets([array])
    return () => {
      setNweets([]);
    };
  }, []);

  const onSubmit = async event => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      creatorId: userObj.uid,
      createdAt: Date.now(),
      text: nweet,
    });
    setNweet("");
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    // fileReader API를 이용한 Reader
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      // event listener read가 끝나면 onloadend에 event를 전달...
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); // URL형식으로 전달??
  };
  const onClearAttachment = () => {
    setAttachment(null);   // state에서 제거
    document.getElementById("Attachment").value = null; // input에서 제거
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What'on your mind?"
          maxLength={120}
        />
        <input id="Attachment" type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map(nweet => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
