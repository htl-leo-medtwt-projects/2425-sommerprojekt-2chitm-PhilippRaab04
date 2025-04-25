document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        {
            question: "Welche Eigenschaft beschreibt dich am besten?",
            answers: [
                { text: "Effizient und strukturiert", value: "DEUTSCHLAND" },
                { text: "Innovativ und risikofreudig", value: "USA" },
                { text: "Robust und beständig", value: "UDSSR" }
            ]
        },
        {
            question: "Was schätzt du mehr?",
            answers: [
                { text: "Technologische Fortschritte", value: "USA" },
                { text: "Stabilität und Sicherheit", value: "UDSSR" },
                { text: "Präzision und Qualität", value: "DEUTSCHLAND" }
            ]
        },
        {
            question: "Welches Motto spricht dich an?",
            answers: [
                { text: "Freiheit und Individualität", value: "USA" },
                { text: "Einheit und Zusammenhalt", value: "UDSSR" },
                { text: "Ordnung und Disziplin", value: "DEUTSCHLAND" }
            ]
        }
    ];
  
    const quizContent = document.getElementById("quiz-content");
    const startQuizButton = document.getElementById("start-quiz");
    const resultDiv = document.getElementById("result");
    const nationSlogan = document.getElementById("nation-slogan");
    const nationReason = document.getElementById("nation-reason");
    const backButton = document.getElementById("back-button");
  
    let currentQuestionIndex = 0;
    let results = { DEUTSCHLAND: 0, USA: 0, UDSSR: 0 };
  
    startQuizButton.addEventListener("click", startQuiz);
    backButton.addEventListener("click", resetQuiz);
  
    function startQuiz() {
        startQuizButton.classList.add("hidden");
        showQuestion();
    }
  
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResult();
            return;
        }
  
        const question = questions[currentQuestionIndex];
        quizContent.innerHTML = `<h2 class="question">${question.question}</h2>`;
        const answersContainer = document.createElement("div");
        answersContainer.classList.add("answers");
  
        question.answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer.text;
            button.classList.add("answer-button");
            button.addEventListener("click", () => handleAnswer(answer.value));
            answersContainer.appendChild(button);
        });
  
        quizContent.appendChild(answersContainer);
    }
  
    function handleAnswer(value) {
        results[value]++;
        currentQuestionIndex++;
        showQuestion();
    }
  
    function showResult() {
        const maxResult = Object.keys(results).reduce((a, b) => (results[a] > results[b] ? a : b));
        let slogan, reason;
  
        switch (maxResult) {
            case "DEUTSCHLAND":
                slogan = "BRD - Effizient und robust";
                reason = "Du schätzt Präzision und Ordnung. Deine Arbeitsweise ist methodisch und zielgerichtet.";
                break;
            case "USA":
                slogan = "USA - Innovativ und freiheitsliebend";
                reason = "Du bist risikofreudig und strebst nach Fortschritt. Deine Kreativität kennt keine Grenzen.";
                break;
            case "UDSSR":
                slogan = "UDSSR - Stark und vereint";
                reason = "Du stehst für Stabilität und Gemeinschaft. Deine Kraft liegt in der Einheit.";
                break;
        }
  
        nationSlogan.textContent = slogan;
        nationReason.textContent = reason;
        quizContent.classList.add("hidden");
        resultDiv.classList.remove("hidden");
    }
  
    function resetQuiz() {
        currentQuestionIndex = 0;
        results = { DEUTSCHLAND: 0, USA: 0, UDSSR: 0 };
        quizContent.classList.remove("hidden");
        resultDiv.classList.add("hidden");
        startQuizButton.classList.remove("hidden");
        quizContent.innerHTML = "";
    }
  });