# language: pt

Funcionalidade: Agendar o sucesso
  O objetivo vira estrutura com o que a pessoa ou a fonte nomeou.

  Regra: O objetivo traz marco, compromisso, responsável, duração e evidência

    Exemplo: Objetivo com os cinco itens nomeados
      Dado que existe um objetivo com marco, compromissos, responsáveis, duração e evidências de conclusão nomeados
      Quando o sucesso é agendado
      Então a estrutura guarda esses cinco itens
      E a gravação de cada bloco fica com definir-agenda

    Exemplo: Responsável, duração ou evidência ausente
      Dado que existe um objetivo sem responsável, duração ou evidência de conclusão
      Quando o sucesso é agendado
      Então a skill pede o que falta
      Mas ela não inventa a pessoa, a duração nem a evidência
