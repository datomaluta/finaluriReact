import React, { useEffect, useState } from 'react';
const ContextMenu = ({ parentItem, clicked, deleteItem, itemDate }) => {
    const [menuIsActive, setMenuIsActive] = useState(false);

    useEffect(() => {
        clicked && setMenuIsActive(true);
    }, [clicked]);

    useEffect(() => {
        const hideMenu = (e) => {
            const parent = parentItem.current;
            if (parent && parent.contains(e.target)) {
                e.preventDefault();
            }
            if (parent && !parent.contains(e.target)) {
                setMenuIsActive(false);
            }
        };
        window.addEventListener('click', hideMenu);

        return () => {
            window.removeEventListener('click', hideMenu);
        };
    });
    return menuIsActive ? (
        <div className="context_menu" onClick={() => deleteItem(itemDate)}>
            <p>Delete</p>
        </div>
    ) : null;
};

export default ContextMenu;
