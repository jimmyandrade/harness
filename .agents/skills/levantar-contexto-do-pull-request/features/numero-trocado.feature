# language: pt

Funcionalidade: Achar o item certo quando o número vem com os dígitos trocados
  O número que a pessoa passa pode estar com os dígitos em outra ordem, e a ficha não pode sair de um item de outro assunto.

  Regra: A ficha confere o assunto do item antes de seguir

    Exemplo: O item lido não tem a ver com o assunto
      Dado que a pessoa pediu o contexto do PR 258, que exporta relatórios
      E o PR 258 trata de outro assunto
      Quando a ficha do PR é montada
      Então a ficha busca o PR 285, o 528, o 582, o 825 e o 852 antes de perguntar
      E compara o título e a descrição de cada um com o assunto

    Exemplo: Só uma permutação combina com o assunto
      Dado que a pessoa pediu o contexto do PR 258, que exporta relatórios
      E só o PR 825 trata da exportação de relatórios
      Quando a ficha do PR é montada
      Então a primeira frase diz que o número veio trocado e que o contexto é do PR 825
      E a ficha segue com o PR 825

    Exemplo: Mais de uma permutação combina, ou nenhuma
      Dado que a pessoa pediu o contexto do PR 258, que exporta relatórios
      E mais de uma permutação trata de exportação, ou nenhuma trata
      Quando a ficha do PR é montada
      Então a resposta mostra cada candidata com o título
      E pergunta qual vale
      E a ficha não segue com nenhuma delas
