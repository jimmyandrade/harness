---
name: definir-formato-do-preco
description: Use essa habilidade sempre que for decidir o formato de um preço de venda, redondo ou quebrado, a terminação e o arredondamento do preço à vista ou parcelado, mesmo sem dizer formato. NÃO use para registrar o preço, o histórico, a justificativa nem lançar a venda.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - registrar-preco-de-produto-fisico
    - evoluir-habilidade
---

# Definir formato do preço

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
# Terminação que fecha o preço quebrado, como `,90` em R$ 449,90. Só vale quando o Passo 1 aceita o preço quebrado.
"Terminação do preço quebrado": ",90"
# Terminação do preço à vista que a pessoa comunica como desconto, como `9` em R$ 299 ou `,90` em R$ 299,90. Vazio: o preço à vista segue a decisão do Passo 1, como qualquer outro.
"Terminação do preço à vista": ""
# Valores em que o preço trava a compra, como 300 ou 500. Vazio: a habilidade não trata barreira.
"Barreiras psicológicas de preço": []
# Níveis da curva de preço do projeto. Vazios: pergunte à pessoa em que nível a peça está.
"Nível de entrada da curva de preço": ""
"Níveis acima da entrada": []
```

## Instruções

### Passo 1

Ao sugerir, conferir, validar ou registrar um preço de venda, decida se ele é redondo, como R$ 450, ou quebrado, como R$ 449,90, antes de dar o número. A decisão parte da função que o preço precisa cumprir: sustentar valor percebido, autoria e desejo, ou favorecer conversão, entrada e comparação.

O padrão é o preço redondo. Ele serve quando a peça precisa comunicar coleção, presença, acabamento, confiança, marca, valor autoral ou desejo.

O preço quebrado só entra com uma justificativa clara, ligada a conversão, produto de entrada, campanha, saldo, condição especial ou barreira psicológica relevante. Quando for quebrado, termine em `Terminação do preço quebrado`.

Não termine todos os preços em `Terminação do preço quebrado` por hábito: cada peça passa pela decisão. Sem dado para saber a função da peça, pergunte antes de escolher o formato.

O formato vale para cada preço que a pessoa vai ver ou usar, como o cheio a prazo, o do débito e o do Pix. O preço que sai de uma taxa ou de um prazo, como o cheio que embute a taxa do parcelamento, não sai com os centavos da conta: arredonde para o preço redondo mais próximo acima, de modo que o valor líquido não fique abaixo do preço-base, e mostre essa conferência.

O preço à vista que a pessoa comunica como desconto, como o do Pix e o do débito, cumpre a função de conversão. Com `Terminação do preço à vista` preenchida, ele termina assim, e o à vista derivado de outro, como o débito, é arredondado para cima até essa terminação. O preço cheio da etiqueta segue a decisão acima. Diga na resposta que o à vista é um preço de conversão.

Mudar um preço que a pessoa já definiu para ajustar o formato, como de 299 para 300, é uma proposta. Mostre o preço dela ao lado e pergunte antes de tratá-lo como final.

Peça central da coleção, de campanha, limitada, sob medida, conceitual, premium ou com narrativa forte pede preço redondo e seguro, que sustenta melhor o valor percebido. Evite o quebrado quando ele fizer a peça parecer promocional, massificada, varejista ou menos autoral. Se ainda assim recomendar o quebrado, explique objetivamente por que a conversão pesa mais que o valor percebido naquela peça. Preço quebrado sem essa explicação enfraquece a postura da marca e parece esconder o valor real da peça.

Porta de entrada da marca, acessório, item de menor risco para a primeira compra, produto de maior volume ou peça mais comercial pode ter preço quebrado, como R$ 89,90 ou R$ 299,90, quando isso reduz a barreira de compra. Diga que, nesses casos, o quebrado é ferramenta de conversão e não a linguagem principal de valor da marca. Confira se ele não entra em conflito com a posição da peça na curva de preço, na pirâmide de mix e no posicionamento da marca. Peça em `Níveis acima da entrada` reavalie se o redondo protege melhor a percepção de valor.

Peça em promoção, saldo de coleção, última peça, bazar, outlet, campanha com prazo, cupom, peça-piloto, drop anterior ou outra condição especial pode ter preço quebrado para comunicar oportunidade. Preserve, quando existir, a âncora de preço cheio, de preferência redonda, como "De R$ 450 por R$ 399,90". Não deixe o quebrado de campanha parecer o preço normal da peça. Registre se o preço é cheio, promocional, de saldo, de campanha ou de condição especial.

Preço calculado perto de um valor de `Barreiras psicológicas de preço`, como R$ 299,90 contra R$ 300, pede cuidado. Um preço exatamente na barreira conta como perto dela.

Veja se a peça está numa faixa comercial em que reduzir a barreira ajuda a conversão, e evite essa lógica quando a peça precisa sustentar desejo, imagem, exclusividade, autoria ou percepção premium. Compare o ganho provável de conversão com o risco de reduzir o valor percebido, e diga por que o preço escolhido protege melhor a estratégia da peça e da coleção.

O preço à vista de `Terminação do preço à vista` pode ficar logo abaixo da barreira, como R$ 299, porque é preço de conversão.

O preço também comunica posicionamento. Diga se o número escolhido comunica decisão, confiança e valor autoral, ou conversão, oportunidade e menor barreira de compra. Não recomende o quebrado só porque parece mais barato, sem ver se combina com a marca. Na dúvida, pergunte à pessoa: "esse preço precisa vender por impulso ou sustentar desejo?".

### Passo 2

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Preço quebrado por hábito

Se você terminar todos os preços em `Terminação do preço quebrado`, a peça que precisava sustentar desejo passa a parecer promocional.

1. Pergunte qual função o preço cumpre.
2. Use o redondo quando a função for valor percebido, autoria ou desejo.
3. Use o quebrado só com a justificativa de conversão, entrada, campanha, saldo, condição especial ou barreira psicológica, e diga qual é.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### sugere o preço de uma peça autoral que custou 210

Sugeri R$ 450 em vez de R$ 449,90. A peça precisa sustentar valor autoral e desejo, e disse isso na resposta. Não usei o preço quebrado, porque nenhuma função de conversão o justificava.

### sugere o preço de um item de entrada que custou 40

Sugeri R$ 89,90. O item é a porta de entrada da marca, e o quebrado ajuda a reduzir a barreira da primeira compra. Disse essa função na resposta.

### define os preços de uma peça de etiqueta R$ 320 com Pix a 299

Deixei a etiqueta redonda em R$ 320 e o Pix em R$ 299, porque `Terminação do preço à vista` pede o final 9. Disse que o Pix é um preço de conversão, que parece abaixo do que é, e que o cheio da etiqueta sustenta o valor da peça.

### sugere o preço de uma peça conceitual que custou 300

Sugeri R$ 690 e não R$ 679,90. A peça é conceitual e precisa sustentar autoria, e o quebrado a faria parecer varejista. Expliquei os critérios que mais pesaram: custo, posição na coleção e valor percebido.

### dá um preço de saldo para a peça de 450

Sugeri R$ 399,90 com a âncora "De R$ 450 por R$ 399,90". Registrei que é preço de saldo, para o quebrado não parecer o preço normal da peça.

## Casos-limite

- O preço fica a poucos reais de uma barreira, como R$ 300: confira se a peça precisa sustentar desejo antes de usar o quebrado.
- O preço é de saldo, campanha ou condição especial: registre isso e preserve a âncora do preço cheio.
- A função da peça não está clara, como entrada, campanha ou valor autoral: pergunte antes de escolher o formato do preço.

## Pegadinhas

- O Pix parece pedir o preço redondo como a etiqueta. Com `Terminação do preço à vista` preenchida, ele termina nela, e só a etiqueta segue o redondo.
- O preço cheio que embute a taxa do parcelamento parece valer com os centavos da conta. Arredonde e confira o líquido.
- O preço quebrado parece mais barato e por isso melhor. Em peça autoral ele a faz parecer promocional.
- O preço terminado em `,90` parece o padrão do varejo. Aqui o padrão é o redondo, e o quebrado precisa de uma função dita.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
