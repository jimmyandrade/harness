# language: pt
Funcionalidade: Publicar a análise na página do perfil social
  Como pessoa que consulta as análises depois
  Quero que cada perfil analisado tenha a análise publicada na própria página
  De forma que a leitura de cada canal fique junto do perfil e não da pessoa

  Cenário: Publicação da análise
    Dado que Publicar a análise no perfil social está em sim
    Quando a análise termina
    Então a habilidade publica a análise no corpo da página do perfil analisado, na lista de perfis sociais
    E dá o link da página na resposta
    E não publica na página da pessoa nem da empresa

  Cenário: Perfil sem página na lista
    Dado que o perfil analisado não tem página na lista de perfis sociais
    Quando a habilidade vai publicar
    Então ela cadastra o perfil antes, seguindo definir-perfil-social
    E publica a análise na página nova

  Cenário: Perfil que já tem análise publicada
    Dado que a página do perfil já tem uma análise anterior
    Quando a habilidade publica a análise nova
    Então ela segue Quando já existe análise publicada

  Cenário: A lista de perfis sociais não está no workspace conectado
    Dado que a lista de perfis sociais não está no workspace conectado
    Quando a análise termina
    Então a resposta entrega a análise sem publicar
    E diz que não publicou e por quê

  Cenário: Publicar a análise no perfil social está em não
    Dado que Publicar a análise no perfil social está em não
    Quando a análise termina
    Então a habilidade entrega a análise só na resposta
