# language: pt

Funcionalidade: Distribuição das fontes da viagem
  Cada dado fica na fonte responsável. A oportunidade guarda a missão, e a inscrição não substitui a viagem.

  Esquema do Cenário: Fonte de cada dado
    Dado que a pessoa traz <dado>
    Quando a pessoa pede para registrar a viagem
    Então o dado fica em <fonte>

    Exemplos:
      | dado | fonte |
      | origem, destino e datas | a lista de viagens |
      | hospedagem com nome ou endereço confiável | a lista de hospedagens |
      | quartos, café da manhã e despesa coberta sem lançamento | a lista de hospedagens |
      | acontecimento com data ou horário | o cronograma |
      | lançamento financeiro | despesas e investimentos |

  Exemplo: Hospedagem sem confirmação
    Dado que a fonte não confirma o nome nem o endereço da hospedagem
    Quando a pessoa pede para registrar a viagem
    Então a hospedagem fica vazia
    E a lacuna fica nomeada na viagem

  Exemplo: Roteiro fora da oportunidade
    Dado que a viagem e o cronograma já existem
    Quando a pessoa traz o roteiro operacional e a missão que originou a viagem
    Então a missão fica na oportunidade
    E o roteiro fica na viagem e no cronograma
    E a inscrição não recebe esse roteiro

  Exemplo: Clima e vestuário
    Dado que a fonte diz que vai fazer frio e pede roupa de frio
    Quando a pessoa pede para registrar a viagem
    Então a orientação fica nomeada na viagem
    E nenhum produto nem variante é criado
    E nenhuma propriedade nova é criada
