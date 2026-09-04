// ==========================================
// PEDRO & ORLEIDYS - RULETA DE PAREJA
// ==========================================

const STORAGE_KEY = "pedroOrleidysRoulette";

// ==========================================
// LAS 8 PREGUNTAS
// ==========================================

const allQuestions = [
    {
        id: 1,
        question: "¿Comó querrias que fuera vuestra primera vez juntos, haciendo el amor. Sé detallista?",
        responder: "Pedro"
    },
    {
        id: 2,
        question: "¿cuantás veces te tocas al dia pensando en tu pareja?",
        responder: "Pedro"
    },
    {
        id: 3,
        question: "¿Que seria lo mas dificil de resistir, las ganas de besarme o mantener la calma mientras te toco?",
        responder: "Orleidys"
    },
    {
        id: 4,
        question: "¿te gustaría probar algo novedoso con tu pareja?. Pon dos ejemplos",
        responder: "Orleidys"
    },
    {
        id: 5,
        question: "¿sí pudieras elegir una fantasia para cumplirla conmigo cuando nos veamos, cual escogerias?",
        responder: "Pedro"
    }
  
];


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const roulette = document.getElementById("roulette");
const spinButton = document.getElementById("spinButton");
const restartButton = document.getElementById("restartButton");
const readyButton = document.getElementById("readyButton");

const questionElement = document.getElementById("question");
const answerLabel = document.getElementById("answerLabel");
const remainingElement = document.getElementById("remaining");


// ==========================================
// ESTADO DEL JUEGO
// ==========================================

let remainingQuestions = [];
let currentQuestion = null;
let currentRotation = 0;
let spinning = false;


// ==========================================
// CARGAR PARTIDA GUARDADA
// ==========================================

function loadGame() {

    const savedGame = localStorage.getItem(STORAGE_KEY);

    if (savedGame) {

        try {

            const data = JSON.parse(savedGame);

            remainingQuestions = data.remainingQuestions || [...allQuestions];
            currentQuestion = data.currentQuestion || null;
            currentRotation = data.currentRotation || 0;

        } catch (error) {

            console.log("No se pudo cargar la partida.");
            resetGameState();

        }

    } else {

        resetGameState();

    }

    updateInterface();
}


// ==========================================
// ESTADO INICIAL
// ==========================================

function resetGameState() {

    remainingQuestions = [...allQuestions];
    currentQuestion = null;
    currentRotation = 0;
}


// ==========================================
// GUARDAR PARTIDA
// ==========================================

function saveGame() {

    const gameState = {
        remainingQuestions: remainingQuestions,
        currentQuestion: currentQuestion,
        currentRotation: currentRotation
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(gameState)
    );
}


// ==========================================
// ACTUALIZAR INTERFAZ
// ==========================================

function updateInterface() {

    remainingElement.textContent = remainingQuestions.length;

    // Dibujar la ruleta según las preguntas que quedan
    drawRoulette();

    // Si ya terminó
    if (remainingQuestions.length === 0) {

        questionElement.textContent =
            "¡Han terminado la ronda! ❤️";

        answerLabel.textContent =
            "Pedro & Orleidys";

        spinButton.disabled = true;
        readyButton.disabled = true;

        return;
    }

    // Si existe una pregunta pendiente
    if (currentQuestion) {

        answerLabel.textContent =
            `Responde: ${currentQuestion.responder}`;

        questionElement.textContent =
            currentQuestion.question;

        spinButton.disabled = true;
        readyButton.disabled = false;

    } else {

        answerLabel.textContent =
            "Cuando estén listos...";

        questionElement.textContent =
            "Gira la ruleta para comenzar";

        spinButton.disabled = false;
        readyButton.disabled = true;
    }
}


// ==========================================
// DIBUJAR RUleta
// ==========================================

function drawRoulette() {

    const numberOfSegments = Math.max(
        remainingQuestions.length,
        1
    );

    const segmentSize = 360 / numberOfSegments;

    let gradientParts = [];

    for (let i = 0; i < numberOfSegments; i++) {

        const start = i * segmentSize;
        const end = (i + 1) * segmentSize;

        if (i % 2 === 0) {

            gradientParts.push(
                `#f1c8d2 ${start}deg ${end}deg`
            );

        } else {

            gradientParts.push(
                `#ffffff ${start}deg ${end}deg`
            );
        }
    }

    roulette.style.background =
        `conic-gradient(${gradientParts.join(", ")})`;
}


// ==========================================
// GIRAR RULETA
// ==========================================

function spinRoulette() {

    if (spinning) return;

    if (remainingQuestions.length === 0) return;

    if (currentQuestion) {

        alert(
            "Primero respondan la pregunta y presionen «Listo»."
        );

        return;
    }

    spinning = true;

    spinButton.disabled = true;
    readyButton.disabled = true;

    // Elegir una pregunta aleatoriamente
    const randomIndex =
        Math.floor(
            Math.random() * remainingQuestions.length
        );

    const selectedQuestion =
        remainingQuestions[randomIndex];

    const numberOfSegments =
        remainingQuestions.length;

    const segmentSize =
        360 / numberOfSegments;

    // Centro del segmento seleccionado
    const segmentCenter =
        randomIndex * segmentSize +
        segmentSize / 2;

    // Rotación necesaria para colocar
    // el segmento seleccionado arriba
    const normalizedRotation =
        currentRotation % 360;

    const targetRotation =
        360 - segmentCenter;

    let rotationDifference =
        targetRotation - normalizedRotation;

    if (rotationDifference < 0) {
        rotationDifference += 360;
    }

    // Varias vueltas antes de detenerse
    const extraSpins = 5;

    const finalRotation =
        currentRotation +
        (extraSpins * 360) +
        rotationDifference;

    currentRotation = finalRotation;

    // Aplicar giro
    roulette.style.transform =
        `rotate(${finalRotation}deg)`;

    // Sonido de ruleta
    playRouletteSound();

    // Esperar a que termine la animación
    setTimeout(() => {

        currentQuestion = selectedQuestion;

        saveGame();

        updateInterface();

        spinning = false;

    }, 5100);
}


// ==========================================
// BOTÓN "LISTO"
// ==========================================

function markAsReady() {

    if (!currentQuestion) return;

    // Eliminar la pregunta actual
    remainingQuestions =
        remainingQuestions.filter(
            question =>
                question.id !== currentQuestion.id
        );

    // Limpiar pregunta actual
    currentQuestion = null;

    saveGame();

    updateInterface();
}


// ==========================================
// INICIAR DE NUEVO
// ==========================================

function restartGame() {

    const confirmation = confirm(
        "¿Seguro que quieres iniciar una nueva ronda? Se borrará el progreso actual."
    );

    if (!confirmation) return;

    localStorage.removeItem(STORAGE_KEY);

    resetGameState();

    roulette.style.transform =
        "rotate(0deg)";

    currentRotation = 0;

    spinning = false;

    updateInterface();
}


// ==========================================
// SONIDO DE RULETA
// ==========================================

let audioContext = null;

function playRouletteSound() {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const duration = 4.8;
        const startTime = audioContext.currentTime;

        const tickInterval = 0.085;

        for (
            let time = 0;
            time < duration;
            time += tickInterval
        ) {

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type = "sine";

            oscillator.frequency.value =
                850 + Math.random() * 250;

            gain.gain.setValueAtTime(
                0.0001,
                startTime + time
            );

            gain.gain.exponentialRampToValueAtTime(
                0.035,
                startTime + time + 0.005
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                startTime + time + 0.035
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start(startTime + time);
            oscillator.stop(startTime + time + 0.04);
        }

    } catch (error) {

        console.log(
            "El sonido no está disponible en este navegador."
        );
    }
}


// ==========================================
// EVENTOS
// ==========================================

spinButton.addEventListener(
    "click",
    spinRoulette
);

readyButton.addEventListener(
    "click",
    markAsReady
);

restartButton.addEventListener(
    "click",
    restartGame
);


// ==========================================
// INICIAR
// ==========================================

loadGame();