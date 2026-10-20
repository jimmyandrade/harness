# language: pt

Funcionalidade: Registrar a despesa reconhecida em uma evidência
  Uma evidência de gasto segue para a busca e o lançamento sem duplicidade.

  Regra: Procurar antes de lançar

    Exemplo: O gasto já está lançado
      Dado que o gasto da evidência já tem um lançamento
      Quando a habilidade procura a despesa
      Então a resposta aponta o lançamento existente
      Mas não cria outra despesa da mesma compra

  Regra: Registrar o gasto da empresa que ainda não existe

    Exemplo: O usuário confirma a despesa
      Dado que o gasto da evidência tem produto, finalidade, dados de classificação, valor e data e ainda não tem lançamento
      E o usuário confirmou que é despesa da empresa
      Quando a habilidade processa a evidência
      Então a despesa é registrada nesta execução

    Exemplo: A despesa é inferível pelo contexto
      Dado que o gasto da evidência tem produto, finalidade, dados de classificação, valor e data e ainda não tem lançamento
      E o contexto permite inferir que é despesa da empresa
      Quando a habilidade processa a evidência
      Então a despesa é registrada sem exigir um pedido escrito de lançamento

  Regra: Encaminhar a empresa recebedora que ainda não está cadastrada

    Exemplo: O comprovante identifica a empresa ausente do cadastro
      Dado que uma despesa já salva tem comprovante com nome e CNPJ da empresa recebedora
      E a busca não encontrou empresa equivalente e o cadastro é permitido
      Quando a habilidade complementa a despesa
      Então a empresa é cadastrada com os dados comprovados e vinculada à mesma despesa
      Mas não é criado outro lançamento para o mesmo pagamento

    Exemplo: O cadastro da recebedora precisa de esclarecimento
      Dado que a empresa recebedora ainda não está cadastrada
      E a evidência não permite identificá-la com segurança
      Quando a habilidade encaminha o cadastro da recebedora
      Então a resposta propõe o cadastro e pergunta somente o dado necessário
      Mas não encerra apenas informando um vínculo pendente nem cria uma empresa por suposição
