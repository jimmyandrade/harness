# language: pt
Funcionalidade: Verificar se existe Não confundir com
  A comparação de itens parecidos diz se a relação existe e não troca o vínculo por texto.

  Regra: A resposta diz se a propriedade existe

    Exemplo: Comparar itens parecidos em qualquer banco
      Dado que existe uma avaliação de duplicidade desambiguação consolidação ou confusão
      Quando a skill compara itens parecidos
      Então a skill verifica se o banco tem Não confundir com
      E diz se a propriedade existe ou não

  Regra: Parecidos diferentes ligam antes de concluir

    Exemplo: A propriedade existe e os itens são diferentes
      Dado que Não confundir com existe no banco
      Quando os itens são parecidos mas diferentes e há segurança suficiente
      Então a skill relaciona os registros por Não confundir com antes de concluir

  Regra: Sem a propriedade a relação é criada antes do vínculo

    Exemplo: A pessoa autoriza criar a propriedade
      Dado que o banco não tem Não confundir com
      Quando a pessoa autoriza a criação
      Então a skill cria a propriedade como relação antes de registrar a desambiguação
      E não usa variação grafia observação nem corpo da página como substituto permanente

    Exemplo: O banco já tem pares parecidos conhecidos
      Dado que existe a propriedade Não confundir com recém-criada num banco com pares parecidos conhecidos
      Quando a skill segue a vinculação
      Então a skill sugere ou realiza o vínculo dos pares relevantes
      E não consolida registros que representam conceitos diferentes
