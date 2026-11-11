---
name: definir-orcamento-de-fornecedor
description: Lê o orçamento ou a proposta que um fornecedor envia, por PDF, imagem, link ou mensagem, confere preço, prazo e validade, compara com a conversa e o registra onde o projeto indica. Usada quando chega orçamento de fornecedor. NÃO serve para pesquisar preço de compra, decidir se fecha, responder ao fornecedor nem lançar a despesa.
metadata:
  author: jimmyandrade
  version: "0.2.1"
  related:
    - conversar-no-whatsapp
    - definir-empresa
    - evoluir-habilidade
    - lancar-despesa-da-empresa
    - procurar-email
    - reconhecer-imagem
    - redigir-com-tom-de-voz
    - usar-whatsapp-web
---

# Definir orçamento de fornecedor

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Registro do orçamento` é a habilidade ou o lugar onde o orçamento fica registrado, como o histórico da negociação. Vazio: mostre o resultado e pergunte onde gravar.
"Registro do orçamento": ""
# `Campos do orçamento` lista o que se extrai de cada item. O projeto acrescenta o que o fornecedor dele traz, como o número da proposta.
"Campos do orçamento": ["item", "quantidade", "preço unitário", "preço total", "prazo de produção", "prazo de entrega", "validade", "condições de pagamento", "frete"]
# `Aviso de validade em dias` é quantos dias antes do vencimento o orçamento já é avisado como perto de vencer.
"Aviso de validade em dias": 7
# `Conversa de reenvio do arquivo` é o nome da conversa de WhatsApp onde a equipe reencaminha o arquivo que o WhatsApp Web já não carrega, como a conversa de cada pessoa consigo mesma. Vazio: só peça o reenvio.
"Conversa de reenvio do arquivo": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Abra o orçamento, não só o nome do arquivo. Ele chega como PDF, imagem, link ou texto na conversa, no e-mail ou na reunião. Ler não pede confirmação.
Imagem segue `reconhecer-imagem`. Com o aviso de documento indisponível, procure o mesmo arquivo, pelo nome ou pelo número, em `Conversa de reenvio do arquivo`: é lá que a equipe o reencaminha. Sem ela, ou sem o arquivo lá, diga isso e peça que a pessoa o encaminhe pelo celular, sem procurar noutro lugar antes. O WhatsApp Web só abre o PDF recente.
O acesso ao WhatsApp Web segue `usar-whatsapp-web`: a mesma aba, pela sessão dona, sem abrir aba própria. No visualizador, o texto da página não traz o PDF: diminua o zoom, role e leia por captura de tela, até o rodapé, onde costuma estar a validade.
Um arquivo reenviado pode ser outro orçamento do mesmo fornecedor: confira o número e a data antes de tratá-lo como o já lido.

### Passo 2

Extraia `Campos do orçamento`, um bloco por item. Campo que o arquivo não traz fica como não informado: não deduza.
Confira a conta: quantidade vezes preço unitário bate com o total, a soma dos itens bate com o total geral, e frete e imposto estão dentro ou fora.

### Passo 3

Compare com a conversa e com os orçamentos anteriores do mesmo fornecedor e assunto: preço, quantidade, especificação e prazo.
O que o fornecedor disse no texto e o arquivo não traz, como uma restrição do material ou da arte, entra no resultado como condição.
Mostre a divergência à pessoa, não ao fornecedor.

### Passo 4

Compare a validade com hoje. Vencido, ou a menos de `Aviso de validade em dias`, diga e avise que fechar depois pede novo orçamento. Orçamento que o fornecedor ainda não terminou fica como pendente, com o motivo.

### Passo 5

Registre em `Registro do orçamento`, sem pedir antes, com o link do arquivo. Leve o link do registro na resposta e não diga que está registrado sem ele.
Aceitar, recusar ou fechar é da pessoa. Responder ao fornecedor segue `redigir-com-tom-de-voz`, e o gasto só vira despesa quando for pago, por `lancar-despesa-da-empresa`.

### Passo 6

Mostre um resumo curto: fornecedor, itens com preço e prazo, validade, condições, divergências e o link do registro.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Orçamento só citado

Se você citar o nome do PDF sem abri-lo, a pessoa não sabe o preço nem o prazo, e o registro fica sem o orçamento.

1. Abra o arquivo e extraia os campos.
2. Registre e leve o link na resposta.

### Conta que não fecha

Se você copiar o total do arquivo sem conferir, um erro do fornecedor entra no registro como verdade.

1. Confira unitário, quantidade, soma e frete.
2. Mostre a diferença à pessoa e registre o valor do arquivo com a observação.

### Validade ignorada

Se você registrar o preço sem a validade, a pessoa fecha depois do prazo e o fornecedor orça de novo.

1. Leia a validade, que pode estar só no rodapé.
2. Avise quando estiver vencida ou perto de vencer.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A gráfica mandou o orçamento das etiquetas no WhatsApp

Abri o PDF: 500 etiquetas a R$ 0,90 a unidade, R$ 450,00 no total, produção em 5 dias úteis, válido até sexta-feira, 20/11/2026. A conta fecha. Na conversa ela avisou que arte com fundo todo preto perde qualidade, e isso entrou como condição. Falta 1 dia útil para a validade. Registrei no histórico da negociação, com o link do arquivo.

## Casos-limite

- O orçamento tem vários itens e a conversa cita um: registre todos e destaque o citado.
- Só há o valor dito na conversa, sem arquivo: registre como valor verbal, sem validade, e peça o arquivo.
- O fornecedor ainda depende de um terceiro para fechar um item: registre o item como pendente.
- Há dois orçamentos do mesmo item: mostre os dois lado a lado, sem escolher.

## Pegadinhas

- O nome do arquivo, como "Proposta", não traz preço nem prazo. Só o arquivo aberto traz.
- A mensagem marcada como encaminhada pode ser um reenvio de outro orçamento, com número ou data diferente.
- No WhatsApp Web, o PDF de semanas atrás abre "Documento indisponível" quando já não está no celular. O reenviado no dia abre.
- O total de uma proposta pode já incluir o frete ou o imposto. Confira antes de comparar.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
