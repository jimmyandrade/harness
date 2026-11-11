# language: pt

Funcionalidade: Enviar um e-mail em nome de uma pessoa

  Regra: quem contata a organização assina com o próprio nome

    Exemplo: a caixa é da empresa, mas quem fala é uma pessoa
      Dado que uma pessoa contata uma organização pela caixa da empresa
      Quando a habilidade monta o rascunho
      Então o texto fala em primeira pessoa
      E a assinatura é o nome da pessoa, não o da empresa

  Regra: comprovante só vai por e-mail depois de gravado no Notion

    Exemplo: o e-mail leva o comprovante de um pagamento
      Dado que o comprovante ainda não está na despesa
      Quando a habilidade prepara o anexo
      Então ela grava o comprovante na despesa primeiro
      E só então anexa o arquivo ao e-mail

  Regra: quem já escreveu sobre o assunto fica em cópia

    Exemplo: mais de um endereço da organização escreveu à pessoa
      Dado que três endereços da mesma organização escreveram sobre o assunto
      Quando a habilidade monta os destinatários
      Então o endereço da área do assunto fica em Para
      E os outros, de domínio verificado, ficam em cópia
