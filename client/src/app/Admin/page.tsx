"use client";
import styles from "./adminStyles.module.scss";
import { useEffect, useState } from "react";

// 인터페이스 정의
interface AdminOption {
  관리구분: string;
  품목: string;
  품종: string;
  등급: string;
  first: string;
  second: string;
  NotiSet: boolean;
}

interface Update {
  관리구분: string;
  품목: string;
  품종: string;
  등급: string;
  first: string;
  second: string;
  NotiSet: boolean;
}

// 서버로부터 받은 데이터와 관련된 타입
type AdminOptions = AdminOption[];

async function getAdminOptions(params: any): Promise<AdminOptions> {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params)
  };

  const response = await fetch(
    `http://localhost:3001/admin/getAdminOptions`,
    requestOptions
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

async function setAdminOptions(params: Update[]): Promise<void> {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params)
  };

  const response = await fetch(
    `http://localhost:3001/admin/setAdminOptions`,
    requestOptions
  );

  if (!response.ok) {
    throw new Error("Failed to set data");
  }
}

export default function Page() {
  const [field, setField] = useState<AdminOptions>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [data, setData] = useState({
    관리구분: [],
    품목: [],
    품종: [],
    등급: []
  });
  const [selected, setSelected] = useState({
    관리구분: [],
    품목: [],
    품종: [],
    등급: []
  });
  const temp = "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminOptions(temp);
        const initialUpdates: Update[] = data.map((item: AdminOption) => ({
          관리구분: item.관리구분,
          품목: item.품목,
          품종: item.품종,
          등급: item.등급,
          first: '',
          second: '',
          NotiSet: item.NotiSet
        }));
        setField(data);
        setUpdates(initialUpdates);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type, checked } = e.target;
    const updatedUpdates = updates.map((update, idx) => {
      if (idx === index) {
        return type === 'checkbox' ? { ...update, NotiSet: checked } : { ...update, [name]: value };
      }
      return update;
    });
    setUpdates(updatedUpdates);
  };

  const handleClick = async () => {
    try {
      await setAdminOptions(updates);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.optionField}>
        {/* 관리 구분 필드 */}
        {field.map((item, index) => (
          <div className={styles.inputLine} key={item.관리구분}>
            <p>{item.관리구분}</p>
          </div>
        ))}
        {/* 품목 필드 */}
        {/* 품종 필드 */}
        {/* 등급 필드 */}
      </div>
      <button onClick={handleClick} type="button">저장하기</button>
      {field.map((item, index) => (
        <div className={styles.inputLine} key={index}>
          <p>{item.관리구분}: {item.품목}</p>
          <input
            type="text"
            name="first"
            placeholder={item.first}
            value={updates[index]?.first}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            type="text"
            name="second"
            placeholder={item.second}
            value={updates[index]?.second}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            type="checkbox"
            name="notiCheck"
            checked={updates[index]?.NotiSet}
            onChange={(e) => handleChange(e, index)}
          />
          <label htmlFor="notiCheck">알림 설정</label>
        </div>
      ))}
    </div>
  );
};
