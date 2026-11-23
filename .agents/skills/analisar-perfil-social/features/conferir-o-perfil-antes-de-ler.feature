# language: pt
Funcionalidade: Conferir o perfil e a leitura antes de concluir
  Como pessoa que decide com base na análise
  Quero que a habilidade confira o perfil, a conta e o que leu antes de concluir
  De forma que um alias, um nome mal lido ou o perfil errado não entrem na análise

  Cenário: O handle da lista não abre
    Dado que o nome que a lista traz para a feira é só um alias
    Quando o perfil não abre no canal
    Então a habilidade procura o perfil oficial citado na página da oportunidade
    E pergunta antes de ler quando não o acha

  Cenário: O perfil é do espaço e não da feira
    Dado que o perfil oficial é a conta do lugar onde a feira acontece
    Quando a habilidade escreve o contexto da análise
    Então ela diz que o perfil é do espaço
    E lista nos sinais vermelhos que nenhum post lido fala da feira

  Cenário: O navegador da pessoa já está logado
    Dado que o navegador da pessoa abre o perfil sem aviso de login
    Quando a habilidade começa a ler
    Então ela não pede o login nem a credencial do gerenciador de senhas
    E diz com qual conta leu

  Cenário: Nome lido numa captura pequena
    Dado que o nome de um perfil ou de uma pessoa aparece ilegível numa captura
    Quando a habilidade escreve a análise
    Então ela escreve que não conseguiu ler o nome
    E não completa o nome por dedução

  Cenário: Documento escaneado
    Dado que a leitura da página não devolve texto de um documento escaneado
    Quando a habilidade precisa dos dados dele
    Então ela lê as páginas como imagem
    E não conta o documento como lido enquanto não o fizer
