---
name: anexar-arquivo-no-notion
description: Anexa um arquivo local a uma página do Notion com a linha de comando `ntn`, na propriedade de arquivos, sem apagar o anexo que já está. Usada quando outra habilidade precisa subir comprovante, foto, PDF ou print do computador para o Notion. NÃO serve para ler a página, criar o banco nem anexar em e-mail ou mensagem.
compatibility: Precisa de terminal e da linha de comando `ntn`.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - evoluir-habilidade
    - procurar-banco-de-dados
---

# Anexar arquivo no Notion

## Parâmetros de configuração

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

A habilidade que cadastra a página chama esta quando o arquivo está no computador e precisa ir para uma propriedade de arquivos do Notion.
Se a sessão é a IA do próprio Notion, ela sobe o arquivo pela ferramenta que tem. Toda outra IA, como as de código, é quem precisa subir o arquivo, com o `ntn`.
O anexo só fica pendente depois de tentar o `ntn`. Com o `ntn` ausente, diga isso e peça a instalação: não instale sem o sim da pessoa.

### Passo 2

Envie o arquivo com `ntn files create`, dando o nome e o tipo, com o arquivo na entrada padrão. O comando devolve o id do envio.
O arquivo sobe por upload e entra numa atualização da página depois de criá-la: a criação não aceita o arquivo enviado.

### Passo 3

Ponha o envio na propriedade de arquivos com `ntn api -X PATCH v1/pages/<id>`. Rode o `ntn api` com a entrada padrão em `/dev/null`, senão ele trava.
Leia a propriedade antes. Para somar a um anexo que já existe, mande no `PATCH` a lista que a leitura da página devolveu mais o arquivo novo, senão o antigo some.
Leia a página depois e confira que o anexo novo e os antigos estão lá.

### Passo 4

Diga o link da página e o que está anexado. Se o `ntn` recusar o arquivo, diga o erro exato e investigue a causa, como o tamanho, o tipo ou o nome da propriedade, antes de dizer que não consegue.
Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Anexo antigo que some

Se você mandar no `PATCH` só o arquivo novo, a propriedade perde o que já estava nela.

1. Leia a propriedade antes.
2. Mande a lista da leitura mais o arquivo novo.
3. Leia depois e confira os dois.

### Comando que trava

Se você rodar o `ntn api` sem fechar a entrada padrão, ele espera o que nunca vem e a sessão para.

1. Rode o `ntn api` com a entrada padrão em `/dev/null`.
2. Se travou, interrompa e rode de novo assim.

### Anexo deixado pendente sem tentar

Se você disser que não consegue anexar sem rodar o `ntn`, a pessoa sobe o arquivo à mão.

1. Tente o `ntn` antes.
2. Só diga que o anexo ficou pendente com o erro exato do `ntn`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Anexe o PDF do comprovante à despesa que acabei de criar.

Li a propriedade de arquivos da despesa, que estava vazia. Enviei o PDF com `ntn files create`, pus o envio na propriedade com `ntn api -X PATCH` e li a página depois: o PDF estava lá. Respondi com o link da página.

### A despesa já tem um comprovante e chegou o segundo.

Li a lista da propriedade e mandei no `PATCH` o comprovante que já estava mais o novo. Na leitura depois, os dois apareciam.

## Casos-limite

- O banco não tem propriedade de arquivos: é limitação do banco. Diga isso e recomende criar uma propriedade de arquivos.
- A sessão é a IA do Notion e tem a ferramenta de upload: use a ferramenta, sem o `ntn`.
- O `ntn` não está instalado: diga isso e peça o sim para instalar.
- O arquivo é grande ou de um tipo que a propriedade recusa: diga o erro exato e investigue a causa antes de desistir.
- O arquivo já está anexado na página: não anexe o mesmo arquivo de novo.

## Pegadinhas

- Subir o arquivo parece parte de criar a página. A criação não aceita o arquivo enviado: a página nasce primeiro e o anexo entra numa atualização.
- Um `PATCH` com o arquivo novo parece somar. Ele troca a lista inteira, então o antigo some se não vier junto.
- O `ntn api` parece terminar sozinho. Sem a entrada padrão em `/dev/null`, ele trava.
- A IA de código parece poder deixar o anexo para a pessoa. É ela quem sobe o arquivo.

## Scripts disponíveis

- `ntn files create --filename <nome> --content-type <tipo> < <arquivo>` envia o arquivo e devolve o id do envio.
- `ntn api -X PATCH v1/pages/<id> -d <json> < /dev/null` põe o envio na propriedade de arquivos da página.

1. Envie o arquivo, leia a propriedade, ponha o envio somado aos anexos que já estão e leia a página de novo.
