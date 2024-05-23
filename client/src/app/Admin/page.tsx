"use client";
import styles from "./adminStyles.module.scss";
import { useEffect, useState } from "react";
async function getAdminOptions() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `http://localhost:3001/management/getAdminOptions`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
async function setAdminOptions(params:any) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params)
  };

  const res = await fetch(
    `http://localhost:3001/management/setAdminOptions`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Page() {
  const [field, setField] = useState([]);
  const [update, setUpdate] = useState({
    관리구분:"",
    품목:"",
    first: "",
    second: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminOptions();
        setField(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setUpdate({
      ...update,
      [e.target.name]: e.target.value,
    });
  };
  const handleClick = () => {
    setAdminOptions(update);
  }

  return (
    <div className={styles.container}>
      <button
        onClick={handleClick}
        type="button">
          저장하기
        </button>
      {field.map((item: any, index: number) => (
        <div className={styles.inputLine} key={index}>
          <p>
            {item.관리구분}: {item.품목}
            <input
              type="text"
              id="first"
              name="first"
              placeholder="@first"
              value={update.first}
              onChange={handleChange}
            />
            <input
              type="text"
              id="second"
              name="second"
              placeholder="@second"
              value={update.second}
              onChange={handleChange}
            />
          </p>
        </div>
      ))}
    </div>
  );
}
