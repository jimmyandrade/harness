# language: pt
Funcionalidade: Captura de tela de passo a passo

  Regra: a captura só vale com a imagem carregada

    Exemplo: A foto de capa ainda não apareceu
      Dado que a tela tem uma foto que vem de um endereço externo
      Quando a habilidade olha a captura e vê um espaço vazio no lugar da foto
      Então ela espera mais e captura de novo
      E não entrega a imagem em branco

  Regra: o passo sem print exige a tentativa em cada navegador

    Exemplo: O primeiro navegador cai na tela de login
      Dado que um navegador da sessão mostra a tela de login
      Quando a habilidade ainda não tentou o outro navegador
      Então ela abre a tela no outro navegador antes de dizer que não capturou
