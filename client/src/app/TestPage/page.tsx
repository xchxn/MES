"use client";
import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import styles from './testpage.module.css';

async function example(rawFormData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rawFormData),
    next: { revalidate: 3600 },
  };

  const res = await fetch(`http://localhost:3001/management/managementview`, requestOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Page() {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setExcelData(json);

      
        example(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = (e:any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={styles.body}>
      <p>테스트 페이지</p>
      <p>서버 컴포넌트에서 폼 데이터와 엑셀 업로드 데이터를 넘기는 테스트</p>

      <form action={() => example(excelData)}>
        <div>
          <input type="text" id="testValue1" name="testValue1" placeholder="@testValue1" />
        </div>
        <div>
          <input type="text" id="testValue2" name="testValue2" placeholder="@testValue2" />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <p>엑셀 파일 드랍테스트</p>
      <div
        className={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>엑셀 드래그</p>
      </div>

      {excelData && (
        <div>
          <h2>Excel Data</h2>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
