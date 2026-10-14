# language: pt

Funcionalidade: Planejar o lançamento de trás para frente
  A pessoa responsável pela entrega, pelo produto, pela apresentação ou pelo lançamento escolhe a data marco.
  Criação, produção, comunicação, comercialização e logística acontecem no tempo certo.

  Regra: Os compromissos voltam da data marco

    Exemplo: Lançamento com os tempos nomeados
      Dado que existe uma data marco escolhida para a entrega, o produto, a apresentação ou o lançamento
      E o tempo que a pessoa ou a fonte nomeou para cada etapa
      Quando a agenda reversa é montada
      Então criação, produção, comunicação, comercialização e logística voltam dessa data
      E cada etapa fica no Google Agenda nesse tempo

    Exemplo: A etapa sem tempo
      Dado que existe uma data marco de lançamento
      E uma etapa sem o tempo nomeado
      Quando a agenda reversa é montada
      Então a skill pede esse tempo
      Mas ela não inventa a antecedência

    Exemplo: Margem para revisão e imprevistos
      Dado que existe uma data final e as dependências do lançamento
      E a margem para revisão e imprevistos que a pessoa ou a fonte nomeou
      Quando a agenda reversa é montada
      Então as dependências voltam dessa data com essa margem
      Mas a skill não inventa a folga

    Exemplo: Margem ausente
      Dado que existe uma data final sem a margem para revisão e imprevistos
      Quando a agenda reversa é montada
      Então a skill pede essa margem
      Mas ela não inventa a folga nem a antecedência

    Exemplo: Resposta da agenda reversa
      Dado que a data marco, as etapas, as dependências, a margem, o custo previsto e o critério de conclusão foram nomeados
      E o fuso do marco
      Quando a agenda reversa é respondida
      Então a resposta traz esses seis itens, o resumo curto e o fuso
      Mas ela não inventa o custo nem o critério de conclusão
