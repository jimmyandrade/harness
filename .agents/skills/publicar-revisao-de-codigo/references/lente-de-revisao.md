# Lente de revisão

Perguntas que a revisão faz ao código, no próprio PR ou no de outra pessoa. Elas valem para o self-review e para a revisão de terceiros. Cada uma vira pergunta aberta, nunca veredito, e a resposta fica na descrição do PR. Exemplos genéricos: o que é específico de um negócio ou de um repositório mora nas skills do projeto, não aqui.

## Nome

- O nome diz o que a coisa faz, em inglês simples, ou existe um mais claro para quem tem inglês básico?
- Uma função que lê ou deriva algo começa com `get`? Um mapper diz que é mapper?
- O nome vai continuar claro daqui a seis meses, sem quem o escreveu por perto?
- Um alias com nome bom para uma dependência dispensa o comentário que a explica?

## Origem do dado

- De onde vem esse dado: API, CMS ou um contrato que já existia? Isso está dito no código e na descrição do PR?
- Se o formato é um contrato antigo mantido por compatibilidade, a descrição diz isso.

## Reuso e valores

- Existe token do design system para esse valor? Existe um util pronto que já faz isso?
- O valor fixo deveria ser o default de uma propriedade, para poder mudar depois?
- O componente é flexível e reaproveitável, ou está preso a uma ocasião?

## Estrutura

- Um subcomponente privado separado ou dentro do pai? O que é melhor para re-renderização e qual é a boa prática?
- Layout com flex e gap em vez de espaçamento manual, sem perder semântica?

## Condição e comportamento

- Por que essa condição existe, como um modo especial de venda? O que ela é, e isso está na descrição do PR?
- Qual estado visual ainda não foi mostrado: hover, foco, com e sem link, tema claro e escuro? Cada um pede evidência visual.

## Tom

- Cada ponto é uma pergunta aberta, que admite estar errada, e nunca um veredito.
- Cada dúvida respondida deixa a decisão na descrição do PR, com como e por quê, e um teste quando o comportamento for testável.
- A redação de cada pergunta, como o prefixo de um self-review, é escolha de voz da pessoa e mora no vocabulário, não aqui.
