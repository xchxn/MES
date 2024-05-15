'use client'
import styles from "./page.module.css";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export default function Home() {
  const [userId,setUserID] = useState("");
    // 컴포넌트가 마운트될 때 한 번 쿠키에서 userId를 읽어오고,
  // 쿠키의 userId 값이 변경될 때마다 반응합니다.
  useEffect(() => {
    const fetchUserId = () => {
      const id = Cookies.get('id');  // 'id' 쿠키에서 사용자 ID를 가져옵니다.
      setUserID(id || "");  // 쿠키에서 가져온 값을 상태에 설정합니다.
    };

    fetchUserId();
    // 쿠키 값의 변화를 감지하기 위해 setInterval을 사용할 수 있습니다.
    const interval = setInterval(fetchUserId, 1000);  // 매 1초마다 쿠키를 확인합니다.

    return () => clearInterval(interval);  // 컴포넌트 언마운트 시 인터벌을 정리합니다.
  }, []);
  
  return (
    <div className={styles.main}>
      CoD팀{userId ? `: ${userId}` : ''}
    </div>
  );
}
