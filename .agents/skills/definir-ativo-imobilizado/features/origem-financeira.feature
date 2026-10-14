# language: pt

Funcionalidade: Vincular a origem financeira
  O bem durável aponta o lançamento que já existe.

  Regra: A nota não substitui o lançamento

    Exemplo: Máquina comprada com lançamento
      Dado que existe um bem durável e o lançamento dele já está na lista de despesas e investimentos
      Quando a análise vincula a máquina à despesa
      Então a análise liga esse lançamento nos lançamentos de custo e investimento
      Mas não registra o pagamento nesta habilidade

  Regra: A origem fica rastreável ao criar ou atualizar

    Contexto:
      Dado que existe um ativo comprado ou adquirido por despesa ou investimento

    Exemplo: Lançamento correspondente disponível
      Quando a análise cria ou atualiza o ativo
      Então a análise relaciona o item nos lançamentos de custo e investimento
      E preserva valor pago, data de compra, fornecedor e a evidência usada

    Exemplo: Lançamento confiável ausente
      Quando ainda não existe lançamento financeiro confiável
      Então a análise aciona lancar-despesa ou pede os dados mínimos
      Mas não considera a origem resolvida
