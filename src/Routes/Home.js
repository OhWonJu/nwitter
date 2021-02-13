import React, { useEffect, useState } from "react";

import { dbService } from "../firebase";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    setNweets([]); // 불러올 때 초기화 하고 load ... > prev가 꼬이지 않게 하기 위해서..?
    // nweets collection에 해당하는 것의 전체를 get -> QuerySnapshot 형태.
    const nweetsData = await dbService.collection("nweets").get();
    nweetsData.forEach(document => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      //                 [ current + prev ]
      setNweets(prev => [nweetObject, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
  }, []);
  
  const onSubmit = async event => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      nweet,
      createdAt: Date.now(),
    });
    setNweet("");
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNweet(value);
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
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map(nweet => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
