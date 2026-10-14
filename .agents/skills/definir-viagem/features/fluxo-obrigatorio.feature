# language: pt

Funcionalidade: Fluxo obrigatório da viagem
  A pessoa registra a viagem pela rota, pelas datas e pelos marcos, sem abrir outra viagem nem outro marco igual.

  Exemplo: Correspondência e marcos
    Dado que a pessoa traz origem, destino, data de ida, data de volta, marcos e uma despesa que já existe
    Quando a pessoa pede para registrar a viagem
    Então a busca casa rota e datas iguais ou sobrepostas, com BH e Belo Horizonte como a mesma origem
    E a correspondência atualiza a viagem, e a ausência segura cria uma só com dados confirmados
    E o marco com a mesma viagem, nome, etapa e data, e com hora vazia ou igual, é atualizado
