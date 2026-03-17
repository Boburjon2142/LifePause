function getRecognitionCtor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const BREAK_ALERT_AUDIO_PATH = '/static/voice/ifepause%20alert.mp3';

export function supportsSpeechRecognition() {
  return Boolean(getRecognitionCtor());
}

export function speakUz(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'uz-UZ';
  utter.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export async function playBreakAlert() {
  if (typeof window === 'undefined') return false;

  try {
    const audio = new Audio(BREAK_ALERT_AUDIO_PATH);
    audio.preload = 'auto';
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function startUzListening({ onText, onError, onStart, onEnd } = {}) {
  const Recognition = getRecognitionCtor();
  if (!Recognition) {
    if (onError) onError(new Error('SpeechRecognition mavjud emas'));
    return null;
  }

  const recognition = new Recognition();
  recognition.lang = 'uz-UZ';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    const transcript = event?.results?.[0]?.[0]?.transcript?.trim() || '';
    if (transcript && onText) {
      onText(transcript);
    }
  };

  recognition.onerror = (event) => {
    if (onError) onError(new Error(event?.error || 'Speech xato'));
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();
  return () => recognition.stop();
}
