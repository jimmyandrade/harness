# language: pt
Funcionalidade: Pacotes relacionados atualizados juntos

  Regra: o pacote não entra sem os pacotes que andam junto com ele

    Esquema do Cenário: o modo de agrupamento decide se a pessoa é consultada
      Dado que o <bot> abriu um PR de um pacote cuja peer dependency espera atualização à parte
      E que `Agrupar pacotes relacionados` é <modo>
      Quando a habilidade avalia esse PR
      Então o PR para na fila sem merge
      E <resultado>

      Exemplos:
        | bot        | modo       | resultado                                                                 |
        | Renovate   | perguntar  | a pessoa recebe a proposta de grupo em `packageRules`, com `groupName`    |
        | Renovate   | automático | um PR à parte grava o grupo em `packageRules`, com `groupName`            |
        | Dependabot | perguntar  | a pessoa recebe a proposta de grupo em `groups`                           |
        | Dependabot | automático | um PR à parte grava o grupo em `groups`                                   |
