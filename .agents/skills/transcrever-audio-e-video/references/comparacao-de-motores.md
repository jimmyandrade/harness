# Comparação de motores de transcrição locais

Medição em um áudio de WhatsApp de 2 min 56 s, em português, no formato Ogg/Opus, convertido para wav de 16 kHz e mono, num MacBook Air com Apple Silicon e macOS 27.2. É uma amostra só, de fala espontânea. Meça outra antes de generalizar.

| Motor | Tempo | O que saiu |
| --- | --- | --- |
| `SpeechTranscriber` (SpeechAnalyzer) | 39 s | Pontos finais e maiúsculas, sem vírgulas. Acertou "pra você" e "lindo". Errou só o nome próprio de um evento, que saiu colado e sem o sublinhado. |
| `DictationTranscriber` (SpeechAnalyzer) | 66 s | Sem pontuação. Errou "pro senhor", omitiu "lindo" e trocou o nome do evento por "encontro". |
| `SFSpeechRecognizer` no aparelho | cerca de 45 s | Quase igual ao `DictationTranscriber`. Exige a concatenação dos trechos, descrita abaixo. |
| `whisper-cli` com `ggml-large-v3-turbo-q5_0.bin` | 34 s | Pontuação completa e os nomes próprios do evento e do local certos. Caiu num laço repetido ("a gente sempre dá prioridade pra gente...") e perdeu "pras pessoas que participaram da última edição". |

- O conteúdo central veio igual nos quatro, e nenhum erro mudou o sentido.
- O erro do Whisper é do tipo que um leitor não nota: a frase fica gramatical e perde informação. Releia o trecho onde o texto se repete.
- O `SpeechTranscriber` não pediu permissão de privacidade e rodou direto do terminal do app. O primeiro uso de um idioma pode baixar o modelo de idioma da Apple.

## SFSpeechRecognizer

- Chamado de um binário rodado pelo terminal da ferramenta de código, o processo aborta com `SIGABRT` do TCC: "attempted to access privacy-sensitive data without a usage description". O app responsável é o da ferramenta, e o `Info.plist` embutido no binário não conta.
- Dois jeitos funcionam. O primeiro é rodar no painel Terminal do app. O segundo é empacotar o binário num `.app` com `Info.plist` próprio (`CFBundleExecutable`, `CFBundleIdentifier`, `LSUIElement` e `NSSpeechRecognitionUsageDescription`), assinar com `codesign --force --sign - App.app` e lançar com `open -W -n App.app --stdout saida.txt --stderr erro.txt --args audio.wav`.
- Com `requiresOnDeviceRecognition` e resultados parciais, o texto recomeça a cada trecho. O resultado final traz só o último. Concatene os trechos: quando o texto novo fica bem menor que o anterior, guarde o anterior e siga.
- Como não superou o `DictationTranscriber`, só use o `SFSpeechRecognizer` se o `SpeechAnalyzer` não estiver disponível.
