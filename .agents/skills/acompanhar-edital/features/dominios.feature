# language: pt

Funcionalidade: Domínios onde sai o resultado
  O resultado de uma inscrição sai onde a organização publica, e não só no e-mail.
  A lista de domínios fica nas instruções do projeto, sem gravar no Notion.

  Regra: A lista cobre a organização, a mantenedora, a plataforma e o diário oficial

    Exemplo: Instituição mantida por uma fundação
      Dado que a pessoa se inscreveu num curso de uma instituição cultural pública
      E que a instituição é mantida por uma fundação com outro domínio
      Quando a skill levanta os domínios
      Então a lista traz o domínio da instituição, o da fundação, o da plataforma da inscrição e o do diário oficial do governo que mantém a fundação
      E cada domínio entra em `Domínios por organização`, com a origem dele na resposta

  Regra: Um domínio novo achado na busca aberta entra na lista

    Exemplo: Resultado num domínio que a lista não tinha
      Dado que a busca do nome com o nome da organização, sem `site:`, acha o resultado num domínio fora da lista
      Quando a skill termina a busca
      Então ela propõe acrescentar esse domínio em `Domínios por organização`
