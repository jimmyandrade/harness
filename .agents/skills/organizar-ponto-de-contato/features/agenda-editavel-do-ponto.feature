# language: pt

Funcionalidade: Gravar o ponto de contato na agenda editável
  Criar, recriar, migrar ou revisar o evento usa a agenda com permissão de escrita.

  Regra: A agenda ignorada não é destino

    Exemplo: Criação na agenda principal
      Dado que existe um evento de um ponto de contato
      Quando a skill cria, recria ou revisa esse evento
      Então o destino é a agenda do ponto de contato, de Agendas
      Mas a agenda ignorada não é usada

    Exemplo: Histórico que ainda cita a agenda ignorada
      Dado que existe uma menção a uma agenda ignorada no histórico ou na descrição antiga
      Quando a skill grava o evento do ponto de contato
      Então ela ignora essa agenda como destino
      E mantém o evento na agenda editável atual
      E a descrição registra o escopo Pontos de contato e a página canônica

    Exemplo: O evento em outra agenda editável
      Dado que existe um evento de ponto de contato em outra agenda que a skill consegue editar
      Quando a skill migra esse evento
      Então ela cria o evento na agenda editável atual
      E cancela ou remove o evento antigo

    Exemplo: O evento em agenda sem permissão
      Dado que existe um evento de ponto de contato em uma agenda que a skill não consegue editar
      Quando a skill trata esse evento
      Então ela cria o equivalente na agenda editável disponível
      E avisa que a remoção do duplicado antigo é manual
