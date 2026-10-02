# language: pt
Funcionalidade: Rotear habilidades em Mermaid
  O encaminhamento para outra habilidade fica num flowchart.

  Regra: Roteamento não fica em frase

    Exemplo: Passo que encaminha
      Dado um passo que roteia para outra habilidade
      Quando a skill é escrita
      Então o roteamento fica num flowchart Mermaid
      E o sentido é o configurado
