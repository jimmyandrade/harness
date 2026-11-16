// Local transcription with Apple's SpeechAnalyzer (macOS 26 or later). No network audio, no privacy prompt.
//
// Build: swiftc -O -parse-as-library speech_transcribe.swift -o <out>/speech_transcribe
// Usage: speech_transcribe <audio file> [locale, default pt-BR] [speech|dictation]
//   speech    SpeechTranscriber, with full stops and capital letters (the default and the best Apple engine in the measured case)
//   dictation DictationTranscriber, slower and without punctuation
// Prints the text to stdout. The first run for a locale may download the language model from Apple.
import AVFoundation
import Foundation
import Speech

@main
struct SpeechTranscribe {
    static func main() async {
        let args = CommandLine.arguments
        guard args.count >= 2 else {
            FileHandle.standardError.write(Data("usage: speech_transcribe <audio file> [locale] [speech|dictation]\n".utf8))
            exit(2)
        }
        let locale = Locale(identifier: args.count > 2 ? args[2] : "pt-BR")
        let mode = args.count > 3 ? args[3] : "speech"
        do {
            let file = try AVAudioFile(forReading: URL(fileURLWithPath: args[1]))
            if mode == "dictation" {
                let module = DictationTranscriber(locale: locale, preset: .longDictation)
                try await install(module)
                let analyzer = SpeechAnalyzer(modules: [module])
                try await analyzer.start(inputAudioFile: file, finishAfterFile: true)
                var text = ""
                for try await result in module.results { text += String(result.text.characters) }
                print(text)
            } else {
                let module = SpeechTranscriber(locale: locale, preset: .transcription)
                try await install(module)
                let analyzer = SpeechAnalyzer(modules: [module])
                try await analyzer.start(inputAudioFile: file, finishAfterFile: true)
                var text = ""
                for try await result in module.results { text += String(result.text.characters) }
                print(text)
            }
        } catch {
            FileHandle.standardError.write(Data("error: \(error)\n".utf8))
            exit(1)
        }
    }

    static func install(_ module: any SpeechModule) async throws {
        if let request = try await AssetInventory.assetInstallationRequest(supporting: [module]) {
            FileHandle.standardError.write(Data("downloading the language model...\n".utf8))
            try await request.downloadAndInstall()
        }
    }
}
