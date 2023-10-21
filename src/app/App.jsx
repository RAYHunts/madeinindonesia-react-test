import { useEffect, useState } from "react";

const App = () => {
    const questions = [
        {
            question: "What type of smartphone do you use?",
            choices: ["Android", "iOS", "Windows"],
            name: "os",
        },
        {
            question: "How often do you update your computer's operating system or software?",
            choices: [
                "Regularly (automatic updates)",
                "Occasionally (manual updates)",
                "Rarely (never update)",
            ],
            name: "update",
        },
        {
            question: "Which social media platform do you use most frequently?",
            choices: ["Facebook", "Instagram", "Twitter"],
            name: "social",
        },
        {
            question: "How do you primarily access the internet at home?",
            choices: ["Wi-Fi", "Ethernet", "Mobile data"],
            name: "internet",
        },
        {
            question: "What is your preferred web browser?",
            choices: ["Google Chrome", "Mozilla Firefox", "Microsoft Edge"],
            name: "browser",
        },
        {
            question: "Do you use a virtual private network (VPN) for online privacy and security?",
            choices: ["Yes, regularly", "Occasionally", "No"],
            name: "vpn",
        },
        {
            question: "Which streaming service do you use for entertainment?",
            choices: ["Netflix", "Amazon Prime Video", "Disney+"],
            name: "streaming",
        },
        {
            question: "How do you store your important digital files and documents?",
            choices: [
                "Cloud storage (e.g., Google Drive, Dropbox)",
                "External hard drive",
                "On my computer's local storage",
            ],
            name: "storage",
        },
        {
            question: "Have you ever used a smart home device (e.g., smart thermostat, voice assistant)?",
            choices: ["Yes, multiple", "Yes, one", "No, never"],
            name: "smart",
        },
        {
            question: "How often do you participate in online gaming or e-sports?",
            choices: ["Daily", "Weekly", "Rarely or never"],
            name: "gaming",
        },
    ];

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
        <main className="h-screen grid place-content-center p-2 bg-gradient-to-b from-white via-red-400 to-primary font-jakarta">
            <div className="p-6 bg-white/25 backdrop-blur-md rounded-md relative min-w-[240px] w-full sm:w-[480px]">

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
                                setStep(1);
                                setFormData({});
                                setTimer(300);
                                setIsSubmitted(false);
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
