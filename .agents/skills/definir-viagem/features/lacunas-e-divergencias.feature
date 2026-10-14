# language: pt

Funcionalidade: Lacunas e divergências da viagem
  A pessoa responsável pela viagem distingue fato confirmado, informação pendente e fontes conflitantes.

  Exemplo: Lacunas e divergências
    Dado que a pessoa responsável pela viagem traz fato confirmado, informação pendente e fontes conflitantes
    Quando a pessoa pede para registrar a viagem
    Então o fato confirmado entra e a pendência fica vazia e nomeada
    E as fontes conflitantes permanecem sem escolha quando nenhuma é mais recente e oficial
    E cidade, aeroporto, hotel, horário, transfer e responsabilidade só entram se a fonte confirmou

  Exemplo: Fonte mais recente e oficial
    Dado que duas fontes divergem e uma é mais recente e explicitamente oficial
    Quando a pessoa pede para registrar a viagem
    Então essa fonte entra
    E a outra fica nomeada como divergência
