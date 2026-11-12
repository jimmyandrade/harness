# language: pt

Funcionalidade: Distinguir a oportunidade do ponto de venda
  Oportunidade, inscrição, cronograma, local, data ou custo não provam que houve venda.
  A pessoa confirma o ponto de venda antes de o ponto de contato ser criado ou relacionado.

  Regra: Atividade formativa não gera ponto de contato sozinha

    Exemplo: Curso com despesa e cronograma
      Dado que existe uma oportunidade com aulas, oficinas e despesa de deslocamento
      Quando a skill vai criar ou relacionar um ponto de contato
      Então a skill pergunta se a atividade também foi ponto de venda físico ou digital
      E explica que feira aqui é qualquer ponto de venda, não qualquer evento

    Exemplo: A pessoa confirma que não houve venda
      Dado que a pessoa respondeu que não houve venda
      Quando a skill segue
      Então nenhum ponto de contato é criado nem associado
      E a despesa é orientada a usar a relação geral padrão das despesas

    Exemplo: Resposta ambígua
      Dado que a pessoa não deixou claro se houve venda
      Quando a skill precisa decidir
      Então ela interrompe e pede a confirmação explícita
