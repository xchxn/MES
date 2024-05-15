"use client";
import Link from "next/link";
import sidebarstyle from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div>
      <div className={sidebarstyle.navContainer}>
      <div>
        <p className={sidebarstyle.title}>SPM</p>
      </div>
        <div className={sidebarstyle.navButton}>
          <Link href="/">Home</Link>
        </div>
        <div className={sidebarstyle.navButton}>
          <Link href="/TestPage">TestPage</Link>
        </div>
        <div className={sidebarstyle.navButton}>
          <Link href="/DashBoard">DashBoard</Link>
        </div>
        <div className={sidebarstyle.navButton}>
          <Link href="/Chart">Chart</Link>
        </div>
        <div className={sidebarstyle.navButton}>
          <Link href="/Compare">Compare</Link>
        </div>
      </div>
    </div>
  );
}
