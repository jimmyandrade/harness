# language: pt
Funcionalidade: Commits do mesmo tema no mesmo pull request

  Regra: o assunto do commit não abre outro pull request

    Exemplo: dois commits do mesmo tema
      Dado que já existe um pull request aberto para o tema
      E que o trabalho novo é outro commit desse tema
      Quando o commit é criado
      Então ele entra nesse pull request
