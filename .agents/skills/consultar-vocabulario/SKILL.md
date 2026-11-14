---
name: consultar-vocabulario
description: Use essa habilidade sempre que, antes de escrever ou conferir um texto da marca, for preciso ler o vocabulário do tom de voz, por palavra e por expressão inteira, com as tags de quem fala, do evento e do canal, mesmo sem dizer glossário. NÃO use para cadastrar ou corrigir termo, escrever o texto, nem decidir o nível de um termo.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - redigir-com-tom-de-voz
    - definir-vocabulario
    - procurar-variacao-de-termo
    - evoluir-habilidade
---

# Consultar vocabulário

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba o texto ou as expressões que ele pode usar, o idioma e quem fala, o evento e o canal. O idioma é o do texto que vai ser escrito: texto em inglês consulta `en`, texto em português consulta `pt-BR`. Sem saber quem fala, pergunte. Esta habilidade só lê. O cadastro segue `definir-vocabulario`.

Monte as tags com as que o vocabulário já tem para esse contexto, como `maria-silva`, `festival-de-verao`, `palco` ou `whatsapp`. A consulta com tags deixa de fora o termo de outra pessoa, de outro evento ou de outro canal.

### Passo 2

O vocabulário é o do negócio para o qual o texto sai e fica no harness dele, não no core nem na pasta da sessão. Com terminal, rode a CLI na pasta desse harness. Sem terminal, chame a ferramenta do servidor `vocabulary`.

Se ela disser que não há glossário, a sessão está noutra pasta: ache o harness do negócio, não rode `init` e não conclua que o vocabulário não existe. Sem os dois, como num agente do Notion, o vocabulário vem de uma fonte do workspace conectado que as instruções do projeto nomeiam. Sem essa fonte, pare e diga que a consulta roda numa ferramenta de código com o projeto aberto. Não leia o vocabulário de memória.

### Passo 3

Consulte o texto por palavra e cada expressão inteira. A consulta por palavra lê palavra por palavra e deixa passar um termo de mais de uma palavra, como uma expressão proibida. Por isso, antes de rascunhar, consulte também cada expressão que o texto pode usar, inteira.

### Passo 4

Leia a linha inteira de cada termo permitido com ressalva, em especial o `when`. A palavra ou a frase só vale no contexto que o `when` descreve: a consulta por palavra não o aplica, e a leitura é sua. Um termo permitido só nesse contexto não é permitido fora dele.

Devolva, por termo, se a gente usa, evita ou não usa, a troca recomendada de quem é evitado e o `when` de quem tem ressalva.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Frase checada só palavra por palavra

Se você conferir o rascunho só por palavra, uma expressão proibida de mais de uma palavra passa.

1. Consulte cada expressão que o texto pode usar, inteira.
2. Confira o rascunho inteiro por palavra depois.

### Permitido com ressalva lido como permitido

Se você ler só o nível do termo e ignorar o `when`, um termo que vale em um contexto entra no texto de outro.

1. Leia a linha inteira de cada termo permitido com ressalva.
2. Aplique o `when` ao canal e ao destino do texto, inclusive a pontuação e o fim da última frase.

### Vocabulário de outro negócio

Se você consultar o glossário da pasta da sessão, o termo de outro negócio vale no texto.

1. Ache o harness do negócio para o qual o texto sai.
2. Não rode `init` nem conclua que o vocabulário não existe.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Consulte o vocabulário para uma mensagem de WhatsApp de despedida

Consultei com as tags do canal e de quem fala, cada expressão inteira e o rascunho por palavra. O ponto final está permitido só fora da última frase do WhatsApp, pelo `when` da linha, então a despedida ficou sem ponto.

## Casos-limite

- O pedido é cadastrar ou corrigir um termo: `definir-vocabulario`.
- O pedido é saber se uma variação faltou: `procurar-variacao-de-termo`.
- O pedido é escrever o texto: `redigir-com-tom-de-voz`.
- Sem terminal e sem o servidor `vocabulary`: pare e diga que a consulta roda numa ferramenta de código com o projeto aberto.

## Pegadinhas

- A consulta por palavra parece cobrir o texto inteiro. Ela não pega uma expressão de mais de uma palavra.
- Um termo permitido parece valer em qualquer texto. O `when` limita o contexto.
- Uma consulta sem tags parece completa. Ela só devolve a linha sem tags, e a de outro contexto só aparece com a tag dele.

## Scripts disponíveis

- `node node_modules/harness/vocabulary/dist/cli.js lookup --language <idioma> --term <termo> --tags <tag>` lê um termo e devolve se ele existe e a linha guardada.
- `node node_modules/harness/vocabulary/dist/cli.js exists --language <idioma> --text <trecho> --tags <tag>` devolve só o registro de cada token do trecho para se ele existe.
- Com `case_matches` falso, a caixa do texto não é a guardada. Escreva a grafia de `term`.
- `node node_modules/harness/vocabulary/dist/cli.js classify-text --language <idioma> --text <trecho> --tags <tag>` devolve o nível de cada palavra, emoji e pontuação do trecho, com a troca recomendada de quem é evitado, que vem da substituição da linha. Confere o rascunho inteiro de uma vez, mas só palavra por palavra: não pega uma expressão de mais de uma palavra.
- `node node_modules/harness/vocabulary/dist/cli.js lookup-terms --language <idioma> --term <expressão> --term <expressão> --tags <tag>` lê cada expressão inteira, em uma chamada, e devolve `results` na ordem enviada.
- `--tags` repete, um valor por vez. Termo sem tag vale em qualquer texto. Termo com tag só volta quando uma tag dele está na consulta.
- Passe o formato ou o canal do texto como tag, como `review` ou `chat`. Quando a tag está em `forbidden_in` ou `allowed_in` do termo, `classify-text` devolve o nível para esse contexto, com `base_state` no nível guardado e, se ficou proibido só pelo contexto, o motivo e as alternativas.
- `lookup_term`, `lookup_terms`, `exists_in_text` e `classify_text`, no servidor `vocabulary`, fazem a mesma consulta quando não há terminal ou quando a CLI não está disponível, com o mesmo campo `tags`.

1. Com terminal e a CLI instalada, na pasta do harness do negócio, rode `exists` com o texto, `lookup-terms` com cada expressão que o texto pode usar e `lookup` para cada termo que precisar da linha inteira, com as tags de quem fala, do evento e do canal. Escreva o comando inteiro em cada chamada.
2. Sem terminal, ou quando a CLI não está disponível, chame `exists_in_text`, `lookup_term` e `lookup_terms` com os mesmos campos.
