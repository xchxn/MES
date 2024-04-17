import styles from "./dashboard.module.css";
import { useState } from "react";
// async function getInventory () {
//   const res = await fetch(`http://localhost:3001/api/apiget`)
//   if (!res.ok) {
//     throw new Error('Failed to fetch inventory');
//   }
//   return res.json();
// }

export default async function Page() {
  const inventoryData = [
    {
         "inventory_id" : "1",
         "category_name" : "lemon",
         "type_name" : "box",
         "grade_name": "a",
         "previous_month_stock" : "1234",
         "previous_month_weight" : "2500",
         "incoming_quantity" : "230",
         "incoming_weight" : "500",
         "outgoing_quantity" : "800",
         "outgoing_weight" : "1000",
         "current_stock" : "2000",
         "current_weight" : "2500"
   },
   {
         "inventory_id" : "2",
         "category_name" : "orange",
         "type_name" : "bigbox",
         "grade_name": "b",
         "previous_month_stock" : "3243",
         "previous_month_weight" : "400",
         "incoming_quantity" : "230",
         "incoming_weight" : "500",
         "outgoing_quantity" : "800",
         "outgoing_weight" : "1000",
         "current_stock" : "4545",
         "current_weight" : "2500",
   }
   ]
  
  const [inventory] = await Promise.all([inventoryData])
  return (
    <div className={styles.dataTable}>
      <table>
      <thead>
        <tr>
          <th>Inventory ID</th>
          <th>Category Name</th>
          <th>Type Name</th>
          <th>Grade Name</th>
          <th>Previous Month Stock</th>
          <th>Previous Month Weight</th>
          <th>Incoming Quantity</th>
          <th>Incoming Weight</th>
          <th>Outgoing Quantity</th>
          <th>Outgoing Weight</th>
          <th>Current Stock</th>
          <th>Current Weight</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item : any) => (
          <tr key={item.inventory_id}>
            <td>{item.inventory_id}</td>
            <td>{item.category_name}</td>
            <td>{item.type_name}</td>
            <td>{item.grade_name}</td>
            <td>{item.previous_month_stock}</td>
            <td>{item.previous_month_weight}</td>
            <td>{item.incoming_quantity}</td>
            <td>{item.incoming_weight}</td>
            <td>{item.outgoing_quantity}</td>
            <td>{item.outgoing_weight}</td>
            <td>{item.current_stock}</td>
            <td>{item.current_weight}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}