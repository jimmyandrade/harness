# language: pt

Funcionalidade: Preço de combustível na estrada
  A pessoa registra o preço visto ou pago num posto da estrada, para depois analisar onde vale parar.

  Exemplo: Posto na contramão
    Dado que o posto fica do outro lado da pista
    Quando a pessoa conta o preço dele
    Então a skill não cria a linha de preço e avisa que ele fica fora da análise

  Exemplo: Abastecimento com a bomba coberta
    Dado que a pessoa abasteceu e o preço unitário da bomba estava coberto
    Quando a skill registra o preço
    Então o preço por litro é o valor pago dividido pelos litros e a pessoa o confirma
    E a despesa é lançada e ligada à linha, à viagem e ao veículo

  Exemplo: Preço visto de passagem
    Dado que a pessoa viu o preço na placa sem parar e sem foto
    Quando a skill registra a leitura
    Então a linha marca que não houve abastecimento nem foto e guarda a hora e o local aproximado

  Exemplo: Nome do posto
    Dado que o comprovante traz o nome e o CNPJ do estabelecimento
    Quando a skill resolve o posto
    Então o cadastro usa o nome e o CNPJ do comprovante e guarda a bandeira à parte
