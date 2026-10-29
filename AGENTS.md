---
metadata:
  version: "1.42.0"
  parameters:
    "Global":
      "Organização": "jimmyandrade"
      "Licença obrigatória": "não"
      "Idioma do Gherkin": "pt"
      "Palavras": 5000
      "Linhas": 500
      "Tokens do catálogo": 100
      "Tokens do corpo": 5000
      "Direção dos fluxogramas": "LR"
      "Ícone das páginas no Notion": "magic-wand"
      "Cor do ícone das páginas no Notion": "gray"
      "Ícone dos modelos no Notion": "script"
      "Cor do ícone dos modelos no Notion": "gray"
      "Símbolo da pasta no macOS": "wand.and.sparkles"
      "Considerar grupos de oportunidades": "sim"
      "Cópia de trabalho": "worktree"
      "Idioma da issue": "português do Brasil"
      "Idioma das instruções do projeto": "português do Brasil"
      "Idioma das respostas": "português do Brasil"
      "Idioma das decisões de arquitetura": "inglês"
      "Idioma da mensagem de commit": "inglês"
      "Idioma do PR": "inglês"
    "preparar-tarefa-do-pull-request":
      "Onde ficam as tarefas": "issues do GitHub"
      "Projeto da tarefa por repositório": "issues do próprio repositório"
    "sincronizar-status-da-tarefa":
      "Consulta das tarefas": "gh issue list --state open --assignee @me --json number,title,url"
      "Registro da ligação": "No pull request aberto, acrescente `Closes #<número>` ao corpo. No pull request já mesclado, comente na tarefa com o link do pull request."
    "publicar-resposta-de-revisao":
      "Idioma da resposta à revisão": "o idioma do comentário"
---

# Instruções do projeto

## Camadas

- Este repositório é o harness core. Ele é público. Nunca adicione a ele nome de empresa, regra de negócio, espaço de trabalho, banco, página, pessoa ou segredo.
- Um harness de negócio é um repositório próprio. Ele guarda as skills do negócio, os schemas e os mapeamentos das fontes de dados, o glossário e os estilos de saída. Ele usa este repositório para o verificador, a sincronização com o Notion e as skills compartilhadas. A API, a linha de comando e o MCP do vocabulário ficam neste repositório, em `vocabulary/`, como decide a ADR 0018.
- Uma skill passa de um harness de negócio para este repositório uma de cada vez, depois de uma auditoria. A auditoria remove todo nome de empresa, regra de negócio e nome de espaço de trabalho ou de banco, e leva para as instruções do projeto o que ainda muda de um negócio para outro. Mantenha o nome, a versão e `metadata.aliases` quando a skill mudar de repositório, para a página no Notion de cada negócio manter o histórico.
- Não traga uma skill para cá porque dois negócios têm skills parecidas. Traga quando um texto só servir para os dois.

## Instruções do projeto

- Uma skill lê nas instruções do projeto o que muda de um projeto para outro. Num repositório, elas são o `AGENTS.md`. No Notion, são a página com o título `AGENTS.md` no banco de skills daquele espaço de trabalho. Quando as duas existem, o repositório vale para o trabalho no repositório.
- O texto da skill diz "instruções do projeto". Ele não cita arquivo, caminho, espaço de trabalho nem página.
- Os valores dos parâmetros formam uma árvore em `metadata.parameters`, como decide a ADR 0008: uma entrada com o nome da skill e uma entrada chamada `Global`. A skill lê primeiro a própria entrada, depois a `Global`. Um valor no primeiro nível dos parâmetros conta como `Global`.
- Um parâmetro que as instruções do projeto não definem usa o padrão escrito na skill. Quando a skill não tem padrão, pergunte uma vez e pare.
- O idioma das instruções do projeto é o parâmetro `Idioma das instruções do projeto`, que tem como padrão português do Brasil. Um projeto que escreve as instruções em outro idioma define esse parâmetro no próprio `AGENTS.md`.
- A sincronização escreve a página das instruções do projeto no Notion a partir do `AGENTS.md`, como decide a ADR 0008, com a descrição e o `metadata.version` do frontmatter, e os parâmetros num bloco de código YAML no fim da página. Nunca edite essa página à mão: mude o `AGENTS.md` no harness de negócio.

## Respostas

- Responda sempre no `Idioma das respostas`, que tem como padrão português do Brasil. Um projeto que quer as respostas em outro idioma define esse parâmetro no próprio `AGENTS.md`.
- Fale com a pessoa na resposta, sem usar o nome dela no lugar dela. Comece pelo que precisa ser feito. Termine com a sugestão do próximo passo e, se houver, com a decisão que cabe a ela. Terceira pessoa fica na descrição da habilidade.
- Quando a pessoa disser que não entendeu, a resposta seguinte só diz quem faz, o que fazer e o próximo passo, e nomeia se o clique é no aplicativo ou na página da conta no navegador.
- Todo pull request, issue, commit ou página do Notion citado vai como link clicável no texto, não só no resumo final.

## Execução

- Execute as consultas e verificações permitidas que o pedido exige sem pedir uma confirmação que a pessoa já deu. Pergunte só quando faltar um dado ou uma decisão humana que mude a ação.
- Diante de uma falha técnica, verifique as alternativas permitidas da mesma conexão antes de passar a pendência à pessoa. A falha de uma chamada não prova perda de acesso. Não peça mudança de permissões sem verificar o alcance do bloqueio.
- Resolva a referência da habilidade seguinte no catálogo conectado quando as regras do ambiente permitirem. A ausência na lista inicial não prova que ela não existe. Não peça à pessoa uma referência que já está na conversa.
- Distinga a restrição explícita de descoberta, a busca sem resultado e o erro de permissão que a ferramenta devolveu. Não chame uma restrição das instruções de falta de acesso nem prometa que um pull request remove uma restrição do ambiente.
- Ao receber uma correção sobre o seu comportamento, siga `evoluir-habilidade` na mesma conversa e transforme o feedback em correção no repositório de origem, não na cópia instalada, em vez de só explicar o erro. Com pedido de pull request, abra-o e diga o que mudou e o que ainda não foi validado.
- Ao começar a trabalhar num repositório, antes do primeiro passo, siga `levantar-ambiente-do-repositorio`: liste as habilidades do próprio repositório e as que chegam por dependência ou plugin, como as deste repositório, e abra as que a tarefa vai usar. Uma habilidade que a sessão não carregou é lida do `SKILL.md` dela. Quando a habilidade carregada na sessão tem `metadata.version` diferente da que o repositório fixa, no próprio repositório ou na dependência, siga o `SKILL.md` do repositório e diga que o plugin instalado está desatualizado. A ausência na lista da sessão não prova que ela não existe.
- As tarefas deste repositório são as issues do GitHub dele. Um harness de negócio faz o mesmo com as issues do próprio repositório. Não há banco de tarefas à parte.
- Depois que a release de um plugin que a pessoa usa sair, com a PR de release mesclada e a tag publicada, atualize o plugin instalado sem esperar um pedido: atualize o marketplace, atualize o plugin e diga que a sessão precisa reiniciar para valer. Vale para o plugin deste repositório e para o de um harness de negócio. A habilidade nova só chega à sessão depois disso.
- Numa tarefa de código, siga nesta ordem: `procurar-tarefa` para os detalhes da issue ou da tarefa, `levantar-ambiente-do-repositorio`, `escrever-teste`, `escrever-codigo`, `criar-commit` e `criar-pull-request`. Use TDD por padrão: o teste vem primeiro, roda e falha, e só então vem o código que o faz passar. Depois de criar um commit ou de mudar o estado do pull request, siga `sincronizar-status-da-tarefa`. O merge segue `mesclar-pull-request`. Criar ou evoluir uma habilidade segue a mesma cadeia. Toda issue sai por `definir-issue-do-github`, que procura antes as issues abertas e fechadas do mesmo assunto, e todo pull request sai por `criar-pull-request`. Isso vale também para a issue ou o PR que outra habilidade manda abrir. Nunca abra pelo comando direto: ele cria issue repetida e deixa o PR sem rótulo, sem rascunho e sem pessoa atribuída.
- Execute cada habilidade dessa ordem até o fim. Ler o arquivo começa a habilidade e não a encerra. Sem `Comando de testes`, `escrever-teste` ainda é chamada: o resultado é dizer que o comando não existe, sem inventar um runner. O modo de abertura é `Criar pull request ao terminar`. Os valores ficam na skill. Um projeto que quer outro modo define o parâmetro no próprio `AGENTS.md`. A resposta diz o nome da branch, se ela está no GitHub e, quando o pull request existe, o link. Não escreva que uma habilidade ficou para este pedido, nem para depois.
- Um comando em segundo plano não encerra o turno. Quando o próximo passo depende do resultado dele, como uma instalação, uma suíte de testes, um build ou um check, espere no mesmo turno com um comando que bloqueia até o resultado sair, dentro do limite de tempo da ferramenta, e siga com ele. Encerre o turno só quando o trabalho terminar ou quando faltar uma decisão da pessoa. Nunca termine a resposta dizendo que o comando ainda roda e que você volta quando ele acabar.
- Uma regra de comportamento que vale para todos os projetos fica nestas instruções. O valor de um parâmetro fica nas instruções do projeto. O guia de contribuição cita o nome do parâmetro e não copia o valor, para a mudança acontecer num lugar só. Uma convenção de código que não é parâmetro fica no guia de contribuição. Não fica na memória de um projeto.

## Git

- Toda mudança entra por pull request. Não dê push no `main`.
- Ao terminar o trabalho de uma sessão, siga `limpar-copias-de-trabalho` para remover as cópias de trabalho que ela deixou.
- Commit segue `Idioma da mensagem de commit` e PR segue `Idioma do PR`, quem quer que proponha.
- Use um assunto em Conventional Commits: `tipo: descrição`. Quando a mudança afeta uma skill, o assunto é `tipo(nome-da-skill): descrição`. Os tipos são `feat`, `fix`, `perf`, `docs`, `refactor`, `test`, `chore` e `ci`.
- Uma mudança no CI ou numa action usa `ci`, mesmo quando acrescenta comportamento.
- Dê a toda branch o nome `tipo/descricao-curta`, com um desses tipos e uma descrição em ASCII e kebab-case: `feat/build-on-install`, `fix/mcp-path`. Uma branch que uma ferramenta criou com outro prefixo, como `claude/` ou `cursor/`, é renomeada antes do primeiro push. Renomear uma branch que já tem pull request fecha esse pull request: abra outro a partir da branch renomeada, com o mesmo título e a mesma descrição, e ponha o link dele no antigo. Um passo `Check the branch name` no CI reprova o pull request de uma branch fora desse padrão.

## Configuração

- Quando o `AGENTS.md` muda, suba o `metadata.version` dele como o de uma skill: patch para correção, minor para regra nova, major para mudança que quebra.
- Toda configuração fica em `metadata.parameters` no frontmatter do `AGENTS.md`, como decide a ADR 0009. O frontmatter deste arquivo guarda os padrões. Um harness de negócio guarda só os valores que mudam, e um valor que falta usa o daqui. O verificador valida os parâmetros de todo projeto.
- Um projeto que roda só numa ferramenta com sistema de arquivos e linha de comando, como o Claude Code ou o Cursor, pode guardar os parâmetros de uma skill em `<pasta>/<skill>/config.yaml`, na chave `parametros`, e dizer a pasta em `Pasta dos arquivos de configuração`, como decide a ADR 0020. O arquivo conta como instruções do projeto, e a skill não muda. Cada skill tem uma fonte só: com o arquivo, ela não tem entrada em `metadata.parameters`, e o verificador falha quando tem as duas. O agente do Notion não lê arquivo local: um projeto que usa o Notion guarda os parâmetros no `AGENTS.md`.
- Todo YAML que uma skill ou um projeto grava, como o frontmatter, o bloco de parâmetros e o `config.yaml`, tem de ser YAML válido. Um parâmetro tem sempre chave e valor curtos: uma linha, sem `: ` no meio. Texto com `: ` ou com mais de uma linha não é parâmetro. Antes de pôr esse texto num YAML, pergunte se ele deve estar lá: em geral ele vai para o texto da skill, para uma árvore de decisão ou para um arquivo de referência, e o parâmetro guarda só o nome ou um valor curto que aponta para isso. Em texto corrido sem aspas, o parser falha com "Implicit keys need to be on a single line". Um valor igual ao padrão da skill não entra na configuração do projeto. O detalhe de um parâmetro vira outro parâmetro curto, ou uma lista de itens curtos, e não um texto de regras. Quando o repositório tem convenção própria, a skill a descobre nele e o parâmetro só dá o padrão. Depois de criar ou editar um YAML, leia-o com um parser e só então diga que está pronto.
- Quando uma skill aprende com a pessoa uma decisão de caso, como classificar um item ou escolher um destino, ela guarda a decisão numa árvore de decisão Mermaid (`flowchart TD`) num arquivo `.mmd` ao lado do `config.yaml`, e um parâmetro cita o arquivo. A árvore é percorrida de cima para baixo e a primeira pergunta que bater decide. O texto das regras da skill guarda só o comportamento geral, em seções com listas numeradas, nunca a decisão de um caso. Quando nenhuma pergunta bate, a skill pergunta e acrescenta a regra na árvore.
- Um script acha o projeto pelo `HARNESS_ROOT` ou pela pasta de trabalho. Ele acha este repositório pela própria localização. Não faça um script ler um arquivo deste repositório quando o projeto tem o seu.
- Todo documento Markdown declara o `locale` no frontmatter, menos: o `CHANGELOG.md`, que o Release Please escreve e reescreve a cada release; o `LICENSE.md`, que mantém o texto da licença sem mudança; o `CLAUDE.md`, que só importa o `AGENTS.md`; o `AGENTS.md`, deste repositório ou de um projeto, cujo idioma é o parâmetro `Idioma das instruções do projeto`; e cada `SKILL.md`, cujo frontmatter segue o formato de skill e cujo texto é em português.

## Skills

- Salve toda skill como `.agents/skills/<nome>/SKILL.md` no repositório de origem dela. Antes de alterar uma skill, confira de onde ela vem. A cópia que outro projeto recebe pronta, por dependência ou plugin, inclusive em `node_modules`, não se edita: a próxima instalação apaga a alteração. O `name` é igual ao nome da pasta. O nome da pasta e o `name` do frontmatter são em ASCII e kebab-case. O título de nível 1 e o corpo são linguagem natural para pessoas e modelos, então mantêm ortografia e gramática corretas, com todos os acentos: `# Resolver comentários de revisão`. Toda skill sincroniza com o Notion. O frontmatter não tem `metadata.notion` nem `metadata.internal`.
- Quando a ferramenta tem acesso direto a um sistema de arquivos e a uma linha de comando, como o Claude Code ou o Cursor, crie a skill antes de mover os dados dela para o projeto. Os dados de uma skill ficam numa pasta com o nome da skill. Dado numa pasta que nenhuma skill lê não tem dono, e a regra dele se perde. Se a skill ainda não existe, crie primeiro e só então mova os dados.
- O texto da skill não cita arquivo nem caminho, a não ser ao propor mover detalhes para `references/` quando a skill passaria do limite de linhas ou de tokens, ao apontar um modelo de entrada, e na seção final `Scripts disponíveis`, que diz o nome de cada script e como rodá-lo.
- Uma skill cita um modelo de saída pelo nome, como decide a ADR 0016: ``Leia o modelo de saída `<nome>` quando for gerar a saída.`` Num repositório, o agente lê `.agents/assets/templates/<nome>.md` do projeto ou, se não houver, deste harness. Fora dele, abre a página com esse título no banco que `Banco de modelos no Notion` indica. A skill lista o modelo em `metadata.models`, um nome por linha, e o verificador confere essa lista como confere `metadata.related`.
- Uma skill que cita outra skill a lista em `metadata.related`, um nome por linha. O verificador falha quando um nome da lista não é skill do projeto nem deste harness, ou quando o corpo cita uma skill que falta na lista. Uma skill sem `metadata.related` não é conferida, para um harness de negócio adotar a regra uma skill de cada vez. Toda skill que vem para cá declara a lista assim que uma skill citada por ela estiver neste repositório. Cada nova mudança de repositório acrescenta o nome nas skills daqui que citam a skill trazida.
- Quando uma skill muda, suba o `metadata.version`: patch para correção, minor para funcionalidade, major para mudança que quebra. Uma skill abaixo de 1.0.0 sem 3 evals validados sobe o minor numa mudança que quebra, porque o verificador exige 3 evals a partir da 1.0.0.
- Renomear uma skill é uma mudança que quebra. Ponha `!` depois do tipo, comece o rodapé com `BREAKING CHANGE:` e ponha cada nome anterior em `metadata.aliases`.
- O `.agents/skills/README.md` é gerado pelo `.agents/scripts/skill-graph/run-graph.sh`: um grafo Mermaid de como as skills se relacionam. Num harness de negócio, ele também mostra as skills do core, num grupo próprio. Não edite à mão.
- O Lefthook roda o `.agents/scripts/check-skill/run-check.sh` no commit. Ele também falha quando o `.agents/skills/README.md` está desatualizado. Não commite se ele falhar.

## Sincronização com o Notion

- Não edite as páginas de skill nem o banco delas no Notion: a sincronização é a única que escreve. Como ela funciona está no `CONTRIBUTING.md`.

## Fontes de dados

- Descreva uma fonte de dados com JSON Schema e um mapeamento do Notion separado, como em `docs/adr/0001-describe-data-sources-with-json-schema.md`. Esses arquivos ficam no harness de negócio, não aqui.
- Uma skill do core que lê uma fonte de dados do negócio fala de conceitos, como o título da edição ou o grupo de uma edição. O mapeamento de cada negócio liga esses conceitos aos nomes da lista e das propriedades. Uma propriedade sem a qual a edição não existe e que falta no mapeamento para a skill antes de ela escrever. Um valor de propriedade opcional que falta no mapeamento é listado no fim, com a sugestão de criar a propriedade: a skill nunca cria schema e nunca escreve esse valor no corpo da página.
- `Considerar grupos de oportunidades` diz se as skills de oportunidade usam grupos. Com `sim`, toda edição pertence a exatamente um grupo, e o verificador falha quando o mapeamento de oportunidades do negócio, `.agents/mappings/oportunidades.notion.json`, não liga `group`. Com `não`, a edição não tem grupo.
- `Glossário no repositório atual` diz se os arquivos de idioma ficam no repositório aberto nesta sessão e sobem no Git. O repositório atual é esse. Cada projeto define o próprio valor. Com `não`, eles ficam só no computador, na `Pasta do glossário`.
- A pasta do glossário não é o harness. O glossário pode ficar dentro de um harness.
- `Harness no repositório atual` diz se o repositório aberto nesta sessão recebe a instalação do harness. Com `não`, não acrescente essa instalação nele. Isso não escolhe uma instalação global. A instalação reúne o servidor, as skills, a linha de comando e a API.
- `Forma do harness` é `repositório próprio`, `repositório existente` ou `próprio e repositórios`. A tabela está em `INSTALL.md`. A forma não decide a pasta do glossário nem a pasta de skills.
- `Papel do repositório atual` é `harness` ou `projeto`. `harness` é o repositório de harness do negócio. `projeto` usa ou recebe a instalação.
- `Instalação do harness` é `repositório` ou `global`. Com `global`, o repositório atual não recebe outra instalação. Com `repositório`, vale `Harness no repositório atual`.
- Um valor vazio desses parâmetros pergunta uma vez e não escolhe o lugar.
- As skills que um repositório guarda ficam na pasta de skills dele. As skills do core podem chegar por um link da dependência instalada. Nenhuma das duas decide a pasta do glossário.
- O motor que lê e escreve o glossário fica neste repositório, em `vocabulary/`, como decide a ADR 0018.

## Documentos

- O `ARCHITECTURE.md` é o mapa de arquivos, componentes e fronteiras, no formato ARCHITECTURE.md. Não descreva a organização em outro documento; aponte para ele. Atualize-o quando uma pasta, um componente ou uma fronteira mudar.
- O `FEATURES.md` lista as ferramentas que uma pessoa ou um repositório usa diretamente. Cada skill tem a entrada dela em `.agents/skills/FEATURES.md`, escrita à mão. Quando uma skill vem para cá, a entrada dela vai para `.agents/skills/FEATURES.md`. Não copie um documento para outro.
- O `INSTALL.md` é o índice dos runbooks de instalação em `docs/runbooks/`, um por ferramenta, cada um uma lista de passos com um comando e uma verificação. Os harnesses de negócio apontam para eles e guardam no próprio `INSTALL.md` só os valores do negócio. Um runbook copia um arquivo de configuração de `examples/` em vez de mostrá-lo no texto; a versão fixada num exemplo é `vX.Y.Z`, que o runbook troca.
- Nenhum documento Markdown cita uma release, como `v1.2.3`, a não ser o `CHANGELOG.md`. Cite o arquivo que fixa a versão, como o `package.json`. Um harness de negócio segue a mesma regra nos próprios documentos. O Renovate move as versões fixadas, não o texto, então uma versão no texto fica desatualizada na release seguinte. A versão de exemplo é `vX.Y.Z`.
- As decisões de arquitetura ficam em `docs/adr/`, no `Idioma das decisões de arquitetura`, que tem inglês como padrão. Um projeto que quer as decisões em outro idioma, por exemplo para quem vai cuidar dele depois, define esse parâmetro no próprio `AGENTS.md`.
- Fica em `docs/adr/` só a decisão que vale. Quando uma decisão substitui outra inteira, apague a antiga; quando substitui só uma parte, tire essa parte da antiga. A nova decisão conta o que mudou e por quê, e o histórico do git guarda o texto antigo.
