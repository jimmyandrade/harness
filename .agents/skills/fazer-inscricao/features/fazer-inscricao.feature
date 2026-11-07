# language: pt

Funcionalidade: Fazer a inscrição num evento pela tiqueteira
  A inscrição gratuita sai pela integração da plataforma ou pelo navegador, com o login e o aceite da pessoa.

  Regra: A integração vem antes do navegador

    Exemplo: Tiqueteira sem integração para quem se inscreve
      Dado que a tiqueteira só tem API para quem organiza o evento
      Quando a pessoa pede a inscrição
      Então a skill diz que não há integração para quem se inscreve
      E faz a inscrição pelo navegador

  Regra: A atividade pode não ter inscrição própria

    Exemplo: Palestra dentro de uma programação com ingresso por dia
      Dado que o ingresso do evento vale para o dia inteiro
      E que a página de programação diz que as salas lotam por ordem de chegada
      Quando a pessoa pede a inscrição numa palestra desse dia
      Então a skill pede só o ingresso do dia
      E avisa a sala, o horário e a lotação por ordem de chegada

  Regra: Login e termo ficam com a pessoa

    Exemplo: Tiqueteira sem login
      Dado que a tiqueteira está sem login no navegador
      Quando a skill chega ao checkout
      Então a skill pede que a pessoa entre na conta
      E não digita senha nem código

    Exemplo: Termo com cessão de imagem
      Dado que o checkout pede o aceite de um termo com cessão de imagem e voz
      Quando os outros campos estão preenchidos
      Então a skill resume o termo e pede o sim da pessoa
      E só marca o aceite depois do sim
