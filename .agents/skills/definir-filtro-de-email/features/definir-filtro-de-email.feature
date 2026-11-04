# language: pt
Funcionalidade: Definir filtros de e-mail sem esconder o que a pessoa quer ver
  Regra: Remetente que anuncia evento ou oportunidade fica na entrada
    Exemplo: Marca de cores que anuncia workshops
      Dado que o remetente manda newsletter e também convites para workshops e eventos
      Quando o filtro dele é criado ou editado
      Então o filtro aplica a etiqueta sem pular a entrada
      E a pessoa continua vendo os convites na entrada

  Regra: O remetente novo não apaga o antigo
    Exemplo: Remetente que mudou de domínio
      Dado que o filtro procura o endereço antigo do remetente
      E que as mensagens novas chegam de outro domínio
      Quando o filtro é ajustado
      Então o critério une o endereço antigo e o domínio novo com OR
      E as ações do filtro continuam as mesmas

  Regra: Pouco volume não exclui o filtro
    Exemplo: Filtro que ainda não pegou nenhuma mensagem
      Dado que o filtro de um remetente não atinge nenhuma conversa da caixa
      Quando a triagem revisa os filtros existentes
      Então o filtro é mantido
      E a resposta não propõe excluí-lo por causa do volume
