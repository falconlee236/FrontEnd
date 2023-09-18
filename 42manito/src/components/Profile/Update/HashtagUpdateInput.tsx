import { Input } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/RTK/store";
import { addHashtag } from "@/RTK/Slices/ProfileUpdate";
import { HashtagResponseDto } from "@/Types/Hashtags/HashtagResponse.dto";
import { usePostHashtagMutation } from "@/RTK/Apis/User";
import { Button } from "@/common";

interface props {
  hashtags: HashtagResponseDto[];
}

export default function HashtagUpdateInput({ hashtags }: props) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = React.useState("");
  const [
    hashtagPost,
    { data: hashtagData, isLoading: hashtagLoading, isError: hashtagError },
  ] = usePostHashtagMutation();

  const hashtagPostHandler = () => {
    if (inputValue.length === 0) {
      return;
    }
    const doesHashtagExist = hashtags.some(
      (hashtag) => hashtag.name === inputValue,
    );
    if (hashtags.length >= 5) {
      alert("관심 분야는 5개까지만 추가 가능합니다.");
      setInputValue("");
      return;
    }
    // 정규 표현식으로 영어(a-z, A-Z), 한글(가-힣), 숫자(0-9)를 제외한 모든 문자 찾기
    const regex = /[a-zA-Z0-9가-힣]{2,12}/g;
    const regex_invalid = /[^a-zA-Z0-9가-힣]/g;
    const invalidTest = regex_invalid.test(inputValue);
    const regexResult = inputValue.match(regex);
    if (regexResult && !invalidTest) {
      // 입력된 해시태그가 위의 조건들을 만족하면 새로운 해시태그 추가
      if (doesHashtagExist) {
        alert("이미 추가된 해시태그입니다.");
        setInputValue("");
        return;
      }
      hashtagPost({ name: inputValue });
    } else {
      alert("2글자 이상의 12자 이하의 한글, 영어, 숫자만 추가 가능합니다.");
    }
    setInputValue("");
  };

  useEffect(() => {
    if (hashtagData) {
      dispatch(addHashtag(hashtagData));
      setInputValue("");
    }
  }, [dispatch, hashtagData, hashtagLoading]);

  return (
    <div className="profile-update-hashtag-input-wrapper">
      <Input
        placeholder={"관심분야를 입력해주세요."}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setInputValue(e.currentTarget.value);
            hashtagPostHandler();
          }
        }}
        value={inputValue}
        enterKeyHint={"send"}
        className="md:w-[20em] w-[60%]"
      />
      <Button
        onClick={() => hashtagPostHandler()}
        className="profile-update-hashtag-input-btn"
        type="button"
      >
        추가
      </Button>
    </div>
  );
}
