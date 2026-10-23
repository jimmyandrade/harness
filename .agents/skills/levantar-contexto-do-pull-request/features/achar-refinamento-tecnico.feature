# language: pt

Funcionalidade: Achar o refinamento técnico do trabalho de um pull request
  A revisão se baseia no refinamento técnico do trabalho, quando existe, e só pede para registrar um quando nada foi achado.

  Regra: A busca segue a ordem do card, dos cards ligados e dos registros de reunião

    Exemplo: O card tem a ata do refinamento
      Dado que a busca do refinamento técnico está ligada
      E o card do PR tem um comentário com o link da ata do refinamento
      Quando a ficha do PR é montada
      Então a ficha traz o que a ata decidiu e o que ficou em aberto
      E a ficha não busca em cards ligados nem em registros de reunião

    Exemplo: O card não tem a ata, mas um card irmão tem
      Dado que a busca do refinamento técnico está ligada
      E o card do PR não tem ata nem registro de refinamento
      E um card irmão do mesmo pai tem a ata de um refinamento do mesmo tema
      Quando a ficha do PR é montada
      Então a ficha traz o refinamento do card irmão com o endereço dele
      E a ficha não cria registro nenhum

    Exemplo: Nenhum lugar tem refinamento
      Dado que a busca do refinamento técnico está ligada
      E o card, os cards ligados e os registros de reunião não têm refinamento do tema
      Quando a ficha do PR é montada
      Então a ficha diz que não achou refinamento
      E o registro só é proposto ou criado conforme o valor de criar o registro que falta
      E nenhuma decisão é inventada

  Regra: A busca desligada não muda a ficha

    Exemplo: A busca está desligada
      Dado que a busca do refinamento técnico está desligada
      Quando a ficha do PR é montada
      Então a ficha segue só o card, as conversas citadas e os registros de reunião do Passo 4
