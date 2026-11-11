# language: pt

Funcionalidade: Acompanhar os retornos pendentes com uma rotina só

  Regra: um assunto novo entra pela etiqueta e pelo registro, nunca por uma rotina nova

    Exemplo: a pessoa envia um e-mail que espera resposta
      Dado que já existe a rotina única de retornos pendentes
      Quando a sessão envia o e-mail
      Então ela etiqueta a conversa como Aguardando retorno
      E acrescenta uma linha ao registro com a sessão que espera
      E não cria outra rotina

  Regra: a resposta volta para a sessão que espera

    Exemplo: o anfitrião responde com a informação que faltava
      Dado que o registro liga a conversa a uma sessão
      Quando a rotina vê a resposta
      Então ela troca a etiqueta para Respondida
      E entrega o resumo à sessão e à pessoa
      E nunca escreve senha nem link no aviso

  Regra: o tempo de resposta ensina o ritmo

    Exemplo: um contato responde em minutos
      Dado que três respostas de um contato vieram em menos de 30 minutos
      Quando a rotina soma o tempo ao histórico
      Então ela sugere uma conferência mais curta para esse contato

  Regra: o aviso que uma tarefa espera atualiza a tarefa, mesmo sem etiqueta

    Exemplo: a fornecedora confirma por e-mail a devolução de um equipamento
      Dado que o registro liga uma tarefa ao aviso de confirmação da devolução
      E que o e-mail da confirmação chegou sem etiqueta
      Quando a rotina do e-mail procura o aviso na caixa toda
      Então ela etiqueta a conversa
      E marca na tarefa só os itens que a mensagem prova
      E avisa a pessoa do que falta
