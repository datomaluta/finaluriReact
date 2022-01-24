import React from 'react';

const MenuBar = () => {
    const pathname = window.location.pathname;

    if (pathname === '/quiz') return '';

    return (
        <ul className="menu-bar">
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/quiz">Quiz</a>
            </li>
            <li>
                <a href="/history">History</a>
            </li>
        </ul>
    );
};

export default MenuBar;
