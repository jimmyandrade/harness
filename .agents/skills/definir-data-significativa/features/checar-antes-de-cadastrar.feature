# language: pt
Funcionalidade: Checar a lista de datas significativas antes de cadastrar
  O cadastro só cria depois da checagem de duplicata.

  Regra: A busca cobre o termo principal e as variações úteis

    Exemplo: Nova data significativa
      Dado que existe a lista de datas significativas
      Quando a skill cadastra uma nova data significativa
      Então ela busca o termo principal no evento
      E busca variações com e sem acento, singular e plural, sigla, nome reduzido como Dia Mundial da Internet e Dia da Internet, e grafia alternativa como Dia do Abraço e Dia do Abraco
      E filtra pela janela de datas quando fizer sentido e compara a data, a categoria e a fonte
