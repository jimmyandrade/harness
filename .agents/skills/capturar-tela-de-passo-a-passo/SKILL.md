---
name: capturar-tela-de-passo-a-passo
description: Captura o print de cada passo de uma tela, com o estado do passo à vista, o carregamento terminado e os dados pessoais cobertos, e entrega as imagens. Usada quando um artigo ou guia precisa de print, mesmo sem dizer print. NÃO serve para a prova visual de um pull request, nem para subir a imagem.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-artigo-da-base-de-conhecimento
    - evoluir-habilidade
    - registrar-evidencia-visual
---

# Capturar tela de passo a passo

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Sempre que um passo for de uma tela, capture um print dele.
Não pergunte se pode capturar: capture.
Ilustre com o máximo de prints úteis, não só os passos: o desenho de referência, cada estado do caso lado a lado e a ferramenta de apoio, como a aba de acessibilidade.
Uma comparação em imagem explica o que uma lista de passos não explica.
Num passo de aparelho físico, como ligar uma impressora ou encaixar o papel, não há tela para capturar: a foto que a pessoa manda é o print do passo, e a legenda diz o que ela mostra, como a cor da luz.
Peça a foto no próprio passo, com o aparelho no estado dele, em vez de esperar o fim do teste.

### Passo 2

Mostre na tela o estado do passo, como o menu aberto ou a janela com o botão, antes de capturar.
Antes de capturar, espere o carregamento terminar: imagens de capa, fontes e conteúdo que chega depois da tela.
Olhe a própria captura e confira que cada imagem apareceu. Um espaço vazio onde deveria haver foto manda esperar mais e capturar de novo.
Capture em tamanho cheio, sem reduzir a escala: um print reduzido sobe ilegível.
Numa tela que muda dados, abra o passo, capture e cancele. O passo que só aparece depois de salvar fica sem print.
Numa tela de login que a pessoa preenche, capture cada estado enquanto ela avança, porque depois do login não dá para voltar a essa tela sem sair da conta.
Quando a pessoa precisa fazer um passo à mão, como entrar numa tela com a própria senha, a mesma mensagem traz o passo a passo completo: o atalho ou o clique até a tela (inclusive como abrir uma janela anônima), o endereço por extenso, o que digitar em cada campo, o que deve aparecer e o que me mandar de volta.
Antes de pedir, deixe a tela pronta: saia da conta, abra a tela de entrada e deixe os campos à vista, e a pessoa só digita a senha.
Quando a pessoa avisar que entrou, leia o resultado na tela, capture o que o passo mostra e registre o achado nos artigos que ele toca, na mesma sessão, sem esperar outro pedido.

### Passo 3

Antes de entregar, cubra no print ou na foto o nome, o e-mail, o telefone, o nome do computador e outro dado pessoal de quem aparece, com um rótulo neutro como "e-mail pessoal", e confira a imagem coberta.
Se a imagem mostra um desses dados e não dá para cobri-lo, deixe-a de fora e descreva o passo no texto.
Quando o navegador deixa, cubra antes de capturar: troque na própria página o texto do nome, do e-mail e do telefone pelo rótulo neutro e esconda as fotos de perfil, e capture com a página já coberta.
Uma lista com várias pessoas também é coberta, linha por linha.

### Passo 4

Antes de dizer que não consegue capturar um passo, abra a tela em cada navegador que a sessão tenha, inclusive o que usa os logins da pessoa, e capture o estado do passo. A tela de login num navegador não encerra a tentativa: passe para o próximo.
Só deixe um passo sem print depois dessa tentativa, e diga qual ficou sem print e o que a tentativa mostrou, como um login que nenhum navegador da sessão tem.
Nunca escreva que não deu para capturar sem ter aberto a tela.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Print dispensado sem tentar

Se você escrever que o passo ficou sem print sem ter aberto a tela, o artigo sai sem imagem por uma suposição, e a pessoa descobre que o print era possível.

1. Abra a tela em cada navegador que a sessão tenha, inclusive o que usa os logins da pessoa, e capture o estado do passo.
2. Só com a tentativa feita em todos, diga qual ficou sem print e o que ela mostrou.
3. Ponha o aviso no topo do artigo com esse motivo.

### Print capturado antes de carregar

Se você capturar assim que a tela abre, uma foto que vem de fora ainda não carregou e o print sobe com um buraco no lugar dela, com uma legenda que descreve o que não aparece.

1. Espere o carregamento terminar antes de capturar.
2. Olhe a captura: espaço vazio onde deveria haver foto manda esperar mais e capturar de novo.
3. Depois de subir, abra cada imagem e confira o conteúdo, não só que ela carrega.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Capture o card nos dois temas para o artigo

Esperei a foto de capa carregar em cada tema, olhei cada captura antes de guardar e entreguei as duas imagens lado a lado, com o desenho de referência.

## Casos-limite

- A tela não abre na conexão, mesmo depois da tentativa de capturá-la: escreva o passo, diga qual ficou sem print e o que a tentativa mostrou.
- O passo é de um aparelho físico: não há tela. Peça a foto do passo à pessoa e use-a, com a legenda do que ela mostra.
- O pedido é a prova visual de um pull request: use `registrar-evidencia-visual`.

## Pegadinhas

- O print da tela inicial parece bastar. O passo mostra o estado em que a pessoa clica: o menu aberto, o submenu, a janela de busca.
- Esperar os prints da pessoa, ou perguntar se pode capturar, parece o caminho seguro. Quem escreve o artigo captura os prints que faltam, sem perguntar.
- A tela de login num navegador parece encerrar a tentativa. Outro navegador da sessão pode já ter o login da pessoa.
- Dizer que não dá para capturar parece uma resposta honesta. Sem a tentativa de abrir a tela, é uma suposição.
- Uma imagem que carrega parece uma imagem certa. Ela pode ter saído em branco, porque a captura veio antes de a foto carregar, e só abrir a imagem mostra isso.
- O Storybook guarda a última escolha do seletor de tema no navegador. Uma história pode abrir num tema diferente do endereço, então confira o estado na captura.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
