'use client'
import Link from "next/link";
import headerStyle from "./Header.module.css";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export async function getServerSideProps(context: any) {
  const { req } = context;
  const userId = Cookies.get('id');
  return {
    props: {
      initialUserId: userId || null,
    },
  };
}

async function Logout(): Promise<any> {
  try {
    const token = Cookies.get('token');
    if (!token) {
      console.log("로그아웃 실패: 토큰이 없습니다.");
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    };

    const res = await fetch(`http://localhost:3001/auth/logout`, requestOptions);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    // 서버에서의 응답을 JSON 형식으로 파싱
    const data = await res.json();
    Cookies.remove('id');
    Cookies.remove('token');
    // 사용자가 존재하는 경우
    if (data) {
      console.log("로그아웃 성공.");
      redirect("/");
    } else {
      // 사용자가 존재하지 않는 경우
      console.log("로그아웃 실패.");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export default function Header({ initialUserId }: any) {
  const [userId, setUserId] = useState(initialUserId);

  useEffect(() => {
    if (!userId) {
      setUserId(Cookies.get('id')); // 클라이언트 사이드에서 id 재확인
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div>
      {userId ? (
        <div>
          <div className={headerStyle.navContainer}>
            <div>
              <p className={headerStyle.title}>SPM</p>
            </div>
            <div>
              <div>
                <button onClick={handleLogout}>Logout</button>
              </div>
              <div className={headerStyle.navButton}>
                <Link href="/Setting">Setting</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className={headerStyle.navContainer}>
            <div>
              <p className={headerStyle.title}>SPM</p>
            </div>
            <div>
              <div className={headerStyle.navButton}>
                <Link href="/Login">Login</Link>
              </div>
              <div className={headerStyle.navButton}>
                <Link href="/Setting">Setting</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
