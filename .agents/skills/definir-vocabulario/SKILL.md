---
name: definir-vocabulario
description: Use essa habilidade sempre que for cadastrar ou atualizar um ou mais termos do vocabulário do tom de voz, mesmo sem dizer glossário, lote ou estado. NÃO use para escrever, revisar ou aprovar o texto da marca, classificar uma frase, perguntar quais variações de gênero, número ou grafia foram cadastradas, nem inventar um termo que a pessoa não enviou.
metadata:
  author: jimmyandrade
  version: "0.34.0"
  related:
    - classificar-estado-do-termo
    - evoluir-habilidade
    - gravar-termos-no-vocabulario
    - procurar-variacao-de-termo
    - redigir-com-tom-de-voz
    - validar-plano-de-vocabulario
---

# Definir vocabulário

## Parâmetros de configuração

```yaml
"Modo de aprendizado": "perguntar"
"Categorias": {}
"Validação dos campos": "warn"
"Domínio do e-mail de quem decide": ""
```

## Instruções

### Passo 1

A pessoa responsável pelo tom de voz quer cadastrar ou atualizar termos. Perguntar se um termo ou uma variação faltou segue `procurar-variacao-de-termo`. Monte o plano com idioma, modo e a lista. Cada item tem `state`, `term`, `categories` e os campos desse nível. Use o que a pessoa enviou. O texto que você monta a partir disso, como o `reason`, vai marcado como seu.

Quando a pessoa manda um par rotulado de antes e depois, cada lado é um termo no mesmo lote. O antes fica `forbidden`, e `substitution` e `alternatives` são o depois, com o texto que ela escreveu. O depois fica `allowed`. `related` liga os dois. Não invente outra alternativa. "Nunca use uma palavra, use outra" tem o mesmo formato, sem `when` e sem `tags`. A frase inteira, com a pontuação e com um símbolo no fim, é um termo. Termo novo entra em minúsculas.

O idioma de cada linha é o da comunicação inteira, não o do arquivo que já existe. Comunicação inteira em inglês, como um e-mail, uma review ou uma mensagem, grava o termo e a frase em `en`. Comunicação principalmente em português que só leva um termo em inglês no meio, como `header`, grava em `pt-BR`. Idioma ambíguo: pergunte. Sem idioma ou sem termo, pare e peça.

```mermaid
flowchart LR
  A{Pedido?} -->|cadastrar ou atualizar| B[Esta habilidade]
  A -->|perguntar a variação| D[procurar-variacao-de-termo]
  A -->|escrever o texto| C[redigir-com-tom-de-voz]
  B --> E[classificar-estado-do-termo]
  E --> F[validar-plano-de-vocabulario]
  F --> G[gravar-termos-no-vocabulario]
```

### Passo 2

Classifique cada termo com `classificar-estado-do-termo`: ele lê as fontes da marca e decide o `state`, as `tags`, o `allowed_in` e o `forbidden_in`. Contexto ainda ambíguo: ele pergunta. Não responda e não grave. Um par rotulado de antes e depois não é contexto ambíguo: o antes é `forbidden` e o depois é `allowed`.

### Passo 3

Cadastrar o que ainda não está usa `insert`. Corrigir o que já está usa `update`. Gravar novos e corrigir os que já estão usa `upsert`. Se a pessoa pedir para cadastrar e não disser o modo, use `insert`. Uma grafia guarda uma linha por conjunto de tags: a regra de um contexto para uma grafia que já tem linha de outro contexto, ou sem tags, entra como outra linha, com as tags dela. Corrigir uma linha com tags manda as tags dela. Apagar uma linha, ou tirar a tag de uma que já existe, é com `gravar-termos-no-vocabulario`, depois do sim da pessoa.

### Passo 4

Valide o plano com `validar-plano-de-vocabulario`. Passe `Categorias`, `Validação dos campos` e `Domínio do e-mail de quem decide`. Validação falha: corrija e valide de novo. Não grave.

### Passo 5

Grave com `gravar-termos-no-vocabulario`. Passe `Validação dos campos`. Ele corrige sem apagar o resto da linha, pesquisa a grafia, testa com dry run e grava o plano inteiro numa escrita só. Não confirme o cadastro sem a resposta dele. Se `incomplete` voltar com itens, preencha agora e grave de novo com `update`, e diga a redação que é sua. Nunca termine com `incomplete` sem dizer o que falta.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Idioma pelo arquivo à mão

Se você gravar no arquivo que já existe sem olhar o idioma da comunicação inteira, a frase em inglês entra no vocabulário errado.

1. Leia o texto inteiro: em inglês, `en`; em português com um termo em inglês, `pt-BR`.
2. Texto ambíguo: pergunte.
3. Sem o arquivo do idioma, crie-o com `{}` e grave.

### Par antes e depois numa frase só

Se você gravar o par como um termo só, ou só o depois, o antes continua valendo e a pessoa repete a correção.

1. O antes entra como `forbidden`, com `substitution` e `alternatives` iguais ao depois.
2. O depois entra como `allowed` no mesmo lote, e os dois ficam em `related`.
3. Não invente outra alternativa.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Cadastre `i'll refund the order` e `kind regards`, de um e-mail inteiro em inglês que pede um reembolso.

A comunicação inteira era em inglês: as duas frases foram para `en`, não para `pt-BR`. O `en.json` não existia: criei `{}` e gravei.

### Cadastre `header`, de uma mensagem em português.

A mensagem era em português e só levava uma palavra em inglês. A linha ficou em `pt-BR`.

### A pessoa manda o antes `se faltar algo, reabre.` e o depois `vc pode reabrir essa conversa se eu tiver deixado alguma coisa pra trás`, numa mensagem em português.

A comunicação era em português. O antes ficou proibido e a substituição foi o depois. O depois ficou permitido. Os dois ficaram ligados no mesmo lote.

## Casos-limite

- Permitidos, proibidos e situacionais juntos: um lote e um modo.
- A pessoa manda pares antes e depois: os dois entram no mesmo lote, o antes proibido e o depois permitido, ligados entre si.
- A mesma palavra vale de um jeito num contexto e de outro no resto: uma linha sem tags e uma com as tags do contexto, no mesmo lote.
- A pessoa pergunta se um termo ou uma variação faltou: `procurar-variacao-de-termo`.
- O pedido é escrever a frase: `redigir-com-tom-de-voz`.
- O pedido é saber se a frase pode: não é esta habilidade.
- Sem terminal e sem o servidor `vocabulary`, como num agente do Notion: pare. `gravar-termos-no-vocabulario` explica o motivo.

## Pegadinhas

- Uma palavra em inglês dentro do texto em português parece termo do vocabulário em inglês. Ela mora no vocabulário desse texto.
- O par antes e depois parece uma frase só, ou só o depois. Cada lado é um termo, e o antes aponta para o depois que a pessoa escreveu.
- Um `pt-BR.json` à mão parece o lugar de tudo. O e-mail inteiro em inglês mora em `en`, com a frase inteira.

## Scripts disponíveis

- Nenhum.
