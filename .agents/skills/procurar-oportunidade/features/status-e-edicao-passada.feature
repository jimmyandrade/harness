# language: pt
Funcionalidade: Devolver o status e tratar a edição passada ou de outra data
  Regra: A resposta de "já temos?" traz o status atual de cada edição achada
    Exemplo: Uma edição achada com possível duplicata
      Dado que a lista tem duas páginas que podem ser a edição pedida
      Quando a pessoa pergunta se a oportunidade já existe
      Então a resposta mostra título, data, status atual e link de cada uma
      E não escolhe entre elas

  Regra: Edição com data anterior a hoje pede o que foi aproveitado e o que foi perdido
    Exemplo: Edição passada achada
      Dado que a edição achada tem data anterior a hoje
      Quando a pessoa consulta se ela já existe
      Então a skill pergunta quais foram aproveitadas e quais foram perdidas antes de alterar
      E atualiza o status de cada uma só depois da resposta

  Regra: Outra data do mesmo nome é outra edição
    Exemplo: Pedido com data diferente da página
      Dado que a página existente tem o mesmo nome e outra data
      Quando o pedido se refere a outra data
      Então a edição existente não é atualizada
      E o cadastro da nova segue criar-oportunidade

  Regra: Edições parecidas que a pessoa diz serem diferentes usam Não confundir com
    Exemplo: Mesmo dia, outro organizador
      Dado que duas edições parecem a mesma e a pessoa diz que são diferentes
      Quando a skill orienta
      Então indica a relação Não confundir com por identificar-duplicata e mesclar-registro
