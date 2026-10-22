---
name: levantar-ambiente-do-repositorio
description: Levanta o ambiente de trabalho de um repositório antes de escrever código, testes, commit ou pull request. Acha o runtime e como ativá-lo, os comandos de instalar, lint, tipos, testes e build, as habilidades do repositório que se aplicam e as pegadinhas que ele documenta. Não serve para rodar os comandos, instalar dependências nem decidir a convenção de código.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  notion: "false"
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
```

## Instruções

### Passo 1

Peça o repositório, ou a cópia de trabalho em que a mudança será feita. O ambiente se levanta nessa cópia, não em outra.

### Passo 2

Leia os `Arquivos de instruções` e liste as `Pastas de habilidades do repositório`, inclusive a pasta `.github`, antes de concluir que ele não tem convenções. Leia o nome e a descrição de cada habilidade do repositório, e abra a que trata de ambiente, de git, de pull request, de testes, de lint ou de criar o tipo de coisa que a mudança cria.

### Passo 3

Ache o runtime: a versão exigida e como ativá-la. Procure o arquivo de versão do projeto, como `.nvmrc` ou `.tool-versions`, o campo de versão do manifesto e o que as instruções dizem. Se uma instrução manda ativar o runtime na mesma chamada que roda o comando, registre isso como obrigatório, com o texto exato do comando.

### Passo 4

Ache os comandos de instalar, de lint dos arquivos tocados, de tipos, de testes por arquivo ou afetados e de build. Pegue-os das instruções e das habilidades do repositório. Na falta delas, leia os `Manifestos de comandos`. Marque de onde veio cada comando. Não invente um comando que nenhuma fonte tem.

### Passo 5

Registre as pegadinhas do ambiente que o repositório documenta: falhas conhecidas que não são da mudança, variáveis ou credenciais necessárias, hook de pre-push e quanto ele leva, e comandos que não se deve rodar.

### Passo 6

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

## Pegadinhas

- Um arquivo de instruções pode apontar para outro. Leia o que ele cita.
- O comando do manifesto roda tudo. O de arquivos tocados pode estar numa habilidade ou nas instruções.
- O hook de pre-push pode levar minutos e parece travado.
- Esta habilidade só lê. Instalar dependência ou rodar um comando é de quem chamou.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
