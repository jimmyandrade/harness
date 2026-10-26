# language: pt

Funcionalidade: Histórico de medições
  Cada valor de uma métrica vira um registro no histórico de medições, nunca um número na página da entidade medida.

  Regra: Um registro por métrica, entidade, recorte e período de referência

    Exemplo: O valor do período ainda não foi registrado
      Dado que alguém informa o valor de uma métrica de uma entidade num mês
      Quando a habilidade registra o valor
      Então ela cria um registro no histórico de medições
      E preenche a quantidade, o período de referência, a data de registro e a métrica
      E liga o registro à entidade medida

    Exemplo: O período já tem registro
      Dado que o histórico já tem um registro da mesma métrica, entidade, recorte e período
      Quando alguém informa um valor novo para esse período
      Então a habilidade atualiza esse registro em vez de criar outro
      E mostra o valor antigo e o novo

    Exemplo: O valor não traz o período
      Dado que alguém informa um número sem dizer a que data ou período ele se refere
      Quando a habilidade vai registrar o valor
      Então ela pergunta o período de referência antes de gravar

  Regra: A entidade medida não guarda números de métrica

    Exemplo: Alguém pede para guardar o número na página da entidade
      Dado que alguém pede para guardar os ouvintes mensais na página da artista
      Quando a habilidade registra o valor
      Então o número fica só no histórico de medições
      E nenhuma propriedade, observação ou corpo da página da artista recebe o número

  Regra: O recorte geográfico só vem de dado explícito

    Exemplo: O dado traz o recorte por cidade
      Dado que o relatório mostra "Recife: 120, São Paulo: 30, Outros: 15"
      Quando a habilidade registra os valores
      Então ela cria um registro por cidade com o recorte preenchido

    Exemplo: O dado é um total
      Dado que o relatório mostra só o total de alcance de um perfil
      E que o nome do perfil cita uma cidade
      Quando a habilidade registra o valor
      Então ela deixa o recorte geográfico em branco
      E não deduz a cidade pelo nome do perfil, pela praça nem pelo contexto

  Regra: O histórico é a fonte do valor atual do key result

    Exemplo: Um key result usa a métrica
      Dado que um key result está ligado à métrica
      Quando a habilidade registra uma medição nova
      Então ela não digita o valor atual no key result
      E o valor atual sai do histórico de medições
