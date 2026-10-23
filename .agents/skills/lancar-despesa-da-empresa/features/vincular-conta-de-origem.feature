# language: pt

Funcionalidade: Vincular a conta que pagou uma despesa
  A conta de origem é vinculada pela identificação no comprovante ou pela confirmação do pagamento.

  Exemplo: Dados da conta identificam um único cadastro
    Dado que os dados da conta no comprovante identificam inequivocamente uma conta cadastrada
    Quando a pessoa pede para registrar a despesa identificada
    Então o lançamento fica vinculado à conta identificada
    E não é solicitada confirmação adicional da conta

  Exemplo: Titular e banco não identificam a conta usada
    Dado que o comprovante mostra apenas o nome do titular e a instituição de origem
    E há somente uma conta candidata cadastrada nesse banco
    Quando a pessoa pede para registrar uma despesa com os demais dados obrigatórios sustentados
    Então o gasto é registrado com o vínculo da conta vazio e a pendência informada
    E é perguntado qual conta foi usada, sem presumir conta pessoal ou empresarial

  Exemplo: Confirmação complementa o mesmo pagamento
    Dado que a despesa foi registrada com a conta pendente
    Quando a pessoa confirma qual conta usou nesse pagamento
    Então a conta confirmada é vinculada à mesma despesa sem duplicar o lançamento
    E os comprovantes são preservados sem repetir a pergunta

  Exemplo: Confirmação anterior não determina a conta de outro Pix
    Dado que a pessoa confirmou a conta de um pagamento anterior
    E um novo comprovante do mesmo banco não identifica a conta de origem
    Quando a pessoa pede para registrar o novo pagamento com os demais dados obrigatórios sustentados
    Então o novo gasto é registrado com a conta pendente sem reutilizar automaticamente a confirmação anterior
    E é perguntado qual conta foi usada no novo pagamento
