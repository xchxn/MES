"use client";
import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import styles from "./testpage.module.css";
async function updateServer(data: any, fileName: string) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "File-Name": fileName,
    },
    body: JSON.stringify(data),
    next: { revalidate: 3600 },
  };

  const res = await fetch(
    `http://localhost:3001/management/update`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Page() {
  const [inventory, setInventory] = useState([]);
  const handleFileUpload = (file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any = XLSX.utils.sheet_to_json(sheet);
        console.log(json);
        setInventory(json);
        updateServer(json, file.name);
        console.log(inventory);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    console.log(files[0].name); //23.1.16-1.22.xlsx
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      <div className={styles.body}>
        <p>테스트 페이지</p>
        <p>서버 컴포넌트에서 폼 데이터와 엑셀 업로드 데이터를 넘기는 테스트</p>

        {/* 엑셀 파일을 업로드 하는 부분, DnD이 되면 자동으로 updateServer 수행 */}
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>엑셀 파일을 업로드 하세요.</p>
        </div>
        {/* 해당 버튼으로 서버에 데이터 업데이트*/}
        {/* 드래그 데이터 테이블*/}
      </div>
      <div>
        <div className={styles.dataTable}>
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
              {inventory.map((item: any, index: number) => (
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
        </div>
      </div>
    </div>
  );
}
