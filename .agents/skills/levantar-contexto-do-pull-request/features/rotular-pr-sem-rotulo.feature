# language: pt

Funcionalidade: Rotular o pull request sem rótulo antes de propor o merge
  Um PR colado sem rótulo recebe um rótulo aplicado ou sugerido antes de qualquer proposta de merge.

  Regra: O rótulo vem antes da proposta de merge

    Exemplo: Um rótulo do repositório serve
      Dado que a pessoa colou o link de um PR aberto sem rótulo
      E o repositório tem um rótulo que descreve a mudança
      Quando a ficha do PR é montada
      Então o PR recebe esse rótulo e a resposta diz qual
      E a proposta de merge vem depois do rótulo

    Exemplo: Nenhum rótulo do repositório serve
      Dado que a pessoa colou o link de um PR aberto sem rótulo
      E nenhum rótulo do repositório descreve a mudança
      Quando a ficha do PR é montada
      Então a resposta sugere um rótulo e pergunta qual usar
      E a proposta de merge espera a resposta

    Exemplo: O PR já tem rótulo
      Dado que a pessoa colou o link de um PR aberto com rótulo
      Quando a ficha do PR é montada
      Então o rótulo do PR continua o mesmo
