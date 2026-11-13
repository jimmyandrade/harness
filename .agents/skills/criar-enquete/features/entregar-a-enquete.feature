# language: pt
Funcionalidade: Entregar a enquete
  A skill entrega a enquete pronta e deixa a escrita, o registro e o envio para quem cuida deles.

  Regra: A entrega traz o que descobre e a decisão que apoia

    Exemplo: Enquete de cidade para uma comunidade de WhatsApp
      Dado que a pessoa quer saber de qual cidade a comunidade é
      Quando a skill entrega a enquete
      Então a entrega tem objetivo, ideia usada, canal, pergunta, opções, justificativa e decisão apoiada
      E as opções de cidade vêm da lista de localidades
      E "outra cidade" é uma opção válida

  Regra: Canal e praça ausentes usam o padrão

    Exemplo: Sem canal nem praça no pedido
      Dado que o pedido não diz o canal nem a praça
      Quando a skill sugere a enquete
      Então ela aplica o canal padrão e todas as praças
      E diz os valores que assumiu

  Regra: Não repete pergunta recente

    Exemplo: Pergunta repetida
      Dado que a pergunta foi feita há pouco tempo
      Quando a skill sugere a enquete
      Então ela troca a pergunta ou espaça a repetição
      E, se for para comparar ao longo do tempo, diz que é escolha de medição

  Regra: A escrita e o envio ficam com outras skills

    Exemplo: Escrever a pergunta final
      Dado que a ideia e as opções estão definidas
      Quando a skill precisa da pergunta final no tom do negócio
      Então ela chama redigir-com-tom-de-voz

    Exemplo: Enviar no WhatsApp
      Dado que a enquete está pronta
      Quando a pessoa quer publicá-la no WhatsApp
      Então a skill entrega só a pergunta e as opções
      E o envio segue conversar-no-whatsapp e só com o sim da pessoa
