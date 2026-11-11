# language: pt

Funcionalidade: Enviar imagem como foto

  Regra: a imagem nunca vai como figurinha

    Exemplo: a pessoa aprova o envio de um comprovante
      Dado que a pessoa aprovou enviar uma imagem na conversa
      Quando a habilidade anexa a imagem
      Então ela usa a entrada de Fotos e vídeos, nunca a de Nova figurinha
      E a pré-visualização mostra o campo de legenda
      E, depois do envio, a lista de conversas diz Foto

    Exemplo: a imagem saiu como figurinha
      Dado que a lista de conversas diz Figurinha depois do envio
      Quando a habilidade confere o envio
      Então ela avisa a pessoa e propõe apagar para todos e reenviar como foto
      E só apaga com o sim da pessoa
