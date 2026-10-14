# language: pt

Funcionalidade: Verificar participação e localidade antes de convidar
  Cada pessoa entra só no compromisso que ela realmente acompanha.

  Regra: Sócio da empresa não entra em todo convite

    Exemplo: Participação individual
      Dado que existem pessoas da empresa que podem dividir compromissos no mesmo período
      Quando a skill cria, revisa, sincroniza ou audita convidados
      Então verifica uma a uma quem participará
      E usa inscrição, oportunidade, o cronograma, viagem, responsabilidade, descrição confirmada e localidade

    Exemplo: Compromisso da empresa
      Dado que existe um compromisso da empresa numa agenda compartilhada
      Quando a oportunidade é formativa
      Então a skill não convida todos os sócios só por isso

    Exemplo: Cidades diferentes
      Dado que existem duas pessoas em cidades ou praças diferentes no mesmo período
      Quando a skill monta os convites
      Então cada pessoa entra só no compromisso compatível com a presença, a participação confirmada ou a responsabilidade
      E o conflito geográfico não duplica o convite

    Exemplo: Missão em outra cidade e compromissos na cidade da empresa
      Dado que uma sócia está na missão em outra cidade
      E outro sócio em compromissos na cidade da empresa
      Quando a skill sincroniza os convidados
      Então a missão permanece com a sócia da missão
      E o outro sócio permanece nos eventos da cidade da empresa que acompanhará

    Exemplo: Convite enviado à pessoa errada
      Dado que existe um convite enviado à pessoa errada
      Quando a pessoa autoriza a remoção
      Então a skill remove essa pessoa
      E informa a correção no resumo da operação

    Exemplo: Participação ambígua
      Dado que a participação individual ainda está ambígua
      Quando falta confirmação para enviar ou remover
      Então a skill pergunta antes de enviar ou remover o convite
