import React, { useEffect, useState } from 'react';

const Home = () => {
    const [record, setRecord] = useState(false);

    useEffect(() => {
        const localStorageRecords = JSON.parse(localStorage.getItem('records')) || [];
        localStorageRecords.sort((a, b) =>
            a.point > b.point ? -1 : a.point === b.point ? (a.date > b.date ? -1 : 1) : 1
        );
        if (localStorageRecords.length > 0) {
            setRecord(localStorageRecords[0]);
        }
    }, []);

    return (
        <div className="home_wrapper">
            <div className="start_quiz_btn_wrapper">
                <a className="start_quiz_btn" href="/quiz">
                    Start Quiz
                </a>
            </div>
            <div className="home_history_wrapper">
                {record ? (
                    <>
                        Last record
                        <div className="home_history_item">
                            <p className="point">{record.point}</p>
                            <p className="line">|</p>
                            <p className="date">{record.date}</p>
                        </div>
                        <a href="/history" className="view_all_records_btn_home">
                            View all records
                        </a>
                    </>
                ) : (
                    <p className="no_record_found">No record found</p>
                )}
            </div>
        </div>
    );
};

export default Home;
