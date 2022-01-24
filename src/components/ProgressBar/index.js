const ProgressBar = ({ progress }) => {
    return (
        <div className="progress_bar_wrapper">
            <div className="progress_bar" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;
