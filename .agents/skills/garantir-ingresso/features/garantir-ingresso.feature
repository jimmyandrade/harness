# language: pt

Funcionalidade: Garantir o ingresso de um evento na tiqueteira
  O ingresso sai pela integração da plataforma ou pelo navegador, com o login e o aceite da pessoa.

  Regra: A integração vem antes do navegador

    Exemplo: Tiqueteira sem integração para quem compra
      Dado que a tiqueteira só tem API para quem organiza o evento
      E que `Sem integração` está em `perguntar`
      Quando a pessoa pede o ingresso
      Então a skill diz que não há integração para quem compra
      E pergunta se segue pelo navegador ou se a pessoa se inscreve e manda o comprovante

  Regra: A atividade pode não ter ingresso próprio

    Exemplo: Palestra dentro de uma programação com ingresso por dia
      Dado que o ingresso do evento vale para o dia inteiro
      E que a página de programação diz que as salas lotam por ordem de chegada
      Quando a pessoa pede a inscrição numa palestra desse dia
      Então a skill pede só o ingresso do dia
      E avisa a sala, o horário e a lotação por ordem de chegada

    Exemplo: Regra da sala sem fonte
      Dado que nem a página, nem o e-mail, nem o WhatsApp dizem como se entra na atividade
      Quando a pessoa pede a inscrição nessa atividade
      Então a skill redige a pergunta à organização
      E só envia com o sim da pessoa

  Regra: O checkout sai preenchido pelo cadastro

    Exemplo: Campo opcional que o cadastro responde
      Dado que o checkout traz o campo opcional de complemento do endereço
      E que o cadastro da pessoa titular tem o complemento
      Quando a skill preenche o checkout
      Então o complemento entra no campo

    Exemplo: Campo novo
      Dado que o checkout pede um campo fora da tabela de campos da skill
      E que nenhum cadastro responde esse campo
      Quando a skill preenche o checkout
      Então a skill pergunta o valor à pessoa
      E o campo entra na tabela ao final, com a fonte que respondeu

  Regra: Login, termos e pagamento ficam com a pessoa

    Exemplo: Tiqueteira sem login
      Dado que a tiqueteira está sem login no navegador
      Quando a skill chega ao checkout
      Então a skill pede que a pessoa entre na conta
      E não digita senha nem código

    Exemplo: Termo obrigatório com cessão de imagem
      Dado que `Aceite de termos obrigatórios` está em `automático`
      E que o checkout pede um termo obrigatório com cessão de imagem e voz
      Quando os outros campos estão preenchidos
      Então a skill resume o termo e pede o sim da pessoa
      E só marca o aceite depois do sim

    Exemplo: Termo opcional com o padrão
      Dado que `Aceite de termos opcionais` está em `perguntar`
      E que o checkout traz um termo opcional de envio de novidades
      Quando os outros campos estão preenchidos
      Então a skill resume o termo e pergunta se ele deve ser marcado

    Exemplo: Termo opcional em automático
      Dado que `Aceite de termos opcionais` está em `automático`
      E que o checkout traz um termo opcional de marketing e outro de certificado
      Quando a skill decide os termos
      Então o termo de marketing fica desmarcado
      E o termo de certificado se marca
      E as duas decisões entram no relatório

    Exemplo: Ingresso pago
      Dado que o ingresso escolhido é pago
      Quando a skill chega ao pagamento
      Então a skill mostra o item, o valor total e o meio de pagamento
      E só finaliza depois do sim da pessoa

  Regra: Quem se apresenta fica sabendo que a pessoa vai

    Exemplo: Palestrante no cadastro de pessoas
      Dado que `Avisar quem se apresenta` está em `perguntar`
      E que a palestrante da atividade está no cadastro de pessoas, com telefone
      E que nenhuma conversa nem e-mail mostram um aviso
      Quando o pedido sai confirmado
      Então a skill oferece avisar a palestrante que a pessoa vai
      E só envia a mensagem com o sim da pessoa ao texto e ao canal

  Regra: A atividade entra na agenda

    Exemplo: Atividade ausente da agenda
      Dado que o pedido saiu confirmado
      E que a agenda não tem a atividade no dia e no horário dela
      Quando a skill termina a inscrição
      Então a skill cria o evento na agenda com os dados do e-mail da tiqueteira e do Notion
      E avisa o compromisso que bate com o horário
