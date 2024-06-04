"use client";
import { useState, useEffect } from "react";
import styles from "./forecastStyles.module.scss";
interface InventoryItem {
  관리구분: string;
  품목: string;
  품종: string;
  등급: string;
  예측날짜: string;
  현재고: number;
  현재중량: number;
  재고상태: string;
  중량상태: string;
}

//옵션을 선택된 항목들의 예측값 요청
async function getForecast(options: any) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  };

  const res = await fetch(`http://localhost:3001/forecast/data`, requestOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

//DB에서 항목을 구별할 수 있는 옵션 요청
async function getOptions(option: any) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(option),
  };

  const res = await fetch(
    `http://localhost:3001/forecast/getOptions`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

//anomaly값이 있는 항목 전부 요청
async function getAll() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `http://localhost:3001/forecast/getAnomalyItems`,
    requestOptions
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export default function Page() {
  const [inventory, setInventory] = useState<[]>([]);
  const [groupedInventory, setGroupedInventory] = useState({});
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

  // Inventory 데이터를 그룹화하는 함수
  const groupInventory = (inventory: InventoryItem[]) => {
    const grouped: { [key: string]: InventoryItem[] } = {};

    inventory.forEach((item) => {
      const key = `${item.관리구분}-${item.품목}-${item.품종}-${item.등급}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    return grouped;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getForecast(options);
        setInventory(data);
        const groupedData = groupInventory(data);
        setGroupedInventory(groupedData);
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

  const handleClick = async () => {
    const values = await getAll();
    setInventory(values);
    const groupedData = groupInventory(values);
    setGroupedInventory(groupedData);
  }
  return (
    <div className={styles.container}>
      <div className={styles.optionContainer}>
        <select
          id="관리구분"
          name="관리구분"
          value={options.관리구분}
          onChange={handleSelectChange}
        >
          <option value="" disabled={options.품목 === ""}>
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
          <option value="" disabled={options.품목 === ""}>
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
          <option value="" disabled={options.품목 === ""}>
            선택하세요
          </option>
          {initialState.등급.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div>
        </div>
      </div>
      <button onClick={handleClick} type="button">
        전부 가져오기
      </button>
      <div className={styles.itemsContainer}>
      {Object.keys(groupedInventory).map((groupKey, index) => (
        <div key={index}>
          <h3>{groupKey.replace(/-/g, ' ')}</h3>
          <ul>
            {groupedInventory[groupKey].map((item: any, idx: any) => (
              <li key={idx}>
                <strong>예측날짜: </strong>{item.예측날짜},
                <strong>현재고: </strong>{item.현재고},
                <strong>현재중량: </strong>{item.현재중량},
                <strong>재고상태: </strong>{item.재고상태},
                <strong>중량상태: </strong>{item.중량상태}
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </div>
  );
}
