import Foundation
import FoundationModels
import Vision

// Usage: draft <image> <context>
// Reads the image with Vision and asks the on-device model, with the image attached, for an alt text.
// Prints JSON with the labels, the number of people and the draft. Exits 2 for an unreadable image
// and 3 when the model is unavailable or refuses.
@main
struct Main {
    static func main() async {
        let arguments = CommandLine.arguments
        guard arguments.count == 3 else { exit(2) }
        let url = URL(fileURLWithPath: arguments[1])
        guard case .available = SystemLanguageModel.default.availability else { exit(3) }
        let classify = VNClassifyImageRequest()
        let humans = VNDetectHumanRectanglesRequest()
        do {
            try VNImageRequestHandler(url: url).perform([classify, humans])
        } catch {
            exit(2)
        }
        let labels = (classify.results ?? []).filter { $0.confidence > 0.3 }.prefix(8).map { $0.identifier }
        let people = humans.results?.count ?? 0
        let reading = labels.isEmpty ? "" : "Rótulos do Vision: \(labels.joined(separator: ", ")). Pessoas detectadas: \(people)."
        let instructions = """
            Você escreve texto alternativo de fotos de moda em português do Brasil. \
            Comece pelo nome da peça que o contexto informa, sem trocá-lo por "peça". \
            Depois descreva só o que a imagem mostra: cor, estampa, comprimento da manga, enquadramento, fundo e, \
            se houver pessoa, a pose e a roupa que acompanha, sem nome da pessoa e sem adivinhar tecido. \
            Não descreva o que não aparece. Duas frases, até 240 caracteres. Responda só com o texto alternativo.
            """
        // Describing a photo is a content transformation. The default guardrails refuse ordinary garment photos.
        let model = SystemLanguageModel(guardrails: .permissiveContentTransformations)
        let session = LanguageModelSession(model: model, instructions: instructions)
        do {
            let response = try await session.respond(options: GenerationOptions(temperature: 0.2)) {
                "Contexto do cadastro: \(arguments[2]). \(reading)"
                Attachment(imageURL: url)
            }
            let output: [String: Any] = ["labels": Array(labels), "people": people, "draft": response.content]
            let data = try JSONSerialization.data(withJSONObject: output, options: [.sortedKeys])
            print(String(data: data, encoding: .utf8) ?? "")
        } catch {
            FileHandle.standardError.write("\(error)\n".data(using: .utf8)!)
            exit(3)
        }
    }
}
