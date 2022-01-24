import React, { useEffect, useState } from 'react';
import RecordItem from '../../components/RecordItem';

const History = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const localStorageRecords = JSON.parse(localStorage.getItem('records')) || [];
        localStorageRecords.sort((a, b) =>
            a.point > b.point ? -1 : a.point === b.point ? (a.date > b.date ? -1 : 1) : 1
        );
        setRecords(localStorageRecords);
    }, []);

    function deleteItem(date) {
        let newRecords = records;
        newRecords = newRecords.filter((record) => record.date !== date);
        localStorage.setItem('records', JSON.stringify(newRecords));
        setRecords(newRecords);
    }

    return (
        <div className="history_wrapper">
            <h2>History</h2>
            {Array.isArray(records) && records?.length ? (
                <ul>
                    {records?.map((record, index) => (
                        <RecordItem
                            id={index}
                            point={record.point}
                            date={record.date}
                            deleteItem={deleteItem}
                            key={record.date}
                        />
                    ))}
                </ul>
            ) : (
                <p className="no_records_text">Records not found</p>
            )}
        </div>
    );
};

export default History;
