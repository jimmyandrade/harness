---
name: preparar-itens-do-ponto-de-contato
description: Decide o que a empresa leva a um ponto de contato, a partir dos bens ligados a ele, do que a organização fornece e do que o regulamento pede, e cria a tarefa-checklist, com a conferência na volta. Usada ao organizar um ponto de contato físico ou ao saber o que levar. NÃO serve para cadastrar o bem, registrar o estado dele nem organizar a viagem.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - analisar-regulamento-da-oportunidade
    - definir-ativo-imobilizado
    - definir-tarefa
    - definir-viagem
    - evoluir-habilidade
    - inscrever-na-oportunidade
    - organizar-ponto-de-contato
    - procurar-tarefa
    - registrar-ciclo-do-ativo
---

# Preparar itens do ponto de contato

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Peça o ponto de contato ou a oportunidade. Se a pessoa passou o link, essa é a página. As listas e o nome de cada propriedade vêm do mapeamento de dados do projeto. Sem a página, pare.
A tarefa-checklist já existente para o ponto vem antes: confira com `procurar-tarefa` e atualize a que existe, em vez de criar outra.

### Passo 2

Junte, nesta ordem, o que o ponto leva:

1. Os bens ligados ao ponto na lista de ativos a levar. Cada unidade é uma linha, e a quantidade vem de quantas linhas estão ligadas.
2. Os suportes que a expografia do ponto cita, como uma arara.
3. O que o regulamento pede levar, como extensão, filtro de linha, adaptador e meio de pagamento próprio, lido da análise de `analisar-regulamento-da-oportunidade`.
4. O material que a organização pediu para validar.
5. O que se levou nos pontos anteriores do mesmo grupo de oportunidades e as lições nas notas do grupo.

Sem a ligação do ponto com os ativos no mapeamento, diga a limitação e recomende a propriedade. Não a crie sem a autorização da pessoa.

### Passo 3

Compare com o que a organização fornece, na propriedade de mobiliário da oportunidade.
O que ela fornece e a empresa também leva é pergunta: a empresa leva o próprio por escolha ou por esquecimento?
O que ela não fornece e a lista não tem é lacuna: pergunte à pessoa, com o item e a quantidade, antes de fechar a lista.
Não complete a lista pelo que se levou noutro ponto sem dizer que veio de lá.

### Passo 4

Crie a tarefa por `definir-tarefa`, no formato da tarefa da mala de um ponto anterior, com a oportunidade e o ponto ligados.
A definição de concluído tem um item por bem, com a quantidade, e termina com o item de que os bens foram conferidos na volta.
O prazo é a véspera da saída da viagem ou da montagem, lido de `definir-viagem`.
Pergunte quem responde. Não preencha responsável que a pessoa não disse.
Avise a pessoa antes do prazo, com o link.

### Passo 5

Depois do ponto, bem perdido, danificado ou emprestado segue `registrar-ciclo-do-ativo`.
O item que faltou e teve de ser comprado ou alugado vira lição nas notas do grupo, e a lista do próximo ponto o leva.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Item esquecido

Se você montar a lista só pelo que a pessoa lembra, mesa e cadeira ficam de fora ou vão sem precisar.

1. Junte as cinco fontes do Passo 2.
2. Compare com o que a organização fornece.
3. Pergunte só a diferença.

### Item alugado que a empresa tem

Se você deixar o formulário alugar mesa, balcão ou cadeira que a empresa tem, ela paga duas vezes.

1. Leia os ativos ligados ao ponto.
2. Responda ao formulário por `inscrever-na-oportunidade`.
3. Deixe o item no checklist.

### Checklist sem volta

Se você terminar a definição de concluído na ida, o bem some depois do ponto e ninguém registra.

1. Termine com o item de conferência na volta.
2. Registre o que se perdeu em `registrar-ciclo-do-ativo`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a organização fornece tenda e uma cadeira e não fornece mesa

Li os bens ligados ao ponto e o que o regulamento pede. A mesa não está fornecida e a empresa a tem: entrou no checklist. A cadeira fornecida não entrou. Criei a tarefa com um item por bem e o item da volta, com o prazo na véspera da saída.

## Casos-limite

- A oportunidade não tem a propriedade de mobiliário preenchida: peça à pessoa o que a organização fornece, não suponha.
- Ponto sem bens ligados: monte a lista pelas outras fontes e recomende ligar os bens.
- Ponto de um dia só, sem viagem: o prazo é a véspera da montagem.

## Pegadinhas

- A expografia parece a lista de mobiliário. Ela é de peça sobre suporte, e mesa e cadeira só entram por serem ativos ligados ao ponto.
- A mesa da empresa parece sempre necessária. Quando a organização fornece, ela fica em casa.
- Cada cadeira é uma linha de ativo: a quantidade é quantas linhas estão ligadas.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
