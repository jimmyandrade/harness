# language: pt

Funcionalidade: Tratar contestação, desfecho e prazos da inscrição
  O andamento da inscrição fica no status dela, e o prazo que falta nunca é inventado.

  Regra: A contestação fica na inscrição

    Exemplo: Recusa contestada
      Dado que a oportunidade está como não selecionada
      Quando a pessoa contesta a recusa
      Então a skill põe a inscrição em contestação, ou propõe criar a opção se a lista não a tem
      E mantém a oportunidade como não selecionada até a organização reverter ou confirmar

  Regra: O desfecho distingue perdida de não selecionada

    Exemplo: Prazo perdido
      Dado que a inscrição não foi concluída porque o prazo acabou
      Quando a pessoa pede para encerrá-la
      Então a skill grava o status de perdida

    Exemplo: Lista de espera
      Dado que a inscrição foi enviada e a candidata ficou na lista de espera
      Quando a pessoa pede para encerrá-la
      Então a skill grava o status de não selecionada

  Regra: O prazo é separado e nunca inventado

    Exemplo: Prazo relativo
      Dado que a regra diz "até 2 dias após a confirmação"
      Quando a pessoa pergunta se a participação está segura
      Então a skill sinaliza que falta o prazo de confirmação
      E sugere perguntar à organização
      E não inventa a data

  Regra: O formulário colado vira o corpo da inscrição

    Exemplo: Formulário colado sem inscrição
      Dado que a oportunidade existe e não tem inscrição
      Quando a pessoa cola o texto do formulário
      Então a skill cria a inscrição em andamento com o formulário no corpo dela
      E não escreve o formulário no corpo da oportunidade
