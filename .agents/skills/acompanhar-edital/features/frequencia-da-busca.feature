# language: pt

Funcionalidade: Frequência da busca pela previsão do resultado
  A data anunciada não garante o dia em que o resultado sai.
  A frequência vem do histórico da oportunidade ou, sem ele, de uma heurística com parâmetro.

  Regra: O histórico das edições anteriores dá a janela da busca

    Exemplo: Organização que costuma atrasar
      Dado que as duas edições anteriores do mesmo grupo publicaram o resultado 10 e 20 dias depois da data anunciada
      Quando a pessoa pede para não perder o resultado
      Então a rotina segue `definir-rotina` com uma janela que vai até 20 dias depois da data anunciada
      E a resposta mostra as datas anunciadas e as reais usadas na previsão

  Regra: Sem histórico, a heurística usa `Dias de busca diária antes da data anunciada`

    Exemplo: Sem histórico
      Dado que a oportunidade não tem edição anterior com a data real do resultado
      E que `Dias de busca diária antes da data anunciada` vale 7
      Quando a pessoa pede para não perder o resultado
      Então a busca fica em `Frequência da busca do resultado` até 7 dias antes da data anunciada
      E fica diária em dias úteis a partir daí, até o resultado sair

  Regra: Cada etapa se prorroga sozinha

    Esquema do Cenário: Prorrogações possíveis
      Dado que a rotina vigia a inscrição e o resultado de um edital
      E que a organização publica <prorrogação>
      Quando a busca acha o documento
      Então <efeito>

      Exemplos:
        | prorrogação                                   | efeito                                                      |
        | só a do resultado                             | só a janela do resultado se move                            |
        | só a do prazo de inscrição                    | só a etapa do prazo de inscrição muda, e o resultado fica   |
        | a do prazo de inscrição e a do resultado      | as duas etapas mudam, cada uma com a fonte                  |
        | uma retificação sem mudança de data           | nenhuma etapa muda, e o anexo da retificação entra          |

  Regra: O prazo curto de resposta aperta a busca

    Exemplo: Aceite em 2 dias depois do resultado
      Dado que o edital pede aceite em até 2 dias depois do resultado
      Quando a rotina é criada
      Então a busca na janela roda com intervalo menor que 2 dias, inclusive no fim de semana
      E o prazo de aceite abre a resposta quando o resultado sai

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
