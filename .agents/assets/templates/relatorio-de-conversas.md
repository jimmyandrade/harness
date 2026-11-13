---
name: relatorio-de-conversas
description: Formato do relatório da triagem das conversas, com um bloco por canal e por conversa, pontos de atenção, tarefas, intercorrências, rótulos e mensagens sem relevância.
metadata:
  version: "0.3.0"
---

## Contexto

Use este modelo para entregar o resultado de uma varredura das conversas do WhatsApp e do Slack, na resposta do chat ou na saída de uma rotina. A habilidade `triar-conversas` lê este modelo quando gera a saída.

## Formato

### Conversas — <data no Formato da data com dia da semana>

Período lido: <desde quando> até <data e hora da varredura>.

### <canal, como WhatsApp ou Slack>

#### <nome da conversa>

- **Rótulos:** <estado e contexto aplicados>
- **Pontos de atenção:** <o que informa algo útil, com quem escreveu e a hora, por que importa e o que a pessoa faz, ou "só informativo">
- **Áudios:** <quem mandou, a hora, o arquivo da transcrição e a ação no áudio. Sem transcrição, diga por quê>
- **Tarefas:** <título da tarefa, com o link>
- **Intercorrências:** <o que aconteceu, com o link do comentário ou da página>
- **Ignorados:** <um registro curto por item sem tarefa nem ação: o que era, de qual conversa, por que ficou sem ação e a data, só do assunto que não tem página para o comentário>
- **Ações no WhatsApp:** <reações, favoritos e mensagens apagadas para você, com o resultado de cada tentativa>

#### <nome da conversa sem mensagem nova>

Não houve interação.

### Para você decidir

- <decisão que cabe à pessoa, como reagir, favoritar ou apagar para você, guardar uma lição ou criar um rótulo de contexto>

## Estilo

Um bloco por canal, na ordem de `Fontes`, e dentro dele um bloco por conversa, na ordem da lista de conversas. A linha sem conteúdo sai do bloco: uma conversa só com agradecimentos fica com a linha de ignorados, que registra o que foi ignorado e por quê. Nada é descartado sem registro. A conversa sem mensagem nova no período fica com a frase "Não houve interação". Um canal que não foi lido diz por quê numa linha. Cada tarefa e cada intercorrência leva o link. A data de cada mensagem segue o separador do dia na conversa. A seção de decisões sai quando nada espera a pessoa.
