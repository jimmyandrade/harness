# language: pt

Funcionalidade: Importar um lote de outra fonte sem sobrescrever uma decisão

  Regra: A linha que guarda uma decisão não é reescrita

    Exemplo: Importar um banco do Notion com um termo já decidido
      Dado que o lote tem o termo "peça" e o vocabulário já guarda uma decisão sobre ele
      Quando a skill grava o lote com o modo fill
      Então a linha de "peça" fica como está
      E a resposta lista "peça" em skipped, com a razão
      E a skill pergunta à pessoa qual vale antes de mudar essa linha

  Regra: A linha que o vocabulário criou sozinho é preenchida

    Exemplo: Preencher o esboço criado por uma alternativa
      Dado que "aplicativo" existe só porque outro termo o citou como alternativa
      Quando a skill grava o lote com o modo fill
      Então "aplicativo" recebe a descrição e os exemplos do lote
