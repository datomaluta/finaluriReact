import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getQuestions } from '../../utils/funcions';

import { TailSpin } from 'react-loader-spinner';

import SingleQuestionCard from '../../components/QuestionCards/SingleQuestionCard';
import MultiQuestionCard from '../../components/QuestionCards/MultiQuestionCard';
import BoolQuestionCard from '../../components/QuestionCards/BoolQuestionCard';
import ProgressBar from '../../components/ProgressBar';

const Quiz = () => {
    let history = useHistory();
    const modalRef = useRef();

    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState({});

    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [selectedOptions, setSelectedOptions] = useState([]);

    const totalQuestions = quizData?.questions?.length || false;

    const [score, setScore] = useState(0);
    const [questionIsAnsweared, setQuestionIsAnsweared] = useState(false);
    const [quizIsComleted, setQuizIsCompleted] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [quizCompletedTime, setQuizCompletedTime] = useState('');

    useEffect(() => {
        if (quizData) {
            setCurrentQuestion(quizData?.questions?.[currentQuestionIndex]);
        }
    }, [currentQuestionIndex, quizData]);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                setLoading(true);
                const questionsFromLocalStorage = getQuestionsFromLocalStorage('quiz_questions');
                if (!!questionsFromLocalStorage) {
                    setQuizData(questionsFromLocalStorage);
                } else {
                    const questionsFromApi = await getQuestions();
                    setQuizData(questionsFromApi);
                    saveQuestionsToLocalStorage('quiz_questions', questionsFromApi, 60 * 10 * 1000);
                }
            } catch (e) {
                setQuizData(false);
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        loadQuiz();
    }, []);

    async function handleOptionSelect(type, index, optionValue = false) {
        if (questionIsAnsweared) return;
        if (type === 'multiple') {
            if (!optionsIsSelected(index)) {
                setSelectedOptions((prevOptions) => [...prevOptions, index + 1]);
            } else {
                const options = selectedOptions;
                const selectedOptionsIndex = getSelectedOptionsIndex(index);
                options.splice(selectedOptionsIndex, 1);
                setSelectedOptions([...options]);
            }
        } else if (type === 'single') {
            setSelectedOptions([index + 1]);
        } else {
            setSelectedOptions([optionValue]);
        }
    }

    const optionsIsSelected = (optionIndex) => selectedOptions.indexOf(optionIndex + 1) > -1;

    const boolTypeOptionsIsSelected = (optionValue) => selectedOptions[0] === optionValue;

    const getSelectedOptionsIndex = (optionIndex) => selectedOptions.indexOf(optionIndex + 1);

    function saveQuestionsToLocalStorage(key, value, ttl) {
        try {
            const now = new Date();
            // `item` is an object which contains the original value
            // as well as the time when it's supposed to expire
            const item = {
                value: value,
                expiry: now.getTime() + ttl
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            throw new Error(e);
        }
    }

    function getQuestionsFromLocalStorage(key) {
        try {
            const localQuestions = localStorage.getItem(key);
            // if the item doesn't exist, return null
            if (!localQuestions) {
                return null;
            }
            const item = JSON.parse(localQuestions);
            const now = new Date();
            // compare the expiry time of the item with the current time
            if (now.getTime() > item.expiry) {
                // If the item is expired, delete the item from storage
                // and return null
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch (e) {
            throw new Error(e);
        }
    }

    function setNextQuestion() {
        if (totalQuestions && totalQuestions - 1 !== currentQuestionIndex) {
            setSelectedOptions([]);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setQuestionIsAnsweared(false);
        } else {
            const now = new Date();
            const completedTime = now.toLocaleDateString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
            setQuizCompletedTime(completedTime);
            setQuizIsCompleted(true);
        }
    }

    function setQuestionBoxColor(color) {
        const box = document.getElementById(currentQuestion?.id?.toString());
        if (box) box.style.backgroundColor = color;
    }

    function handleAnswear(type) {
        if (selectedOptions.length) {
            const targetAnswearData = quizData.answers.filter((answear) => answear.id === currentQuestion.id);
            const correctAnswear = targetAnswearData[0].answer;
            if (type === 'single') {
                if (selectedOptions[0] === correctAnswear) {
                    setScore((prevScore) => prevScore + 1);
                    setQuestionBoxColor('#7fff7f');
                } else setQuestionBoxColor('#ee5d8d');
            } else if (type === 'multiple') {
                let correctAnswearCount = 0;
                for (const option of selectedOptions) {
                    if (correctAnswear.indexOf(option) > -1) correctAnswearCount += 1;
                }
                if (correctAnswearCount > 0) setQuestionBoxColor('#7fff7f');
                else setQuestionBoxColor('#ee5d8d');
                const multipleQuestionScore = (1 / correctAnswear.length) * correctAnswearCount;
                setScore((prevScore) => prevScore + multipleQuestionScore);
            } else if (type === 'boolean') {
                if (selectedOptions[0] === correctAnswear) {
                    setScore((prevScore) => prevScore + 1);
                    setQuestionBoxColor('#7fff7f');
                } else setQuestionBoxColor('#ee5d8d');
            }
            setQuestionIsAnsweared(true);
        } else {
            console.log('please select option');
        }
    }

    function handleModalButtonClick(saveResults) {
        if (saveResults) {
            saveRecordsToLocalStorage();
        }
        history.push('/');
    }

    function saveRecordsToLocalStorage() {
        try {
            let records = JSON.parse(localStorage.getItem('records')) || [];
            records = [...records, { point: score, date: quizCompletedTime }];
            localStorage.setItem('records', JSON.stringify(records));
        } catch (e) {
            throw new Error(e);
        }
    }

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!modalRef.current?.contains(e.target)) {
                if (modalIsOpen) closeModal();
            }
        };
        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    });

    return (
        <div className="quiz_container">
            {!loading ? (
                <>
                    {!quizIsComleted ? (
                        <>
                            <ProgressBar progress={((currentQuestionIndex + 1) * 100) / totalQuestions} />
                            {currentQuestion && (
                                <>
                                    {currentQuestion.type === 'single' ? (
                                        <SingleQuestionCard
                                            id={currentQuestion.id}
                                            title={currentQuestion.question}
                                            options={currentQuestion.options}
                                            type={currentQuestion.type}
                                            handleOptionSelect={handleOptionSelect}
                                            optionsIsSelected={optionsIsSelected}
                                        />
                                    ) : currentQuestion.type === 'multiple' ? (
                                        <MultiQuestionCard
                                            id={currentQuestion.id}
                                            title={currentQuestion.question}
                                            options={currentQuestion.options}
                                            type={currentQuestion.type}
                                            handleOptionSelect={handleOptionSelect}
                                            optionsIsSelected={optionsIsSelected}
                                        />
                                    ) : (
                                        <BoolQuestionCard
                                            id={currentQuestion.id}
                                            title={currentQuestion.question}
                                            options={[true, false]}
                                            type={currentQuestion.type}
                                            handleOptionSelect={handleOptionSelect}
                                            optionsIsSelected={boolTypeOptionsIsSelected}
                                        />
                                    )}
                                    <button
                                        className="quiz_btn"
                                        onClick={() =>
                                            questionIsAnsweared
                                                ? setNextQuestion()
                                                : handleAnswear(currentQuestion.type)
                                        }>
                                        {questionIsAnsweared
                                            ? currentQuestionIndex + 1 === totalQuestions
                                                ? 'Finish'
                                                : 'Next'
                                            : 'Answear'}
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="sum_wrapper">
                                <p>{`${score} / ${totalQuestions}`}</p>
                                <button className="try_again_button" onClick={() => openModal()} ref={modalRef}>
                                    Try Again
                                </button>
                            </div>
                            {modalIsOpen ? (
                                <div className="modal_bg">
                                    <div className="modal_wrapper" ref={modalRef}>
                                        <h3>Do you want to save this attempt?</h3>
                                        <div className="modal_btn_wrapper">
                                            <button className="modal_btn" onClick={() => handleModalButtonClick(true)}>
                                                Yes
                                            </button>
                                            <button className="modal_btn" onClick={() => handleModalButtonClick(false)}>
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                        </>
                    )}
                </>
            ) : (
                <div className="spinner_container">
                    <TailSpin height={'30px'} width={'30px'} color="#000" />
                </div>
            )}
        </div>
    );
};

export default Quiz;
