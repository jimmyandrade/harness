# language: pt

Funcionalidade: Cadastro a partir do print da grafia
  O print que mostra a grafia de uma pessoa ou de um perfil entra no cadastro quando ainda não existe.

  Exemplo: Ana Exemplo no Instagram
    Dado que o print do perfil anaexemplo.oficial traz o nome Ana Exemplo
    E a pessoa ainda está fora da lista de pessoas
    E o perfil ainda está fora de Perfis sociais
    Quando a pessoa cola o print para mostrar a grafia
    Então a pessoa e o perfil entram no cadastro
