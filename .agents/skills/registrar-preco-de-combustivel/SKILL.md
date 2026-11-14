---
name: registrar-preco-de-combustivel
description: Registra o preço de combustível visto num posto da estrada, com data e hora, bandeira, sentido da pista, local no mapa e, quando abastece, o comprovante como despesa. Usada ao ver ou pagar o preço num posto, mesmo sem abastecer. NÃO serve para lançar só a despesa, cadastrar a viagem nem recomendar onde parar.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-empresa
    - definir-viagem
    - evoluir-habilidade
    - identificar-duplicata
    - lancar-despesa-da-empresa
    - procurar-banco-de-dados
---

# Registrar preço de combustível

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

O registro é uma linha no banco de preços de combustível, uma por posto e por leitura. A pessoa informa o data source na execução. Sem ele, use `procurar-banco-de-dados`; se o banco não existir no workspace conectado, pare e peça. Os conceitos do banco são: registro, data e hora, posto (empresa), local no mapa, combustível, preço por litro, se abastecemos, litros, valor pago, sentido da pista, viagem, veículo, comprovante (despesa), quem informou e observações. Um conceito que o esquema não tem fica vazio e nomeado, sem criar propriedade.

### Passo 2

Confira antes de gravar e marque o que já está sustentado:

- [ ] Posto no sentido da viagem. Posto na contramão não entra: não dá para virar e abastecer. Não crie a linha; se ela já existe, marque o sentido da pista como contramão e deixe fora da análise.
- [ ] Combustível e preço por litro, lidos na placa ou na bomba.
- [ ] Hora da leitura, mesmo aproximada. O horário do cupom vale quando houve abastecimento.
- [ ] Origem do preço: foto, bomba ou visto de passagem. Sem foto, diga isso nas observações.
- [ ] Ordem dos postos no caminho e o lado da pista, nas observações.

Preço visto de passagem e sem foto entra mesmo assim, marcado como sem foto. A boa prática é fotografar a placa de todo posto que passa, abastecendo ou não, quando a velocidade e a segurança permitem.

### Passo 3

Resolva o posto pelo nome e pelo CNPJ do comprovante, nunca por busca na web: o nome do cupom é o do estabelecimento, que pode diferir da razão social e da bandeira. Busque a empresa antes com `identificar-duplicata` e cadastre só se faltar, por `definir-empresa`. A bandeira da placa vai nas observações e na desambiguação da empresa, porque a análise pode comparar bandeiras. Sem comprovante, o posto é a bandeira mais o lugar, sem inventar razão social.

### Passo 4

Preencha o local no mapa pela pesquisa de lugares, com o nome e a localização aproximada que a pessoa deu, como a avenida e o trecho. Sem endereço confirmado, use o ponto aproximado e escreva "local aproximado" nas observações. Não invente número de rua. Se o posto não aparecer, deixe o local vazio e proponha o histórico de locais do celular da pessoa no horário da parada.

### Passo 5

Quando abasteceram, siga esta ordem: leia o cupom, registre o preço e depois lance a despesa por `lancar-despesa-da-empresa`, ligando a despesa, a viagem e o veículo à linha de preço. Se a bomba estava coberta, calcule o preço por litro como o valor pago dividido pelos litros e peça a confirmação da pessoa. Do cartão guarde só os quatro últimos dígitos, no cadastro de cartões, nunca o número. A pessoa que pagou e a conta seguem `lancar-despesa-da-empresa`.

### Passo 6

Releia a linha salva, confira os vínculos e responda com o link, o que ficou vazio e o que depende da pessoa. Quando a pessoa pedir a análise de onde parar, use só as linhas no sentido da viagem, compare o mesmo combustível e diga quantas leituras sustentam cada posto e quais não têm foto.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Posto da contramão registrado como opção

Se você registrar o posto do outro lado da pista como se desse para parar, a análise recomenda um posto que a pessoa não alcança.

1. Não crie a linha de um posto na contramão.
2. Se já existe, marque o sentido e deixe fora da análise.
3. Se a pessoa não sabe o lado, pergunte uma vez e não suponha.

### Nome do posto vindo da web

Se você pegar o nome ou a razão social numa busca, o cadastro troca o nome do cupom por outro e a empresa se duplica.

1. Use o nome e o CNPJ do comprovante.
2. Guarde a bandeira à parte.
3. Corrija o cadastro existente, sem criar outro.

### Preço sem origem

Se você gravar um preço lido de passagem como se fosse da foto, a análise confia num número que ninguém conferiu.

1. Marque nas observações se houve foto, bomba ou só leitura de passagem.
2. Não arredonde nem complete o preço que não foi lido.

### Cartão inteiro gravado

Se você guardar o número do cartão do cupom, o dado sensível vai para o banco.

1. Guarde só os quatro últimos dígitos e a bandeira.
2. Ligue o cartão à despesa.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### abastecemos no Posto X, bandeira BR, 27 litros por R$ 176,31, e o cupom segue

A bomba estava coberta, então o preço por litro saiu de R$ 176,31 dividido por 27,167, R$ 6,49, e a pessoa confirmou. A linha ficou com data e hora do cupom, posto, combustível, litros, valor e sentido no sentido da viagem. A despesa foi lançada por `lancar-despesa-da-empresa` e ligada à linha, à viagem e ao veículo.

### vimos um posto com gasolina a R$ 6,39 e passamos direto

A linha entrou sem abastecimento e sem foto, com a hora e o trecho da avenida como local aproximado, e a ordem entre os postos nas observações.

### tem um posto a R$ 6,49 do outro lado da pista

Não criei a linha: o posto está na contramão e não dá para virar. Avisei que ele fica fora da análise.

## Casos-limite

- Posto visto sem preço legível: não crie a linha de preço. Anote nas observações do próximo posto só se a pessoa pedir.
- Mais de um combustível na mesma placa: uma linha por combustível.
- Abastecimento sem cupom: registre o preço e a despesa com o que a pessoa disser, marque o comprovante como pendente e não invente valor.
- Banco de preços fora do workspace conectado: pare e peça.

## Pegadinhas

- O nome da razão social, o do cupom e a bandeira da placa são três coisas. O cupom manda no cadastro.
- A bomba pode estar parcialmente coberta: o preço por litro sai do cupom, com a confirmação da pessoa.
- Dois postos da mesma bandeira em lados opostos da pista são dois postos, e só o do sentido da viagem entra.
- O horário do cupom é o do pagamento, não o da leitura da placa de outro posto.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
