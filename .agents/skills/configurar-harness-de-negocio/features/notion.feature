# language: pt

Funcionalidade: Sincronização com o Notion
  A pessoa faz cada clique, e a skill confere cada tela pelo print.

  Regra: Cada print é conferido antes do próximo passo

    Exemplo: Opção de e-mail marcada por padrão
      Dado que o print das funções da conexão mostra a leitura de informações dos usuários com e-mail
      Quando a skill confere o print
      Então ela pede para marcar sem informações dos usuários antes de seguir

    Exemplo: Banco de habilidades e não a página que o contém
      Dado que a busca do acesso a conteúdo mostra um resultado com ícone personalizado
      Quando a skill confere o print
      Então ela pede para confirmar que o resultado é o banco, com as propriedades em colunas

    Exemplo: Lista agrupada pelo espaço de equipe
      Dado que a aba de acesso a conteúdo mostra um espaço de equipe com uma página
      Quando a skill confere o print
      Então ela pede para expandir tudo e conferir que só o banco de habilidades aparece

  Regra: A tela que mudou volta ao runbook

    Exemplo: Caminho novo no Notion
      Dado que a tela que a pessoa mostra difere da que o runbook descreve
      Quando a configuração termina
      Então a skill propõe um pull request no runbook com o caminho novo e os prints sem dado pessoal
