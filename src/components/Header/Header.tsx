import React from "react";
import "./Header.scss";
import logo from "../../media/ok200logo.jpeg";

export const Header: React.FC = () => {
  return (
    <div className="header">
      <img src={logo} alt="ok200-logo" />
    </div>
  );
};
