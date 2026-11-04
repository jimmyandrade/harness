# language: pt
Funcionalidade: Definir o post-mortem de um incidente
  O post-mortem conta o que aconteceu, quando, por quê, o que resolveu e o que muda no padrão, sem apontar culpados, no destino e no modelo que o negócio usa.

  Regra: O destino vem do parâmetro ou da busca na ferramenta conectada

    Exemplo: Destino no parâmetro
      Dado que "Destino do post-mortem" tem o nome de um banco da ferramenta conectada
      Quando a pessoa pede o post-mortem de um incidente
      Então a skill usa esse banco
      Mas não procura outro destino

    Exemplo: Destino achado pela busca
      Dado que "Destino do post-mortem" está vazio
      E que a ferramenta conectada tem um só banco ou espaço com post-mortems
      Quando a pessoa pede o post-mortem
      Então a skill usa esse destino
      E diz qual achou e como achou

    Exemplo: Mais de um destino possível
      Dado que "Destino do post-mortem" está vazio
      E que a busca acha dois bancos com post-mortems
      Quando a pessoa pede o post-mortem
      Então a skill mostra os dois, com o link de cada um, e pergunta qual usar
      Mas não escreve em nenhum antes da resposta

    Exemplo: Nenhum destino
      Dado que "Destino do post-mortem" está vazio
      E que a busca não acha banco nem espaço com post-mortems
      Quando a pessoa pede o post-mortem
      Então a skill pergunta onde salvar
      Mas não cria banco nem espaço

    Exemplo: Destino do parâmetro fora da ferramenta conectada
      Dado que "Destino do post-mortem" tem um nome que a ferramenta conectada não acha
      Quando a pessoa pede o post-mortem
      Então a skill para e diz que o destino não está na conexão
      Mas não troca por outro banco que a conexão mostrou

  Regra: O modelo vem do parâmetro, da busca ou das seções padrão

    Exemplo: Modelo no parâmetro
      Dado que "Modelo do post-mortem" tem o nome de um modelo da ferramenta conectada
      Quando a skill escreve o post-mortem
      Então o texto segue as seções e as regras desse modelo

    Exemplo: Modelo achado pela busca
      Dado que "Modelo do post-mortem" está vazio
      E que a ferramenta conectada tem um modelo de post-mortem
      Quando a skill escreve o post-mortem
      Então ela segue esse modelo e diz qual usou

    Exemplo: Sem modelo
      Dado que "Modelo do post-mortem" está vazio
      E que a busca não acha modelo de post-mortem
      Quando a skill escreve o post-mortem
      Então ela usa as seções de "Seções do post-mortem"
      E segue o formato dos post-mortems já publicados no destino

  Regra: O texto conta o caso sem caça às bruxas

    Exemplo: Erro de uma pessoa
      Dado que o incidente começou quando uma pessoa perdeu o acesso à própria conta
      Quando a skill escreve a causa raiz
      Então a causa é o processo ou a configuração que deixou o erro acontecer
      Mas o texto não culpa a pessoa

    Exemplo: Medida temporária
      Dado que a administração liberou o acesso com uma exceção que vence numa data
      Quando a skill escreve as ações
      Então a ação de desfazer a exceção entra aberta, com a data em que vence
      E o padrão novo entra no que muda, para o caso não se repetir

    Exemplo: Fato sem fonte
      Dado que a conversa não diz o horário de um passo
      Quando a skill monta a linha do tempo
      Então o passo entra sem horário, na ordem em que aconteceu
      Mas a skill não inventa o horário

  Regra: A publicação pede o sim da pessoa

    Exemplo: Texto pronto
      Dado que o post-mortem está escrito
      Quando a skill vai publicar
      Então ela mostra o título, o destino e o texto
      E publica só depois do sim da pessoa
      E responde com o link da página publicada

    Exemplo: Post-mortem do mesmo incidente já existe
      Dado que o destino já tem um post-mortem do mesmo incidente
      Quando a pessoa pede o post-mortem
      Então a skill mostra o que muda nele e atualiza essa página
      Mas não cria outra
