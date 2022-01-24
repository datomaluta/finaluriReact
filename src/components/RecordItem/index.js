import { useRef, useState } from 'react';
import ContextMenu from '../ContextMenu';

const RecordItem = ({ point, date, deleteItem }) => {
    const itemRef = useRef();

    const [isRightClicked, setIsRightClicked] = useState(false);

    function handleContextMenuClick(e) {
        e.preventDefault();
        setIsRightClicked(e);
    }

    return (
        <li
            className="record_item"
            ref={itemRef}
            onContextMenu={(e) => {
                handleContextMenuClick(e);
            }}>
            <p className="point">{point}</p>
            <p className="line">|</p>
            <p className="date">{date}</p>
            <ContextMenu parentItem={itemRef} clicked={isRightClicked} deleteItem={deleteItem} itemDate={date} />
        </li>
    );
};

export default RecordItem;
