"use client";
import Link from "next/link";
import sidebarstyle from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div>
      <div>
        <p className={sidebarstyle.title}>SPM</p>
      </div>
      <div className={sidebarstyle.navContainer}>
        <div className={sidebarstyle.navButton}>
          <Link href="/">Home</Link>
        </div>
        <div className={sidebarstyle.navButton}>
          <Link href="/TestPage">TestPage</Link>
        </div>
      </div>
    </div>
  );
}
