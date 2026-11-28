# language: pt
Funcionalidade: Recriar o produto a partir de duas fotos
  Como pessoa que publica fotos de moda
  Quero o produto isolado recriado das fotos da peça aberta e no manequim
  De forma que a imagem preserve o que a peça tem, sem simplificar nem inventar

  Cenário: O pedido diz qual foto governa cada detalhe
    Dado que a peça aberta e a peça no manequim diferem num detalhe
    Quando o pedido de geração é escrito
    Então ele diz qual foto governa esse detalhe
    E escreve esquerdo e direito com os dois pontos de vista

  Cenário: O plano barra a geração
    Dado que a ferramenta barra a segunda geração
    Quando a geração para
    Então a resposta diz quais peças ficaram sem foto
    E nenhuma peça é gerada só por texto

  Cenário: A revisão conta o que a miniatura esconde
    Dado que há uma imagem recriada fiel à primeira vista
    Quando ela é revisada em tamanho real
    Então botões, bolsos e aplicações são contados e comparados com a referência
    E a imagem fica Precisa revisar até a comparação humana
