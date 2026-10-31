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

  Regra: Antes de resolver um aviso, a ficha diz o que conferir e o que sai junto

    Exemplo: A remoção levaria junto um runtime de que um projeto depende
      Dado que o diagnóstico aponta uma versão antiga do runtime como obsoleta
      E que o gerenciador removeria junto um runtime instalado só como dependência
      E que um ambiente virtual do projeto aponta para esse runtime
      Quando a skill monta a ficha
      Então ela marca a remoção como de cuidado e nomeia o runtime que sairia junto
      E diz para instalar esse runtime a pedido antes de remover

    Exemplo: Aviso que pede senha de administrador
      Dado que o diagnóstico avisa que os certificados raiz confiam numa autoridade comprometida
      E que a correção pede senha de administrador
      Quando a skill monta a ficha
      Então ela marca o aviso como da pessoa, com o comando e o link que o diagnóstico dá

    Esquema do Cenário: Tap não confiável
      Dado que o diagnóstico aponta um tap não confiável
      E que <instalados> pacote dele está instalado
      Quando a skill monta a ficha
      Então ela sugere <saída>

      Exemplos:
        | instalados | saída                                               |
        | nenhum     | remover o tap                                       |
        | algum      | a pessoa decidir se confia no tap ou troca o pacote |
