# language: pt
Funcionalidade: Rotear habilidades em Mermaid
  O encaminhamento para outra habilidade fica num flowchart.

  Regra: O Passo 1 roteia no flowchart

    Exemplo: Encaminhar a consolidação
      Dado que existe um passo que roteia para outra habilidade
      Quando a skill descreve esse roteamento
      Então o roteamento fica num flowchart Mermaid
      E a frase não repete o mesmo encaminhamento
