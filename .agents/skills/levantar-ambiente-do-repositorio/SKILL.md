---
name: levantar-ambiente-do-repositorio
description: Levanta o ambiente de trabalho de um repositório antes de escrever código, testes, commit ou pull request. Acha o runtime e como ativá-lo, os comandos de instalar, lint, tipos, testes e build, as habilidades do repositório que se aplicam e as pegadinhas que ele documenta. Não serve para rodar os comandos, instalar dependências nem decidir a convenção de código.
metadata:
  author: jimmyandrade
  version: "0.5.0"
  related:
    - criar-commit
    - criar-pull-request
    - escrever-codigo
    - escrever-teste
    - evoluir-habilidade
    - levantar-contexto-do-pull-request
---

# Levantar ambiente do repositório

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.

```yaml
"Arquivos de instruções": "AGENTS.md, CLAUDE.md, CONTRIBUTING.md"
"Pastas de habilidades do repositório": ".claude/skills, .agents/skills, .cursor, .github"
"Manifestos de comandos": "package.json, Makefile, pyproject.toml, justfile"
"Modo de aprendizado": "perguntar"
# `Harness no repositório atual` é `sim` ou `não`. O repositório atual é o que está aberto nesta sessão. Cada projeto define o próprio valor. Com `não`, não acrescente nele a instalação do harness. Isso não escolhe a instalação global, nem a pasta do glossário, nem a pasta de skills.
"Harness no repositório atual": "sim"
# `Instalação do harness` é `repositório` ou `global`. `repositório` permite a instalação no repositório atual. `global` usa a instalação única da ferramenta, para o negócio, e o repositório atual não recebe dependência, link de skills, plugin nem servidor. Não decide a pasta do glossário nem a pasta de skills.
"Instalação do harness": "repositório"
```

## Instruções

### Passo 1

Peça o repositório, ou a cópia de trabalho em que a mudança será feita. O ambiente se levanta nessa cópia, não em outra.

### Passo 2

Leia os `Arquivos de instruções` e liste as `Pastas de habilidades do repositório`, inclusive a pasta `.github`, antes de concluir que ele não tem convenções. Liste também as habilidades que chegam por dependência ou plugin: uma dependência dos `Manifestos de comandos` que traz habilidades, como o core harness, e os plugins habilitados nas configurações da ferramenta. Uma habilidade que a sessão não carregou é lida do `SKILL.md` dela. Quando a habilidade carregada na sessão tem `metadata.version` diferente da que o repositório fixa, no próprio repositório ou na dependência, siga o `SKILL.md` do repositório e diga que o plugin instalado está desatualizado. Leia o nome e a descrição de cada habilidade do repositório, e abra a que trata de ambiente, de git, de pull request, de testes, de lint ou de criar o tipo de coisa que a mudança cria.

### Passo 3

Ache o runtime: a versão exigida e como ativá-la. Procure o arquivo de versão do projeto, como `.nvmrc` ou `.tool-versions`, o campo de versão do manifesto e o que as instruções dizem. Se uma instrução manda ativar o runtime na mesma chamada que roda o comando, registre isso como obrigatório, com o texto exato do comando.

### Passo 4

Ache os comandos de instalar, de lint dos arquivos tocados, de tipos, de testes por arquivo ou afetados e de build. Pegue-os das instruções e das habilidades do repositório. Na falta delas, leia os `Manifestos de comandos`. Marque de onde veio cada comando. Não invente um comando que nenhuma fonte tem.

### Passo 5

Registre as pegadinhas do ambiente que o repositório documenta: falhas conhecidas que não são da mudança, variáveis ou credenciais necessárias, hook de pre-push e quanto ele leva, e comandos que não se deve rodar.

### Passo 6

Leia `Instalação do harness` e `Harness no repositório atual`. O repositório atual é o que está aberto nesta sessão. Com `global`, a ficha diz que o harness é a instalação única da ferramenta e que o repositório atual não recebe dependência, link de skills, plugin nem servidor. Com `repositório` e `Harness no repositório atual` em `não`, a ficha diz para não acrescentar a instalação e que isso não escolhe a instalação global. Liste à parte as skills do repositório atual e as que chegam pela instalação da ferramenta. A pasta do glossário não faz parte dessa instalação.
Entregue a ficha, com uma seção por passo: instruções e habilidades do repositório, runtime e como ativar, comandos com a origem de cada um, habilidades do repositório que se aplicam a cada tarefa e pegadinhas. Em cada seção que não achou nada, escreva "Não achei". Não rode nenhum comando além de ler arquivos, e não instale nada.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Comando inventado

Se você escrever um comando de teste que nenhuma fonte do repositório tem, quem usa a ficha roda algo que não existe ou que faz outra coisa.

1. Procure o comando nas instruções, nas habilidades e no manifesto.
2. Se não achou, escreva "Não achei" e pergunte.

### Runtime errado

Se você ignorar a versão do runtime e a regra de ativá-la na mesma chamada, o lint e os testes falham por causa do ambiente, e parece que a mudança quebrou.

1. Leia o arquivo de versão e as instruções.
2. Entregue o comando de ativar junto com o comando de rodar.

### Habilidade do repositório ignorada

Se você só leu o arquivo de instruções, perde a habilidade do repositório que já explica como criar um componente, escrever um teste ou abrir um PR.

1. Liste as pastas de habilidades.
2. Leia o nome e a descrição de cada uma, e abra a que se aplica.

### Instalação do harness no repositório atual

Se você acrescentar a instalação do harness no repositório atual com `Instalação do harness` em `global`, ou com `Harness no repositório atual` em `não`, ou tratar esse `não` como instalação global, o repositório recebe arquivos que o negócio não pediu ou a ficha aponta um harness que não foi escolhido.

1. Leia `Instalação do harness` e `Harness no repositório atual`.
2. Com `global`, use a instalação da ferramenta e não acrescente outra no repositório atual.
3. Com `repositório` e `Harness no repositório atual` em `não`, não acrescente a instalação e não trate isso como global. Pergunte uma vez onde está o harness desse trabalho e pare.
4. A pasta do glossário, a pasta de skills e a instalação do harness são decisões separadas.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Levante o ambiente do repositório de pedidos antes de eu mudar o formatador de datas

O repositório tem `AGENTS.md` e uma habilidade chamada `dev-environment`. O arquivo `.nvmrc` pede a versão 20, e a habilidade manda ativar a versão na mesma chamada do comando. O lint dos arquivos tocados e os testes afetados vêm do `package.json`, e o build está nas instruções. O pre-push leva uns 8 minutos. Não achei variável de ambiente obrigatória.

### Levante o ambiente de uma biblioteca sem instruções

Não achei arquivo de instruções nem habilidade do repositório. O `pyproject.toml` define o comando de testes e o de lint. Não achei como ativar a versão do runtime, então perguntei qual usar.

## Casos-limite

- O repositório não tem instruções nem habilidades: leia só o manifesto e diga que o resto não foi achado.
- Duas fontes dão comandos diferentes: use a habilidade do repositório e diga qual conflita.
- O repositório é um monorepo: levante os comandos do projeto afetado, e diga como escolher o projeto.
- A cópia de trabalho não existe ainda: peça o repositório e pare.
- `Harness no repositório atual` em `não`, com `Instalação do harness` em `repositório`: a ficha diz para não acrescentar a instalação no repositório atual e que isso não escolhe a instalação global. A pasta do glossário não entra nessa decisão.
- `Instalação do harness` em `global`: a ficha aponta a instalação única da ferramenta e diz para não criar outra no repositório atual. `Harness no repositório atual` em `sim` não cria essa segunda cópia.

## Pegadinhas

- Um arquivo de instruções pode apontar para outro. Leia o que ele cita.
- O comando do manifesto roda tudo. O de arquivos tocados pode estar numa habilidade ou nas instruções.
- O hook de pre-push pode levar minutos e parece travado.
- Esta habilidade só lê. Instalar dependência ou rodar um comando é de quem chamou.
- A pasta do glossário parece ser o lugar do harness. O harness reúne o servidor, as skills, a linha de comando e a API. O glossário pode ficar dentro de um harness, e também pode ficar só no computador.
- `Harness no repositório atual` em `não` parece escolher a instalação global. Só `Instalação do harness` em `global` faz isso.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
