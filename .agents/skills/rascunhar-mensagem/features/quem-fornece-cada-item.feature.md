# Funcionalidade: Dizer quem fornece e quem leva cada item

Ao confirmar mobiliário, estrutura ou equipamento, a mensagem diz de cada item quem fornece e quem leva, como a conversa disse.

## Regra: Cada item tem o seu responsável

### Exemplo: A organização fornece a mesa e a marca leva a arara

- Dado que a conversa diz que a organização fornece a mesa e as cadeiras
- E que a conversa diz que a marca leva a arara e o espelho
- Quando a habilidade rascunha a mensagem que confirma a estrutura
- Então o texto diz que a mesa e as cadeiras vêm da organização
- E diz que a arara e o espelho vão com a marca
- E não junta os quatro itens numa lista única

### Exemplo: A conversa não diz quem leva um item

- Dado que a conversa cita uma extensão elétrica sem dizer quem leva
- Quando a habilidade rascunha a mensagem que confirma a estrutura
- Então o texto pergunta quem leva a extensão
- E não afirma que a organização fornece a extensão
