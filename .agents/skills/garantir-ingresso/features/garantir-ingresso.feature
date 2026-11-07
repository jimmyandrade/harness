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

  Regra: Login, termos e pagamento ficam com a pessoa

    Exemplo: Tiqueteira sem login
      Dado que a tiqueteira está sem login no navegador
      Quando a skill chega ao checkout
      Então a skill pede que a pessoa entre na conta
      E não digita senha nem código

    Exemplo: Termo obrigatório com cessão de imagem
      Dado que `Aceite de termos` está em `automático`
      E que o checkout pede um termo obrigatório com cessão de imagem e voz
      Quando os outros campos estão preenchidos
      Então a skill resume o termo e pede o sim da pessoa
      E só marca o aceite depois do sim

    Exemplo: Termo opcional
      Dado que o checkout traz um termo opcional
      Quando a pessoa não pediu para aceitá-lo
      Então a skill deixa o termo desmarcado e finaliza

    Exemplo: Ingresso pago
      Dado que o ingresso escolhido é pago
      Quando a skill chega ao pagamento
      Então a skill mostra o item, o valor total e o meio de pagamento
      E só finaliza depois do sim da pessoa
