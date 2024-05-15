"use client";
import { useState, useEffect } from "react";
import styles from "./compare.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, BarElement, LinearScale, Title, CategoryScale);

async function getInventory(option: any) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(option),
  };

  const res = await fetch(
    `http://localhost:3001/management/getCompare`,
    requestOptions
  );
  console.log(res);
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

  const res = await fetch(
    `http://localhost:3001/management/getOptions`,
    requestOptions
  );

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
    등급: "",
  });
  const [initialState, setInitialState] = useState({
    관리구분: [],
    품목: [],
    품종: [],
    등급: [],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "My First Dataset",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventory(options);
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchData();
  }, [options, options.등급]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOptions(options);
        //해당 set함수 확인필요 05.06
        setInitialState((prevStates) => ({
          관리구분: data.관리구분 || prevStates.관리구분,
          품목: data.품목 || prevStates.품목,
          품종: data.품종 || prevStates.품종,
          등급: data.등급 || prevStates.등급,
        }));
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, [options]);

  useEffect(() => {
    const newLabels = "ㅇ"; //문자열 슬라이싱
    const newData = inventory.현재고;
    const newData2 = inventory.전월재고;
    setChartData({
      labels: newLabels,
      datasets: [
        {
          label: '현재고',
          data: inventory.현재고,
          backgroundColor: 'rgba(255, 99, 132, 0.5)', // 현재고 데이터 색상
          borderColor: 'rgba(255, 99, 132, 1)', // 테두리 색상
          borderWidth: 1
        },
        {
          label: '전월재고',
          data: inventory.전월재고,
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // 전월재고 데이터 색상
          borderColor: 'rgba(54, 162, 235, 1)', // 테두리 색상
          borderWidth: 1
        }
      ],
    });
  }, [inventory]);

  const handleSelectChange = async (event: any) => {
    const { name, value } = event.target;

    if (name === "관리구분") {
      // '관리구분'이 변경될 경우, 나머지 상태를 초기화합니다.
      setOptions({
        관리구분: value,
        품목: "",
        품종: "",
        등급: "",
      });
      setInitialState({
        관리구분: initialState.관리구분, // 관리구분 리스트는 유지
        품목: [],
        품종: [],
        등급: [],
      });
    } else if (name === "품목") {
      setOptions({
        관리구분: options.관리구분,
        품목: value,
        품종: "",
        등급: "",
      });
      setInitialState({
        관리구분: initialState.관리구분, // 관리구분 리스트는 유지
        품목: initialState.품목,
        품종: [],
        등급: [],
      });
    } else if (name === "품종") {
      setOptions({
        관리구분: options.관리구분,
        품목: options.품목,
        품종: value,
        등급: "",
      });
      setInitialState({
        관리구분: initialState.관리구분, // 관리구분 리스트는 유지
        품목: initialState.품목,
        품종: initialState.품종,
        등급: [],
      });
    } else {
      setOptions((prevOptions) => ({
        ...prevOptions,
        [name]: value, // 특정 키(예: 관리구분)의 값을 업데이트
      }));
    }
    console.log(options);
  };

  const chartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Floating Bar Chart'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true, // Y축을 0부터 시작하도록 설정
        max: Math.max(inventory.현재고, inventory.전월재고),
      }
    },
  };

  return (
    <div>
      <div className={styles.optionContainer}>
        <select
          id="관리구분"
          name="관리구분"
          value={options.관리구분}
          onChange={handleSelectChange}
        >
          <option value="" disabled={options.관리구분 === ""}>
            선택하세요
          </option>
          {initialState.관리구분.map((option: any, index: any) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          id="품목"
          name="품목"
          value={options.품목}
          onChange={handleSelectChange}
        >
          <option value="" disabled={options.품목 === ""}>
            선택하세요
          </option>
          {initialState.품목.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          id="품종"
          name="품종"
          value={options.품종}
          onChange={handleSelectChange}
        >
          <option value="" disabled={options.품종 === ""}>
            선택하세요
          </option>
          {initialState.품종.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          id="등급"
          name="등급"
          value={options.등급}
          onChange={handleSelectChange}
        >
          <option value="" disabled={options.등급 === ""}>
            선택하세요
          </option>
          {initialState.등급.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className={styles.container}>
        <div className={styles.dataTable}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>현재고</th>
                <th>전월재고</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              <tr>
                <td>{inventory.현재고}</td>
                <td>{inventory.전월재고}</td>
                <td>{inventory.날짜}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
