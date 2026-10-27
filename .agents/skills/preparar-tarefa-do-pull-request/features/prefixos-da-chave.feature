# language: pt
Funcionalidade: Prefixo da chave do projeto

  Regra: Vários prefixos limitam a escolha
    Exemplo: A pessoa escolhe entre os prefixos configurados
      Dado que o prefixo da chave do projeto tem PROJ e OUTRO
      Quando a pessoa pede para criar o card sem dizer a chave
      Então o agente mostra só PROJ e OUTRO
      E espera a pessoa escolher
      E não cria a tarefa
