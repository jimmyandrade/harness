# language: pt
Funcionalidade: Pedir o login quando o perfil abre com aviso de login
  Como pessoa que depende de uma análise completa
  Quero ser avisada antes da análise quando o canal esconde o conteúdo atrás de um login
  De forma que destaques, legendas e comentários entrem na leitura

  Cenário: O perfil abre com aviso de login
    Dado que o canal abre o perfil com um aviso de login por cima
    Quando a habilidade abre o perfil
    Então a habilidade pede à pessoa que entre na conta antes de começar a análise
    E diz o que o login libera, como destaques, legendas e comentários
    E espera a resposta antes de ler o perfil

  Cenário: A pessoa entra na conta
    Dado que a pessoa entrou na conta depois do pedido
    Quando a habilidade lê o perfil
    Então a análise inclui os destaques, as legendas e os comentários

  Cenário: A pessoa prefere não entrar
    Dado que a pessoa disse que não quer entrar na conta
    Quando a habilidade segue com o que está visível
    Então a resposta lista em Limites da análise o que ficou de fora
    E a habilidade nunca digita a senha da pessoa
