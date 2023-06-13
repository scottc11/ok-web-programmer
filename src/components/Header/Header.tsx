import React from "react";
import "./Header.scss";
import logo from "../../media/OK200.png";

const Header: React.FC = () => {
  return (
    <div className="header">
      <img src={logo} alt="ok200-logo" />
    </div>
  );
};

export default Header;
