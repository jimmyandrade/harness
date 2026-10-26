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

  Regra: o grupo vai só para as ferramentas que o repositório usa

    Exemplo: o repositório só tem a configuração do Dependabot
      Dado que `Ferramentas de atualização de dependências` é automático
      E que o repositório tem só o arquivo `.github/dependabot.yml`
      Quando a habilidade agrupa um pacote com a peer dependency dele
      Então o grupo fica em `groups` no `.github/dependabot.yml`
      E nenhuma configuração do Renovate é criada
