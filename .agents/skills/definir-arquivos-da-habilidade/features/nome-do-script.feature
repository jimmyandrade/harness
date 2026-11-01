# language: pt

Funcionalidade: Nome e lugar do script
  O nome e o lugar seguem a regra desde a proposta, antes de o arquivo existir.

  Regra: O script proposto na conversa já segue a regra

    Exemplo: Lista de scripts proposta à pessoa
      Dado que a skill está escrita em português
      E que `Idioma do nome dos scripts` usa o padrão
      Quando o agente propõe scripts para a skill numa resposta
      Então cada nome proposto está em inglês, sem acento, na convenção da linguagem

    Exemplo: Script que outra skill também usaria
      Dado que um dos scripts propostos serve a mais de uma skill
      Quando o agente diz onde ele fica
      Então ele propõe a pasta de scripts compartilhados, e não a pasta da skill

  Regra: Comando curto fica listado na skill, sem script

    Exemplo: Comandos curtos de ferramentas prontas
      Dado que os comandos da tarefa são curtos e usam ferramentas que já resolvem, como `gh` e `curl`
      Quando o agente propõe como a skill guarda esses comandos
      Então ele os lista em Scripts disponíveis e não propõe script separado

    Exemplo: Comando longo com lógica
      Dado que um comando é longo e tem lógica que pede teste
      Quando o agente propõe como a skill guarda esse comando
      Então ele propõe um script testado, com o nome no `Idioma do nome dos scripts`
