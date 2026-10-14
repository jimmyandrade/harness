# language: pt
Funcionalidade: Tratar nomes parecidos que não são a mesma entidade
  O caso ambíguo permanece com um registro canônico por entidade.

  Regra: Nome parecido de outra entidade não vira consolidação

    Exemplo: Dois itens com nomes parecidos
      Dado que existem dois itens com nomes parecidos que não são a mesma entidade
      Quando a skill registra e trata o caso
      Então a skill registra o caso como entidades diferentes
      E cada entidade permanece com um registro canônico único
      E a skill não consolida um item no outro

  Regra: Caso parecido que não é o mesmo fica registrado

    Exemplo: Feira de Verão Norte e Feira de Verão Sul
      Dado que existem nomes parecidos que se referem a entidades diferentes como Feira de Verão Norte e Feira de Verão Sul
      Quando a skill identifica que são parecidos porém não equivalentes
      Então a skill registra a relação como parecido mas diferente
      E a relação apoia a desambiguação futura
      E a skill evita a consolidação incorreta

  Regra: Confirmação de que não é duplicata liga e esclarece

    Exemplo: Dois itens parecidos confirmados como diferentes
      Dado que existem dois itens com nomes parecidos que são diferentes
      Quando a pessoa confirma que não é duplicata
      Então a skill conecta os dois em Não confundir com
      E Variações de nome recebe só formas do mesmo registro no formato padrão

  Regra: A correção da pessoa grava o vínculo na hora

    Exemplo: A pessoa confirma que os parecidos são itens diferentes
      Dado que a pessoa corrige explica ou confirma que dois registros parecidos são itens diferentes
      Quando o banco tem Não confundir com ou propriedade equivalente
      Então a skill preenche a relação na hora e não deixa a correção só no chat
      E atualiza a variação de nome com termos úteis quando isso reduz confusão futura
      E pergunta antes de salvar quando não há segurança sobre as páginas

    Exemplo: O banco não tem a propriedade
      Dado que existem dois registros parecidos confirmados como itens diferentes
      Quando o banco não tem Não confundir com nem propriedade equivalente
      Então a skill avisa que a propriedade não existe
      E propõe a criação da propriedade
      E não dá a desambiguação por concluída
