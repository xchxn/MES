"use client";
import Link from "next/link";
import sidebarstyles from "./sidebarStyles.module.scss";

export default function Sidebar() {
  function onClick(){

  }
  return (
      <div className={sidebarstyles.navContainer}>
          <button className={sidebarstyles.btn3} type="button" onClick={onClick}>
            <span><Link href="/">SFM</Link></span>
          </button>
        <div className={sidebarstyles.linkButton}>
          <Link href="/">Home</Link>
        </div>
        <div className={sidebarstyles.linkButton}>
          <Link href="/Update">Update</Link>
        </div>
        <div className={sidebarstyles.linkButton}>
          <Link href="/DashBoard">DashBoard</Link>
        </div>
        <div className={sidebarstyles.linkButton}>
          <Link href="/Chart">Chart</Link>
        </div>
        <div className={sidebarstyles.linkButton}>
          <Link href="/Forecast">Forecast</Link>
        </div>
      </div>
  );
}
