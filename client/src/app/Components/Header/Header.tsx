"use client";
import styles from "./headerStyles.module.scss";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Link from "next/link";
import Fixed from 'next/image';
async function logout(): Promise<boolean> {
  try {
    const token = Cookies.get("token");
    if (!token) {
      console.log("로그아웃 실패: 토큰이 없습니다.");
      return false;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    // 서버에서의 응답을 JSON 형식으로 파싱
    const data = await res.json();
    // 사용자가 존재하는 경우
    if (data) {
      Cookies.remove("id");
      Cookies.remove("token");
      console.log("로그아웃 성공.");
      return true;
    } else {
      // 사용자가 존재하지 않는 경우
      console.log("로그아웃 실패.");
      return false;
    }
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

export default function Header() {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = () => {
      const id = Cookies.get("id"); // 'id' 쿠키에서 사용자 ID를 가져옵니다.
      setUserId(id || ""); // 쿠키에서 가져온 값을 상태에 설정합니다.
    };

    fetchUserId();
    // 쿠키 값의 변화를 감지하기 위해 setInterval을 사용할 수 있습니다.
    const interval = setInterval(fetchUserId, 1000); // 매 60분마다 쿠키를 확인합니다.
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌을 정리합니다.
  }, []);

  const handleLogout = async () => {
    if (await logout()) {
      setUserId("");
      router.push(`/`);
      window.alert("로그아웃 성공");
    } else {
      window.alert("로그아웃 실패");
    }
  };

  return (
    <div className={styles.container}>
      <Link href="https://github.com/xchxn/SFM" target="_blink">
        <Fixed src="/github.svg" alt="설명" width={30} height={30}/>
      </Link>
      {userId ? (
        <div className={styles.loginContainer}>
          <button
            className={styles.loginButton}
            onClick={() => router.push("/Admin")}
          >
            ⚙관리자 페이지
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className={styles.loginContainer}>
          <button
            className={styles.loginButton}
            onClick={() => router.push("/Login")}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
