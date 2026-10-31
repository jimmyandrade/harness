# language: pt

Funcionalidade: Organizar o código para mudar num lugar só
  Um valor, uma responsabilidade e uma regra moram num lugar só.

  Regra: O valor repetido vira uma constante

    Exemplo: Endereço repetido em vários arquivos
      Dado que o mesmo endereço aparece escrito em três arquivos
      Quando o código é escrito
      Então o endereço vem de uma constante exportada de um módulo só

  Regra: Cada responsabilidade fica no próprio módulo

    Exemplo: Checagem nova dentro de um módulo de esquema
      Dado que a mudança acrescenta uma checagem de link ao módulo que valida o esquema
      Quando o código é escrito
      Então a checagem fica num módulo próprio, que o esquema importa

  Regra: Checagens que se acumulam se compõem

    Exemplo: Terceira recusa na mesma validação
      Dado que a validação já encadeia duas recusas
      Quando a mudança acrescenta uma terceira
      Então as recusas viram uma lista de funções aplicadas por uma composição
