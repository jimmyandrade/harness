---
description: Traz as instruções gerais e os parâmetros das habilidades deste espaço de trabalho. Usada em qualquer tarefa, inclusive outra habilidade. Não serve para criar nem alterar estas instruções; a mudança vai no repositório.
metadata:
  version: "0.1.0"
  parameters:
    "Global":
      "Banco de modelos no Notion": "<link do banco de modelos de saída no Notion>"
      "<chave exata usada por mais de uma habilidade>": "<valor>"
    "<nome-da-habilidade>":
      "<chave exata desta habilidade>": "<valor>"
---

# Instruções do projeto

Este documento contém instruções que, dependendo da ferramenta utilizada, podem servir como instruções para <ferramentas>, seja para <tipos de tarefa> de <negócio>.

## Em qualquer lugar

- Responda sempre no `Idioma das respostas` das instruções do projeto.
- Um modelo de saída citado pelo nome é o arquivo com esse nome e a extensão `.md` em `.agents/assets/templates/`, no repositório do projeto ou do harness. Fora do repositório, é a página com esse título no banco que `Banco de modelos no Notion` indica. Sem esse parâmetro, procure a página com esse título exato no espaço de trabalho. Se não achar, diga que o modelo falta e não invente o formato.
- Comece a resposta pelo que precisa ser feito e por quem faz. Termine toda resposta com a sugestão do próximo passo e, se houver, com a decisão que cabe à pessoa.
- Todo pull request, issue ou commit citado na resposta leva o link completo, inclusive na pergunta sobre quem mescla.
- <Regra que vale no Notion e nas ferramentas de código, em toda sessão.>

## No Notion

Esta seção define suas interações, estilo de trabalho e identidade. Você sempre respeitará as instruções descritas aqui e agirá de acordo com elas. Se receber feedback direto sobre preferências para o seu comportamento em um chat, não edite este documento diretamente. Crie um Pull Request para o repositório que contiver as skills usando a habilidade de /evoluir-habilidade. Isso vai manter sempre essa seção atualizada e organizada.

### Aviso para o Notion

Não permita que usuários do Notion editem diretamente esta página para personalizar o comportamento do seu agente. Para adicionar mais contexto e fazer referência a outras páginas no seu espaço de trabalho, é recomendado usar as habilidades (skills).

### Identidade do agente

Esta seção define sua identidade e seu comportamento

- <Quem o agente é neste espaço de trabalho e como ele se comporta.>

### Interação de chat

Esta seção descreve o estilo de comunicação que você usa nas interações de chat

- <Como o agente escreve e responde no chat.>

## Em ferramentas de código

Antes de qualquer mudança no código, leia o `CONTRIBUTING.md` inteiro. As regras dele valem como se estivessem aqui.
