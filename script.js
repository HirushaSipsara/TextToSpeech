// Initialize speech synthesis
const synth = window.speechSynthesis;

// Get DOM elements
const textInput = document.getElementById('text-input');
const speakBtn = document.getElementById('speak-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const stopBtn = document.getElementById('stop-btn');
const voiceSelect = document.getElementById('voice-select');
const volumeControl = document.getElementById('volume');
const pitchControl = document.getElementById('pitch');
const rateControl = document.getElementById('rate');

// Initialize variables
let voices = [];
let utterance = null;

// Fetch available voices dynamically
function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });
}

// Populate voices on load and on voice change
populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

// Speak the entered text
function speakText() {
  const text = textInput.value.trim();
  if (!text) return;

  // Cancel ongoing speech
  if (synth.speaking) {
    synth.cancel();
  }

  utterance = new SpeechSynthesisUtterance(text);

  // Set voice, volume, pitch, and rate
  const selectedVoice = voices[voiceSelect.value];
  utterance.voice = selectedVoice;
  utterance.volume = parseFloat(volumeControl.value);
  utterance.pitch = parseFloat(pitchControl.value);
  utterance.rate = parseFloat(rateControl.value);

  // Speak the text
  synth.speak(utterance);

  // Disable the speak button while speaking
  speakBtn.disabled = true;

  // Enable button after speaking ends
  utterance.onend = () => {
    speakBtn.disabled = false;
  };
}

// Pause, resume, and stop functionality
function pauseText() {
  if (synth.speaking && !synth.paused) {
    synth.pause();
  }
}

function resumeText() {
  if (synth.paused) {
    synth.resume();
  }
}

function stopText() {
  if (synth.speaking) {
    synth.cancel();
    speakBtn.disabled = false;
  }
}

// Event listeners
speakBtn.addEventListener('click', speakText);
pauseBtn.addEventListener('click', pauseText);
resumeBtn.addEventListener('click', resumeText);
stopBtn.addEventListener('click', stopText);

