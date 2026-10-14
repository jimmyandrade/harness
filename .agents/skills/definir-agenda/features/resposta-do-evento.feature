# language: pt

Funcionalidade: Responder o que aconteceu no Google Agenda
  A resposta resume a decisão e o estado de cada evento.

  Regra: A resposta nomeia o estado e o fuso

    Exemplo: O evento criado com fuso conhecido
      Dado que existe um evento criado no Google Agenda
      E o fuso do evento
      Quando a resposta é escrita
      Então ela traz um resumo curto da ação
      E lista o evento como criado e nomeia o fuso

    Exemplo: Reserva sem confirmação
      Dado que existe um evento desejado ainda sem confirmação
      Quando a resposta é escrita
      Então o evento sai como provisório
      Mas a resposta não o trata como confirmado

    Exemplo: Fuso ausente
      Dado que existe uma data cujo dia pode mudar sem o fuso
      Quando a resposta é escrita
      Então a skill pede o fuso
      Mas ela não inventa o fuso nem um evento removido
