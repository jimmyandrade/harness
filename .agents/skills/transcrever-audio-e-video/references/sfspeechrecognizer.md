# Rodar o SFSpeechRecognizer

A skill não usa o `SFSpeechRecognizer` por padrão: na medição ele não superou o `DictationTranscriber`, e a ADR 0027 do core guarda a comparação dos quatro motores. Leia este arquivo só quando for preciso rodá-lo.

- Chamado de um binário rodado pelo terminal da ferramenta de código, o processo aborta com `SIGABRT` do TCC: "attempted to access privacy-sensitive data without a usage description". O app responsável é o da ferramenta, e o `Info.plist` embutido no binário não conta.
- Dois jeitos funcionam. O primeiro é rodar no painel Terminal do app. O segundo é empacotar o binário num `.app` com `Info.plist` próprio (`CFBundleExecutable`, `CFBundleIdentifier`, `LSUIElement` e `NSSpeechRecognitionUsageDescription`), assinar com `codesign --force --sign - App.app` e lançar com `open -W -n App.app --stdout saida.txt --stderr erro.txt --args audio.wav`.
- Peça `requiresOnDeviceRecognition = true`. Com resultados parciais, o texto recomeça a cada trecho, e o resultado final traz só o último. Concatene os trechos: quando o texto novo fica bem menor que o anterior, guarde o anterior e siga.
