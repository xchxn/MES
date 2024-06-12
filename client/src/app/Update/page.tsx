"use client";
import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import styles from "./updateStyles.module.scss";
import Cookies from "js-cookie";

async function updateServer(data: any, fileName: string) {
  const token = Cookies.get('token');
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "File-Name": fileName,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    next: { revalidate: 3600 },
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/management/update`,
    requestOptions
  );

  if (!res.ok) {
    if (res.status === 401) {
      window.alert("인증에 실패하였습니다. 로그인 후 진행해 주세요.");
      throw new Error("Token authentication failed. Please log in again.");
    } else if ( res.status === 400) {
      window.alert("중복 업로드");
      throw new Error("Failed to fetch data");
    } else {
      window.alert("업로드 실패");
      throw new Error("Failed to fetch data");
    }
  }

  return res.json();
}

export default function Page() {
  const [inventory, setInventory] = useState([]);
  const [uploadSuccess, setUploadSucecss] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState("");

  const handleFileUpload = async (file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any = XLSX.utils.sheet_to_json(sheet);
        console.log(json);
        setInventory(json);
        const suc = await updateServer(json, file.name);
        if(suc){
          setUploadSucecss(true);
          setUploadedFilename(file.name);
        }
        console.log(inventory);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
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
        {/* 엑셀 파일을 업로드 하는 부분, DnD이 되면 자동으로 updateServer 수행 */}
        <strong> * 파일명 예시: 22.1.24-1.30.xlsx *</strong>
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>엑셀 파일을 </p>
          <strong>하나씩 
            </strong>
          <p> 업로드 하세요.</p>
        </div>
        <div className={uploadSuccess ? styles.inputValid : ''}> {uploadedFilename}</div>
        {/* 해당 버튼으로 서버에 데이터 업데이트*/}
        {/* 드래그 데이터 테이블*/}
      </div>
    </div>
  );
}
