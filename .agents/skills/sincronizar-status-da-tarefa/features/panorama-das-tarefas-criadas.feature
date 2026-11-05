# language: pt
Funcionalidade: Panorama das tarefas que a pessoa criou

  Regra: o panorama só lê

    Exemplo: A pessoa pede o panorama
      Dado que a pessoa pede o panorama do que criou
      Quando a habilidade monta o relato
      Então cada tarefa aparece no bloco da sua situação com a chave, o link e o link do PR
      E nenhuma ligação é gravada
      E nenhum status muda

    Exemplo: A tarefa aberta tem o PR já mesclado
      Dado que a tarefa está aberta
      E o PR que a cita já foi mesclado
      Quando a habilidade monta o relato
      Então a tarefa vai para o bloco de aberta com PR mesclado
      E a tarefa continua aberta

  Regra: a ausência de PR é conferida pela chave

    Exemplo: A consulta não traz PR
      Dado que a consulta não traz PR para a tarefa
      Quando a habilidade monta o relato
      Então a habilidade busca pela chave da tarefa antes de dizer que não tem PR

  Regra: o panorama de um status agrupa pelo que cada um faz

    Esquema do Cenário: Tarefa em revisão cai no bloco certo
      Dado que a tarefa <chave> está em revisão e seu PR está <estado do PR>
      Quando a pessoa pede o panorama das tarefas em revisão
      Então a tarefa <chave> aparece no bloco <bloco>
      E nenhum status muda sem a confirmação da pessoa

      Exemplos:
        | chave | estado do PR                    | bloco                                |
        | ABC-1 | aprovado e ainda aberto         | Você faz agora                       |
        | ABC-2 | pronto, aguardando a revisão    | Esperando revisão de outras pessoas  |
        | ABC-4 | em rascunho                     | Você faz agora                       |

    Exemplo: O status não bate com o PR
      Dado que a tarefa ABC-3 está concluída
      E o PR dela segue aberto
      Quando a pessoa pede o panorama das tarefas em revisão
      Então a tarefa ABC-3 aparece no bloco Eu faço como correção sugerida
      E a correção só se aplica depois do sim da pessoa
