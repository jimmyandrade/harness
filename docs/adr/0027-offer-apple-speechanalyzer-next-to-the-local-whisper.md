---
locale: en
---

# Offer Apple's SpeechAnalyzer next to the local Whisper

## Status

Accepted.

## Context

The `transcrever-audio-e-video` skill transcribed with the local Whisper only. On a Mac with macOS 26 or later, Apple ships its own on-device engines, and a person asked which one transcribes better.

A second measurement, on a long meeting recording, is in the section "Second measurement" below. Four local engines transcribed the same voice note: 2 min 56 s of spontaneous speech in Portuguese, an Ogg/Opus WhatsApp audio converted to a 16 kHz mono wav, on a MacBook Air with Apple Silicon and macOS 27.2. It is one sample.

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

The skill offers `SpeechTranscriber` and the local Whisper, in the order of the `Ordem dos motores` parameter, `["SpeechTranscriber", "Whisper"]` by default. The first available engine runs. The first version of this decision put the Whisper first; the second measurement and the person's preference for the most modern native API moved `SpeechTranscriber` to the front.

- `SpeechTranscriber` is first because it needs nothing installed and was about five times faster on the long recording, with 90% of the words in common with the Whisper. The Whisper is the second opinion and the only engine that writes the `.srt` with times: a person who needs the times asks for it.
- The installation step opens only when no engine is available.
- After the Whisper, the skill looks for a repeated phrase and a jump of subject. Found one, it runs the other engine on that audio, or says the passage is not reliable.
- `SFSpeechRecognizer` is not offered, not even as a fallback. It did not beat `DictationTranscriber`, it needs a permission that the code tool does not hold and, on the long recording, it returned about a third of the words. The way to run it is in the last section.
- `scripts/speech_transcribe.swift` runs `SpeechTranscriber`, and `DictationTranscriber` as an option.

## Second measurement

Three engines transcribed one 18 min 16 s meeting recording in Portuguese (an mp4 with the audio converted to a 16 kHz mono wav), on an Apple M4 Pro with 24 GB and macOS 27.2. There is no reference text, so the comparison is between the engines.

| Engine | Time | Words | Words in common with the Whisper |
| --- | --- | --- | --- |
| `SpeechTranscriber` | 9.7 s | 2688 | 92% of its words are in the Whisper text, and 90% of the Whisper words are in its text |
| `whisper-cli` with `ggml-large-v3-turbo-q5_0.bin` | 49.6 s | 2739 | reference of the comparison |
| `SFSpeechRecognizer`, on device | 33 s after the permission | 853 | 92% of its words are in the Whisper text, but only 28% of the Whisper words are in its text |

- `SpeechTranscriber` and the Whisper differ in only three stretches of six words or more. The `SpeechTranscriber` dropped two short remarks, and the Whisper kept them. Neither fell into a repeated phrase.
- The proper names split: one English product name came out right in the `SpeechTranscriber` and as a Portuguese word in the Whisper, and two technical terms came out right in the Whisper and misspelled in the `SpeechTranscriber`. Both had about 20 commas. The `SpeechTranscriber` text has 172 full stops and the Whisper text has one, because the `.txt` of the Whisper puts each phrase on its own line.
- `SFSpeechRecognizer` skipped most of the speech, with the segments joined by their time stamps and also by the length rule above. What it kept is right, so it is a loss of content, not of accuracy, and a reader would not notice it.
- The permission prompt for `SFSpeechRecognizer` appears for each new build of the `.app`, because the ad hoc signature changes. A run that waits on it looks like a hang.
- Calling it from the main thread with a blocking wait never returns: the results are delivered on the main queue, so the process has to run the main loop.
- The two measurements ran on different machines, a MacBook Air and a MacBook Pro with an M4 Pro, so their times do not compare with each other. Only the comparison between engines inside each measurement holds.
- Two recordings are still a small sample. A new macOS or a new kind of audio calls for another measurement.

## Consequences

- A Mac with macOS 26 or later transcribes with nothing to install. The first use of a language may download the Apple language model.
- Neither `SpeechTranscriber` nor the Whisper won in everything, so the order is a default and not a ranking. A project that prefers the Whisper first changes the parameter.
- `SpeechTranscriber` was measured on three and on 18 minutes. The skill says so when the recording is much longer.
- Two samples. A new engine, a new macOS or a new audio calls for another measurement and, if the order should change, a new record.

## Running SFSpeechRecognizer

The skill does not use it. It is recorded here for the day it is needed.

- Called from a binary run in the terminal of the code tool, the process aborts with `SIGABRT` from TCC: "attempted to access privacy-sensitive data without a usage description". The responsible app is the code tool, and an `Info.plist` embedded in the binary does not count.
- Two ways work. The first is to run it in the Terminal panel of the app. The second is to package the binary as an `.app` with its own `Info.plist` (`CFBundleExecutable`, `CFBundleIdentifier`, `LSUIElement` and `NSSpeechRecognitionUsageDescription`), sign it with `codesign --force --sign - App.app` and launch it with `open -W -n App.app --stdout out.txt --stderr err.txt --args audio.wav`.
- Ask for `requiresOnDeviceRecognition = true`. With partial results the text restarts at each segment, and the final result holds only the last one. Join the segments: when the new text is much shorter than the previous one, keep the previous one and go on.
