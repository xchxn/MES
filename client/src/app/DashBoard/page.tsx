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

export default async function Page() {
  const inventoryData = await getInventory();
  const [inventory] = await Promise.all([inventoryData]);
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
  );
}
