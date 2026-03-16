import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <nav className="w-full">
      <div className="flex justify-between">
        <Link href="/">Siang Grocery</Link>
        <div>
          <Link href="/store">Store</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
