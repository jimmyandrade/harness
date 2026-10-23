---
name: lancar-despesa-da-empresa
description: Use essa habilidade sempre que for buscar ou registrar gasto da empresa, inclusive nota, recibo, comprovante ou transação lidos de imagem sem pedido escrito. NÃO use para venda, gasto pessoal, cadastrar oportunidade, atualizar inscrição, criar tarefa, montar agenda nem cadastrar ativo.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-query-data-sources notion:notion-create-pages notion:notion-update-page notion:notion-create-comment
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.8.0"
  aliases:
    - definir-despesa
    - lancar-despesa
  related:
    - definir-ativo-imobilizado
    - definir-empresa
    - definir-lancamento
    - identificar-duplicata
    - lancar-despesa-pessoal
---

# Lançar despesa da empresa

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Moeda` é a moeda das contas. `Moedas estrangeiras` lista as outras moedas em que a empresa paga.

```yaml
"Moeda": "BRL"
"Moedas estrangeiras": []
```

## Instruções

### Passo 1

Pagamento, taxa, comprovante, custo, investimento, boleto, Pix, fatura ou inscrição paga é esta habilidade. A pessoa informa o data source na execução. Sem essa indicação, use a lista do mapeamento de dados do projeto. O nome de cada propriedade vem desse mapeamento. Se a lista de despesas e investimentos não estiver no workspace conectado, pare. Não use a lista de outro workspace. A relação com `definir-ativo-imobilizado` é rastrear o lançamento financeiro que originou a compra ou aquisição do ativo. A página do bem fica naquela habilidade. Não crie a página do ativo aqui.

```mermaid
flowchart LR
  Q{O pedido é?} -->|gasto da empresa| A[Lança aqui]
  Q -->|venda ou frase mista| L[definir-lancamento]
  Q -->|página do bem durável| I[definir-ativo-imobilizado]
```

Venda ou frase que mistura venda, gasto e estoque segue `definir-lancamento`. Esta habilidade grava o gasto da empresa.

Antes da primeira chamada no Notion, identifique o tipo da entidade pelo mapeamento ou pelo contexto estruturado. Não deduza o tipo só pelo título ou por um UUID.

```mermaid
flowchart LR
  A{Entidade identificada} -->|fonte de dados ou relação dataSourceUrl| S[notion_load_data_source com a URL da fonte]
  A -->|banco identificado como banco| B[notion_load_database com a URL do banco]
  A -->|página ou modelo| P[notion_load_page com a URL da página]
  A -->|tipo incerto| C[Confirme no mapeamento ou no contexto antes de chamar]
```

Preserve as URLs retornadas. Não transforme o UUID de uma fonte em URL de banco ou página. Um modelo é uma página: seu `parent.url` identifica a fonte, não a URL do banco. Leia o esquema da fonte antes de consultar ou gravar suas propriedades.

Erro genérico de acesso descreve a chamada que falhou, não prova a causa nem a falta de acesso ao banco inteiro. Confira os argumentos e o tipo da entidade. Corrija a chamada somente com evidência de incompatibilidade; não repita a mesma chamada, não alterne carregadores por tentativa e não contorne uma negativa real. Uma leitura bem-sucedida da fonte ou do modelo é evidência de leitura desse recurso, não garantia de acesso a todos os registros nem de escrita. Com a fonte corretamente carregada, continue a busca de duplicata e o fluxo do gasto, sem pedir que a pessoa libere um acesso cuja ausência não foi demonstrada. Se a chamada correta continuar bloqueada, informe a operação e o erro retornado, diga que a causa específica não foi informada e não afirme que houve lançamento.

### Passo 2

Busque antes de criar, sem pedir autorização para a leitura. Compare recebedor e suas variações de nome, documento ou cobrança, valor, data e meio de pagamento. Um valor igual sozinho não confirma duplicata. Uma nota e um print da mesma transação são evidências de um lançamento, não duas despesas.

```mermaid
flowchart LR
  A[Busca o lançamento] --> B{Mesmo gasto?}
  B -->|sim| C[Reutiliza e complementa evidências]
  B -->|duvidoso| D[Pergunta sem criar outro]
  B -->|não encontrado| E{Gasto da empresa?}
  E -->|confirmado ou inferível do contexto| F{Identificação, classificação e dados financeiros suficientes?}
  E -->|incerto| G[Pergunta se é gasto da empresa]
  E -->|pessoal| H[lancar-despesa-pessoal]
  F -->|sim| I[Registra nesta execução]
  F -->|não| J[Pergunta só o dado ausente]
  G --> K{A pessoa confirmou?}
  K -->|sim| F
  K -->|não| H
```

A inferência precisa de evidência no contexto da empresa, no produto ou na finalidade informada. Ter um comprovante ou um CPF não basta. Não exija a palavra "lançar". A leitura não prova que a busca ou a gravação já aconteceu.

### Passo 3

Antes de qualquer gravação, confira e marque este checklist com o que a evidência e o contexto já sustentam:

- [ ] Produto ou serviço exato e finalidade do gasto, confirmados pela pessoa ou discriminados na evidência.
- [ ] Natureza pessoal ou da empresa, sem confundir quem pagou com quem deve.
- [ ] Dados necessários à categoria e aos vínculos aplicáveis no mapeamento: por exemplo, o veículo ou a obrigação a que o gasto pertence.
- [ ] Valor, datas e situação do pagamento sustentados pela evidência, conforme o tipo de cobrança.
- [ ] Busca de duplicata concluída antes de criar.

O recebedor e a modalidade Pix não identificam o produto nem sua finalidade. Dizer apenas “despesa pessoal” ou “despesa da empresa” só confirma a natureza. Consulte o contexto e os registros relacionados; reúna as perguntas que faltam, espere as respostas e só depois grave. Não repita perguntas já respondidas nem exija campos sem relação com o gasto. Não use nome genérico de recebedor como substituto da identificação.

Use apenas categorias e relações existentes, sustentadas pelos dados confirmados. Sem propriedade de categoria no mapeamento, informe a limitação; não crie estrutura nem grave uma categoria inventada no corpo. Isso não impede registrar um gasto já identificado com os vínculos disponíveis. Uma informação opcional ausente não substitui a identificação obrigatória do produto e da finalidade.

Resolva a empresa recebedora com o nome e o CNPJ da evidência, inclusive ao complementar uma despesa já salva. Use `identificar-duplicata` antes de criar. A instituição de pagamento não é a empresa recebedora. Não deduza a razão social completa de um nome comercial.

```mermaid
flowchart LR
  A[Busca a empresa pelo nome, variações e CNPJ] --> B{Resultado}
  B -->|equivalente confirmado| C[Vincula a empresa existente à despesa]
  B -->|identidade ambígua| D[Pergunta qual empresa antes de criar ou vincular]
  B -->|nenhum equivalente| E{Identificação suficiente e cadastro permitido?}
  E -->|sim| F[Segue definir-empresa com os dados comprovados]
  F --> G[Vincula a página devolvida à mesma despesa]
  E -->|não| H[Propõe o cadastro e pede só o dado ou a autorização necessária]
```

Não encerre com apenas "empresa não cadastrada" ou "vínculo pendente": entregue a ação realizada ou a proposta concreta e o bloqueio. Reaproveite a leitura e os comprovantes; cadastrar a recebedora não cria outra despesa. Nome no título, no assunto do comprovante ou nas observações não substitui a relação com a empresa. Confira o vínculo salvo e preserve a conta, a pessoa pagadora e os anexos já confirmados. Não infira que o nome exibido no Pix seja dono, contato ou responsável pela empresa.

Grave os dados nas propriedades mapeadas, não no corpo. Separe a data do documento da data de pagamento. Não invente valor, data, conta, finalidade, categoria nem parcelas. Campo opcional ausente fica pendente; produto, finalidade e informação necessária à classificação não são opcionais. Depois do checklist completo, a pendência opcional não impede o lançamento. Preserve o modelo da página.

Anexe os originais na propriedade mapeada de comprovantes, sem novo reconhecimento. Mantenha as evidências anteriores ao complementar um lançamento. Preserve os dados confirmados e pergunte sobre conflito antes de sobrescrever. Uma transação ainda em processamento não equivale a conciliação concluída; uma cobrança sem confirmação não equivale a pagamento.

Pagamento numa moeda de `Moedas estrangeiras`: grave o valor original, o câmbio, a data e a fonte do câmbio, e o valor convertido na `Moeda`. Sem o câmbio na evidência, pergunte. Não invente o câmbio.

### Passo 4

Confira o registro salvo, os anexos e o vínculo da empresa recebedora. Entregue a página do lançamento e as pendências, distinguindo o dado que falta de um cadastro ainda não encaminhado. Diga o que foi encontrado, criado ou complementado; não apresente transcrição como lançamento. O lançamento é a origem financeira da compra. A página do bem, a separação entre ativo e estoque e a compra de item controlável ficam com `definir-ativo-imobilizado`.

## Problemas comuns

### Comprovante sem identificação do gasto

Se você gravar só com recebedor, valor e data, a despesa entra sem saber o que foi comprado nem como categorizá-la.

1. Confira o checklist antes de gravar, inclusive ao complementar um registro.
2. Pergunte o produto ou serviço, a finalidade e os dados de classificação ainda ausentes.
3. Espere a resposta e atualize o mesmo lançamento, preservando o comprovante e sem duplicar.

### Ativo criado na despesa

Se você criar a página do bem nesta habilidade, o lançamento e o ativo se misturam.

1. Rastreie o lançamento que originou a compra.
2. A página do bem fica em `definir-ativo-imobilizado`.
3. Não crie a página do ativo aqui.

### Lançamento inventado

Se você inventar valor ou data, o lançamento deixa de ser a origem da compra.

1. Busque antes de criar.
2. Compare documento, recebedor, valor e data.
3. Registre só os dados da evidência e do contexto confirmado.

### Comprovante só transcrito

Se você parar na transcrição de uma despesa inferível ou confirmada, o gasto não entra na lista.

1. Busque o lançamento sem perguntar.
2. Siga a decisão do passo 2.
3. Confira a gravação antes de dizer que lançou.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### rastreie o lançamento dessa máquina

O lançamento que originou a compra é este. A página da máquina fica em `definir-ativo-imobilizado`. Não criei o ativo aqui.

### uma nota de tecido e o print da mesma compra no cartão; o gasto da empresa foi confirmado e ainda não está lançado.

Busquei pelo recebedor, documento, valor e data. Registrei um lançamento com as duas evidências. Não fiz dois lançamentos nem inventei a finalidade do tecido.

## Casos-limite

- A lista de despesas e investimentos não está no workspace conectado: pare. Não use a lista de outro workspace.
- O pedido é a página do bem durável: `definir-ativo-imobilizado`. Não crie o ativo aqui.
- Compra de item controlável ou separação entre ativo e estoque: `definir-ativo-imobilizado`. Não reescreva essas regras aqui.
- Falta conta de origem opcional, mas a identificação, a classificação e os dados financeiros estão sustentados: registre e entregue a pendência, sem adivinhar.
- Valor, data e natureza da empresa estão confirmados, mas falta o que foi pago ou sua finalidade: pergunte e aguarde antes de gravar.
- Venda ou frase mista: `definir-lancamento`. Não grave a venda aqui.

## Pegadinhas

- Rastrear o lançamento parece criar o ativo. O lançamento fica aqui. A página do bem fica em `definir-ativo-imobilizado`.
- Item controlável parece esta habilidade decidir o destino. A separação entre ativo e estoque fica em `definir-ativo-imobilizado`.
- Venda recebida na hora parece este gasto. A frase mista começa em `definir-lancamento`.
- O comprovante identifica a transferência, não necessariamente a compra. Recebedor e Pix não são produto nem finalidade.
- Nota fiscal e print de cartão podem ser o mesmo gasto. Dois arquivos não são duas despesas.
- Uma tela pode dizer "Crédito" como modalidade do cartão, não como entrada de receita.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
