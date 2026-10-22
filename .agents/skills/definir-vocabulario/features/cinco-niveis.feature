# language: pt

Funcionalidade: Cadastrar o termo num dos cinco níveis
  O nível vai de proibido a permitido, e o campo que falta não barra a migração.

  Regra: Cada nível guarda os próprios campos

    Esquema do Cenário: Termo sem um campo esperado
      Dado que a pessoa cadastra um termo "<nível>" sem "<campo>"
      Quando a skill grava o lote
      Então o termo entra no vocabulário
      E a resposta lista o termo em incomplete, com "<campo>"

      Exemplos:
        | nível     | campo        |
        | allowed   | description  |
        | allowed   | reason       |
        | forbidden | substitution |

  Regra: Categoria do projeto vira palavra em inglês

    Exemplo: Categoria mapeada nas instruções do projeto
      Dado que as instruções do projeto mapeiam uma categoria para slang
      Quando a pessoa cadastra um termo com essa categoria
      Então o termo grava slang em categories
      E a categoria não vira tag
