import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import { dbService, storageService } from "../firebase";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async event => {
    if (nweet === "") {
      return;
    }
    event.preventDefault();
    // photo가 있는 경우 사진을 먼저 upload 후 그 URL을 nweet에 추가
    // 기본적으로 collection과 비슷하게 작동.
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/file/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      creatorId: userObj.uid,
      createdAt: Date.now(),
      text: nweet,
      attachmentURL,
    };
    await dbService.collection("nweets").add(nweetObj);
    // state 초기화?
    setNweet("");
    setAttachment("");
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
    setAttachment(""); // state에서 제거
    document.getElementById("Attachment").value = ""; // input에서 제거
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What'on your mind?"
          maxLength={120}
          className="factoryInput__input"
        />
        <input type="submit" value="&rarr;" className="factoryInput_arrow" />
      </div>
      <label htmlFor="attach_file" className="factoryInput__label">
        <span>Add Photo</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach_file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0, height: "20px", }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} style={{ backgroundImage: attachment, }} />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
