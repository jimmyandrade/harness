# language: pt

Funcionalidade: Gravar o termo só no glossário do harness do negócio

  Regra: O servidor fora do ar não manda o termo para outra fonte

    Exemplo: Servidor vocabulary falha com um banco antigo de vocabulário no Notion
      Dado que o servidor vocabulary não responde
      E que o espaço de trabalho ainda tem um banco antigo de vocabulário no Notion
      Quando a skill grava um termo novo
      Então ela não grava no banco do Notion
      E grava pela linha de comando numa cópia de trabalho do harness do negócio
      E abre o pull request com a mudança
      Mas, sem o repositório na sessão, pede uma sessão que o tenha
