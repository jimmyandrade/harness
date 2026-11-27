---
name: cadastrar-foto-de-moda
description: Registra e classifica cada foto de moda, com tipo, ângulo, cena, vínculos, nome do arquivo, texto alternativo, status e histórico. Usada quando uma foto de peça ou look chega, é migrada, revisada ou aprovada, mesmo sem dizer registro. NÃO serve para tratar ou recriar a imagem nem para publicar a foto.
compatibility: O rascunho local do texto alternativo precisa de Python e de um macOS 27 ou superior com swiftc.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  aliases:
    - definir-foto-de-moda
  related:
    - tratar-foto-de-moda
    - definir-pessoa
    - escrever-link
    - evoluir-habilidade
---

# Cadastrar foto de moda

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Fonte dos tipos de fotografia de moda` aponta a lista dos tipos e das orientações de cada um. Vazia, pergunte e pare.
"Fonte dos tipos de fotografia de moda": ""
# `Status da foto` lista os estágios, do primeiro ao último. A foto só passa dos três primeiros depois da validação visual.
"Status da foto": "Original anexada, Precisa gerar, Precisa revisar, Aprovada, Publicada"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

A lista de fotos de moda do mapeamento de dados é a fonte da verdade das fotos originais, das tratadas, dos nomes de arquivo, dos textos alternativos, do status e das observações de fidelidade. Sem ela, pergunte e pare. Não use a lista de outro workspace.

Salve cada foto original na hora, quando a peça ou o look puder ser identificado com segurança. Não guarde na memória da conversa se a foto era de frente, costas ou detalhe. Se a peça, o look, o ângulo ou o tipo não estiverem seguros, pergunte antes de gravar.

Quando outro trabalho precisa das fotos de um produto, como um material para um terceiro, procure antes na lista de fotos de moda e nos campos de foto do produto, tratada e bruta. Se estão vazios, diga na hora que o produto não tem foto no cadastro e qual é a fonte provável, como o álbum da marca num serviço de fotos, e peça à pessoa o link do álbum ou os arquivos. Não tente abrir um serviço que a sessão não tem conector para acessar, e não comece o material sem foto nem invente uma.

### Passo 2

Abra e analise cada arquivo antes de responder ou gravar tipo, ângulo, cena, nome, texto alternativo ou observações. Nome de arquivo, título, fórmula, propriedade legada e classificação anterior não bastam. A leitura visual vence o metadado herdado, e a inconsistência vai para a pessoa antes de aprovar.

Sem conseguir abrir um arquivo, diga isso, não afirme com certeza e deixe o status em `Precisa revisar`.

### Passo 3

Leia os tipos de `Fonte dos tipos de fotografia de moda` e classifique cada imagem. Pessoa, corpo, rosto, mão, braço, tatuagem ou alguém segurando a peça nunca é produto isolado: use o tipo com pessoa. Peça dobrada ou empilhada recebe o ângulo `Dobrado`, sem trocar o tipo, e `dobrado` entra no nome do arquivo.

Tipo, ângulo, nome do arquivo e texto alternativo descrevem a mesma imagem e a mesma finalidade. Confira os quatro juntos antes de concluir.

### Passo 4

Cada registro é uma cena ou finalidade. Reúna as originais só quando têm a mesma peça, a mesma pessoa modelo, a mesma cena e a mesma finalidade, e separe por ambiente interno ou externo, por teste ou ajuste, por look completo e por peça isolada. Várias originais da mesma pessoa com a mesma peça na mesma cena ficam num registro só.

Prancha, board, mockup e imagem conceitual entram como referência, nunca como foto final. Não crie registro só com nome de arquivo ou texto alternativo legado: o registro existe quando há ao menos uma imagem, ou quando a pessoa pede um pendente.

### Passo 5

Nenhuma imagem útil se perde. Antes de tirar uma imagem de um registro errado, salve-a em outro registro adequado. Pergunte antes de apagar qualquer arquivo.

Numa migração de campos legados de peça ou look, trate cada arquivo como imagem individual. Um campo chamado "pronto para publicar" pode conter editorial, flat lay ou look, e a imagem decide, não o nome do campo. Se a mesma foto já existe, vincule a que existe. Sem capacidade de validar visualmente, migre separando por nome e indício de cena, com `Precisa revisar`.

### Passo 6

Preencha a peça quando há uma peça principal, e o look quando a imagem é uma combinação cadastrada. Uma foto pode ter os dois, só a peça ou só o look. Não force um nem outro. Foto de look sai no registro de foto de moda, e os campos de arquivo do cadastro do look não recebem foto nova.

Com pessoa modelo identificável, a pessoa vem da lista de pessoas, nunca de um usuário do espaço de trabalho. Sem a pessoa vinculada, não aprove nem publique: pergunte qual cadastro é.

Antes de dizer que a foto foi salva, confira as relações dos dois lados: a foto aponta a peça e o look, e a peça e o look apontam a foto.

### Passo 7

O título do registro é o nome do arquivo, sem extensão, em minúsculas, sem acento e com hífens, como `jaqueta-vestido-detalhe-close`. Normalize a sugestão de título antes de usá-la e corrija na hora um título em formato humano, sem esperar o pedido. Sem certeza, grave um nome provisório e `Precisa revisar`.

O texto alternativo descreve só aquela imagem e os elementos visíveis nela. Quando a peça é renomeada, revise o nome do arquivo, o texto alternativo e as observações de todas as fotos dela, sem mexer nos arquivos. Antes de aprovar, o título não tem extensão, maiúscula, acento, espaço nem pontuação decorativa.

Uma foto sem texto alternativo recebe uma proposta, sem esperar o pedido. Numa sessão local num macOS 27 ou superior, gere o rascunho com o script de rascunho local, que usa a leitura do Vision e o modelo do Foundation Models com a imagem anexada, e dê a peça, o tipo e o ângulo do registro como contexto. Fora disso, ou quando o script diz que o rascunho local não está disponível, escreva a proposta a partir da imagem aberta e diga isso.

O rascunho local é ponto de partida: confira cada afirmação dele contra a imagem aberta e corrija antes de mostrar. Mostre a proposta ao lado do link do registro e só grave o texto com o sim da pessoa.

### Passo 8

Foto original não vai para o campo da foto tratada só para preenchê-lo. Sem imagem final diferente das originais, a tratada fica vazia e o status é `Precisa gerar` ou `Precisa revisar`. Original e tratada com os mesmos arquivos é inconsistência: limpe a tratada e registre que falta a imagem final.

O status reflete o estágio real. `Aprovada` e `Publicada` só depois da validação visual, da comparação com as originais e da pessoa modelo vinculada, quando há pessoa. Imagem gerada por IA é referência conceitual: registre isso nas observações e não a aprove só por estar bonita. Na dúvida entre referência e foto tratada, escolha referência.

### Passo 9

O histórico de cada tentativa fica nos comentários do registro, não no corpo da página nem nas observações. Leia os comentários antes de agir. Cada comentário diz a data, o objetivo, as referências, o resultado da revisão, as falhas e a decisão, em linguagem que a equipe entende. Tentativa reprovada também entra, dizendo que não se aprova nem se publica. Uma decisão do produto todo vai também num comentário resumido na peça.

As observações de fidelidade guardam só o estado atual: riscos abertos, referências vigentes e o que validar na próxima versão. Cronologia achada ali vai para os comentários.

### Passo 10

Valide antes de responder. Corrija e repita até passar.

- [ ] Cada imagem foi aberta e analisada, ou a limitação foi dita.
- [ ] Tipo, ângulo, nome do arquivo e texto alternativo descrevem a mesma imagem.
- [ ] Cada foto sem texto alternativo tem uma proposta conferida contra a imagem, ainda não gravada sem o sim.
- [ ] Cada registro tem uma cena e uma finalidade, e nenhuma imagem útil foi apagada.
- [ ] Os vínculos da peça, do look e da pessoa modelo existem dos dois lados.
- [ ] A tratada não repete as originais, e o status vale o estágio real.
- [ ] O histórico está nos comentários.
- [ ] Cada registro que a resposta cita, inclusive os de um lote, leva o link da página, como `escrever-link` manda.

### Passo 11

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`. O tratamento e a recriação da imagem seguem `tratar-foto-de-moda`.

## Problemas comuns

### Classificação pelo nome do arquivo

Se você classificar pelo nome, pelo título ou pelo campo de origem, uma foto com pessoa fica como produto isolado.

1. Abra a imagem.
2. Corrija o metadado que a imagem contradiz e registre a correção.

### Lote tratado como uma cena

Se você salvar várias imagens de um campo legado num registro só, cenas diferentes se misturam e viram referência de geração.

1. Classifique cada arquivo.
2. Separe por cena e finalidade, salvando antes de remover.

### Original copiada como tratada

Se você preencher a foto tratada com as originais, o registro parece pronto e não tem imagem final.

1. Deixe a tratada vazia.
2. Mantenha `Precisa gerar` ou `Precisa revisar`.

### Histórico no campo de observações

Se você escrever a cronologia nas observações, o estado atual se perde no diário.

1. Mova a cronologia para os comentários.
2. Deixe nas observações só o estado atual.

### Rascunho local gravado sem conferir

Se você gravar o texto alternativo que o modelo local devolveu, a foto fica com manga, cor ou enquadramento que a imagem não mostra.

1. Abra a imagem e confira cada afirmação do rascunho.
2. Corrija o que a imagem contradiz e troque "peça" pelo nome da peça.
3. Mostre a proposta e grave só com o sim da pessoa.

### Foto procurada só depois do material

Se você começar um material com fotos de produto sem olhar os campos de foto do cadastro, a falta só aparece no meio do trabalho.

1. Confira a lista de fotos de moda e os campos de foto do produto antes de começar.
2. Com os campos vazios, diga a fonte provável e peça o link do álbum ou os arquivos.
3. Não tente acessar um serviço sem conector.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### salve estas 3 fotos da jaqueta, uma é de pessoa usando em casa e duas são da peça sozinha

Abri as três. Criei dois registros: um da peça isolada com as duas originais e outro com pessoa usando, vinculado à pessoa do cadastro. Os nomes saíram como `jaqueta-frente` e `jaqueta-pessoa-usando-interno`, a tratada ficou vazia e o status ficou `Precisa gerar`.

### proponha o texto alternativo das fotos que ficaram sem

Gerei um rascunho de cada foto no próprio computador, com a peça, o tipo e o ângulo do registro como contexto. O rascunho do boné dizia "manga curta", e a imagem mostrava só o boné e a camiseta: corrigi. Mostrei cada proposta com o link do registro e não gravei nenhuma antes do sim.

## Casos-limite

- Um material precisa de fotos de produtos e os campos de foto estão vazios: diga a fonte provável, peça o link do álbum ou os arquivos e não acesse um serviço sem conector.
- A foto mostra uma pessoa e a pessoa não está no cadastro: não crie nem vincule em silêncio, pergunte.
- O arquivo não abre: diga, não confirme o ângulo e deixe `Precisa revisar`.
- A sessão não é local, o macOS é anterior ao 27, ou o modelo local não está disponível ou recusa a imagem: não rode nem conserte o script, escreva a proposta a partir da imagem aberta e diga que não houve rascunho local.
- A foto mistura peça dobrada e aberta: dois registros.
- A pessoa quer separar por ângulo dentro da mesma cena: separe, porque ela pediu.
- Existe campo de arquivo no look com foto antiga: avise que a fonte é o registro de foto, migre e pergunte antes de limpar.

## Pegadinhas

- A relação espelhada nem sempre se atualiza sozinha. Confira a peça e o look, e atualize à mão quando faltar.
- Um registro com a mesma pessoa e cenas diferentes parece uma coisa só. Cena e finalidade decidem, não a pessoa.
- A sugestão de título é leitura humana. Ela tem maiúscula, acento e travessão, e não serve de nome de arquivo sem normalizar.
- Um título em formato humano parece inofensivo. Ele quebra a busca e o nome do arquivo.

- O rascunho do modelo local parece descrever a foto. Ele chama a peça de "peça", inventa manga e troca o enquadramento, e só a imagem aberta decide.
- A leitura local falha em silêncio dentro de um sandbox e devolve rótulos vazios. Rode o script fora dele antes de concluir que a imagem não tem o que ler.
- O filtro do modelo local recusa uma foto de roupa comum de vez em quando. A recusa não diz nada sobre a foto: siga pela imagem aberta.

## Scripts disponíveis

- `draft_alt_text.py` imprime em JSON os rótulos do Vision, o número de pessoas e o rascunho do texto alternativo de uma foto. Só roda numa sessão local num macOS 27 ou superior, com `swiftc`.
- `draft_alt_text.swift` é compilado por `draft_alt_text.py`. Não rode este arquivo direto.

1. Numa sessão local num macOS 27 ou superior, com o repositório: `python3 -I scripts/draft_alt_text.py "<imagem>" "<peça, tipo e ângulo do registro>"`, fora do sandbox.
2. A primeira execução compila com `swiftc` e guarda o binário. Não usa rede. As seguintes usam o cache.
3. Quando o script responde `local draft unavailable`, e em qualquer outro ambiente, como o Notion, não há rascunho local: o passo segue pela imagem aberta.
