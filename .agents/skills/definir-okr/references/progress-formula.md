# Fórmula de progresso pelo sentido

Modelo para a lista que calcula o progresso do key result por fórmula, no editor de fórmulas do Notion.
Troque cada nome entre `<>` pelo nome da propriedade ou da opção que o mapeamento de dados do projeto dá.
Antes de colar, compare com a fórmula atual da lista e mantenha o que ela faz além do progresso.
Confira o resultado de um key result de cada sentido contra o cálculo de referência de `scripts/key_result_progress.py`.

## Progresso

Um resultado igual a 1 é o alvo atingido. Acima de 1, o alvo foi passado. Sem valor atual, sem valor-alvo, ou num key result de redução sem base acima do alvo, o campo fica vazio.

```
lets(
  sentido, prop("<Sentido>"),
  atual, prop("<Valor atual>"),
  alvo, prop("<Valor alvo>"),
  base, prop("<Valor da baseline>"),
  inicio, if(empty(base), 0, base),
  ifs(
    empty(atual) or empty(alvo), toNumber(""),
    sentido == "<Diminuir>", if(empty(base) or base <= alvo, toNumber(""), (base - atual) / (base - alvo)),
    sentido == "<Manter abaixo>", if(atual <= alvo, 1, alvo / atual),
    sentido == "<Manter acima>", if(atual >= alvo or alvo == 0, 1, atual / alvo),
    alvo == inicio, toNumber(""),
    (atual - inicio) / (alvo - inicio)
  )
)
```

## Atingido

```
lets(
  sentido, prop("<Sentido>"),
  atual, prop("<Valor atual>"),
  alvo, prop("<Valor alvo>"),
  ifs(
    empty(atual) or empty(alvo), false,
    sentido == "<Diminuir>" or sentido == "<Manter abaixo>", atual <= alvo,
    atual >= alvo
  )
)
```

## Valor atual

O valor atual vem do histórico de medições da métrica do key result.
Numa métrica medida por período, como o custo de uma fatura, o valor atual é o registro mais recente pelo período de referência, não a soma dos registros.
Numa métrica acumulada, como o faturamento do ciclo, é a soma dos registros do ciclo.
