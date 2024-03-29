'use client'
import Link from 'next/link';
import sidebarstyle from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div>
      <p className={sidebarstyle.title}>SPM</p>
      <div className={sidebarstyle.navButton}>
        <Link href="/">Home</Link>
      </div>
    </div>
)
}