# language: pt
Funcionalidade: Verificar o status do quadro

  Regra: o quadro é lido pelo caminho mais barato disponível

    Exemplo: Há conector do rastreador
      Dado que a pessoa pede para verificar o status do quadro
      E o conector do rastreador está disponível
      Quando a habilidade lê o quadro
      Então ela usa o conector
      E o relato diz o caminho que usou

    Exemplo: Não há ferramenta direta nem conector
      Dado que a pessoa pede para verificar o status do quadro
      E nem a ferramenta direta nem o conector estão disponíveis
      Quando a habilidade lê o quadro
      Então ela lê a página do quadro no navegador onde a pessoa já está conectada
      E o relato diz que usou o navegador

  Regra: a tarefa-mãe é conferida pelas subtarefas

    Exemplo: A busca pela chave da mãe não traz PR
      Dado que a tarefa-mãe aparece no quadro só pela chave
      E a busca pela chave dela não traz PR
      Quando a habilidade monta o relato
      Então ela busca também pelas subtarefas antes de dizer que a mãe não tem PR

    Exemplo: O PR da subtarefa está em outro repositório
      Dado que a tarefa-mãe aparece no quadro só pela chave
      E uma subtarefa dela tem o PR em outro repositório da organização
      Quando a habilidade monta o relato
      Então ela busca na organização inteira
      E liga o PR só depois de ler o corpo e ver que ele cita a tarefa
