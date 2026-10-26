# language: pt
Funcionalidade: Quem publica e canal do comunicado

  Regra: as opções vêm das instruções do projeto

    Exemplo: o projeto não define quem publica nem o canal
      Dado que as instruções do projeto não definem quem publica nem o canal do comunicado
      Quando a habilidade pergunta quem publica o comunicado
      Então nenhuma opção sugere um canal que as instruções do projeto não citam
      E a opção de não comunicar vem por último

    Exemplo: o projeto define quem publica e o canal
      Dado que as instruções do projeto definem quem publica e o canal do comunicado
      Quando um pull request com novidade é mesclado
      Então o comunicado sai na voz de quem publica, sem perguntar
      E a entrega segue a formatação desse canal
