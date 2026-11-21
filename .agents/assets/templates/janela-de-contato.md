---
name: janela-de-contato
description: Formato da conferência da janela de contato de uma pessoa antes de enviar mensagem, e-mail ou convite, com o registro lido, a hora no fuso dela, a decisão e o próximo horário permitido.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo antes de qualquer mensagem, e-mail ou convite a uma pessoa, e de novo na hora do envio de um rascunho ou agendamento. As habilidades que contatam uma pessoa leem este modelo quando conferem a janela.

A janela é o que o registro da pessoa diz sobre quando ela não é contatada. As três propriedades da lista de pessoas vêm dos parâmetros `Propriedade dos dias sem contato`, `Propriedade do horário sem contato a partir de` e `Propriedade do horário sem contato até`. Parâmetro vazio, ou propriedade vazia no registro, não impõe regra: siga com o envio e não gere o bloco.

Como conferir:

1. Leia as propriedades no registro da pessoa, nunca de memória nem das observações. Em grupo, leia o registro de cada pessoa que o texto nomeia ou convida.
2. O fuso é o da localidade da pessoa. Sem localidade que o defina, e com janela preenchida, não envie e pergunte o fuso uma vez.
3. Leia o dia e a hora de agora no fuso dela por comando, como `TZ=<fuso> date '+%Y-%m-%d %H:%M'`, e calcule o dia da semana como a regra do dia da semana manda. Nunca de cabeça.
4. O contato é bloqueado quando o dia da semana está nos dias sem contato, ou a hora é igual ou depois do início, ou a hora é anterior ao fim. O início bloqueia da hora dita até a meia-noite, e o fim bloqueia da meia-noite até a hora dita, que já é permitida.
5. O próximo horário permitido é o primeiro instante depois de agora que nenhuma das três regras bloqueia. Pule cada dia sem contato e calcule cada dia da semana por comando.

Fora da janela, nada é enviado, em nenhum canal, nem por pedido de pressa. A janela só muda no registro, pela habilidade que o atualiza. Dentro dela, a conferência não gera o bloco.

## Formato

### Janela de contato — <nome da pessoa>

- **Registro:** <dias sem contato, início e fim, como estão no registro>
- **Agora:** <dia da semana, data e hora no fuso da pessoa, com o fuso>
- **Decisão:** <fora da janela, não enviei>
- **Motivo:** <a regra que bloqueia, como "terça-feira é dia sem contato" ou "são 19h40 e o contato para às 19h">
- **Próximo horário permitido:** <dia da semana, data e hora no fuso da pessoa, e no fuso de quem usa a habilidade quando diferem>
- **O que ficou:** <o rascunho ou o agendamento para esse horário, ou "nada foi enviado">

## Estilo

Uma linha por item, sem justificar a regra além do motivo. A pessoa que usa a habilidade lê o bloco e decide se muda o registro. Não cite a janela a quem recebe a mensagem.
