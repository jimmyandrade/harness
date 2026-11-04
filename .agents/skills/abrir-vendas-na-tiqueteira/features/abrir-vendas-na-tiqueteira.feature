# language: pt

Funcionalidade: Abrir a venda antecipada de um evento na tiqueteira
  A habilidade acha as datas sem venda aberta, duplica o evento-modelo na tiqueteira,
  ajusta os ingressos, publica e grava o link no evento, sempre com o sim da pessoa.

  Regra: A tiqueteira vem do evento

    Exemplo: Evento sem tiqueteira
      Dado que o evento está com o campo de tiqueteira vazio
      Quando a pessoa pede para abrir as vendas dele
      Então a habilidade pede para preencher a tiqueteira do evento
      E sugere a tiqueteira padrão sem gravá-la sozinha

  Regra: As datas sem venda aberta vêm em ordem de urgência

    Exemplo: Duas datas sem evento na tiqueteira
      Dado que duas datas pedem venda aberta e não têm evento na tiqueteira
      E que uma delas já passou da antecedência da campanha do produto
      Quando a pessoa pergunta quais datas estão sem venda aberta
      Então a habilidade lista as duas, com a atrasada primeiro

    Exemplo: Produto sem antecedência
      Dado que o produto do evento não tem a antecedência da campanha preenchida
      Quando a habilidade lista as datas sem venda aberta
      Então ela lista o evento sem ordenar
      E diz o que falta no produto

  Regra: O evento novo parte do evento-modelo

    Exemplo: Duplicação com a edição anterior
      Dado que existe uma edição anterior do mesmo produto no mesmo local
      Quando a habilidade monta o plano do evento novo
      Então ela propõe duplicar essa edição, com data, nome, casa e descrição novos
      E mantém o evento privado até a publicação aprovada

  Regra: Os lotes seguem a edição anterior e a virada de lote

    Exemplo: Lotes em sequência
      Dado que o evento-modelo tem lotes em sequência e cortesias
      Quando a habilidade confere os ingressos do evento novo
      Então só o primeiro lote abre pela data
      E cada lote seguinte vira só a partir do anterior
      Mas as cortesias ficam fora da virada

    Exemplo: Lotes no banco de lotes
      Dado que os ingressos do evento novo foram aprovados
      Quando a habilidade registra os lotes do evento
      Então ela segue a habilidade de lote de ingresso para o banco de lotes

  Regra: A publicação só conta com o link no evento

    Exemplo: Evento publicado
      Dado que a pessoa aprovou cada item do plano
      Quando a habilidade publica o evento na tiqueteira
      Então ela abre o link público e confere a data e os lotes
      E grava o link e o status de vendas abertas no evento
