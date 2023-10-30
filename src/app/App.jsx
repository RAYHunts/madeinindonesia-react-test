import { useEffect, useState } from "react";
import questions from "../constants/questions";
const App = () => {
    

    const [step, setStep] = useState(parseInt(localStorage.getItem("step"), 10) || 1);
    const [formData, setFormData] = useState(JSON.parse(localStorage.getItem("formData")) || {});
    const [timer, setTimer] = useState(parseInt(localStorage.getItem("timer"), 10) || 300);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleNext = () => {
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimer(0);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const reset = () =>{
        setStep(1);
        setFormData({});
        setTimer(300);
        setIsSubmitted(false);
    }

    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
        localStorage.setItem("timer", timer.toString());
        localStorage.setItem("step", step.toString());
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            } else {
                handleSubmit();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    const handleFormChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    return (
        <main className="h-screen flex justify-center items-center p-2 bg-gradient-to-b from-white via-red-400 to-primary font-jakarta">
            <div className="p-6 bg-white/25 backdrop-blur-md rounded-md relative max-w-lg container">

                {!isSubmitted && (
                    <>
                        <div className="flex justify-between absolute -top-5 left-0 right-0 gap-2">
                            {Array.from({ length: questions.length }, (_, i) => i + 1).map(
                                (item) => (
                                    <div
                                        className={`w-full h-2 rounded-full ${step >= item ? "bg-primary" : "bg-white/50"
                                            } transition-all duration-500`}
                                        key={item}
                                    ></div>
                                )
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="relative w-full h-80 sm:h-60 overflow-hidden">
                                {questions.map((question, index) => (
                                    <div
                                        key={index}
                                        className={`absolute w-full flex flex-col gap-3 transition-all duration-500 ${step === index + 1
                                            ? "translate-x-0"
                                            : step > index + 1
                                                ? "-translate-x-full"
                                                : "translate-x-full"
                                            }`}
                                    >
                                        <h1 className="text-xl sm:text-3xl font-bold text-primary">
                                            Question {index + 1}
                                        </h1>
                                        <p className="text-sm sm:text-lg font-medium text-primary">
                                            {question.question}
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            {question.choices.map((choice) => (
                                                <label htmlFor={choice} className="flex items-center gap-2" key={choice}>
                                                    <input
                                                        type="radio"
                                                        name={question.name}
                                                        id={choice}
                                                        className="hidden peer"
                                                        value={choice}
                                                        checked={formData[question.name] === choice}
                                                        onChange={(e) => handleFormChange(e)}
                                                    />
                                                    <span className="w-4 h-4 flex-shrink-0 bg-white/25 border-2 border-secondary rounded-full peer-checked:bg-primary peer-checked:border-transparent"></span>
                                                    <span className="text-secondary text-sm sm:text-lg font-medium">{choice}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="px-4 py-2 text-sm sm:text-lg font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                                onClick={() => handleNext()}
                            >
                                {step === questions.length ? "Submit" : "Next"}
                            </button>

                            <div className="flex">
                                <span className="text-sm sm:text-lg font-medium text-primary">
                                    Time Left: {formatTime(timer)}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {isSubmitted && (
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl sm:text-3xl font-bold text-primary">Thank you!</h1>
                        <p className="text-sm sm:text-lg font-medium text-primary">
                            Your response has been recorded.
                        </p>

                        <button
                            className="px-4 py-2 text-sm sm:text-lg font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                            onClick={() => {
                                reset()
                            }}
                        >
                            Restart
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default App;
