# language: pt
Funcionalidade: Achar o canvas e o playbook antes de prospectar
  Sem o modelo de negócio e o perfil das oportunidades, a prospecção não tem com o que comparar.

  Regra: O que não está nos parâmetros é procurado no workspace

    Exemplo: O workspace tem uma página que faz o papel do canvas
      Dado que o parâmetro Business Model Canvas está vazio
      E que o workspace conectado tem uma página com o modelo de negócio
      Quando a skill lê o canvas e o playbook
      Então a skill sugere a página achada, com o link, e só a usa com o sim da pessoa

    Exemplo: O workspace não tem nada
      Dado que o parâmetro Playbook de oportunidades está vazio
      E que o workspace conectado não tem página que faça esse papel
      Quando a skill lê o canvas e o playbook
      Então a skill propõe criar a página e entrevistar a pessoa
      E grava a página só com o sim da pessoa

  Regra: Sem as duas páginas, não há prospecção

    Exemplo: Rotina agendada sem canvas
      Dado que a skill roda por uma rotina, sem ninguém para entrevistar
      E que o canvas não está nos parâmetros nem no workspace
      Quando a skill lê o canvas e o playbook
      Então a skill não prospecta e deixa a falta no resumo
