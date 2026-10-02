# language: pt

Funcionalidade: Ajustar a descrição pelo feedback de disparo
  A skill é um documento vivo.
  Subdisparo e sobredisparo mudam a descrição, não o procedimento.

  Regra: Subdisparo pede detalhe e o termo técnico

    Exemplo: A pessoa liga a skill à mão
      Dado que a skill não carregou em um pedido que ela cobre
      Quando a pessoa liga a skill à mão
      Então a descrição ganha detalhe e nuance
      E a descrição inclui o termo técnico da pessoa
      Mas a descrição não copia uma palavra casual da consulta que falhou

    Exemplo: Pergunta sobre quando usar
      Dado que a pessoa pergunta quando a skill deve ser usada
      Quando a descrição é reescrita
      Então a descrição diz quando carregar
      E a descrição continua começando com "Use essa habilidade sempre que"

  Regra: Sobredisparo pede exclusão específica

    Exemplo: A skill carrega fora do propósito
      Dado que a skill carregou em uma consulta sem relação
      Quando a pessoa desliga a skill
      Então a descrição fecha com "NÃO use para"
      E o que fica de fora fica específico
