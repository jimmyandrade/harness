# language: pt

Funcionalidade: Domínios onde sai o resultado
  O resultado de uma inscrição sai onde a organização publica, e não só no e-mail.
  A oportunidade é a fonte principal dos domínios, e `Domínios monitorados` só completa a busca.

  Regra: A oportunidade dá os domínios primeiro

    Exemplo: Edição com links e mapa de oportunidades
      Dado que a edição tem o link do edital e o do formulário
      E que o grupo dela tem o site oficial e a página no mapa de oportunidades
      Quando a skill levanta os domínios
      Então a lista começa pelos domínios desses links, com a origem de cada um

  Regra: A lista cobre também quem mantém a organização

    Exemplo: Instituição mantida por uma fundação
      Dado que a organização que fornece a oportunidade é mantida por uma fundação com outro domínio
      Quando a skill completa a lista
      Então ela acrescenta o domínio da fundação, o da plataforma da inscrição e o do diário oficial do governo que mantém a fundação

  Regra: `Uso dos domínios monitorados` decide o peso de `Domínios monitorados`

    Esquema do Cenário: Domínios monitorados e a oportunidade
      Dado que `Domínios monitorados` tem domínios
      E que `Uso dos domínios monitorados` está em `<uso>`
      Quando a skill busca o resultado
      Então <comportamento>

      Exemplos:
        | uso         | comportamento                                                          |
        | prioridade  | ela busca neles primeiro e depois nos da oportunidade e na web aberta  |
        | alternativa | ela só busca neles quando a oportunidade não dá domínio                |
        | exclusivo   | ela busca só neles                                                     |

  Regra: Um domínio novo segue `Ao achar um domínio novo`

    Esquema do Cenário: Resultado num domínio fora da lista
      Dado que a busca aberta acha o resultado num domínio que não está na lista
      E que a `Árvore de decisão dos domínios` não decide esse domínio
      E que `Ao achar um domínio novo` está em `<modo>`
      Quando a skill termina a busca
      Então <comportamento>

      Exemplos:
        | modo       | comportamento                                                                 |
        | perguntar  | ela pergunta se o domínio entra em `Domínios monitorados`                     |
        | automático | ela decide se o domínio entra e diz por que incluiu ou não                    |
