"use client";
import Link from "next/link";
import sidebarstyles from "./sidebarStyles.module.scss"

export default function Sidebar() {
  return (
    <div>
      <div className={sidebarstyles.navContainer}>
      <div>
        <p className={sidebarstyles.title}>SPM</p>
      </div>
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
          <Link href="/Admin">Admin</Link>
        </div>
      </div>
    </div>
  );
}
