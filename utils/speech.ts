// ── Text-to-Speech (speechSynthesis API) ──────────────────────────────

let voices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
    };
  });
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (voices.length === 0) {
    voices = speechSynthesis.getVoices();
  }
  return voices;
}

export function getVoicesByGender(): { male: SpeechSynthesisVoice[]; female: SpeechSynthesisVoice[] } {
  const all = getVoices().filter((v) => v.lang.startsWith("en"));

  // Heuristic: common female voice name patterns
  const femaleNames = /samantha|victoria|karen|kate|moira|tessa|fiona|susan|amy|emma|jenny|zira|hazel|linda|aria|sara/i;
  const maleNames = /daniel|alex|tom|james|fred|ralph|david|mark|lee|george|aaron|guy|rishi/i;

  const female = all.filter((v) => femaleNames.test(v.name));
  const male = all.filter((v) => maleNames.test(v.name));

  // If heuristic fails, split by index
  if (female.length === 0 && male.length === 0) {
    const mid = Math.ceil(all.length / 2);
    return { female: all.slice(0, mid), male: all.slice(mid) };
  }

  return { male, female };
}

export function pickDefaultVoice(gender: "male" | "female"): SpeechSynthesisVoice | null {
  const grouped = getVoicesByGender();
  const list = gender === "male" ? grouped.male : grouped.female;
  // Prefer a local (non-network) voice
  const local = list.find((v) => v.localService);
  return local || list[0] || null;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(
  text: string,
  options: { voice?: SpeechSynthesisVoice | null; rate?: number; onEnd?: () => void } = {},
) {
  stop();
  const utterance = new SpeechSynthesisUtterance(text);
  if (options.voice) utterance.voice = options.voice;
  utterance.rate = options.rate ?? 1.0;
  utterance.onend = () => {
    currentUtterance = null;
    options.onEnd?.();
  };
  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

export function stop() {
  speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}

// Initialise voices early
if (typeof window !== "undefined") {
  loadVoices();
}

// ── Speech-to-Text: Web Speech API ───────────────────────────────────

type STTCallback = (text: string, isFinal: boolean) => void;

let recognition: any = null;

export function startWebSTT(onResult: STTCallback, onEnd?: () => void): boolean {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return false;

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    if (final) onResult(final, true);
    else if (interim) onResult(interim, false);
  };

  recognition.onend = () => {
    recognition = null;
    onEnd?.();
  };

  recognition.onerror = (event: any) => {
    console.error("Web STT error:", event.error);
    recognition = null;
    onEnd?.();
  };

  recognition.start();
  return true;
}

export function stopWebSTT() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

// ── Speech-to-Text: Local Whisper (Transformers.js) ──────────────────

let whisperPipeline: any = null;
let whisperLoading = false;

export type WhisperProgress = {
  status: string;
  progress?: number;
  file?: string;
};

export async function loadWhisperModel(
  onProgress?: (p: WhisperProgress) => void,
): Promise<boolean> {
  if (whisperPipeline) return true;
  if (whisperLoading) return false;

  whisperLoading = true;
  try {
    const { pipeline } = await import("@xenova/transformers");
    whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny",
      {
        progress_callback: (p: any) => {
          onProgress?.({
            status: p.status,
            progress: p.progress,
            file: p.file,
          });
        },
      },
    );
    whisperLoading = false;
    return true;
  } catch (e) {
    console.error("Failed to load Whisper model:", e);
    whisperLoading = false;
    return false;
  }
}

export function isWhisperLoaded(): boolean {
  return whisperPipeline !== null;
}

export function isWhisperLoading(): boolean {
  return whisperLoading;
}

export async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
  if (!whisperPipeline) throw new Error("Whisper model not loaded");

  // Convert blob to Float32Array
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioContext = new AudioContext({ sampleRate: 16000 });
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const float32 = audioBuffer.getChannelData(0);
  await audioContext.close();

  const result = await whisperPipeline(float32, {
    language: "english",
    task: "transcribe",
  });

  return result.text?.trim() || "";
}

// ── Audio Recording Helper ───────────────────────────────────────────

export function recordAudio(): Promise<{ stop: () => Promise<Blob> }> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.start();

      resolve({
        stop: () =>
          new Promise((res) => {
            mediaRecorder.onstop = () => {
              stream.getTracks().forEach((t) => t.stop());
              res(new Blob(chunks, { type: mediaRecorder.mimeType }));
            };
            mediaRecorder.stop();
          }),
      });
    } catch (e) {
      reject(e);
    }
  });
}
