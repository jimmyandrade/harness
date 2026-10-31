# language: pt

Funcionalidade: Ferramentas de linha de comando desatualizadas
  A ficha mostra as ferramentas que o trabalho usa e que têm versão nova, sem atualizar nada.

  Regra: O aviso de versão nova entra na ficha com o comando de atualizar

    Exemplo: Um comando avisou que há versão nova
      Dado que um comando do `gh` terminou com o aviso de versão nova e o comando de atualizar
      Quando a skill levanta o ambiente
      Então a ficha lista o `gh` com a versão instalada, a nova e o comando de atualizar
      E a skill não roda a atualização

  Regra: O gerenciador de pacotes do sistema é lido, e o que pede cuidado é marcado

    Exemplo: Fórmulas desatualizadas e avisos do diagnóstico
      Dado que o Homebrew lista fórmulas desatualizadas
      E que o diagnóstico dele avisa de uma fórmula obsoleta
      Quando a skill levanta o ambiente
      Então a ficha diz quantas fórmulas estão desatualizadas e destaca as que o trabalho usa
      E lista o aviso da fórmula obsoleta, que pode estar em uso por outro projeto

    Exemplo: A atualização muda o runtime do projeto
      Dado que o projeto exige uma versão do runtime
      E que o gerenciador de pacotes atualizaria o runtime para outra versão principal
      Quando a skill monta a ficha
      Então ela marca essa atualização como de cuidado, com a versão que o projeto exige

  Regra: Depois da atualização, a versão é conferida de novo

    Exemplo: A pessoa pergunta se a atualização deu certo
      Dado que a pessoa rodou o comando de atualizar o `gh`
      Quando ela pergunta se deu certo
      Então a skill lê a versão do `gh` de novo e diz se ela é a nova
      E diz o que o gerenciador de pacotes ainda lista como desatualizado
