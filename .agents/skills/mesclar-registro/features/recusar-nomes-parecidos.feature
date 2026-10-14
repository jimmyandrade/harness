# language: pt
Funcionalidade: Recusar consolidação de nomes parecidos
  Nomes parecidos que não são a mesma entidade não viram um registro só.

  Regra: Consolidação não junta entidades diferentes

    Exemplo: Dois itens com nomes parecidos
      Dado que existem dois itens com nomes parecidos que não são a mesma entidade
      Quando a skill é chamada para consolidar
      Então a skill não consolida um item no outro
      E cada entidade permanece com um registro canônico único
