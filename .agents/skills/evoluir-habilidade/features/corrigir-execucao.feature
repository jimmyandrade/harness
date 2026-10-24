# language: pt

Funcionalidade: Corrigir a execução pelo feedback
  A skill é um documento vivo.
  Resultado inconsistente, falha de chamada e correção da pessoa mudam a instrução.

  Regra: Falha de execução melhora a instrução

    Exemplo: Resultado inconsistente
      Dado que a mesma tarefa deu um resultado diferente
      Quando a skill é evoluída
      Então a instrução fica mais específica
      E o teste edita a skill nesta conversa

    Exemplo: Falha de chamada
      Dado que uma chamada falhou
      Quando a skill é evoluída
      Então a instrução ganha o tratamento do erro

    Exemplo: Correção da pessoa
      Dado que a pessoa fez uma correção
      Quando a skill é evoluída
      Então a correção entra na instrução
      E a abordagem anterior sai

  Regra: A cópia sincronizada não pede o repositório

    Exemplo: Correção recebida no Notion sem acesso ao repositório
      Dado que a pessoa pediu a evolução de uma skill nomeada pela cópia no Notion
      E o ambiente não tem o repositório nem uma conexão que escreva nele
      Quando a skill é evoluída
      Então a resposta entrega a mudança pronta, com a skill, o passo e o texto novo
      Mas não pede o repositório nem o caminho da skill
