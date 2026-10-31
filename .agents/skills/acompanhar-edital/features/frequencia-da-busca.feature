# language: pt

Funcionalidade: Frequência da busca pela previsão do resultado
  A data anunciada não garante o dia em que o resultado sai.
  A frequência vem do histórico da organização ou, sem ele, do bom senso, e a página que muda pouco é vigiada por diff.

  Regra: O histórico das edições anteriores dá a janela da busca

    Exemplo: Organização que costuma atrasar
      Dado que as duas edições anteriores publicaram o resultado 10 e 20 dias depois da data anunciada
      Quando a pessoa pede para não perder o resultado
      Então a rotina segue `definir-rotina` com uma janela que vai até 20 dias depois da data anunciada
      E a resposta mostra as datas anunciadas e as reais usadas na previsão

    Exemplo: Sem histórico
      Dado que a organização não tem edição anterior com a data real do resultado
      Quando a pessoa pede para não perder o resultado
      Então a busca fica em `Frequência da busca do resultado` até a semana anterior à data anunciada
      E fica diária em dias úteis a partir daí, até o resultado sair

  Regra: A prorrogação move a janela

    Exemplo: Prorrogação da publicação do resultado
      Dado que a rotina vigia o resultado de um edital
      E que a organização publica uma prorrogação da data do resultado
      Quando a busca acha a prorrogação
      Então a janela passa a partir da data nova
      E a etapa do resultado é atualizada com a data antiga, a nova e o link da prorrogação

  Regra: A data real do resultado vira histórico

    Exemplo: Resultado achado depois da data anunciada
      Dado que o banco de etapas tem a publicação do resultado da edição
      Quando a skill acha o resultado publicado
      Então ela grava a data real da publicação junto da etapa, sem apagar a data anunciada

  Regra: Onde o ambiente permite, a página vigiada por diff dispensa a releitura

    Exemplo: Página de resultados conhecida
      Dado que a página de resultados do edital é conhecida
      E que o ambiente tem um monitor que compara a página com a última versão guardada
      Quando a rotina é criada
      Então ela dispara pela mudança da página e lê só o trecho que mudou
