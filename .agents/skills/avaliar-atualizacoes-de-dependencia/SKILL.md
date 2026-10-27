---
name: avaliar-atualizacoes-de-dependencia
description: Use essa habilidade sempre que houver PR de atualização de dependência do Dependabot ou do Renovate para avaliar, testar ou mesclar, mesmo sem dizer o nome do bot. NÃO use para atualizar uma dependência à mão nem para PR que não seja de bot.
metadata:
  author: jimmyandrade
  version: "0.9.4"
  related:
    - evoluir-habilidade
    - criar-commit
    - criar-pull-request
    - atender-revisao-de-pull-request
---

# Avaliar atualizações de dependência

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Repositório` vem do remoto `origin` quando as instruções não dizem.
"Repositório": ""
# `Ferramentas de atualização de dependências` é `automático`, que descobre as ferramentas pelo repositório, ou uma lista com `Renovate`, `Dependabot` ou os dois. Uma lista vazia diz que o repositório não usa nenhuma.
"Ferramentas de atualização de dependências": "automático"
"Autores dos bots":
  - "app/dependabot"
  - "app/renovate"
"Comando de instalação": "npm ci"
"Comando de testes": ""
"Comando de build": ""
"Revisores": ""
"Assignee": ""
"Label": "dependencies"
# `Agrupar pacotes relacionados` é `perguntar`, que propõe o agrupamento e espera a resposta, ou `automático`, que abre o PR da configuração sem perguntar.
"Agrupar pacotes relacionados": "perguntar"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Veja quais são as `Ferramentas de atualização de dependências`. Com `automático`, procure a configuração no repositório: `renovate.json`, `.renovaterc`, `.github/renovate.json` ou a chave `renovate` no `package.json` indicam o Renovate, e `.github/dependabot.yml` indica o Dependabot. Sem configuração, use os autores dos PRs abertos. Diga na fila quais ferramentas valem e de onde veio a resposta. Com a lista vazia e nenhum PR de bot, a fila está vazia: diga isso e encerre. Liste os PRs abertos de cada um dos `Autores dos bots`, do mais antigo ao mais novo. Mostre a fila como checklist na conversa e atualize a cada PR. Trate um PR por vez, sempre o mais antigo.

### Passo 2

Mude para a branch do PR e veja quantos commits ela está atrás da base. Se estiver em conflito, peça rebase ao bot e espere a branch nova. Se só estiver muito atrás, sem conflito, avalie num merge local da branch com a base, sem enviá-lo, em vez de esperar o bot. Rode o `Comando de instalação`. Se o PR muda um subprojeto com manifesto próprio, instale, teste e faça o build nele, com os comandos dele, e não na raiz. Ache o pacote atualizado e veja se ele é direto ou transitivo. Se for transitivo, suba pela árvore até o pacote direto. Procure também imports do pacote transitivo no código: se o projeto o importa, ele é ponto de uso direto, mesmo fora do manifesto. Numa action do GitHub, a própria action é o pacote direto. Registre a cadeia na checklist.

### Passo 3

Compare a versão que o PR traz com a mais recente do pacote direto. Leia as notas de cada versão do intervalo do PR, no repositório do pacote. Num salto grande, a descrição do PR do bot corta as versões mais antigas. Sem notas nem repositório público, compare a API pública das duas versões, como os arquivos de tipos. Aponte breaking change, correção de segurança e exigência de peer dependency. Breaking change sem migração clara no projeto para a fila: pergunte à pessoa. Se as notas mudam retry, timeout ou prazo, meça o caminho degradado do projeto antes e depois e leve o número para a análise.

Confira se o pacote anda junto com outros, como os tipos, a peer dependency ou outro pacote do mesmo repositório de origem, e se algum deles espera atualização noutro PR ou no painel de dependências do bot. Se esperar, o PR para na fila e o agrupamento segue `Agrupar pacotes relacionados`. Com `perguntar`, proponha o agrupamento e espere a resposta. Com `automático`, abra sem perguntar um PR à parte com a regra, seguindo `criar-commit` e `criar-pull-request`, inclusive a conferência do título e da descrição, uma vez e depois do push. No Renovate, a regra é uma entrada em `packageRules` com `matchSourceUrls` ou `matchPackageNames` e `groupName`. No Dependabot, é um grupo em `groups` com `patterns`. Grave a regra na configuração de cada uma das `Ferramentas de atualização de dependências`, e só nelas. A regra fica na configuração do bot no próprio repositório, nunca num preset compartilhado. O merge desse PR espera o sim da pessoa. Depois dele, peça ao bot uma nova execução, como a caixa no painel de dependências, e siga o PR agrupado.

### Passo 4

Ache cada ponto de uso do pacote direto, no código e nos testes. Numa action, os pontos de uso são os jobs que a usam. Numa ferramenta de desenvolvimento, como bundler ou executor de testes, os pontos de uso são as ferramentas e os comandos que a rodam, não imports no código. Num linter ou formatador, compare a contagem de avisos por regra antes e depois, só nos arquivos versionados. Confira se cada ponto tem teste de integração: o teste exercita o código do projeto usando o pacote e falharia se a integração quebrasse. Nunca teste o pacote em si, que já tem os próprios testes. Num pacote que lê conteúdo do projeto, como traduções ou esquemas, passe todo esse conteúdo pela versão nova, sem gravar teste. Se faltar, escreva o teste na própria branch do PR, seguindo `criar-commit`, e envie a branch.

### Passo 5

Rode o `Comando de testes` e o `Comando de build`. Rode também as suítes e os builds que usam o pacote e ficam fora desses comandos, quando as instruções do projeto os listam. Se a atualização quebrar o código do projeto, corrija na própria branch do PR, seguindo `criar-commit`, e envie a branch. Falha que pede decisão de produto, e não só código, para a fila: pergunte à pessoa.

### Passo 6

Antes de pedir revisão ou comentar a análise, garanta que o PR tenha um assignee e um label. `Assignee` vazio significa a pessoa autenticada no GitHub, e não a ausência da regra. Sem assignee, atribua esse valor. Sem label, aplique `Label`. Se o PR já tiver assignee e pelo menos um label, não troque e não acrescente outro. Se a atribuição ou a etiqueta falhar, pare e mostre o erro. Não mescle enquanto faltar um dos dois. Cite os dois na análise.

Peça revisão aos `Revisores`. Sem revisores, comente no PR a análise: a cadeia de dependência, os riscos das notas de versão e os testes acrescentados.

### Passo 7

```mermaid
flowchart LR
  A{PR tem comentário?} -->|sim| B[Siga atender-revisao-de-pull-request]
  B --> C[Mescle seguindo criar-pull-request]
  A -->|não| C
  C --> D{Checks do commit de merge na base}
  D -->|verde| E[Próximo PR da fila]
  D -->|vermelho| F[Pare e mostre a falha]
```

Os checks da base são os do commit de merge, de qualquer serviço: workflow, deploy ou outro. Um PR que o bot mescla sozinho, pelo automerge da configuração dele, pode entrar antes da vez dele e sem a sua avaliação. Ele sai da fila como mesclado pelo bot: confira os checks do commit de merge na base, como num merge seu, e diga na fila que ele entrou sem avaliação. Não reverta nem reabra. Se os checks ficarem vermelhos, pare e mostre a falha. A fila termina quando não sobra PR de nenhum dos `Autores dos bots`.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### PR mais novo primeiro

Se você começar pelo PR mais novo, os mais antigos passam a conflitar no lockfile e o bot precisa refazê-los.

1. Ordene pela data de criação.
2. Só passe ao próximo depois do CI verde na base.

### Busca só pelo pacote transitivo

Se você procurar os pontos de uso do pacote transitivo, não acha nada, porque o projeto importa o pacote direto.

1. Suba pela árvore até o pacote direto.
2. Procure os pontos de uso dele.

### PR sem assignee ou sem label

Se você mesclar o PR sem responsável ou sem etiqueta, a fila perde quem acompanha e o filtro do repositório.

1. Confira assignee e labels antes do comentário.
2. Sem assignee, atribua `Assignee`, ou a pessoa autenticada quando esse valor estiver vazio.
3. Sem label, aplique `Label`. Não substitua um label que já existe.
4. Se o comando falhar, pare e mostre o erro.

### Pacote relacionado esperando à parte

Se você mesclar o PR de um pacote enquanto a peer dependency ou outro pacote do mesmo repositório de origem espera noutro PR, o projeto fica com versões que não foram testadas juntas.

1. Confira os PRs abertos e o painel de dependências do bot.
2. Pare a fila e siga `Agrupar pacotes relacionados`.
3. Grave a regra na configuração de cada uma das `Ferramentas de atualização de dependências`, no próprio repositório.

### Teste num PR separado

Se você abrir outro PR só com o teste, a atualização entra sem a cobertura que justificaria o merge.

1. Commite o teste na branch do bot.
2. Envie a branch e siga no mesmo PR.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### processa os PRs do Renovate

Fila com três PRs, do mais antigo ao mais novo. No primeiro, o pacote é direto e as notas de versão só trazem correções. Os dois pontos de uso já tinham teste, testes e build passaram, o PR não tinha comentário, o merge seguiu `criar-pull-request` e o CI da base ficou verde. Só então o segundo PR começou.

### o Dependabot atualizou uma biblioteca que eu nem uso

A biblioteca era transitiva. A árvore levou ao pacote direto que a puxa, e os pontos de uso desse pacote não tinham teste. O teste entrou na branch do bot, a branch foi enviada e a análise foi comentada no PR, porque o projeto não lista revisores.

## Casos-limite

- O bot já substituiu o PR por um mais novo do mesmo pacote: siga o mais novo.
- O bot mesclou um PR sozinho, por automerge: ele sai da fila sem avaliação, e você confere os checks do commit de merge na base, como diz o Passo 7.
- O PR agrupa vários pacotes: faça os passos 2 a 4 para cada um. Um pacote 0.x do grupo pode quebrar ao subir o minor: leia as notas dele à parte.
- A atualização de major espera aprovação no painel de dependências e ainda não virou PR: fica fora da fila.
- Dois PRs conflitam depois de um merge e a ordem fica ambígua: pergunte à pessoa.
- O pacote baixa binários presos à versão, como os navegadores de teste: diga na análise que cada máquina precisa baixá-los de novo depois do merge.
- O pacote vai num artefato publicado à parte, como um worker ou uma função: o merge não atualiza o que está rodando. Diga na análise que falta publicar de novo.
- Uma revisão obrigatória que você não consegue cumprir bloqueia o merge: pare e diga quem precisa aprovar.
- O PR atualiza um pacote sem os que andam junto com ele, como os tipos, a peer dependency ou outro pacote do mesmo monorepo: pare a fila e agrupe-os conforme `Agrupar pacotes relacionados`, como diz o Passo 3.
- O PR agrupado substitui o PR antigo do pacote: siga o agrupado, como num PR substituído pelo bot.
- O PR da regra de agrupamento abre: o título e a descrição passam uma vez pela conferência, depois do push.

## Pegadinhas

- O autor de um PR parece dizer qual ferramenta o repositório usa. Um Renovate hospedado pelo projeto abre PRs com outro autor, e um bot pode ter PR aberto depois que a configuração dele saiu do repositório. Siga `Ferramentas de atualização de dependências` e, com `automático`, a configuração do repositório antes dos autores.

- Depois que outra pessoa envia commit para a branch, o Dependabot para de fazer rebase dela e o Renovate para de atualizá-la. Daí em diante, quem mantém a branch em dia é você.
- Uma mudança que depende do ambiente de execução, como bloquear algo no navegador, vale também para o ambiente dos testes, como jsdom. Confira o ambiente configurado para os testes. O teste novo de um código que roda no servidor, como uma rota, usa o ambiente do servidor: num projeto com jsdom por padrão, declare o ambiente node no próprio arquivo de teste, porque bibliotecas de criptografia recusam os tipos do jsdom.
- Alguns pacotes regravam arquivos versionados na instalação, como o script de service worker do msw. Depois de instalar, confira se a árvore de trabalho mudou e commite esses arquivos na branch do PR: o bot só muda o manifesto e o lockfile.
- Uma atualização só de tipos pode quebrar a checagem de tipos e o build sem falhar nenhum teste. Rode o build mesmo com os testes verdes.
- A instalação limpa apaga o que foi instalado dentro da pasta de dependências, como o navegador de testes. As suítes fora do `Comando de testes` podem pedir esse passo de novo, e também as variáveis de ambiente do projeto.
- A árvore de dependências só mostra o pacote depois da instalação na branch do PR. Antes dela, ela mostra a versão antiga ou nada.
- Uma dependência git, com npm 11.17 ou mais novo e `allow-scripts` no `~/.npmrc`, faz o `Comando de instalação` parar com `EALLOWSCRIPTS` e deixar a pasta de dependências vazia. O PR não tem defeito: o npm repassa a configuração ao npm que prepara a dependência. Rode a instalação com `npm_config_userconfig=/dev/null` na frente, só nesse comando, como diz o `TROUBLESHOOTING.md` do core.

- Conferir a cada commit parece necessário. A conferência é uma vez, depois do push.

## Scripts disponíveis

- `gh pr list --repo <Repositório> --author <autor> --state open --json number,title,createdAt,url --jq 'sort_by(.createdAt)[]'`: fila do Passo 1, uma vez por autor.
- `gh pr checkout <número> --repo <Repositório>`: branch do Passo 2.
- `npm ls <pacote> --all`: árvore do Passo 2.
- `npm view <pacote> version`: versão mais recente do Passo 3.
- `gh release view <tag> --repo <repositório do pacote>`: notas de versão do Passo 3.
- `gh pr edit <número> --repo <Repositório> --add-assignee <pessoa> --add-label <label>`: assignee e label do Passo 6. Não use quando os dois já existirem.
- `gh pr edit <número> --repo <Repositório> --add-reviewer <pessoa>`: revisão do Passo 6.
- `gh run watch <id da execução> --repo <Repositório> --exit-status`: CI da base do Passo 7.

- Monte a fila, depois, para cada PR: branch, árvore, notas de versão, pontos de uso e testes, verificações, assignee e label, revisão, comentários, merge e CI da base.
