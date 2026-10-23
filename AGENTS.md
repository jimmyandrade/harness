---
metadata:
  version: "1.15.0"
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
      "Idioma da issue": "português do Brasil"
      "Idioma das instruções do projeto": "português do Brasil"
      "Idioma das respostas": "português do Brasil"
      "Idioma das decisões de arquitetura": "inglês"
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
- Comece toda resposta pelo que precisa ser feito e por quem faz. Termine com a sugestão do próximo passo e, se houver, com a decisão que cabe à pessoa.
- Todo pull request, issue ou commit citado leva o link completo, inclusive na pergunta sobre quem mescla.

## Git

- Toda mudança entra por pull request. Não dê push no `main`.
- Ao terminar o trabalho de uma sessão, siga `limpar-copias-de-trabalho` para remover as cópias de trabalho que ela deixou.
- Escreva o assunto de todo commit no idioma de `Idioma da mensagem de commit`, um parâmetro da `criar-commit`, que tem inglês como padrão.
- Use um assunto em Conventional Commits: `tipo: descrição`. Quando a mudança afeta uma skill, o assunto é `tipo(nome-da-skill): descrição`. Os tipos são `feat`, `fix`, `perf`, `docs`, `refactor`, `test`, `chore` e `ci`.
- Uma mudança no CI ou numa action usa `ci`, mesmo quando acrescenta comportamento.
- Dê a toda branch o nome `tipo/descricao-curta`, com um desses tipos e uma descrição em ASCII e kebab-case: `feat/build-on-install`, `fix/mcp-path`. Uma branch que uma ferramenta criou com outro prefixo, como `claude/` ou `cursor/`, é renomeada antes do primeiro push. Renomear uma branch que já tem pull request fecha esse pull request: abra outro a partir da branch renomeada, com o mesmo título e a mesma descrição, e ponha o link dele no antigo. Um passo `Check the branch name` no CI reprova o pull request de uma branch fora desse padrão.

## Configuração

- Quando o `AGENTS.md` muda, suba o `metadata.version` dele como o de uma skill: patch para correção, minor para regra nova, major para mudança que quebra.
- Toda configuração fica em `metadata.parameters` no frontmatter do `AGENTS.md`, como decide a ADR 0009. O frontmatter deste arquivo guarda os padrões. Um harness de negócio guarda só os valores que mudam, e um valor que falta usa o daqui. O verificador valida os parâmetros de todo projeto.
- Um script acha o projeto pelo `HARNESS_ROOT` ou pela pasta de trabalho. Ele acha este repositório pela própria localização. Não faça um script ler um arquivo deste repositório quando o projeto tem o seu.
- Todo documento Markdown declara o `locale` no frontmatter, menos: o `CHANGELOG.md`, que o Release Please escreve e reescreve a cada release; o `LICENSE.md`, que mantém o texto da licença sem mudança; o `CLAUDE.md`, que só importa o `AGENTS.md`; o `AGENTS.md`, deste repositório ou de um projeto, cujo idioma é o parâmetro `Idioma das instruções do projeto`; e cada `SKILL.md`, cujo frontmatter segue o formato de skill e cujo texto é em português.

## Skills

- Salve toda skill como `.agents/skills/<nome>/SKILL.md`. O `name` é igual ao nome da pasta. O nome da pasta e o `name` do frontmatter são em ASCII e kebab-case. O título de nível 1 e o corpo são linguagem natural para pessoas e modelos, então mantêm ortografia e gramática corretas, com todos os acentos: `# Resolver comentários de revisão`. Uma skill que não deve ir para o Notion define `metadata.notion` como `"false"`. Uma skill ainda em construção define `metadata.internal` como `true`, sem aspas: a CLI `skills` esconde a skill do `npx skills add`, e a sincronização a deixa fora do Notion.
- O texto da skill não cita arquivo nem caminho, a não ser ao propor mover detalhes para `references/` quando a skill passaria do limite de linhas ou de tokens, ao apontar um modelo de entrada, e na seção final `Scripts disponíveis`, que diz o nome de cada script e como rodá-lo.
- Uma skill cita um modelo de saída pelo nome, como decide a ADR 0016: ``Leia o modelo de saída `<nome>` quando for gerar a saída.`` Num repositório, o agente lê `.agents/assets/templates/<nome>.md` do projeto ou, se não houver, deste harness. Fora dele, abre a página com esse título no banco que `Banco de modelos no Notion` indica. A skill lista o modelo em `metadata.models`, um nome por linha, e o verificador confere essa lista como confere `metadata.related`.
- Uma skill que vai para o Notion não cita uma skill com `metadata.notion` igual a `"false"`, porque o agente do Notion não consegue carregá-la. O `AGENTS.md` de um negócio também não cita, porque ele vai inteiro para o Notion: a regra que manda usar uma skill dessas fica no guia de contribuição do negócio. O verificador reprova os dois casos.
- Uma skill que cita outra skill a lista em `metadata.related`, um nome por linha. O verificador falha quando um nome da lista não é skill do projeto nem deste harness, ou quando o corpo cita uma skill que falta na lista. Uma skill sem `metadata.related` não é conferida, para um harness de negócio adotar a regra uma skill de cada vez. Toda skill que vem para cá declara a lista assim que uma skill citada por ela estiver neste repositório. Cada nova mudança de repositório acrescenta o nome nas skills daqui que citam a skill trazida.
- Quando uma skill muda, suba o `metadata.version`: patch para correção, minor para funcionalidade, major para mudança que quebra. Uma skill abaixo de 1.0.0 sem 3 evals validados sobe o minor numa mudança que quebra, porque o verificador exige 3 evals a partir da 1.0.0.
- Renomear uma skill é uma mudança que quebra. Ponha `!` depois do tipo, comece o rodapé com `BREAKING CHANGE:` e ponha cada nome anterior em `metadata.aliases`.
- O `.agents/skills/README.md` é gerado pelo `.agents/scripts/skill-graph/run-graph.sh`: um grafo Mermaid de como as skills se relacionam. Num harness de negócio, ele também mostra as skills do core, num grupo próprio. Não edite à mão.
- O Lefthook roda o `.agents/scripts/check-skill/run-check.sh` no commit. Ele também falha quando o `.agents/skills/README.md` está desatualizado. Não commite se ele falhar.

## Sincronização com o Notion

- O GitHub é a fonte de escrita. A action de sincronização é a única que escreve as páginas de skill no Notion. Não edite essas páginas nem esse banco no Notion.
- O schema de uma página de skill é o `.agents/schemas/skill-page.schema.json`. Cada negócio guarda o próprio mapeamento, com o id do data source, os nomes das propriedades e os nomes das opções de status. O `.agents/mappings/skill-page.notion.example.json` é o modelo.
- Um modelo em `.agents/assets/templates/` é publicado num banco de modelos só quando o negócio tem o `.agents/mappings/template-page.notion.json`, como decide a ADR 0015. O schema dele é o `.agents/schemas/template-page.schema.json`, e o `.agents/mappings/template-page.notion.example.json` é o modelo. A sincronização é a única que escreve as propriedades que esse mapeamento liga e o corpo da página.
- Uma versão abaixo de 0.1.0 é a opção de rascunho. Uma versão a partir de 0.1.0 com major 0 é a opção de validação. Uma versão a partir de 1 é a opção de produção.

## Fontes de dados

- Descreva uma fonte de dados com JSON Schema e um mapeamento do Notion separado, como em `docs/adr/0001-describe-data-sources-with-json-schema.md`. Esses arquivos ficam no harness de negócio, não aqui.
- Uma skill do core que lê uma fonte de dados do negócio fala de conceitos, como o título da edição ou o grupo de uma edição. O mapeamento de cada negócio liga esses conceitos aos nomes da lista e das propriedades. Uma propriedade sem a qual a edição não existe e que falta no mapeamento para a skill antes de ela escrever. Um valor de propriedade opcional que falta no mapeamento é listado no fim, com a sugestão de criar a propriedade: a skill nunca cria schema e nunca escreve esse valor no corpo da página.
- `Considerar grupos de oportunidades` diz se as skills de oportunidade usam grupos. Com `sim`, toda edição pertence a exatamente um grupo, e o verificador falha quando o mapeamento de oportunidades do negócio, `.agents/mappings/oportunidades.notion.json`, não liga `group`. Com `não`, a edição não tem grupo.
- O glossário de um projeto fica nesse projeto. O motor que o lê e escreve fica neste repositório, em `vocabulary/`, como decide a ADR 0018.

## Documentos

- O `ARCHITECTURE.md` é o mapa de arquivos, componentes e fronteiras, no formato ARCHITECTURE.md. Não descreva a organização em outro documento; aponte para ele. Atualize-o quando uma pasta, um componente ou uma fronteira mudar.
- O `FEATURES.md` lista as ferramentas que uma pessoa ou um repositório usa diretamente. Cada skill tem a entrada dela em `.agents/skills/FEATURES.md`, escrita à mão. Quando uma skill vem para cá, a entrada dela vai para `.agents/skills/FEATURES.md`. Não copie um documento para outro.
- O `INSTALL.md` é o índice dos runbooks de instalação em `docs/runbooks/`, um por ferramenta, cada um uma lista de passos com um comando e uma verificação. Os harnesses de negócio apontam para eles e guardam no próprio `INSTALL.md` só os valores do negócio. Um runbook copia um arquivo de configuração de `examples/` em vez de mostrá-lo no texto; a versão fixada num exemplo é `vX.Y.Z`, que o runbook troca.
- Nenhum documento Markdown cita uma release, como `v1.2.3`, a não ser o `CHANGELOG.md`. Cite o arquivo que fixa a versão, como o `package.json`. Um harness de negócio segue a mesma regra nos próprios documentos. O Renovate move as versões fixadas, não o texto, então uma versão no texto fica desatualizada na release seguinte. A versão de exemplo é `vX.Y.Z`.
- As decisões de arquitetura ficam em `docs/adr/`, no `Idioma das decisões de arquitetura`, que tem inglês como padrão. Um projeto que quer as decisões em outro idioma, por exemplo para quem vai cuidar dele depois, define esse parâmetro no próprio `AGENTS.md`.
- Fica em `docs/adr/` só a decisão que vale. Quando uma decisão substitui outra inteira, apague a antiga; quando substitui só uma parte, tire essa parte da antiga. A nova decisão conta o que mudou e por quê, e o histórico do git guarda o texto antigo.
