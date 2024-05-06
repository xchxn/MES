"use client";
import { useState, useEffect } from "react";
import styles from "./chart.module.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

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
async function getOptions(option: any) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(option),
  };

  const res = await fetch(`http://localhost:3001/management/getOptions`, requestOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
//첫번째 옵션=db에서 가져오는 관리구분
//관리구분으로 품목 가져오기
//품목으로 품종 가져오기
//품종으로 등급 가져오기
//최종 '조회하기'버튼으로 위의 옵션에 해당하는 값들 가져와서 chart와 연동
export default function Page() {
  const [inventory, setInventory] = useState([]);
  const [options, setOptions] = useState({
    관리구분: "",
    품목: "",
    품종: "",
    등급: ""
  })
  const [initialState, setInitialState] = useState({
    관리구분: [],
    품목: [],
    품종: [],
    등급: []
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOptions(options);
        //해당 set함수 확인필요 05.06
        setInitialState(prevStates => ({
          관리구분: data.관리구분 || prevStates.관리구분,
          품목: data.품목 || prevStates.품목,
          품종: data.품종 || prevStates.품종,
          등급: data.등급 || prevStates.등급
        }));
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setOptions(prevOptions => ({
      ...prevOptions,
      [name]: value // 특정 키(예: 관리구분)의 값을 업데이트
    }));
    console.log(options);
  };

  //fetch한 data에서 날짜를 뽑아서 dataConfig의 labels로 매칭
  //dataConfig의 datasets속 data에 수치 데이터 mapping
  //chartsOptions에서 scales의 x에는 라벨링, y축에는 max값와 min값 적용필요
  const dataConfig : any= {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Line Chart Example",
      },
    },
    scales: {
      x: {
        type: "category",
        labels: ["January", "February", "March", "April", "May", "June"],
      },
      y: {
        type: "linear",
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div>
      <div>
        <select
        id="관리구분"
        name="관리구분"
        value={options.관리구분}
        onChange={handleSelectChange}
        >
          {initialState.관리구분.map((option:any, index: any) => (
          <option key={index} value={option}>
            {option}
          </option>))}
        </select>
        <select
        id="품목"
        name="품목"
        value={options.품목}
        onChange={handleSelectChange}
        >
          {initialState.품목.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>))}
        </select>
        <select
        id="품종"
        name="품종"
        value={options.품종}
        onChange={handleSelectChange}
        >
          {initialState.품종.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>))}
        </select>
        <select
        id="등급"
        name="등급"
        value={options.등급}
        onChange={handleSelectChange}
        >
          {initialState.등급.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>))}
        </select>
      </div>
      <div className={styles.chartContainer}>
        <Line data={dataConfig} options={ chartOptions } />
      </div>
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
