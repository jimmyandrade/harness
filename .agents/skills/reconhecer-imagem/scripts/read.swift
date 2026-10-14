import AppKit
import Vision

let arguments = CommandLine.arguments
if arguments.count < 3 {
    exit(2)
}
let url = URL(fileURLWithPath: arguments[1])
let languages = Array(arguments.dropFirst(2))
guard let image = NSImage(contentsOf: url),
      let tiff = image.tiffRepresentation,
      let ci = CIImage(data: tiff) else {
    exit(2)
}
let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.recognitionLanguages = languages
request.usesLanguageCorrection = true
let handler = VNImageRequestHandler(ciImage: ci, options: [:])
try handler.perform([request])
for obs in request.results ?? [] {
    if let line = obs.topCandidates(1).first?.string {
        print(line)
    }
}
