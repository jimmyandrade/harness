# Funcionalidade: Manter aberto o PR que alguém questiona

Quando quem revisa questiona se a mudança deve existir, a decisão é da pessoa, e o PR fica aberto, em rascunho e marcado até ela decidir.

## Regra: A pergunta sobre a existência do PR não fecha o PR

### Exemplo: A revisora pergunta se a skill faz sentido

- Dado que uma revisão pede mudanças com "não sei se faz sentido essa skill"
- E que `Rótulo de PR a rever` é `question`
- Quando a habilidade atende a revisão
- Então ela leva a decisão à pessoa, com as opções
- E o PR fica aberto e em rascunho
- E o PR recebe o rótulo `question`, seguindo `rotular-item`
- E a thread fica aberta

### Exemplo: Sem rótulo no projeto

- Dado que `Rótulo de PR a rever` está vazio
- Quando uma revisão questiona se o PR deve existir
- Então o PR fica aberto e em rascunho, sem rótulo
- E a resposta diz que o PR ficou sem rótulo
