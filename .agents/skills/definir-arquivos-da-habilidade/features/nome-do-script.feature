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
