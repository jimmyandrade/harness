# language: pt

Funcionalidade: Identificar a despesa pessoal antes de registrar

  Regra: A confirmação da natureza do gasto não identifica a compra

    Exemplo: Comprovante sem produto nem finalidade
      Dado que há um comprovante com recebedor, valor e data, mas sem produto nem finalidade
      Quando a pessoa pede para lançar como despesa pessoal
      Então o agente pergunta o que foi pago, para qual finalidade e os dados necessários à categorização que ainda faltam
      E aguarda as respostas sem gravar a despesa

    Exemplo: Resposta identifica o produto e sua finalidade
      Dado que o agente perguntou o que foi pago e há um lançamento prematuro com o comprovante
      Quando a pessoa responde que o pagamento é da moldura da placa nova dianteira do carro para prevenir que ela se solte
      Então o agente corrige o mesmo lançamento com o produto e a finalidade informados
      E preserva o comprovante sem criar outra despesa
