'use client'
import styles from "./mainPageStyles.module.scss";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
//노티 설정된 항목들 가져오는 함수
async function getAnomalyItems() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`http://localhost:3001/forecast/getAnomalyItems`, requestOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
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

  // 컴포넌트가 마운트 될 때 권한 요청
  useEffect(() => {
    requestNotificationPermission();
    sendNotification();
  }, []);

  // 알림 권한 요청 함수
  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    } else {
      console.error("This browser does not support desktop notification");
    }
  }
  //알림 보내기
  async function sendNotification() {
    //DB에서 알림 설정이 TRUE인 항목들 읽어서 계산 로직 처리 후 알림 보내기.
    if ('Notification' in window && Notification.permission === 'granted') {
      const anomalyItemList = await getAnomalyItems();  // 알림 대상 항목 조회
      let bodyMessage = '다음 항목들을 확인해주세요:\n';
      anomalyItemList.forEach((item: any) => {
        bodyMessage += `품목: ${item.품목}, 품종: ${item.품종}, 등급: ${item.등급}, 현재고: ${item.현재고}\n`;
      });
      const notification = new Notification('알림: 재고 확인 요망', {
        body: bodyMessage
      });
    }else {
      console.error("Notification permission has not been granted");
    }
  }
  
  return (
    <ol className={styles.numbered}>
      <li>SPM 서비스 Wiki</li>
      <li>Update: 엑셀로된 재고 데이터를 업로드 하는 페이지</li> 
      <li>Dashboard: 업로드 된 데이터들을 테이블 형태로 확인하는 페이지</li>
      <li>Chart: 항목 별 데이터에 예측 수치를 추가하여 꺾은 선 그래프로 시각화한 재고 수치 흐름을 한눈에 파악할 수 있는 페이지</li>
      <li>Compare: 항목 별 가장 최근 데이터와 최근 바로 이전, 예측 데이터를 한눈에 비교하기 위한 페이지</li>
      <li>QuickView: 예측 결과 중 위험 혹은 과잉 데이터만 모아서 보여주는 페이지</li>
    </ol>
  );
}
