---
locale: en
---

# Offer Apple's SpeechAnalyzer next to the local Whisper

## Status

Accepted.

## Context

The `transcrever-audio-e-video` skill transcribed with the local Whisper only. On a Mac with macOS 26 or later, Apple ships its own on-device engines, and a person asked which one transcribes better.

Four local engines transcribed the same voice note: 2 min 56 s of spontaneous speech in Portuguese, an Ogg/Opus WhatsApp audio converted to a 16 kHz mono wav, on a MacBook Air with Apple Silicon and macOS 27.2. It is one sample.

| Engine | Time | What came out |
| --- | --- | --- |
| `SpeechTranscriber` (SpeechAnalyzer) | 39 s | Full stops and capital letters, no commas. Got "pra você" and "lindo". Missed only the proper name of an event, which came out glued together and without the underscore. |
| `DictationTranscriber` (SpeechAnalyzer) | 66 s | No punctuation. Got "pro senhor" wrong, dropped "lindo" and replaced the event name with "encontro". |
| `SFSpeechRecognizer`, on device | about 45 s | Almost the same as `DictationTranscriber`. The final result holds only the last segment, so the segments have to be joined. |
| `whisper-cli` with `ggml-large-v3-turbo-q5_0.bin` | 34 s | Full punctuation and the proper names of the event and the place right. It fell into a repeated phrase ("a gente sempre dá prioridade pra gente...") and dropped "pras pessoas que participaram da última edição". |

- The central content was the same in the four, and no error changed the meaning.
- The Whisper error is the kind a reader does not notice: the sentence stays grammatical and loses information.
- `SpeechTranscriber` and `DictationTranscriber` ran from the terminal of the code tool with no privacy prompt. `SFSpeechRecognizer` did not: the process aborted with a `SIGABRT` from TCC, "attempted to access privacy-sensitive data without a usage description". The responsible app is the code tool, and an `Info.plist` embedded in the binary does not count. It ran from the Terminal panel of the app, and from a binary packaged as an `.app` with its own `Info.plist` and launched with `open -W`.
- The Whisper speed was measured on 45 meeting recordings, at about 18 times the real time. `SpeechTranscriber` was measured on this one audio.

Three options were considered:

1. **Keep the Whisper only.** Nothing changes, and a Mac with no Whisper needs an install of a program and a 547 MB model before any transcription.
2. **Replace the Whisper with `SpeechTranscriber`.** No install, but the engine was measured on three minutes, has no `.srt` with times, and lost nothing here but missed a name.
3. **Offer both, in an order the project sets.** The first available engine runs, and the other is the second opinion.

## Decision

The skill offers the local Whisper and `SpeechTranscriber`, in the order of the `Ordem dos motores` parameter, `["Whisper", "SpeechTranscriber"]` by default. The first available engine runs.

- The Whisper stays first because it was measured on 45 recordings and it writes the `.srt` with times. `SpeechTranscriber` is the engine that needs nothing installed.
- The installation step opens only when no engine is available.
- After the Whisper, the skill looks for a repeated phrase and a jump of subject. Found one, it runs the other engine on that audio, or says the passage is not reliable.
- `SFSpeechRecognizer` is not offered. It did not beat `DictationTranscriber`, and it needs a permission that the code tool does not hold. The way to run it is in the section below.
- `scripts/speech_transcribe.swift` runs `SpeechTranscriber`, and `DictationTranscriber` as an option.

## Consequences

- A Mac with macOS 26 or later transcribes with nothing to install. The first use of a language may download the Apple language model.
- No engine won in the measurement, so the order is a default and not a ranking. A project that prefers `SpeechTranscriber` first changes the parameter.
- `SpeechTranscriber` has no measurement on a long recording. The skill says so when the recording is long.
- The measurement is one sample. A new engine, a new macOS or a new audio calls for another measurement and, if the order should change, a new record.

## Running SFSpeechRecognizer

The skill does not use it. It is recorded here for the day it is needed.

- Called from a binary run in the terminal of the code tool, the process aborts with `SIGABRT` from TCC: "attempted to access privacy-sensitive data without a usage description". The responsible app is the code tool, and an `Info.plist` embedded in the binary does not count.
- Two ways work. The first is to run it in the Terminal panel of the app. The second is to package the binary as an `.app` with its own `Info.plist` (`CFBundleExecutable`, `CFBundleIdentifier`, `LSUIElement` and `NSSpeechRecognitionUsageDescription`), sign it with `codesign --force --sign - App.app` and launch it with `open -W -n App.app --stdout out.txt --stderr err.txt --args audio.wav`.
- Ask for `requiresOnDeviceRecognition = true`. With partial results the text restarts at each segment, and the final result holds only the last one. Join the segments: when the new text is much shorter than the previous one, keep the previous one and go on.
