---
locale: en
---

# Run both transcription engines and compare them

## Status

Accepted. It supersedes the order and "first available engine runs" part of [ADR 0027](0027-offer-apple-speechanalyzer-next-to-the-local-whisper.md).

## Context

ADR 0027 offered `SpeechTranscriber` and the local Whisper, and ran only the first available one, with the other as a second opinion when a repeated phrase showed up. Neither engine won in everything.

A third recording confirmed it: an 11-minute meeting in Portuguese. The Whisper text has full punctuation and an `.srt`, and got "Manda, Lu. São pontos, só um ponto." where `SpeechTranscriber` wrote one wrong word. The Whisper also repeated one phrase three times near the end, and `SpeechTranscriber` heard something else in the same stretch. The Whisper text was delivered first and the repetition was only found after the person asked why that engine had been chosen. `SpeechTranscriber` ran in about 6 seconds, so running it costs almost nothing.

## Decision

The skill runs every available engine of the `Ordem dos motores` on the same audio and compares the texts with `scripts/compare_transcripts.py`.

- The working text is the Whisper text, with punctuation and times. In a stretch where the Whisper repeated a phrase or dropped words and `SpeechTranscriber` fits the conversation around it, the working text takes the `SpeechTranscriber` stretch, and the answer says so.
- A stretch where the two differ and the conversation around it does not decide is marked as not reliable, with both versions.
- With only one engine available, it runs alone, the answer says there was no second opinion, and nothing is installed unless no engine is available, as before.
- The parameter keeps its name and its default value, so a project that sets it keeps working. It now lists the engines that run, in order, and no longer picks one.

## Consequences

- A recording costs the time of the slower engine, the Whisper, at about 18 times the real time. `SpeechTranscriber` adds seconds.
- The answer to the person lists what was swapped and what is not reliable, which a single engine could not show.
- Three recordings are still a small sample. A new engine or a new macOS calls for another measurement.
