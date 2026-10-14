# language: pt

Funcionalidade: Hospedagem na viagem
  Cada hospedagem fica ligada à viagem, com o próprio endereço. O cronograma fica com o acontecimento operacional.

  Exemplo: Orientações da hospedagem
    Dado que a pessoa pediu para adicionar as orientações da hospedagem
    Quando a pessoa envia o endereço, o complemento e a orientação
    Então o endereço fica no endereço dessa hospedagem
    E o complemento fica no complemento do endereço
    E quarto, café da manhã e despesa coberta ficam nessa hospedagem

  Exemplo: Informações gerais fora do cronograma
    Dado que a pessoa viajante traz condições de hospedagem, endereço, complemento, despesas cobertas e orientações gerais
    Quando a pessoa pede para registrar a hospedagem
    Então o endereço e o complemento ficam na hospedagem ligada à viagem
    E o cronograma fica só com acontecimentos operacionais

  Exemplo: Mais de uma hospedagem
    Dado que a viagem pode ter mais de uma hospedagem
    Quando a pessoa traz o complemento do endereço
    Então o complemento fica no complemento do endereço
    E cada hospedagem fica ligada à viagem
