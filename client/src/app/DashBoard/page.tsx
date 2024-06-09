"use client";
import { useState, useEffect } from "react";
import styles from "./dashboardStyles.module.scss";
import { color } from "chart.js/helpers";

async function getInventory(options: string) {
  console.log("아이템요청", options);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 날짜: options }),
  };

  const res = await fetch(
    `http://54.180.116.2:3001/management/getItems`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
async function getOptions() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `http://54.180.116.2:3001/management/getDateOptions`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export default function Page() {
  const [inventoryData, setInventoryData] = useState([]);
  const [dateOptions, setDateOptions] = useState({
    날짜: [],
  });
  const [targetDate, setTartgetDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOptions();
        setDateOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, [dateOptions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory(targetDate);
        setInventoryData(inventoryData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchData();
  }, [targetDate]);

  const handleSelectChange = async (event: any) => {
    setTartgetDate(event.target.value);
  };

  //날짜별로 테이블을 관리할 옵션

  //테이블 페이지 옵션
  // 페이지당 표시할 아이템 수
  const itemsPerPage = 20;
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);
  // 전체 페이지 수 계산
  const totalItems = inventoryData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // 현재 페이지에서 보여줄 아이템 계산
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = inventoryData.slice(firstIndex, lastIndex);

  // 페이지 변경 함수
  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
      <div className={styles.container}>
        <select
          id="날짜"
          name="날짜"
          value={targetDate}
          onChange={handleSelectChange}
        >
          <option value="" disabled={targetDate === ""}>
            날짜를 선택하세요
          </option>
          {dateOptions.날짜.map((option: any, index: any) => (
            <option key={index} value={option}>
              {option.substr(0, 10)}
            </option>
          ))}
        </select>
        <table>
          <thead>
            <tr>
              <th>관리구분</th>
              <th>품목</th>
              <th>품종</th>
              <th>등급</th>
              <th>전월재고</th>
              <th>전월중량</th>
              <th>입고수량</th>
              <th>입고중량</th>
              <th>출고수량</th>
              <th>출고중량</th>
              <th>현재고</th>
              <th>현재중량</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.관리구분}</td>
                <td>{item.품목}</td>
                <td>{item.품종}</td>
                <td>{item.등급}</td>
                <td>{item.전월재고}</td>
                <td>{item.전월중량}</td>
                <td>{item.입고수량}</td>
                <td>{item.입고중량}</td>
                <td>{item.출고수량}</td>
                <td>{item.출고중량}</td>
                <td>{item.현재고}</td>
                <td>{item.현재중량}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          이전
        </button>
        <span>
          {currentPage}/{totalPages}
        </span>
        <button onClick={nextPage} disabled={lastIndex >= inventoryData.length}>
          다음
        </button>
      </div>
      </div>
  );
}
