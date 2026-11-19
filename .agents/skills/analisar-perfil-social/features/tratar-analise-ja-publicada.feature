# language: pt
Funcionalidade: Tratar a análise que a página do perfil já tem
  Como pessoa que consulta as análises depois
  Quero escolher o que acontece quando o perfil já tem uma análise publicada
  De forma que uma leitura mais rasa não cubra a mais funda nem crie duas análises que se contradizem

  Cenário: Mesclar
    Dado que Quando já existe análise publicada está em mesclar
    E a página do perfil já tem uma análise
    Quando a habilidade publica a análise nova
    Então ela grava uma só análise, com a data nova no título
    E cada sinal mantém o post ou o destaque e a data de onde veio, da análise anterior ou da nova
    E o sinal da anterior só sai quando a evidência nova o contradiz, e a análise diz o que mudou
    E as notas anteriores ficam registradas com a data delas

  Cenário: Leituras com cobertura diferente
    Dado que Quando já existe análise publicada está em mesclar
    E as duas análises divergem na nota
    Quando a habilidade mescla
    Então a nota segue a leitura que cobriu mais do perfil
    E a análise diz o que cada leitura cobriu e por que as notas diferem

  Cenário: Substituir
    Dado que Quando já existe análise publicada está em substituir
    Quando a habilidade publica a análise nova
    Então a análise nova ocupa o lugar da anterior

  Cenário: Nunca substituir
    Dado que Quando já existe análise publicada está em nunca substituir
    Quando a habilidade publica a análise nova
    Então a análise nova entra abaixo da anterior, com a data no título
    E a anterior não muda

  Cenário: Perguntar
    Dado que Quando já existe análise publicada está em perguntar
    Quando a habilidade vai publicar
    Então ela mostra as duas análises e pergunta entre mesclar, substituir e acrescentar abaixo
    E não grava antes da resposta

  Cenário: Automático
    Dado que Quando já existe análise publicada está em automático
    Quando a habilidade vai publicar
    Então ela mescla quando as duas leem o mesmo perfil no mesmo período
    E acrescenta abaixo quando o perfil mudou e a comparação no tempo importa
    E diz na resposta qual das duas escolheu e por quê
