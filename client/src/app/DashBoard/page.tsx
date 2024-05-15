'use client'
import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
async function getInventory() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`http://localhost:3001/api/test`, requestOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Page() {
  const [inventoryData, setInventoryData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory();
        setInventoryData(inventoryData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchData();
  }, []);

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
      <div className={styles.dataTable}>
        <table className={styles.table}>
          <thead className={styles.thead}>
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
          <tbody className={styles.tbody}>
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
          <button onClick={prevPage} disabled={currentPage === 1}>이전</button>
          <span>{currentPage}/{totalPages}</span>
          <button onClick={nextPage} disabled={lastIndex >= inventoryData.length}>다음</button>
        </div>
      </div>
    </div>
  );
}
