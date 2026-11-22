# language: pt

Funcionalidade: Cadastrar o termo em etapas
  A skill monta o plano e entrega cada etapa para a habilidade dela.

  Regra: O idioma é o da comunicação inteira

    Esquema do Cenário: Idioma da linha
      Dado que a comunicação "<comunicação>" traz o termo "<termo>"
      Quando a skill monta o plano
      Então o idioma do plano é "<idioma>"

      Exemplos:
        | comunicação                        | termo           | idioma |
        | e-mail inteiro em inglês           | kind regards    | en     |
        | mensagem em português              | header          | pt-BR  |

  Regra: A escrita só vem depois da classificação e da validação

    Exemplo: Plano com campo inválido
      Dado que o plano tem um termo com categoria fora do mapa
      Quando a validação falha
      Então a skill corrige o plano e valida de novo
      E não chama a gravação

  Regra: Um par antes e depois vira dois termos

    Exemplo: Frase que sai e frase que entra
      Dado que a comunicação em português traz o antes "Se faltar algo, reabre." e o depois "Vc pode reabrir essa conversa se eu tiver deixado alguma coisa pra trás"
      Quando a skill monta o plano
      Então o antes fica proibido e a substituição é o depois
      E o depois fica permitido no mesmo lote

  Regra: Nome de pessoa ou de empresa não entra no vocabulário

    Exemplo: Trecho do nome de uma empresa pedido como apelido
      Dado que "Brisa" é parte do nome de uma empresa na lista de empresas
      Quando a pessoa pede para cadastrar "Brisa" como apelido
      Então o termo sai do plano
      E a desambiguação vai para o cadastro da empresa por definir-empresa

    Exemplo: Termo que pode ser nome e não aparece nas listas
      Dado que a busca nas listas de pessoas e de empresas não acha o termo
      E o termo pode ser um nome
      Quando a skill monta o plano
      Então pergunta se o termo é nome antes de gravar
