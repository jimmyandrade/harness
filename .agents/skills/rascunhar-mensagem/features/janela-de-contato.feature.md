# Funcionalidade: Respeitar a janela de contato antes de enviar

Antes de enviar a mensagem, a habilidade lê a janela de contato no registro da pessoa e só envia dentro dela.

## Regra: Fora da janela, a mensagem não sai

### Exemplo: Dia de descanso

- Dado que o registro da pessoa tem a terça-feira nos dias sem contato
- E que o comando `date`, no fuso da pessoa, diz que hoje é terça-feira
- Quando a pessoa pede para enviar a mensagem
- Então a mensagem não é enviada
- E a resposta diz que terça-feira é dia sem contato dela
- E diz o próximo dia e a hora permitidos, com o dia da semana calculado por comando
- E o rascunho fica para esse horário

### Exemplo: Depois do horário

- Dado que o registro da pessoa tem `19:00` como o horário a partir do qual não há contato
- E que, no fuso da pessoa, são 19h40
- Quando a pessoa pede para enviar a mensagem
- Então a mensagem não é enviada
- E a resposta diz que ela não é contatada a partir das 19h
- E diz o horário permitido do dia seguinte, se esse dia não for de descanso

### Exemplo: O fuso da pessoa difere do de quem escreve

- Dado que a localidade da pessoa está num fuso diferente do de quem usa a habilidade
- Quando a habilidade confere a janela
- Então ela usa o fuso da localidade da pessoa
- E diz o próximo horário permitido nos dois fusos

## Regra: Sem janela, nada muda

### Exemplo: Parâmetros vazios

- Dado que os parâmetros das propriedades da janela estão vazios
- Quando a pessoa pede para enviar a mensagem
- Então a habilidade não consulta janela alguma e segue o fluxo de sempre

### Exemplo: Propriedades vazias no registro

- Dado que os parâmetros nomeiam as propriedades, mas o registro da pessoa as deixa vazias
- Quando a pessoa pede para enviar a mensagem
- Então a mensagem segue sem restrição
