---
name: definir-orcamento-de-fornecedor
description: Lê o orçamento ou a proposta que um fornecedor envia, por PDF, imagem, link ou mensagem, confere preço, prazo e validade, compara com a conversa e o registra onde o projeto indica. Usada quando chega orçamento de fornecedor. NÃO serve para pesquisar preço de compra, decidir se fecha, responder ao fornecedor nem lançar a despesa.
metadata:
  author: jimmyandrade
  version: "0.3.0"
  related:
    - conversar-no-whatsapp
    - definir-empresa
    - definir-localidade-geografica
    - definir-negociacao
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

Cada dado que tem propriedade própria no registro vai nela antes de nota ou comentário, e você confere isso antes de concluir: o identificador externo da fonte, como número de cotação, protocolo, pedido ou rastreamento; a empresa abordada; a data e a hora de início, reais quando a fonte as traz; o preço à vista, como valor numérico; e a categoria de custo, da lista de categorias do projeto.

Com mais de um identificador de naturezas diferentes, preserve todos ou peça confirmação antes de substituir o que já está. A conversa e a evidência datada ficam em comentário datado, mesmo com a propriedade preenchida.

Frete ou transporte de mercadorias leva também a localidade de origem e a de destino, da lista de localidades do projeto, reutilizando a que já existe. Se a fonte trouxer só o CEP, um endereço parcial ou o apelido de uma praça, grave a localidade só com correspondência segura, ou pergunte antes de criar uma.

O contato com um fornecedor, representante ou intermediário que viabiliza um negócio com um cliente, como pedir cotação, disponibilidade, amostra ou validação técnica, é evidência desse negócio mesmo quando quem responde não é o cliente. Ligue o orçamento à negociação do cliente e preserve os dois lados, o que se falou com o cliente e o que se falou com o fornecedor. Sem dados para ligar ao negócio com segurança, registre a pessoa fornecedora e diga o que falta.

Quando a pessoa recusa o orçamento, o estado da negociação diz o desfecho e o motivo vai na propriedade própria, sem virar outro estado. A opção do motivo nomeia a causa pela decisão de quem recusou, como encontrar outro fornecedor mais barato, e não por um rótulo que pareça vantagem da empresa recusada. A análise e a nuance da decisão ficam em comentário datado.

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

### Dado com propriedade própria deixado na nota

Se você deixar o protocolo, o preço à vista, a origem ou o motivo da recusa só na nota ou no comentário, o registro não filtra nem soma, e o dado se perde na próxima revisão.

1. Passe cada dado para a propriedade que o registro já tem, como o Passo 5 manda.
2. Deixe o histórico datado em comentário.
3. Falta a propriedade: diga qual e proponha criá-la. Não a crie antes do sim.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A gráfica mandou o orçamento das etiquetas no WhatsApp

Abri o PDF: 500 etiquetas a R$ 0,90 a unidade, R$ 450,00 no total, produção em 5 dias úteis, válido até sexta-feira, 20/11/2026. A conta fecha. Na conversa ela avisou que arte com fundo todo preto perde qualidade, e isso entrou como condição. Falta 1 dia útil para a validade. Registrei no histórico da negociação, com o link do arquivo.

### a transportadora mandou a cotação de frete com o protocolo e o preço à vista

Gravei o protocolo, a empresa abordada, o preço à vista em reais, a categoria de transporte de mercadorias e as localidades de origem e destino, reutilizando as que já existiam. A conversa ficou em comentário datado, e a negociação do cliente recebeu o link do orçamento.

## Casos-limite

- O orçamento tem vários itens e a conversa cita um: registre todos e destaque o citado.
- Só há o valor dito na conversa, sem arquivo: registre como valor verbal, sem validade, e peça o arquivo.
- O fornecedor ainda depende de um terceiro para fechar um item: registre o item como pendente.
- Há dois orçamentos do mesmo item: mostre os dois lado a lado, sem escolher.
- O registro não tem a propriedade de um dado, como o identificador externo ou o motivo da recusa: diga qual falta e proponha criá-la. Não ponha o dado na nota no lugar.
- O contato com o fornecedor não tem negociação de cliente para ligar: registre a pessoa fornecedora e diga o que falta para ligar sem duplicar.

## Pegadinhas

- O nome do arquivo, como "Proposta", não traz preço nem prazo. Só o arquivo aberto traz.
- A mensagem marcada como encaminhada pode ser um reenvio de outro orçamento, com número ou data diferente.
- No WhatsApp Web, o PDF de semanas atrás abre "Documento indisponível" quando já não está no celular. O reenviado no dia abre.
- O total de uma proposta pode já incluir o frete ou o imposto. Confira antes de comparar.
- O protocolo e o preço citados na conversa parecem bastar como registro. Sem a propriedade própria preenchida, o dado não filtra nem soma.
- O Notion lê o trecho entre dois cifrões sem barra como fórmula. Num texto com valor em reais, escreva `R\$ 10,00` e releia o campo depois de gravar. A propriedade numérica não precisa da barra.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
