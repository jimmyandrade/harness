# language: pt

Funcionalidade: Pré-requisitos de um harness de negócio novo
  A configuração começa pelo que, faltando, estraga os passos seguintes.

  Regra: Só um harness de negócio novo é configurado

    Exemplo: Pedido no repositório do core
      Dado que o repositório aberto é o harness core
      Quando a pessoa pede para configurar o harness
      Então a skill diz que o core já está configurado e não muda nada

  Regra: A branch padrão é a main

    Exemplo: Primeira branch enviada virou a padrão
      Dado que a branch padrão do remoto é uma branch de trabalho
      Quando a skill confere os pré-requisitos
      Então ela segue o passo do runbook que cria a main antes de qualquer pull request

  Regra: O core fica na release atual antes dos outros runbooks

    Exemplo: Core fixado numa versão antiga
      Dado que o projeto fixa uma versão do core anterior à release atual
      Quando a skill confere os pré-requisitos
      Então ela leva o core à release atual antes de seguir os outros runbooks
      E diz que um core antigo traz runbooks e exemplos antigos

    Exemplo: Renovate sem o app instalado
      Dado que o projeto tem a configuração do Renovate
      E que não há painel nem pull request do Renovate
      Quando a skill confere os pré-requisitos
      Então ela diz à pessoa para instalar o app do Renovate na conta ou organização dona do repositório
