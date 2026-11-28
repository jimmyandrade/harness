import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers
import Vision

// Usage: read_photo <image> [<thumbnail output> <longest side>]
// Prints JSON with the EXIF orientation and date, the displayed size (orientation applied), the Vision
// classification, people, text and attention area. With the optional arguments, also writes a JPEG
// thumbnail with the orientation applied. Exits 2 for an unreadable image.
@main
struct Main {
    static func main() {
        let arguments = CommandLine.arguments
        guard arguments.count == 2 || arguments.count == 4 else { exit(2) }
        let url = URL(fileURLWithPath: arguments[1])
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
              let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any]
        else { exit(2) }
        let orientation = properties[kCGImagePropertyOrientation] as? Int ?? 1
        let width = properties[kCGImagePropertyPixelWidth] as? Int ?? 0
        let height = properties[kCGImagePropertyPixelHeight] as? Int ?? 0
        let exif = properties[kCGImagePropertyExifDictionary] as? [CFString: Any]
        let date = exif?[kCGImagePropertyExifDateTimeOriginal] as? String

        let classify = VNClassifyImageRequest()
        let humans = VNDetectHumanRectanglesRequest()
        let text = VNRecognizeTextRequest()
        text.recognitionLanguages = ["pt-BR", "en-US"]
        let attention = VNGenerateAttentionBasedSaliencyImageRequest()
        // The image's own orientation tag, so every result is read upright.
        let handler = VNImageRequestHandler(
            url: url, orientation: CGImagePropertyOrientation(rawValue: UInt32(orientation)) ?? .up)
        do { try handler.perform([classify, humans, text, attention]) } catch { exit(2) }

        var output: [String: Any] = [
            "orientation": orientation,
            "date": date as Any,
            "pixels": ["width": width, "height": height],
            "labels": (classify.results ?? []).filter { $0.confidence > 0.3 }.prefix(8).map {
                ["label": $0.identifier, "confidence": ($0.confidence * 100).rounded() / 100]
            },
            "people": humans.results?.count ?? 0,
            "text": (text.results ?? []).compactMap { $0.topCandidates(1).first?.string },
        ]
        if let box = attention.results?.first?.salientObjects?.first?.boundingBox {
            output["attention"] = ["x": box.minX, "y": box.minY, "width": box.width, "height": box.height]
        }
        if arguments.count == 4, let side = Int(arguments[3]) {
            let options: [CFString: Any] = [
                kCGImageSourceCreateThumbnailFromImageAlways: true,
                kCGImageSourceCreateThumbnailWithTransform: true,
                kCGImageSourceThumbnailMaxPixelSize: side,
            ]
            guard let thumbnail = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary),
                  let destination = CGImageDestinationCreateWithURL(
                      URL(fileURLWithPath: arguments[2]) as CFURL, UTType.jpeg.identifier as CFString, 1, nil)
            else { exit(2) }
            CGImageDestinationAddImage(destination, thumbnail, nil)
            guard CGImageDestinationFinalize(destination) else { exit(2) }
            output["thumbnail"] = arguments[2]
        }
        guard let data = try? JSONSerialization.data(withJSONObject: output, options: [.sortedKeys]) else { exit(2) }
        print(String(data: data, encoding: .utf8) ?? "")
    }
}
