const SingleQuestionCard = ({ id, title, options, type, handleOptionSelect, optionsIsSelected }) => {
    return (
        <div className="quiz_box_wrapper" id={id}>
            <h3 className="quiz_question">{title}</h3>
            <div className="quiz_options_wrapper">
                {options.map((option, index) => (
                    <p
                        className={`option ${optionsIsSelected(option) ? 'selected' : ''}`}
                        onClick={() => handleOptionSelect(type, index, option)}>
                        {`${option}`}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default SingleQuestionCard;
