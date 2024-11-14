import React from "react";
// import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <nav>
        <ul class="flex justify-between text-2xl font-bold cursor-pointer">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/admin">Admin</a>
          </li>
          <li>
            <a href="/operator">Operator</a>
          </li>
          <li>
            <a href="/login">Account</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
