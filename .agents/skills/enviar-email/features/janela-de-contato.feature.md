# Funcionalidade: Respeitar a janela de contato antes de enviar o e-mail

## Regra: O e-mail só sai dentro da janela de quem o recebe

### Exemplo: Destinatária em dia sem contato

- Dado que o registro da destinatária principal tem a segunda-feira nos dias sem contato
- E que hoje, no fuso dela, é segunda-feira
- Quando a pessoa dá o sim ao rascunho
- Então o e-mail não é enviado
- E a resposta diz o motivo e o próximo horário permitido
- E o rascunho fica na caixa para esse horário, e o envio só é agendado se a pessoa decidir

### Exemplo: Cópia fora da janela

- Dado que uma pessoa em cópia tem janela, e a destinatária principal não
- Quando o horário está fora da janela da pessoa em cópia
- Então o e-mail não sai, e a resposta diz de quem é a janela
