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

export default function Page() {
  const [inventory, setInventory] = useState([]);

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
  
  const data : any= {
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
      <div className={styles.chartContainer}>
        <Line data={data} options={ chartOptions } />
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
