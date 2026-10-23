# language: pt

Funcionalidade: Registrar a despesa empresarial de uma compra mista
  A parcela pessoal do comprovante não entra na despesa da viagem.

  Exemplo: Comprovante único e nome transcrito no comando
    Dado que a pessoa anexou um comprovante com itens da viagem e um item pessoal de pessoa sócia
    E confirmou o cadastro da pessoa cujo nome foi transcrito no comando ditado
    Quando pede para registrar a despesa da viagem sem o item pessoal
    Então o lançamento considera apenas os itens da viagem pelos valores líquidos do comprovante
    E a observação da exclusão usa o nome canônico do cadastro confirmado
