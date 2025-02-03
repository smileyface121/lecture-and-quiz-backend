const API_URL = "http://localhost:8080/api";

// Function to load chapter
async function loadChapter(chapterNumber = 1) {
    try {
        const response = await fetch(`${API_URL}/chapter/${chapterNumber}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById("video").outerHTML = `<p>${data.error}</p>`;
            return;
        }

        // Set video
        document.getElementById("video").src = data.videoUrl;

        // Load quiz
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "";
        
        data.quiz.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");
            questionDiv.innerHTML = `<p>${question.question}</p>`;

            question.options.forEach((option, optionIndex) => {
                questionDiv.innerHTML += `
                    <input type="radio" name="q${index}" value="${optionIndex}"> ${option} <br>
                `;
            });

            quizContainer.appendChild(questionDiv);
        });
    } catch (error) {
        console.error("Error loading chapter:", error);
    }
}

// Function to submit quiz
async function submitQuiz() {
    const answers = [];
    document.querySelectorAll(".question").forEach((question, index) => {
        const selectedOption = question.querySelector(`input[name="q${index}"]:checked`);
        answers.push(selectedOption ? parseInt(selectedOption.value) : -1);
    });

    const response = await fetch(`${API_URL}/submit-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: "123", chapter: 1, answers })
    });

    const result = await response.json();
    document.getElementById("result").innerText = `Score: ${result.score}% - ${result.passed ? "✅ Passed!" : "❌ Failed!"}`;
}

// Load the first chapter on page load
window.onload = () => loadChapter(1);
