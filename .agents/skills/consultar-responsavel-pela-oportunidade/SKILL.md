---
name: consultar-responsavel-pela-oportunidade
description: Pergunta ao responsável por uma oportunidade o que o regulamento não diz e a logística exige, pelos canais dele, e grava a resposta na oportunidade, no ponto de contato e nas notas do grupo. Usada quando a análise do regulamento deixa uma lacuna. NÃO serve para ler o regulamento, redigir no tom da marca nem acompanhar resposta já pedida.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - acompanhar-retornos-pendentes
    - analisar-regulamento-da-oportunidade
    - conversar-no-whatsapp
    - definir-agenda
    - definir-empresa
    - definir-grupo-de-oportunidades
    - definir-negociacao
    - definir-pessoa
    - definir-viagem
    - enviar-email
    - evoluir-habilidade
    - redigir-com-tom-de-voz
    - sincronizar-cronograma
---

# Consultar responsável pela oportunidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Sugestões ao responsável` é `sim`, `perguntar` ou `não`. Depois da oportunidade, `sim` e `perguntar` mandam a ele a lista do que faltou no regulamento, para o próximo, com o sim da pessoa a esse texto.
"Sugestões ao responsável": "perguntar"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba as lacunas de `analisar-regulamento-da-oportunidade`, ou da pessoa, cada uma com a pergunta e o motivo.
O responsável é quem decide ou informa pela oportunidade: o organizador de uma feira, a comissão de um edital, o gestor do local, o órgão público ou o suporte da plataforma.
Ache-o nas páginas da oportunidade e do ponto de contato, nos e-mails e nas conversas, e cadastre pessoa e empresa que faltem por `definir-pessoa` e `definir-empresa`.
Use o canal que a organização declara como oficial, como o e-mail do manual ou o grupo de expositores.
Sem o responsável identificado, pergunte à pessoa quem é. Não escreva ao primeiro contato que achar.

### Passo 2

Leia a conversa de cada canal antes de escrever, e tire a pergunta que a organização já respondeu, no grupo ou no manual.
O grupo de expositores costuma ser um canal só de comunicados da organização, em que a marca não escreve. A pergunta de uma marca vai no e-mail ou na conversa individual com o responsável.
Reúna as lacunas numa mensagem por canal, em lista numerada, uma pergunta curta e concreta por item.
O prazo da resposta vem uma vez, no fim, na frase cuidadosa do vocabulário, nunca como cobrança.
A pergunta que depende de um prazo vencido diz isso sem culpa e pede mesmo assim, citando o material que a empresa já enviou.
Numa conversa já aberta, a mensagem não diz de novo quem escreve.

### Passo 3

Passe o texto por `redigir-com-tom-de-voz`.
Mostre o rascunho inteiro de cada canal, o WhatsApp por `conversar-no-whatsapp` e o e-mail por `enviar-email`, e envie só com o sim da pessoa.
Com mais de um canal, pergunte se vai em todos. Um sim vale para um texto.
Antes de enviar, diga a pessoa o que a mensagem pede e o que a empresa ainda não fez, como um formulário vencido.

### Passo 4

Depois do envio, registre a espera por `acompanhar-retornos-pendentes`, sem criar rotina nova: uma linha no registro e a etiqueta de aguardando retorno.
Registre o prazo pedido e o canal.

### Passo 5

Quando a resposta chegar, compare cada item com a lacuna.
Resposta parcial: pergunte só o que faltou, no mesmo canal.
Resposta completa: grave a resposta onde ela serve a quem organiza.

1. Na página da oportunidade ou do ponto de contato, na propriedade que o mapeamento de dados indica. Sem propriedade para isso, diga a limitação e recomende a propriedade. Não crie nem renomeie propriedade em banco já cadastrado.
2. No cronograma, na viagem e na agenda, quando a resposta muda um horário, por `definir-viagem`, `sincronizar-cronograma` e `definir-agenda`.
3. Como lição nas notas do grupo de oportunidades, por `definir-grupo-de-oportunidades`, para a próxima edição.
4. No histórico da negociação, por `definir-negociacao`.

Documento, senha e número pessoal nunca vão para o registro.
A resposta vale para esta oportunidade e diz isso, até a pessoa dizer que vale para as outras.

### Passo 6

Cada lacuna que o responsável respondeu vira uma sugestão para o próximo regulamento: o que a empresa precisou perguntar e o texto não trazia.
Com `Sugestões ao responsável` em `sim` ou `perguntar`, depois da oportunidade, redija uma mensagem cordial com a lista, sem cobrança, e envie só com o sim da pessoa a esse texto.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Pergunta no grupo da organização

Se você escrever a pergunta da marca no grupo de expositores, ela fica exposta a todos e, quando só administradores escrevem, nem sai.

1. Leia as regras do grupo.
2. Mande a pergunta no e-mail ou na conversa individual.
3. Use o grupo só para o que o manual manda.

### Resposta que fica na conversa

Se você ler a resposta e não a gravar, a próxima edição e as outras sessões voltam a perguntar a mesma coisa.

1. Grave a resposta na oportunidade e no ponto de contato.
2. Atualize o cronograma se o horário mudou.
3. Leve a lição às notas do grupo de oportunidades.

### Pergunta já respondida

Se você perguntar o que o manual ou o grupo já responderam, o responsável percebe que a mensagem não foi lida.

1. Leia as fontes e a conversa.
2. Tire a pergunta respondida.
3. Pergunte só o que sobrou.

### Contato errado

Se você escrever ao primeiro contato que achar, a pergunta cai com quem não decide.

1. Confirme na oportunidade quem responde.
2. Sem essa informação, pergunte à pessoa.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o manual não diz se o carro entra na desmontagem, e o prazo da energia já passou

Li o manual e o grupo e vi que o grupo só aceita mensagem da organização. Redigi, para o e-mail e o WhatsApp do organizador, uma lista com o acesso do carro na montagem e na desmontagem e a necessidade de energia, dizendo que o prazo de sete dias úteis passou e citando o PDF que já tinha ido. Mostrei os dois textos e esperei o sim. Registrei a espera, com o prazo pedido.

### o organizador respondeu que o carro entra até as 21h

Gravei a resposta na página do ponto de contato e na viagem, atualizei o horário da desmontagem na agenda e deixei a lição nas notas do grupo. A resposta vale só para esta edição.

## Casos-limite

- O responsável não responde até o prazo: avise a pessoa e proponha o plano B, em vez de repetir a pergunta sem mudar nada.
- O canal oficial só aceita o formulário da organização: preencha o formulário com a pessoa, como a análise manda.
- A resposta contradiz o manual: guarde as duas e diga qual vale, a mais recente.
- A oportunidade é um edital e o responsável é um órgão público: o canal é o do edital, e o tom segue o da instituição.

## Pegadinhas

- O responsável parece sempre o organizador. Num edital, num espaço ou numa plataforma ele é outra figura.
- O grupo de expositores parece o canal da pergunta. Em geral só a organização escreve nele.
- A resposta de uma edição parece valer para a próxima. Ela fica registrada como daquela.
- A sugestão ao organizador parece reclamação. Ela vai depois da oportunidade, em tom cordial.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
