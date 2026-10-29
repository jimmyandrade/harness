---
name: testar-ponta-a-ponta
description: Cuida do teste ponta a ponta, o E2E. Planeja o teste novo, roda para provar uma mudança e acha a causa de um vermelho, sem digitar credencial nem criar dado real. Usada quando o pedido envolve um E2E, mesmo sem dizer ponta a ponta. Não serve para teste de unidade ou de integração nem para corrigir bug do produto.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - definir-issue-do-github
    - escrever-teste
    - evoluir-habilidade
    - preparar-tarefa-do-pull-request
    - registrar-resultados-da-validacao-na-tarefa
---

# Testar ponta a ponta

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# `Pasta dos workflows` é onde ficam os arquivos do CI que rodam o E2E.
"Pasta dos workflows": ".github/workflows"
# `Variáveis de credencial` lista os nomes das variáveis de ambiente que o teste lê para fazer login. Vazio, o teste não precisa de login.
"Variáveis de credencial": []
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Escrever um teste e testar ponta a ponta são coisas diferentes.
Escrever o código de qualquer teste, de unidade, de integração ou ponta a ponta, segue `escrever-teste`: a convenção do repositório, o TDD e os títulos.
Testar ponta a ponta é percorrer o sistema como a pessoa usuária, num ambiente de verdade, e provar que o caminho inteiro funciona. Esta skill decide o que o teste ponta a ponta percorre, roda, acha a causa quando ele fica vermelho e registra o resultado.
Nem todo teste é ponta a ponta. Teste de unidade e de integração ficam só com `escrever-teste`.

Peça o caminho da pessoa usuária ou o teste, o ambiente, o link da execução quando houver e a tarefa.
Sem a tarefa, siga `preparar-tarefa-do-pull-request` antes de mexer no teste.
Trabalhe numa cópia de trabalho, não no clone da pessoa.

```mermaid
flowchart LR
  A{O pedido é?} -->|teste novo| B[Passo 3]
  A -->|provar uma mudança| C[Passo 8]
  A -->|teste vermelho| D[Passo 4]
  A -->|teste de unidade ou integração| E[escrever-teste]
```

### Passo 2

Antes de dizer onde ou quando o E2E roda, leia o gatilho do workflow na `Pasta dos workflows`: os eventos em `on`, os filtros de branch e de caminho.
Um E2E que roda só em `push` na branch principal não roda no PR nem na fila de merge. Isso muda quando a falha aparece e quando a correção pode ser provada.
Não afirme o gatilho de memória nem pelo nome do workflow.

### Passo 3

Para um teste novo, escreva antes o caminho que ele percorre, em passos que a pessoa usuária faz: abrir a página, clicar, preencher, ver o resultado.
O código do teste segue `escrever-teste`. Além da convenção, um teste ponta a ponta:

- Procura o elemento pelo papel e pelo texto que a pessoa vê na tela. Confira no navegador o que o elemento é de fato.
- Espera por uma condição, como o elemento aparecer, e não por um tempo fixo.
- Lê a credencial do ambiente, como o Passo 7 manda.
- Não cria dado real. Quando o caminho cria cadastro, pedido ou pagamento, use o ambiente de teste e diga isso antes de rodar.

Depois, rode como o Passo 8 manda.

### Passo 4

Para um teste vermelho, ache quando ele começou a falhar, no histórico de execuções do workflow na branch em que ele roda.
Marque a última execução verde e a primeira vermelha, e liste os commits entre as duas.
Leia o log da primeira vermelha e o da mais recente. Se os dois falham no mesmo passo, a causa é uma só.
Uma falha que alterna entre verde e vermelho no mesmo commit é instabilidade, não regressão.

### Passo 5

Reproduza a falha antes de propor o conserto: rode o teste contra o ambiente em que ele falhou, ou abra o mesmo caminho num navegador real e compare com o que o teste espera.
O que o teste procura (papel, texto, `data-testid`) tem de existir na página exatamente como ele escreve. Confira no navegador o que o elemento é de fato.
Escreva a causa em uma frase, com a evidência que a mostra: o passo do log e o que a página tem no lugar.

### Passo 6

Decida de quem é o conserto.

```mermaid
flowchart LR
  A{A página faz o que o usuário precisa?} -->|não| B[Bug do produto: issue com definir-issue-do-github, e o teste fica vermelho de propósito]
  A -->|sim| C{O teste procura o que a página nunca teve ou já mudou?}
  C -->|sim| D[Corrija o teste com escrever-teste]
  C -->|não| E[Instabilidade: conserte a condição de espera, sem só aumentar o tempo]
```

Não troque a expectativa do teste para escondê-lo quando o produto está errado.

### Passo 7

Para um teste que faz login (por exemplo, com e-mail e senha), a pessoa exporta as `Variáveis de credencial` no terminal dela, e o teste as lê do ambiente.
Nunca digite, peça no chat nem grave em arquivo uma senha, um token ou um documento de identificação. Nunca crie conta nem dado real, em produção ou em outro ambiente que não é de teste da pessoa.
Se o teste cria dado de verdade (cadastro, pedido, pagamento), diga isso antes de rodar, com o ambiente, e deixe a pessoa decidir se roda e onde.
Sem as variáveis no ambiente, diga que o login não foi provado e rode só o que não precisa dele.

### Passo 8

Rode os testes que a tarefa pede, no ambiente em que eles rodam de fato e, quando o teste vai rodar depois do merge, no ambiente mais próximo possível.
Conte o resultado como "X de Y testes passaram", com o que cada um fez. Não escreva "sem regressão": diga o que foi procurado e o que foi visto.
Um teste que falhou por outro motivo, fora do que a tarefa pede, entra como "não conferido" ou "falhou", nunca omitido.

### Passo 9

Registre o resultado na tarefa com `registrar-resultados-da-validacao-na-tarefa`, num comentário só, que você edita a cada resultado novo.
O comentário diz o ambiente, o que passou e falhou e o que não foi conferido. Para um teste vermelho, diz também a causa, a correção e o resultado antes e depois.
Enquanto o E2E não ficar verde onde ele roda de fato, a tarefa e a issue do teste não fecham.

### Passo 10

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Todo teste tratado como ponta a ponta

Se você seguir esta skill para um teste de unidade ou de integração, o teste ganha navegador, ambiente e credencial que ele não precisa.

1. Pergunte se o teste percorre o sistema como a pessoa usuária, num ambiente de verdade.
2. Se não percorre, siga só `escrever-teste`.

### Gatilho suposto

Se você disser que o E2E roda no PR ou na fila de merge sem ler o workflow, a pessoa espera uma prova que aquele evento nunca gera.

1. Leia os eventos e os filtros em `on`.
2. Diga em qual evento e em qual branch o teste roda.
3. Se o PR não o roda, diga como a correção será provada antes do merge.

### Conserto antes da causa

Se você mudar o seletor ou a espera antes de reproduzir a falha, o teste fica verde por sorte e volta a falhar.

1. Reproduza no ambiente da falha ou num navegador real.
2. Escreva a causa com a evidência.
3. Só então mude o teste.

### Espera por tempo fixo

Se você fizer o teste novo esperar um número de segundos, ele passa na máquina rápida e falha no CI.

1. Espere pela condição que a pessoa usuária veria, como o elemento aparecer.
2. Só aumente o tempo limite depois de provar que a lentidão é a causa.

### Credencial no chat

Se você pedir a senha, digitá-la ou gravá-la num arquivo para o teste entrar, o segredo passa por onde não devia.

1. Peça à pessoa que exporte as variáveis no terminal dela.
2. Confirme só que elas existem, sem ler o valor.
3. Sem elas, diga que o login não foi provado.

### Dado real criado sem aviso

Se você rodar um teste de cadastro em produção sem dizer, ele cria contas ou pedidos que ninguém pediu.

1. Leia o teste e veja se ele cria dado.
2. Diga o que cria e onde, antes de rodar.
3. Espere a decisão da pessoa.

### Verde parcial contado como conserto

Se você disser que o teste passou quando só parte dos testes da tarefa rodou, a tarefa fecha com um teste vermelho.

1. Liste todos os testes da tarefa.
2. Conte "X de Y" com o motivo de cada falha.
3. Não feche com um teste falhando.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Cria um E2E para o checkout, tarefa ABC-30

Escrevi o caminho antes: abrir o produto, pôr no carrinho, preencher o endereço, ver o resumo do pedido. O código seguiu `escrever-teste`, com cada elemento procurado pelo papel e pelo texto da tela e a espera pelo resumo aparecer. O caminho cria um pedido, então rodei só no ambiente de teste e disse isso antes. 1 de 1 teste passou, e registrei no comentário da tarefa.

### O E2E do login ficou vermelho na main, tarefa ABC-12

Li o workflow: ele roda só em `push` na `main`, não no PR. O histórico mostra a última execução verde e a primeira vermelha, com três commits entre elas, e as duas falham no mesmo passo. No navegador, o item de login é um link sem `href`, e o teste o procura pelo papel `link`. A página está certa, então o conserto é do teste. Corrigi o seletor, rodei os 4 testes da tarefa e 3 de 4 passaram. O quarto cria uma conta de verdade e não rodei, porque você não decidiu onde. Registrei tudo no comentário da tarefa.

### Rode o teste com a minha conta

Pedi que você exporte no seu terminal as variáveis de `Variáveis de credencial`, as do e-mail e da senha. Confirmei que elas existem, sem ler o valor, e rodei só o teste de login. Não digitei a senha nem a gravei em arquivo.

## Casos-limite

- O pedido é um teste de unidade ou de integração: siga só `escrever-teste`.
- O teste falha só às vezes no mesmo commit: é instabilidade. Mostre as execuções verdes e vermelhas e corrija a condição de espera.
- O E2E roda em vários ambientes e falha em um só: compare o ambiente que falha com o que passa antes de mexer no teste.
- A causa é um bug do produto: abra a issue com `definir-issue-do-github` e deixe o teste vermelho.
- O teste precisa de login e as variáveis não estão no ambiente: rode o que não precisa dele e diga o que ficou sem prova.
- O log da execução expirou: diga isso, reproduza no navegador e marque a data da falha como não confirmada.

## Pegadinhas

- Escrever um teste parece o mesmo que testar ponta a ponta. O código segue `escrever-teste`. Percorrer o sistema num ambiente de verdade, rodar e provar é desta skill.
- Um workflow com `on: push` na branch principal não roda em PR nem na fila de merge. A fila só roda o que assina o evento `merge_group`.
- Em Playwright, `getByRole('link')` não acha um `<a>` sem `href`. O elemento aparece como `generic`.
- Um menu que abre ao passar o mouse não abre pelo `click` do teste em todo navegador. O teste faz `hover` antes e espera o item aparecer.
- O erro de timeout aparece no passo que esperava, não no passo que causou o problema. Leia os passos anteriores do log.
- A variável exportada num terminal não existe em outro terminal aberto. Quem roda o teste confere na aba onde exportou.
- Aumentar o tempo de espera costuma esconder a causa. Só vale depois de a causa ser uma lentidão provada.

## Scripts disponíveis

- `sed -n '1,40p' <Pasta dos workflows>/<arquivo>`: gatilho do workflow, no Passo 2.
- `gh run list --workflow <arquivo> --branch <branch> --json conclusion,headSha,createdAt,url`: execuções do workflow no Passo 4.
- `gh run view <id> --log-failed`: log dos passos que falharam, no Passo 4.
- `read -rs <VARIÁVEL> && export <VARIÁVEL>`: a pessoa exporta uma credencial no terminal dela, no Passo 7.
- `npx playwright test <arquivo> --reporter=line`: roda um arquivo de teste, no Passo 8, quando o projeto usa Playwright.

1. Separe o pedido, leia o gatilho, planeje o teste novo ou ache a causa do vermelho, rode os testes da tarefa e registre o resultado.
