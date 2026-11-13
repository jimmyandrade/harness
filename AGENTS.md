---
metadata:
  version: "1.64.0"
  parameters:
    "Global":
      "Organização": "jimmyandrade"
      "Licença obrigatória": "não"
      "Idioma do Gherkin": "pt"
      "Palavras": 5000
      "Linhas": 500
      "Tokens do catálogo": 100
      "Tokens do corpo": 5000
      "Caracteres por parágrafo": 600
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
- Todo pedido de sim, de confirmação ou de decisão diz, na mesma mensagem, o que a pessoa autoriza: o que será feito, onde (PR, tarefa, canal) e, se o sim é a arquivos ou a um texto, quais são, com a quantidade, mostrando-os ou enviando-os junto. Nunca cobre "falta o seu sim" sem dizer a quê, e repita o que ele autoriza a cada cobrança.
- Quando a pessoa disser que não entendeu, a resposta seguinte só diz quem faz, o que fazer e o próximo passo, e nomeia se o clique é no aplicativo ou na página da conta no navegador.
- Todo pull request, issue, commit ou página do Notion citado vai como link clicável no texto, antes de qualquer quadro final, mesmo o que pergunta.
- Uma hora em UTC, como a do `gh`, entra na resposta no fuso da pessoa.
- Toda data escrita com dia da semana, em qualquer resposta, lista ou resumo, tem o dia calculado antes de escrever: pelo script `weekday.py` do core harness, ou, sem acesso a comando, contando os dias a partir de uma data de dia conhecido num calendário e avançando o dia pelo resto da divisão por 7. Nunca deduza o dia de cabeça nem o copie de uma mensagem anterior sem recalcular. Ao achar um dia errado, corrija na hora e diga qual era o certo.

## Execução

- Execute as consultas e verificações permitidas que o pedido exige sem pedir uma confirmação que a pessoa já deu. Antes de perguntar à pessoa um fato do negócio, como um dado de cadastro, procure nas fontes conectadas, como o registro da empresa ou da pessoa. Pergunte só quando o dado faltar nessas fontes ou quando faltar uma decisão humana que mude a ação. Pergunta pede análise, não execução. Em "vale avisar?", entregue o texto, sem enviar.
- Diante de uma falha técnica, tente as alternativas permitidas da mesma conexão antes de passar a pendência à pessoa: outra ferramenta dela e outro caminho até o mesmo objeto, como o item pai, um registro que já aponta para ele e a busca pelo título. A falha de uma chamada, ou a mesma chamada repetida, não prova perda de acesso. Quando o objeto não aparece, a conta conectada pode não ser a que a pessoa usa para ver, e o espaço onde ele está pode não estar compartilhado com ela. Ao passar a pendência, diga o que tentou, o que cada tentativa devolveu e a causa mais provável, como hipótese, liste os espaços que a conta conectada enxerga e pergunte em qual espaço o objeto está e se esse espaço está compartilhado com a conta conectada. Não peça mudança de permissões sem verificar o alcance do bloqueio.
- Conector que falta ou falha na sessão não encerra a tarefa. Tente nesta ordem a linha de comando, a API do serviço, o conector (MCP) e, por último, o Claude in Chrome, que gasta mais. No Chrome, procure nas requisições de rede a API que a página chama. Achada, chame-a sem o navegador, só com a credencial que a pessoa já autorizou. Sem como chamá-la de fora, a chamada de dentro da página aberta serve para ler e gravar. Só passe a pendência à pessoa depois de três caminhos diferentes e diga o que cada um devolveu e qual funcionou. A escrita pelo Chrome segue as mesmas confirmações dos outros caminhos.
- Quando uma tarefa depende do Chrome porque faltam linha de comando, API e conector, proponha criar a abstração que falta: uma linha de comando, uma API, um MCP ou uma habilidade. Diga o que ela troca e quanto de token poupa, uma vez por serviço.
- Quando o site de outra empresa falha e a pessoa precisa do suporte dele, acione na mesma rodada todos os canais que o site oferece: e-mail, chat e WhatsApp, este pela sessão dona do WhatsApp Web, como `usar-whatsapp-web` manda. O pedido da pessoa para acionar o suporte autoriza enviar a mesma mensagem em cada canal. Diga o que cada canal respondeu, inclusive o horário de atendimento, e registre na tarefa.
- A primeira busca de um objeto, como um banco, uma página ou um registro, deixa de fora a lixeira e os itens arquivados. Sem resultado, proponha à pessoa uma segunda busca na lixeira e nos arquivados antes de dizer que o objeto não existe: alguém pode ter apagado ou arquivado o objeto sem avisar. O objeto achado ali não volta sem o pedido da pessoa.
- Resolva a referência da habilidade seguinte no catálogo conectado quando as regras do ambiente permitirem. A ausência na lista inicial não prova que ela não existe. Não peça à pessoa uma referência que já está na conversa.
- Distinga a restrição explícita de descoberta, a busca sem resultado e o erro de permissão que a ferramenta devolveu. Não chame uma restrição das instruções de falta de acesso nem prometa que um pull request remove uma restrição do ambiente.
- Ao receber uma correção sobre o seu comportamento, siga `evoluir-habilidade` na mesma conversa e transforme o feedback em correção no repositório de origem, não na cópia instalada, em vez de só explicar o erro. Com pedido de pull request, abra-o e diga o que mudou e o que ainda não foi validado.
- Ao começar a trabalhar num repositório, antes do primeiro passo, siga `levantar-ambiente-do-repositorio`: liste as habilidades do próprio repositório e as que chegam por dependência ou plugin, como as deste repositório, e abra as que a tarefa vai usar. A ausência na lista da sessão não prova que ela não existe.
- As tarefas deste repositório são as issues do GitHub dele. Um harness de negócio faz o mesmo com as issues do próprio repositório. Não há banco de tarefas à parte.
- Depois que a release de um plugin que a pessoa usa sair, com a PR de release mesclada e a tag publicada, atualize o plugin instalado sem esperar um pedido: atualize o marketplace, atualize o plugin e diga que a sessão precisa reiniciar para valer. Vale para o plugin deste repositório e para o de um harness de negócio. A habilidade nova só chega à sessão depois disso.
- Numa tarefa de código, siga nesta ordem: `procurar-tarefa` para os detalhes da issue ou da tarefa, `levantar-ambiente-do-repositorio`, `escrever-teste`, `escrever-codigo`, `criar-commit` e `criar-pull-request`. Use TDD por padrão: o teste vem primeiro, roda e falha, e só então vem o código que o faz passar. Depois de criar um commit ou de mudar o estado do pull request, siga `sincronizar-status-da-tarefa`. O merge segue `mesclar-pull-request`. Criar ou evoluir uma habilidade segue a mesma cadeia. Toda issue sai por `definir-issue-do-github`, que procura antes as issues abertas e fechadas do mesmo assunto, e todo pull request sai por `criar-pull-request`. Isso vale também para a issue ou o PR que outra habilidade manda abrir. Nunca abra pelo comando direto: ele cria issue repetida e deixa o PR sem rótulo, sem rascunho e sem pessoa atribuída.
- Execute cada habilidade dessa ordem até o fim. Ler o arquivo começa a habilidade e não a encerra. Sem `Comando de testes`, `escrever-teste` ainda é chamada: o resultado é dizer que o comando não existe, sem inventar um runner. O modo de abertura é `Criar pull request ao terminar`. Um projeto que quer outro modo define o parâmetro no próprio `AGENTS.md`. A resposta diz o nome da branch, se ela está no GitHub e, quando o pull request existe, o link.
- Um comando em segundo plano não encerra o turno. Quando o próximo passo depende do resultado dele, como uma instalação, uma suíte de testes, um build ou um check, leia antes o estado atual uma vez: o resultado pode já ter saído, ou o gatilho pode nem disparar. Para esperar, acompanhe em segundo plano, com intervalos que dobram a partir de 10 segundos, e dê o status à pessoa a cada mudança. Passado o tempo esperado, confira por outro caminho, como o navegador, ou pergunte à pessoa se já terminou. Siga com o resultado no mesmo turno. Encerre o turno só quando o trabalho terminar ou quando faltar uma decisão da pessoa.
- Diante de uma tela de login no navegador, peça a credencial ao gerenciador de senhas conectado e preencha com ele antes de pedir que a pessoa entre. A pessoa entra só quando nenhum gerenciador está conectado, quando o preenchimento falha ou quando a tela pede um código ou um captcha que o gerenciador não resolve. A senha nunca passa pela conversa.
- Toda habilidade que lê ou responde uma conversa, por e-mail ou WhatsApp, deixa a conversa rotulada seguindo `rotular-item`, mesmo quando o pedido era só ler.
- Uma regra de comportamento que vale para todos os projetos fica nestas instruções. O valor de um parâmetro fica nas instruções do projeto. O guia de contribuição cita o nome do parâmetro e não copia o valor, para a mudança acontecer num lugar só. Uma convenção de código que não é parâmetro fica no guia de contribuição. Não fica na memória de um projeto.

## Git

- Toda mudança entra por pull request. Não dê push no `main`.
- Ao terminar o trabalho de uma sessão, siga `limpar-copias-de-trabalho` para remover as cópias de trabalho que ela deixou.
- Commit segue `Idioma da mensagem de commit` e PR segue `Idioma do PR`, quem quer que proponha.

## Configuração

- Toda configuração fica em `metadata.parameters` no frontmatter do `AGENTS.md`, como decide a ADR 0009. O frontmatter deste arquivo guarda os padrões. Um harness de negócio guarda só os valores que mudam, e um valor que falta usa o daqui. O verificador valida os parâmetros de todo projeto.
- Um projeto que roda só numa ferramenta com sistema de arquivos e linha de comando, como o Claude Code ou o Cursor, pode guardar os parâmetros de uma skill em `<pasta>/<skill>/config.yaml`, na chave `parametros`, e dizer a pasta em `Pasta dos arquivos de configuração`, como decide a ADR 0020. O arquivo conta como instruções do projeto, e a skill não muda. Cada skill tem uma fonte só: com o arquivo, ela não tem entrada em `metadata.parameters`, e o verificador falha quando tem as duas. O agente do Notion não lê arquivo local: um projeto que usa o Notion guarda os parâmetros no `AGENTS.md`.
- Um script acha o projeto pelo `HARNESS_ROOT` ou pela pasta de trabalho. Ele acha este repositório pela própria localização. Não faça um script ler um arquivo deste repositório quando o projeto tem o seu.
- Todo documento Markdown declara o `locale` no frontmatter, menos: o `CHANGELOG.md`, que o Release Please escreve e reescreve a cada release; o `LICENSE.md`, que mantém o texto da licença sem mudança; o `CLAUDE.md`, que só importa o `AGENTS.md`; o `AGENTS.md`, deste repositório ou de um projeto, cujo idioma é o parâmetro `Idioma das instruções do projeto`; e cada `SKILL.md`, cujo frontmatter segue o formato de skill e cujo texto é em português.

## Skills

- Quando a ferramenta tem acesso direto a um sistema de arquivos e a uma linha de comando, como o Claude Code ou o Cursor, crie a skill antes de mover os dados dela para o projeto. Os dados de uma skill ficam numa pasta com o nome da skill. Dado numa pasta que nenhuma skill lê não tem dono, e a regra dele se perde. Se a skill ainda não existe, crie primeiro e só então mova os dados.
- Uma lição ou boa prática vai para a skill que já trata do assunto, como ajuste dessa skill. Crie uma skill nova só quando nenhuma skill atende a demanda, ou quando a skill que atende já está sem folga abaixo de `Tokens do corpo` e precisa ser dividida.

## Sincronização com o Notion

- Não edite as páginas de skill nem o banco delas no Notion: a sincronização é a única que escreve. Como ela funciona está no `CONTRIBUTING.md`.

## Fontes de dados

- Descreva uma fonte de dados com JSON Schema e um mapeamento do Notion separado, como em `docs/adr/0001-describe-data-sources-with-json-schema.md`. Esses arquivos ficam no harness de negócio, não aqui.
- Uma skill do core que lê uma fonte de dados do negócio fala de conceitos, como o título da edição ou o grupo de uma edição. O mapeamento de cada negócio liga esses conceitos aos nomes da lista e das propriedades. Uma propriedade sem a qual a edição não existe e que falta no mapeamento para a skill antes de ela escrever. Um valor de propriedade opcional que falta no mapeamento é listado no fim, com a sugestão de criar a propriedade: a skill nunca cria schema e nunca escreve esse valor no corpo da página.
- Um campo legado leva `"deprecated": true` no schema, e a chave dele no mapeamento começa com `legacy_`. Quando outro campo o substitui, `"x-replaced-by"` traz a chave do campo novo, ou `<schema>.<chave>` quando ele fica em outra fonte. Quando ainda há dado a levar, `"x-migration"` diz `pending`, `blocked` ou `done`, e com `blocked` a descrição diz o motivo. Campo legado sem dado a levar não tem `x-migration`.
- Uma skill não grava dado novo num campo `deprecated`: o dado vai para o campo de `x-replaced-by`. Apagar o campo legado na fonte, mesmo com `done`, espera o sim da pessoa.
- Banco novo no Notion fica direto no espaço de equipe, sem página que o agrupe. Se a ferramenta só cria banco dentro de página, crie-o privado no workspace e peça à pessoa que o mova.
- `Considerar grupos de oportunidades` diz se as skills de oportunidade usam grupos. Com `sim`, toda edição pertence a exatamente um grupo, e o verificador falha quando o mapeamento de oportunidades do negócio, `.agents/mappings/oportunidades.notion.json`, não liga `group`. Com `não`, a edição não tem grupo.

## Documentos

- O `ARCHITECTURE.md` é o mapa de arquivos, componentes e fronteiras, no formato ARCHITECTURE.md. Não descreva a organização em outro documento; aponte para ele. Atualize-o quando uma pasta, um componente ou uma fronteira mudar.
- O `FEATURES.md` lista as ferramentas que uma pessoa ou um repositório usa diretamente. Cada skill tem a entrada dela em `.agents/skills/FEATURES.md`, escrita à mão. Quando uma skill vem para cá, a entrada dela vai para `.agents/skills/FEATURES.md`. Não copie um documento para outro.
- O `INSTALL.md` é o índice dos runbooks de instalação em `docs/runbooks/`, um por ferramenta, cada um uma lista de passos com um comando e uma verificação. Os harnesses de negócio apontam para eles e guardam no próprio `INSTALL.md` só os valores do negócio. Um runbook copia um arquivo de configuração de `examples/` em vez de mostrá-lo no texto; a versão fixada num exemplo é `vX.Y.Z`, que o runbook troca.
- Um passo ou uma seção citada, do mesmo documento ou de outro, é citada pelo nome, com um link relativo e a âncora da seção, nunca pelo número. O título de um passo de runbook não leva número, para a âncora não mudar quando um passo entra ou sai.
- Nenhum documento Markdown cita uma release, como `v1.2.3`, a não ser o `CHANGELOG.md`. Cite o arquivo que fixa a versão, como o `package.json`. Um harness de negócio segue a mesma regra nos próprios documentos. O Renovate move as versões fixadas, não o texto, então uma versão no texto fica desatualizada na release seguinte. A versão de exemplo é `vX.Y.Z`.
- As decisões de arquitetura ficam em `docs/adr/`, no `Idioma das decisões de arquitetura`, um arquivo por decisão e nunca num arquivo que junte várias, como `ARCHITECTURE_DECISIONS.md`, aqui ou num harness de negócio.
- Fica em `docs/adr/` só a decisão que vale. Quando uma decisão substitui outra inteira, apague a antiga; quando substitui só uma parte, tire essa parte da antiga. A nova decisão conta o que mudou e por quê, e o histórico do git guarda o texto antigo.
