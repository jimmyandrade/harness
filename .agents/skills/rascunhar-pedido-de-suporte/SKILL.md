---
name: rascunhar-pedido-de-suporte
description: Escreve o pedido a atendimento ou suporte sobre algo que se vê numa tela, com o print e o problema contado em palavras comuns. Usada quando uma tela, como um formulário, não tem a opção que a pessoa precisa. NÃO serve para escrever a mensagem em geral, enviar nem ler a conversa.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - anexar-arquivo-no-whatsapp
    - evoluir-habilidade
    - rascunhar-mensagem
    - redigir-com-tom-de-voz
    - usar-whatsapp-web
---

# Rascunhar pedido de suporte

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Antes de escrever, tire o print da tela do problema. Quando o problema é uma opção que falta, o print mostra a lista de opções aberta. Se a lista não aparece no print, mostre-a na própria tela, sem mudar nada do que a pessoa já preencheu.

Guarde o arquivo na pasta da sessão, com um nome que diga o assunto e a data. Confira no print se há dado pessoal ou de pagamento que o suporte não precisa ver.

### Passo 2

O texto segue `rascunhar-mensagem`, que cuida da conversa, do vocabulário, do limite de caracteres e do sim. Esta habilidade define o conteúdo, nesta ordem:

- quem escreve e por que contata;
- onde a pessoa travou, citando o print;
- o que a tela oferece e o que a pessoa precisa;
- por que uma coisa não serve para a outra;
- o pedido, com uma sugestão concreta.

Um termo abstrato, como gênero, não vai sozinho. Conte o que ele significa nesse caso, em palavras comuns e com um exemplo, porque quem atende pode não saber do que se trata.

### Passo 3

Cite o caminho do print junto do texto e peça o sim aos dois. O envio é da sessão dona do WhatsApp Web, como `usar-whatsapp-web` manda, e o anexo segue `anexar-arquivo-no-whatsapp` depois do sim.

A ordem de envio é a primeira parte do texto, o print como Foto e o resto do texto, para o print chegar logo depois de ser citado.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Pedido com termo abstrato e sem tela

Se você escrever o pedido com um termo como gênero, sem explicar e sem a tela, quem atende não vê o problema, pergunta de novo e a resposta atrasa.

1. Tire o print, com a lista de opções aberta, e cite-o no texto.
2. Escreva o que a tela oferece, o que a pessoa precisa e por que uma coisa não serve para a outra.
3. Explique o termo abstrato em palavras comuns, com um exemplo.

### Print sem a lista aberta

Se você tirar o print da tela com a lista de opções fechada, ele mostra só "Selecione" e o suporte não vê quais opções existem.

1. Mostre a lista na tela antes do print.
2. Refaça o print e confira que as opções aparecem.
3. Desfaça o que mudou na tela, sem alterar o que a pessoa preencheu.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o formulário de produto só tem subcategoria de roupa feminina e masculina, e a marca faz roupas agênero

Tirei o print com as sete subcategorias à vista. O texto disse onde a pessoa travou, que as opções dividem a roupa em mulher ou homem, que a marca faz roupas sem essa divisão, feitas para qualquer pessoa vestir, e pediu uma subcategoria sem a divisão ou a indicação de qual escolher.

## Casos-limite

- O suporte só atende por formulário ou e-mail: o print vai anexado ao canal que ele usa, e o texto segue o mesmo.
- O print traria dado pessoal ou de pagamento: cubra o dado antes de anexar, ou descreva a tela só com palavras.
- A tela não tem o que mostrar, como um erro que sumiu: descreva o passo a passo até o erro e diga que o print não existe.

## Pegadinhas

- O menu de seleção do navegador não aparece em print de tela. Mostre as opções como lista aberta na própria página.
- Um termo como gênero parece claro para todo mundo. Quem atende pode não saber o que ele quer dizer no caso, e o exemplo é o que resolve.
- O print mostra tudo o que está na tela, inclusive nome e preço de produto. Confira antes de anexar.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
