# language: pt
Funcionalidade: Normalizar registros de perfis sociais
  O cadastro e a consolidação gravam o identificador canônico normalizado.

  Regra: O título é o identificador normalizado e a variação fica no campo de busca

    Exemplo: Cadastrar ou consolidar um perfil
      Dado que existe a lista de perfis sociais
      Quando a skill cadastra ou consolida um perfil no registro canônico
      Então o título é o identificador canônico normalizado
      E handle fica sem arroba em minúsculas e sem espaços como perfilexemplo
      E website guarda a URL completa na propriedade adequada e não no título

  Regra: Variações úteis e perfis parecidos

    Exemplo: Formas de busca e perfil diferente
      Dado que existe um perfil social no registro canônico
      Quando a skill grava as formas de busca
      Então Variações de nome recebe versão com arroba grafia maiúscula e minúscula apelido e URL alternativa da mesma origem
      E perfis parecidos mas diferentes ligam em Não confundir com

  Regra: Confirmação de que não é a mesma conta grava o vínculo na hora

    Exemplo: Dois perfis parecidos confirmados como contas diferentes
      Dado que existem dois perfis com nomes parecidos que são contas diferentes
      Quando a pessoa confirma que não é duplicata
      Então a skill conecta os dois em Não confundir com na hora
      E Variações de nome recebe termos que aumentam a clareza
      E a skill pergunta antes de salvar se não tiver segurança sobre as páginas
