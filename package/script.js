const output = document.getElementById("output");
const translatedOutput = document.getElementById("translated-output");
const startButton = document.getElementById("startButton");
const translateButton = document.getElementById("translateButton");
const copyButton = document.getElementById("copyButton");
const audioPlayer = document.getElementById("audio-player");

let finalTranscript = "";
let listening = false;

// ✅ Check Browser Compatibility for Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Please use Google Chrome or Edge.");
}

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.maxAlternatives = 1;

// ✅ Detect Language Dynamically (Odia or Hindi)
recognition.lang = "hi-IN"; // Hindi/ Hinglish detection

// ✅ Start / Stop Listening
startButton.addEventListener("click", () => {
    if (!listening) {
        finalTranscript = "";
        output.textContent = "";
        translatedOutput.textContent = "Translated text will be shown here...";
        recognition.start();
        startButton.textContent = "🎙 YES SWARUP BOSS, I AM LISTENING..";
        listening = true;
    } else {
        recognition.stop();
        startButton.textContent = "🎙 Start Listening";
        listening = false;
    }
});

// ✅ Process Speech Result
recognition.addEventListener("result", (event) => {
    let transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");

    if (event.results[0].isFinal) {
        finalTranscript += transcript + " ";
        output.textContent = finalTranscript;
    }
});

// ✅ Auto Restart on End (if listening)
recognition.addEventListener("end", () => {
    if (listening) {
        setTimeout(() => recognition.start(), 500);
    }
});

// ✅ Stop on Escape Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        recognition.stop();
        startButton.textContent = "🎙 Start Listening";
        listening = false;
    }
});

// ✅ Translation API (Google Free API) - FIXED
async function translateText(text) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0]; // ✅ Proper English translation
    } catch (error) {
        console.error("Translation failed:", error);
        return text;
    }
}

// ✅ Translate on Button Click
translateButton.addEventListener("click", async () => {
    if (finalTranscript.trim() !== "") {
        let translatedText = await translateText(finalTranscript);
        translatedOutput.textContent = translatedText;
        finalTranscript = ""; // Reset transcript after translation
    }
});

// ✅ Copy to Clipboard Feature
copyButton.addEventListener("click", () => {
    if (translatedOutput.textContent !== "Translated text will be shown here...") {
        navigator.clipboard.writeText(translatedOutput.textContent).then(() => {
            alert("✅ Translated text copied to clipboard!");
        }).catch(err => {
            console.error("Copy failed:", err);
        });
    } else {
        alert("⚠️ Nothing to copy! Please translate first.");
    }
});

// ✅ Play Music on First User Interaction (To avoid autoplay block)
document.addEventListener("click", () => {
    audioPlayer.play().catch(error => console.error("Autoplay blocked:", error));
}, { once: true });
