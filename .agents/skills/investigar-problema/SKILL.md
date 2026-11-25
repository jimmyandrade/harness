---
name: investigar-problema
description: Conduz a investigação de um problema, como um acesso bloqueado, um cadastro que falha em portal alheio ou um erro, com tarefa, fatos e hipóteses, e oferece artigo e post-mortem. Use sempre que alguém relatar um problema, como um preço errado, ou pedir "investigue isso" com um link, antes de ler. NÃO use para escrever o artigo, o post-mortem nem corrigir código.
metadata:
  author: jimmyandrade
  version: "0.4.3"
  related:
    - procurar-tarefa
    - definir-tarefa
    - definir-artigo-da-base-de-conhecimento
    - definir-post-mortem
    - definir-pessoa
    - acompanhar-retornos-pendentes
    - redigir-com-tom-de-voz
    - conversar-no-whatsapp
    - enviar-email
    - usar-whatsapp-web
    - evoluir-habilidade
---

# Investigar problema

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# `Registros ao fim da investigação` lista o que a habilidade oferece ao terminar. Cada item é feito só com o sim da pessoa.
"Registros ao fim da investigação":
  - "artigo da base de conhecimento"
  - "post-mortem"
# `Destino do dossiê` é o nome do banco ou do espaço, no sistema de conhecimento conectado, onde o dossiê de um problema em portal de outra empresa fica. Vazio, o dossiê vai na tarefa da investigação.
"Destino do dossiê": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba o problema: o que acontece, quem relatou, quando e onde.
Carregue esta habilidade antes de ler código ou de perguntar se a pessoa quer que você investigue: a pergunta já é o começo da investigação.
Quando o relato é uma mensagem ou thread do Slack, reaja a ela com o emoji de olhos (`eyes`) antes de ler os detalhes, para quem acompanha ver que alguém assumiu. Se a reação já estiver lá, não repita.
Leia o relato na fonte: o conector primeiro e, sem ele, cada navegador disponível, o interno do aplicativo e o da pessoa por extensão, que costuma já estar logado.
Só diga que falta acesso à fonte, ou peça à pessoa que entre nela, depois que todos esses caminhos falharam.
Uma página que só redireciona costuma oferecer o link para abrir no navegador: siga-o.
Siga `procurar-tarefa` com esse assunto. Sem tarefa, crie uma com `definir-tarefa`, com quem relatou e a data do relato.
Todo aviso de andamento a quem relatou leva o link da tarefa.

### Passo 2

Reúna os fatos antes de supor: a mensagem e os prints de quem relatou, o que a ferramenta mostra, os avisos recebidos e o que mudou antes do problema.
Leia a imagem que a pessoa mandou. Ela costuma trazer o aviso exato.
Corte os dados por página, origem de tráfego, dispositivo e versão antes de dizer que o volume é estável: a média do site inteiro esconde um aumento numa página só.
Separe o que foi visto do que se supõe.

Quando o problema é um cadastro ou um acesso que falha no portal de outra empresa, refaça o fluxo no navegador antes de cobrar o atendente.
Capture um print de cada etapa e as requisições de rede, com o erro exato da tela e o da resposta.
Abra primeiro o painel da conta, se o portal tiver um, e leia o estado antes de refazer o fluxo: o cadastro pode já existir.
Nas requisições, procure a API que a página chama, sem ler cookie, token nem endereço com parâmetros, e siga o que `acompanhar-retornos-pendentes` manda quando ela só aceita o token da sessão.
O nome que o cadastro leva e o que a conversa usa seguem `definir-pessoa`.

Confira o e-mail, porque o portal costuma mandar mensagem mesmo com erro na tela.
Abra o link de validação, que pode cair na página inicial sem confirmar nada, e tente a recuperação de senha, que muitas vezes destrava a conta criada pela metade.

Pare na senha. Quem a digita é a pessoa, ou o gerenciador de senhas a preenche. Você nunca a digita nem a grava, e ela não entra na tarefa, no dossiê nem na conversa.
Procure uma investigação que outro agente ou ferramenta já fez sobre o mesmo problema, como a de um agente do sistema de monitoramento na thread do alerta ou numa mensagem logo abaixo, e leia a causa, as evidências e os próximos passos dela.
A investigação paralela pode ainda estar rodando ou ter acabado depois do seu primeiro retorno. Releia a thread e o canal antes de encerrar.

Quando o que falha é um ambiente compartilhado, como um preview, o cluster de desenvolvimento ou o executor de integração contínua, procure antes o aviso do time no canal do ambiente e as execuções de manutenção, como a de limpeza.
O ambiente pode ter caído, e ser apagado e recriado, por um motivo que não vem da mudança que você testa.
Enquanto não souber o estado dele, não peça mais carga a ele, como publicar mais aplicações.

Quando o relato é o alerta de um monitor de anomalia, abra o monitor e leia a consulta, o agrupamento e a janela.
Compare o valor do alerta com a mesma hora dos dias anteriores antes de concluir que houve um pico: o monitor compara com um padrão de semanas passadas, e um valor dentro do normal desta semana pode disparar quando o tráfego sobe.

Quando o problema é um erro vindo do navegador de quem usa o site, leia a pilha: o começo do endereço de cada arquivo mostra quem escreveu o código, como uma extensão do navegador, o navegador interno de um aplicativo, um script de terceiro ou o pacote do próprio site.
Corte os eventos por navegador, dispositivo e versão e conte quantos eventos da família a pista cobre antes de propor um filtro.

### Passo 3

Liste as hipóteses, da que a evidência mais apoia para a que menos apoia.
Confira cada uma na fonte: a tela da ferramenta, o registro, a configuração ou quem administra.
Só leia nesse passo. Uma correção que muda algo, como uma permissão, um pagamento ou uma configuração, espera o sim da pessoa, com o que muda e o risco.
Cada hipótese e cada ponto que você ainda não conferiu e que dá para conferir, você confere antes de responder, no código, nos dados e nas ferramentas ao seu alcance. O objetivo é achar a causa.
Só fica como "não verificado" o que depende de um acesso que nenhum caminho ao seu alcance dá: diga qual fonte falta e quem tem.
Antes de responder, releia o que ficou sem conferir: o item que uma consulta ao seu alcance resolve volta para a investigação, e a resposta só sai quando a lista restante é de acesso que falta.
O limite que fala do ambiente em que algo roda, como o sistema, a arquitetura ou a versão, tem fonte própria: os registros das execuções reais, como o job de integração contínua, o nome do executor e o log do build. Leia-os antes de listar o limite.
Uma reprodução num exemplo mínimo prova o mecanismo, não o ambiente real. Diga o que ela cobre e rode no ambiente real o que estiver ao seu alcance.
Quando o código que reporta o erro já manda campos específicos, como o ponto da falha, o módulo e o status, e o monitor agrupa por um campo genérico, a causa do ruído está na definição do monitor e da métrica que ele lê.
Leia as duas antes de propor mudar o erro, porque a métrica gerada pode ter só algumas quebras.
Quando não achar o autor de um erro, deixe-o como hipótese, com os indícios que você viu e o que o repositório não tem. Não proponha descartá-lo nem corrigi-lo antes de confirmar.
Quando um erro é esperado ou não, quando uma taxa é alta ou normal, a resposta traz o número e a comparação, nunca "não verifiquei".
Cruze a sua conclusão com a da investigação paralela: diga onde concordam, onde divergem e o que cada uma viu que a outra não viu.
Quando a outra achou algo que você perdeu, corrija a sua conclusão e diga que mudou. Não proteja a primeira resposta.
Confira na fonte o que só a outra afirma antes de repetir como fato.

### Passo 4

Grave na tarefa o que achou: a causa, a evidência de cada conclusão, o que foi feito e o próximo passo com quem o faz.
Quando a causa está no portal de outra empresa, reúna tudo num dossiê, em `Destino do dossiê`, antes de cobrar o atendente: a linha do tempo com dia e hora, o print de cada etapa, as requisições, os e-mails que chegaram e o que cada tentativa devolveu.
O dossiê é o que o atendente recebe, para não ter de pedir de novo.

A mensagem ao atendente é um feedback, não uma cobrança: diz o que acontece, com os fatos e os prints, conta o que já foi tentado e pede a melhoria, como a correção do erro ou do link de validação.
Ela não leva tom de reclamação, de culpa nem prazo ameaçador.
O texto passa por `redigir-com-tom-de-voz`, e o canal segue `conversar-no-whatsapp` ou `enviar-email`.
Quando a pessoa precisa do suporte dessa empresa, acione na mesma rodada todos os canais que o site oferece, como e-mail, chat e WhatsApp, este pela sessão dona do WhatsApp Web, como `usar-whatsapp-web` manda.
O pedido da pessoa para acionar o suporte autoriza enviar a mesma mensagem em cada canal.
Diga o que cada canal respondeu, inclusive o horário de atendimento, e registre na tarefa.

Dê o retorno a quem relatou, com a causa em palavras simples, o que muda para ela e o link da tarefa.
Uma tarefa para corrigir o que achou só é oferecida depois que a causa está entendida e conferida. Antes disso, siga investigando.

### Passo 5

Ao terminar, pergunte se a pessoa quer cada item de `Registros ao fim da investigação`.
O artigo segue `definir-artigo-da-base-de-conhecimento` e o post-mortem segue `definir-post-mortem`.
Escreva só o que a pessoa escolher. Investigação sem causa achada também pergunta: o post-mortem registra o que se sabe.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Investigação sem registro

Se você investigar sem tarefa, o andamento fica na conversa e quem relatou não tem onde acompanhar.

1. Crie a tarefa antes de começar.
2. Ponha o link em todo aviso.

### Relato sem acesso à fonte

Se você abrir só o navegador interno, cair no login e pedir à pessoa que entre, ela perde tempo com um caminho que o navegador dela já abria.

1. Tente o conector da fonte.
2. Sem ele, tente cada navegador disponível, o interno do aplicativo e o da pessoa por extensão.
3. Só peça ajuda depois que todos falharam, e diga o que tentou.

### Cobrança sem dossiê

Se você cobrar o atendente do portal só com o relato da pessoa, ele não acha o cadastro e a conversa recomeça a cada contato.

1. Refaça o fluxo, capture os prints e as requisições e confira o e-mail.
2. Grave o dossiê em `Destino do dossiê`.
3. Mande o feedback com os fatos e os prints, e peça a melhoria sem tom de cobrança.

### Hipótese tratada como fato

Se você responder com a primeira hipótese sem conferir, a causa errada vira o registro.

1. Confira cada hipótese na fonte.
2. Diga o que foi visto e o que ainda é suposição.

### Parar no que não foi verificado

Se você entregar uma lista do que não conferiu, como se um erro é esperado ou como uma taxa se compara com a normal, a pessoa fica sem causa e tem de pedir de novo.

1. Confira cada um desses pontos que esteja ao seu alcance antes de responder.
2. Só deixe como "não verificado" o que exige acesso que você não tem, e diga qual e quem tem.
3. Não proponha tarefa de correção enquanto a causa não estiver entendida.
4. Antes de pedir a quem relatou um dado do caso, como o id, a cor, a versão ou o que foi cadastrado, procure-o por conta própria: no que a ferramenta de monitoramento registrou no horário do relato, no conector da fonte e no navegador.
5. Só peça a quem relatou depois que cada um desses caminhos falhou, e diga o que cada um devolveu.
6. Não diga que um sistema não dá acesso, nem descreva o que ele mostra, sem ter tentado abri-lo: sem a tentativa, a frase é suposição.
7. Quando o próximo passo é um teste ou uma consulta ao seu alcance, rode-o no mesmo turno em vez de propô-lo. Proponha à pessoa só o que depende de acesso ou de decisão dela.
8. Um limite que fala do ambiente de execução, como o sistema, a arquitetura ou a versão, confere-se nos registros das execuções reais, como o job de integração contínua e o log do build, antes de aparecer como pendência.
9. Uma reprodução num exemplo mínimo cobre o mecanismo. Diga isso, e rode no ambiente real o que estiver ao seu alcance. O que exige subir uma branch ou um pull request, diga qual é e pergunte.
10. Antes de responder, releia o que ficou sem conferir. O que uma consulta ao seu alcance resolve volta para a investigação.

### Investigação sem a habilidade

Se você oferecer investigar, ou começar a ler código, sem carregar esta habilidade, o roteiro de tarefa, fatos e retorno não acontece.

1. Carregue a habilidade assim que alguém relatar um problema, mesmo sem a palavra investigar.
2. Só depois pergunte se a pessoa quer que você investigue.
3. Um pedido de investigar com só um link, um print ou um arquivo também conta: o relato está no conteúdo, então carregue a habilidade antes de abri-lo.

### Investigação paralela ignorada

Se você concluir sem ler o que outro agente ou ferramenta já investigou, a resposta pode contradizer a dele sem ninguém perceber.

1. Procure na thread e no canal a investigação paralela.
2. Cruze as conclusões e corrija a sua quando a outra viu algo que você perdeu.

### Ambiente compartilhado diagnosticado sem o aviso do time

Se você diagnosticar a falha de um preview ou de um cluster compartilhado só pelas respostas dele, a causa pode ser a queda do próprio ambiente, que o time já avisou no canal, e a conclusão e o próximo teste saem errados.

1. Procure no canal do ambiente o aviso do time e as execuções de manutenção, como a de limpeza, antes de diagnosticar.
2. Enquanto o estado do ambiente for desconhecido, não peça carga a ele, como publicar mais aplicações.
3. Diga na conclusão o que o ambiente estava passando, com o link do aviso.

### Alerta de anomalia tratado como incidente

Se você concluir pelo texto do alerta de anomalia, sem o monitor nem a linha de base, um valor normal para a semana vira um incidente e o ruído do monitor continua.

1. Abra o monitor e leia a consulta, o agrupamento e a janela.
2. Compare o valor com a mesma hora dos dias anteriores.
3. Se o código já manda campos específicos e o monitor agrupa por um campo genérico, leia também a métrica que ele consulta: a causa do ruído está nas duas definições.

### Erro de navegador filtrado sem achar o autor

Se você propuser descartar um erro do navegador pelo texto da mensagem, sem ler a pilha, o filtro pode esconder um erro do próprio site ou deixar passar o resto da família.

1. Leia o começo do endereço dos arquivos da pilha e diga quem escreveu o código.
2. Corte por navegador, dispositivo e versão e conte quantos eventos da família a pista cobre.
3. Sem o autor confirmado, mantenha o erro e deixe o autor como hipótese, com os indícios.

### Aprendizado perdido

Se você encerrar sem perguntar pelos registros, a próxima pessoa com o mesmo problema começa do zero.

1. Pergunte pelos itens de `Registros ao fim da investigação`.
2. Escreva só o que a pessoa escolher.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o gestor disse que os anúncios foram bloqueados, investiga?

Não havia tarefa: criei e respondi a quem relatou com o link. O print mostrava que um administrador precisava aprovar o anúncio. Conferi na tela de pessoas da conta quem administra e gravei a causa na tarefa. Perguntei se a pessoa queria um artigo, um post-mortem ou os dois.

### o monitor de anomalia de erros disparou, investiga?

Abri o monitor e li a consulta: ele soma os erros por tipo e compara com semanas passadas. O grupo que disparou estava dentro do normal da mesma hora dos dias anteriores, e o tráfego tinha subido. Li a pilha da família maior de erros, cujos arquivos vinham do navegador interno de um aplicativo, e contei quantos eventos o prefixo cobria. Do outro erro não achei o autor: deixei-o como hipótese, com os indícios, e não propus filtro.

## Casos-limite

- A causa não aparece depois de conferir todas as fontes ao seu alcance: grave o que foi descartado e o próximo passo, e pergunte pelos registros do mesmo jeito.
- A correção depende de outra pessoa, como quem administra a conta: diga quem e o que pedir.
- Já existe artigo sobre o problema: proponha atualizá-lo em vez de criar outro.
- O autor de um erro do navegador não aparece depois de ler a pilha e cortar os eventos: mantenha o erro, escreva o autor como hipótese com os indícios e diga o que confirmaria.

## Pegadinhas

- O print parece só ilustrar o relato. Ele costuma trazer o aviso exato da ferramenta.
- Ler uma tela parece seguro em qualquer ferramenta. Uma tela de configuração pode salvar ao fechar: abra, leia e cancele.
- A thread lida no começo parece completa. Uma investigação paralela pode postar a conclusão minutos depois: releia antes de encerrar.
- A tela de login do navegador interno parece provar que a fonte exige a pessoa. O navegador dela, por extensão, pode já estar logado e abrir o relato na hora.
- O erro na tela do portal parece provar que o cadastro não foi criado. A conta pode existir, e o e-mail e a recuperação de senha mostram isso.
- "Investigue isso" com um link parece um pedido de leitura. O link é o relato do problema: a habilidade vem antes de abri-lo.
- Perguntar a quem relatou parece o passo seguinte quando falta um dado. O horário do relato e o que a ferramenta registrou nele costumam bastar para achá-lo.
- A reprodução num exemplo mínimo parece provar o caso real. Ela prova o mecanismo, e o ambiente real está nos registros das execuções: leia-os antes de listar o limite como "não provado".
- Um erro de certificado ou de rota num preview parece falha da mudança testada. O ambiente compartilhado pode ter caído e estar sendo apagado, e o aviso do time está no canal.
- Uma lista de "não verificado" parece honestidade. Cada item que uma consulta ao seu alcance resolve é investigação por fazer: rode-o antes de responder.
- O texto de um alerta de anomalia parece dizer que houve um pico. O monitor compara com semanas passadas, então o valor da mesma hora dos dias anteriores é que diz se há um.
- A mensagem de um erro do navegador parece dizer de quem ele é. A pilha diz: o começo do endereço dos arquivos mostra a extensão, o aplicativo ou o script de terceiro que o escreveu.
- Uma investigação curta parece não pedir registro. A pergunta pelos registros vale para toda investigação.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
