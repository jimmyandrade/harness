# language: pt
Funcionalidade: Desambiguar datas significativas parecidas
  Nomes parecidos que não são o mesmo evento ganham um nome que separa.

  Regra: Edição, ano, cidade ou contexto diferente vira registro novo

    Exemplo: Confirmação de que não é o mesmo evento
      Dado que existem itens com nomes parecidos na lista de datas significativas
      Quando a pessoa confirma que não são a mesma coisa
      Então a skill cria o novo registro com um nome que desambigua
      E o nome prefere ano, edição, cidade ou país quando isso separa
      E Dia das Mães 2026 (Brasil) e Dia das Mães 2027 (Brasil) ilustram esse nome
