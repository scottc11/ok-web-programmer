import React from "react";
import logo from '../../media/ok200logo.jpeg';
import './Header.scss';


const Header = () => {
    return (
        <div className="header__container">
            <img className="logo" src={logo} alt="ok200-logo" />
        </div>
    )
}

export default Header;