---
name: publicar-revisao-de-codigo
description: Revisa um pull request e publica a revisão numa única review, com os comentários inline, no idioma de quem recebe e no tom do projeto. Usada quando a pessoa pede uma revisão ou outra habilidade precisa publicar uma. Não serve para tratar os comentários que você recebeu no seu PR.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  notion: "false"
  aliases:
    - post-code-review
  related:
    - definir-pessoa
    - enviar-mensagem-no-slack
    - evoluir-habilidade
    - levantar-contexto-do-pull-request
    - priorizar-itens
---

# Publicar revisão de código

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.

```yaml
"Postura dos comentários": "pergunta"
"Revelar que a revisão foi automática": "sim"
"Idioma da revisão sem preferência conhecida": "o idioma do projeto"
"Tradução recolhível": "não"
"Frase sobre o idioma": "sim"
"Ação com Deve ter": "solicitar mudanças"
"Ação com Deveria ter": "comentar sem aprovar"
"Ação só com Poderia ter": "aprovar com os comentários"
"Ação sem achados": "aprovar"
"Nível de detalhe": "enxuta"
"Prova visual em PR de interface": "sim"
"Rótulo de prioridade no texto": "não"
"Abertura da revisão": ""
"Lentes de revisão": ""
"Ler o texto antes de publicar": "sim"
"Pasta das cópias separadas": ""
"Idade máxima da trava": "2 horas"
"Comentário de início da revisão": ""
"Etiqueta de revisão em andamento": ""
"Modo de aprendizado": "perguntar"
```

`Postura dos comentários` é `pergunta` ou `veredito`: com `pergunta`, nenhum achado vira "isto é um erro", e sim o que você viu e uma pergunta. `Nível de detalhe` é `enxuta`, só Deve ter e Deveria ter, ou `completa`, com tudo. `Lentes de revisão` lista critérios que você aplica antes de publicar sem citá-los no texto. `Abertura da revisão` descreve o que abre cada texto, como um resumo curto. `Pasta das cópias separadas` diz onde criar a cópia de trabalho de cada repositório, e vazio usa a pasta temporária do sistema, com uma subpasta por repositório. `Comentário de início da revisão` e `Etiqueta de revisão em andamento` avisam quem acompanha o PR de que a revisão começou: vazios, a habilidade não posta nem etiqueta nada.

## Instruções

### Passo 1

Peça o número ou o link do pull request. Confira o estado dele agora, mesmo que a fila que o trouxe já o tenha conferido. Mesclado ou fechado: diga isso a quem chamou e pare, sem revisar. Um PR com conflito de merge também não se revisa: diga que o conflito precisa ser resolvido e pare. Funciona do mesmo jeito se a pessoa pediu direto ou se outra habilidade chamou.

### Passo 2

Chame `levantar-contexto-do-pull-request` e use a ficha dele: convenções, comentários existentes, card e conversas, propósito e trabalho parecido. Não refaça a leitura.

Não revise com um check pendente: diga qual e espere terminar. Um check que falhou não impede a revisão, mas leia o registro dele antes de perguntar sobre ele.

### Passo 3

Este passo só depende do repositório e pode virar uma habilidade própria. Pule-o quando a revisão só lê o diff, sem baixar o código. Quando for preciso executar código, como rodar testes ou o lint:

1. Procure uma trava do repositório: uma revisão em andamento em outra execução, que é a cópia separada dele em `Pasta das cópias separadas`. Se existir, não comece: diga qual PR e há quanto tempo. Uma trava mais velha que `Idade máxima da trava` não se apaga em silêncio: avise e pergunte.
2. Crie a cópia separada a partir do PR antes de tocar em qualquer arquivo. A cópia é a trava.
3. Trabalhe só nela. Nunca use o clone da pessoa: não troque a branch dele, não guarde as alterações dele e não escreva nada nele.

### Passo 4

Com `Comentário de início da revisão` preenchido, poste esse comentário no PR. Com `Etiqueta de revisão em andamento` preenchida e a etiqueta ainda fora do PR, aplique-a. Guarde o que você fez: no fim, só desfaz o que fez.

### Passo 5

Rode a `code-review` do Claude, com o mesmo alvo e o mesmo nível de esforço recebidos, passando a ficha como contexto: convenções, o propósito, o que já foi comentado. Não reimplemente a análise. A categoria e a confiança que ela devolve são dados de trabalho, nunca texto publicado.

Ajuste o esforço ao risco do PR: baixo para documentação e renomeação, alto para o que mexe em pagamento, segurança, dados ou integração. A `code-review` nunca é pulada, nem em diff pequeno.

### Passo 6

Chame `priorizar-itens` com os achados e junte o resultado com a ficha:

- Um achado que coincide com um comentário já existente e ainda aberto vira resposta na thread dele, com o complemento ou um reforço curto. Não abre comentário novo, e não descarta o achado em silêncio. Em thread que o autor encerrou, ou já resolvida, não responda.
- Um achado fraco, sem cenário concreto de falha, vira pergunta que espera resposta, tratada como importante. Nunca como "não bloqueia".
- Aplique as `Lentes de revisão`. Com `Nível de detalhe` em `enxuta`, publique só Deve ter e Deveria ter.
- Achado de acessibilidade é Deve ter, com sugestão de código.
- Teste novo ou alterado confere a convenção de testes que o repositório define, só nas linhas tocadas.

### Passo 7

Este passo só depende do PR e do registro da pessoa, e pode virar uma habilidade própria. Escolha o idioma de quem recebe a revisão:

1. Leia a preferência dela no registro da pessoa, com `definir-pessoa`: um idioma só, ou um idioma com a tradução recolhível em outro.
2. Sem preferência, levante o que ela escreveu revisando PRs, nos de outras pessoas e nos seus, ignorando código, crases e links. Use o idioma que predomina.
3. Sem histórico, use `Idioma da revisão sem preferência conhecida`.

Com tradução recolhível, o texto principal vem no primeiro idioma e a tradução logo abaixo, dentro de um bloco recolhido, com a mesma voz. Código, nomes de arquivo e identificadores ficam iguais.

Com `Frase sobre o idioma` em `sim`, diga numa frase, uma vez por rodada, que você escreveu naquele idioma pensando na pessoa. Nunca diga de onde veio a preferência nem que foi combinada em privado.

### Passo 8

Este passo só depende do PR e pode virar uma habilidade própria. Com `Prova visual em PR de interface` em `sim`, um PR que muda tela, componente ou estilo precisa de prova visual: print, vídeo, um exemplo publicado ou o resultado de uma ferramenta de comparação.

Procure a prova em todo lugar antes de pedir: o corpo do PR, os comentários do autor, os checks e o card. Se achar, use e siga. Nunca peça uma prova que já existe. Só se não achar nada, pergunte com gentileza se dá para anexar, sem bloquear.

### Passo 9

Escreva os textos com `redigir-com-tom-de-voz`, para o tom de quem publica. Cada comentário diz o que você viu, por que importa e o que muda para quem usa ou mantém o código, e termina convidando a pessoa a responder.

- Com `Postura dos comentários` em `pergunta`, não declare erro confirmado e não dê ordem: separe o fato da decisão e termine em pergunta.
- Todo ponto sobre uma linha de código vai inline, ancorado na linha do diff mais próxima. O corpo geral não cita arquivo, função nem chamada. Só fica no corpo o que não é sobre linha.
- Escreva em palavras, não pelo rótulo: com `Rótulo de prioridade no texto` em `não`, o nome da categoria nunca aparece.
- Com `Revelar que a revisão foi automática` em `não`, não mencione automação, ferramenta, nome de habilidade nem quantos comentários há, e não deixe rodapé de ferramenta.
- Aplique `Abertura da revisão`.
- Seja curto. Não escreva frase que uma pessoa não escreveria.

### Passo 10

Antes de publicar, com `Ler o texto antes de publicar` em `sim`, mostre o texto completo e espere o sim da pessoa que chamou. Em execução agendada, não publique: deixe o texto e o link do PR no resumo.

Publique numa única review, com todos os comentários inline numa chamada só, e as respostas nas threads existentes. A ação final vem dos parâmetros:

- algum Deve ter: `Ação com Deve ter`;
- Deveria ter em aberto: `Ação com Deveria ter`;
- só Poderia ter: `Ação só com Poderia ter`, e o corpo diz que esses pontos são oportunidades, que podem ir para outro PR;
- nenhum achado: `Ação sem achados`.

Se uma passada anterior aprovou e esta achou um problema real, publique a correção. Não proteja o veredito anterior.

### Passo 11

Limpe sempre, mesmo se algo falhou antes. Apague o comentário de início e retire a etiqueta, se foi você que os pôs. Remova a cópia separada, o que libera a trava. Confira que o clone da pessoa está como estava, na mesma branch e sem alteração nova. Se a limpeza falhar, diga o que ficou.

### Passo 12

Devolva a quem chamou o endereço direto da review e de cada comentário publicado, e um resumo dos achados por prioridade. Avisar a pessoa que pediu a revisão é de quem chamou, com `enviar-mensagem-no-slack`.

### Passo 13

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Revisão sobre um PR já mesclado

Se você revisar um PR sem conferir o estado agora, a revisão chega depois do merge e ninguém a lê.

1. Confira o estado no Passo 1, mesmo que a fila já o tenha conferido.
2. Se mesclou ou fechou, pare e diga.
3. Faça o mesmo com um PR com conflito de merge.

### Ponto já dito repetido

Se você publicar um achado que um comentário existente já levanta, o autor vê o mesmo ponto duas vezes e acha que ninguém leu o que já foi dito.

1. Use a ficha do contexto.
2. Responda na thread existente, com o complemento ou um reforço.
3. Não responda em thread encerrada.

### Código no corpo da review

Se você citar arquivo ou função no corpo geral, o ponto perde a linha onde a pessoa o veria.

1. Ancore cada ponto de código num comentário inline.
2. Se nenhuma linha alterada se relaciona, diga isso numa frase no corpo.

### Prova visual pedida sem procurar

Se você pedir a prova visual antes de olhar o corpo, os comentários e os checks, pede o que já existe.

1. Procure em todos os lugares do Passo 8.
2. Peça só se não achar nada, e sem bloquear.

### Achado fraco rebaixado

Se você escrever "não bloqueia" num achado fraco, a pessoa lê como opcional e o ponto some.

1. Publique como pergunta que espera resposta.
2. Comente sem aprovar até ela responder.

### Trava deixada para trás

Se você sair da revisão sem remover a cópia separada, a próxima revisão do repositório não começa.

1. Limpe no Passo 11 mesmo quando algo falhou.
2. Diante de uma trava antiga, avise antes de apagar.

### Clone da pessoa alterado

Se você trocar a branch ou guardar as alterações no clone da pessoa, ela perde o que estava fazendo, às vezes sem perceber.

1. Trabalhe só na cópia separada.
2. Confira no fim que o clone está como estava.

### Comentário de início esquecido

Se você deixar o comentário de início no PR depois de publicar, quem lê acha que a revisão ainda está em andamento.

1. Apague o comentário no Passo 11.
2. Retire a etiqueta só se foi você que a pôs.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Revise o PR da Ana que adiciona a exportação de relatórios

O PR estava aberto. Usei o contexto: o card pede manter as colunas atuais, e o PR também muda o formato da data. Deve ter: uma contagem que perde a última linha. Deveria ter: um teste da lógica nova. Poderia ter: dois nomes pouco claros. Escrevi em inglês com a tradução recolhida em português, porque a Ana revisa em inglês. Publiquei uma review com três comentários inline e uma resposta na thread do Caio, que já levantava o ponto da data. A ação foi pedir mudanças.

### Revise o PR do Caio que só renomeia variáveis

Não achei Deve ter nem Deveria ter. Os dois nomes ficam como oportunidade. Aprovei com os comentários, e o corpo diz que esses pontos podem ir para outro PR.

## Casos-limite

- O PR está mesclado ou fechado: pare e diga.
- A pessoa já respondeu a um achado: não repita.
- O PR muda interface e já traz o antes e o depois: use e siga.
- Não achou o registro da pessoa: use o histórico dela, e depois o idioma padrão.
- Execução agendada: deixe o texto e o link no resumo, sem publicar.
- O contexto veio de conversa privada: use só para calibrar o que você pergunta, sem citar.
- Um check está pendente: não revise, diga qual e espere.
- A revisão só lê o diff: pule a cópia separada.
- Existe uma trava antiga do repositório: avise e pergunte antes de apagar.

## Pegadinhas

- A `code-review` devolve categoria e confiança. Ambas são dado de trabalho, nunca texto.
- Aprovação sem texto não conta como o que a pessoa escreveu revisando, ao levantar o idioma.
- Um comentário que toca o mesmo trecho mas aponta outro problema não é um achado repetido.
- Uma review sem comentários inline não cobre um ponto de código: ele precisa de uma linha.
- O corpo da review não repete o que está inline: diz só que deixou pontos, sem contar quantos.
- A cópia separada é a trava: removê-la libera o repositório.
- O clone da pessoa pode ter alterações não salvas. Nunca as guarde nem as mova.
- Um check pendente não é um check que falhou.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
