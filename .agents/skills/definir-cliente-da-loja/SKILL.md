---
name: definir-cliente-da-loja
description: Use essa habilidade sempre que for achar, criar ou atualizar o cliente de uma pessoa na loja do projeto, física ou virtual, inclusive de quem só demonstrou interesse e ainda não comprou, ou quando chegar o link de um cliente da loja, mesmo sem dizer cliente. NÃO use para cadastrar a pessoa na lista, venda, pedido, produto, tarefa de retorno nem consentimento de marketing.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-pessoa
    - identificar-duplicata
    - definir-tarefa
    - evoluir-habilidade
---

# Definir cliente da loja

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Campo do cliente na loja` é o nome da propriedade da lista de pessoas que guarda o link do cliente na base de clientes da loja. Vazio, o link fica nas notas.
"Campo do cliente na loja": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Ache o cliente na base de clientes da loja do projeto, física ou virtual, antes de qualquer escrita, pelo telefone e pelo e-mail da pessoa. Com o link de um cliente no pedido, leia esse cliente: nome, telefone, e-mail e data de criação.
Cliente não é só quem comprou: quem passou na loja física, num ponto de contato ou no site, demonstrou interesse e pediu retorno, ou disse que volta depois, também é cliente.
Use o meio que as instruções do projeto ordenam para a loja: linha de comando, API, MCP e, por último, o navegador.

### Passo 2

Ache a pessoa na lista de pessoas, como `definir-pessoa` manda: restrita à lista, pelo nome e pelo telefone.
Sem página, cadastre-a por `definir-pessoa` com o nome e o telefone do cliente, e volte aqui para ligar o link.

### Passo 3

Achado o cliente, atualize-o com o que a pessoa trouxe e não crie outro. Sem cliente, crie com o nome, o telefone, o e-mail e o idioma, sem consentimento de marketing.
Telefone vai no formato internacional. Celular do Brasil tem 9 dígitos depois do DDD, e a loja recusa o de 8: confira o número com a pessoa ou na conversa antes de gravar.

### Passo 4

Grave o link do cliente em `Campo do cliente na loja`, ou nas notas da pessoa quando o parâmetro está vazio. Releia a página antes de dizer que gravou.
O histórico das conversas fica nos comentários da página da pessoa, nunca na nota do cliente.
O interesse dela e o combinado, como quem chama quem e quando, entram em comentário datado na página da pessoa. O retorno combinado vira tarefa por `definir-tarefa`.

### Passo 5

Responda o que foi achado, criado ou atualizado, com o link do cliente e da página da pessoa, e o que ficou pendente, como o e-mail que nenhuma fonte trouxe.

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Link lido e respondido sem cadastrar

Se você ler o cliente da loja e só disser se a pessoa já está na lista, ela continua fora da lista e o próximo pedido repete a busca.

1. Busque na lista, restrita a ela, pelo nome e pelo telefone.
2. Sem página, cadastre por `definir-pessoa` no mesmo turno, sem perguntar.
3. Grave o link do cliente no campo.

### Cliente repetido na loja

Se você criar o cliente sem procurá-lo, a loja passa a ter dois com o mesmo telefone e a compra cai no que a pessoa não usa.

1. Procure pelo telefone e pelo e-mail antes de criar.
2. Achado, atualize esse cliente.
3. Com dois já existentes, liste-os e pergunte qual vale. Não apague.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a Dani Exemplo passou na loja física, gostou de uma peça e pediu que a gente chame na semana que vem

Busquei o cliente na base da loja pelo telefone que ela deixou e não achei. Busquei na lista de pessoas, restrita a ela, e também não. Cadastrei a página por `definir-pessoa`, criei o cliente sem consentimento de marketing e gravei o link no campo. O interesse e o combinado entraram em comentário datado, e o retorno virou tarefa por `definir-tarefa`.

### o link do cliente da loja de Caio Exemplo, que acabou de ser criado

Li o cliente: nome Caio Exemplo e um telefone, sem e-mail. Busquei na lista de pessoas, restrita a ela, pelo nome, pelo sobrenome e pelo telefone, e nenhuma casou. Cadastrei a página por `definir-pessoa` e gravei o link do cliente no campo. Não criei outro cliente. Ficaram pendentes o e-mail, a empresa e a localidade.

## Casos-limite

- O cliente existe e a pessoa não: cadastre a pessoa e grave o link. Não crie outro cliente.
- A pessoa existe e o cliente não, e `Cadastro na loja` está em `sim`: crie o cliente e grave o link.
- A pessoa não deixou telefone nem e-mail: não cadastre. Registre o interesse em comentário e diga o que falta.
- A pessoa só demonstrou interesse e não comprou: cadastre mesmo assim, com o interesse e o combinado em comentário.
- Dois clientes com o mesmo telefone: liste os dois e pergunte qual vale.

## Pegadinhas

- O cliente nasce na loja antes da pessoa na lista: uma compra ou um cadastro do site cria o cliente sozinho.
- Loja parece só a loja virtual, e cliente parece só quem comprou. A loja pode ser física, e quem só demonstrou interesse também entra na base.
- O número do WhatsApp parece completo. Num celular do Brasil ele pode vir sem o 9, e a loja recusa o de 8 dígitos.
- A linha do tempo do cliente parece o lugar da conversa. A API da loja pode não gravar comentário nela: a conversa fica na página da pessoa.
- A busca sem resultado no workspace inteiro parece prova de que a pessoa não existe. Ela pode não alcançar a lista de pessoas: restrinja a busca à lista.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
