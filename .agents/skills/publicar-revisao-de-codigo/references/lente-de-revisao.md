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
- Um valor, uma responsabilidade ou uma preparação de teste está em mais de um lugar? A organização segue `escrever-codigo` e `escrever-teste`?

## Estrutura

- Um subcomponente privado separado ou dentro do pai? O que é melhor para re-renderização e qual é a boa prática?
- Layout com flex e gap em vez de espaçamento manual, sem perder semântica?

## Condição e comportamento

- Por que essa condição existe, como um modo especial de venda? O que ela é, e isso está na descrição do PR?
- Qual estado visual ainda não foi mostrado: hover, foco, com e sem link, tema claro e escuro? Cada um pede evidência visual.
- Quem revisa rodou a tela e testou, inclusive no celular, ou só leu o diff?
- A mensagem de erro diz o que de fato falhou? Um campo errado mostra o erro desse campo, e não o de outro?

## CSS antes de JavaScript

- Esse JavaScript decide algo que o CSS resolve sozinho, como detectar celular ou computador, medir a janela ou alternar uma classe?
- Uma media query, uma container query, `:has`, uma unidade de viewport dinâmica ou outra propriedade nativa faz o mesmo?
- A propriedade nova do CSS já é validada nos navegadores que o projeto suporta? Se for, ela troca a lógica em JavaScript?

## Rolagem, camadas e posição fixa

- A mudança mexe em rolagem, em camada de fundo, em bloqueio da rolagem da página ou em posição fixa?
- Qual evidência mostra isso no iPhone e no Android? Um vídeo curto da interação conta mais que um print.
- Os outros pontos da tela que bloqueiam a rolagem continuam liberando quando fecham?
- Há outra mudança em andamento mexendo no mesmo comportamento?

## Complexidade e problema que volta

- Isso é muito código para o que se resolveria de forma simples, num ponto só?
- Esse mesmo problema já apareceu em outro lugar? Então vale registrar o débito técnico e revisitar a causa, em vez de acrescentar mais uma correção.

## Teste ou código de outra área

- A mudança mexe em teste de ponta a ponta ou em código que é de outro time?
- O time dono foi marcado no PR e quem responde por aquela área aprovou, e não só quem abriu o PR?

## Tom

- Cada ponto é uma pergunta aberta, que admite estar errada, e nunca um veredito.
- Cada dúvida respondida deixa a decisão na descrição do PR, com como e por quê, e um teste quando o comportamento for testável.
- A redação de cada pergunta, como o prefixo de um self-review, é escolha de voz da pessoa e mora no vocabulário, não aqui.
