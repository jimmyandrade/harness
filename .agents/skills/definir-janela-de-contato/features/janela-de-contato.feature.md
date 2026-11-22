# Funcionalidade: Gravar a janela de contato da pessoa

A janela de contato diz em que dias e em que horas a pessoa não deve ser contatada. Ela fica em propriedades próprias da lista de pessoas, nomeadas por parâmetros.

## Regra: A janela vai na propriedade, nunca nas observações

### Exemplo: A propriedade existe na lista

- Dado que `Dias sem contato` nomeia uma propriedade da lista de pessoas
- E que quem usa a habilidade diz que a pessoa não é contatada na segunda-feira nem na terça-feira
- Quando a pessoa é cadastrada ou atualizada
- Então os dias vão na propriedade dos dias sem contato
- E as observações não recebem a janela
- E só o campo informado muda, sem regravar os outros

### Exemplo: A propriedade não existe na lista

- Dado que o parâmetro está preenchido, mas a lista de pessoas não tem a propriedade
- Quando quem usa a habilidade informa a janela
- Então a habilidade avisa que a propriedade falta e propõe criá-la
- E não cria a propriedade sem o sim
- E não grava a janela nas observações

### Exemplo: O parâmetro está vazio

- Dado que `Dias sem contato` está vazio
- Quando quem usa a habilidade informa uma janela
- Então a habilidade avisa que o projeto não definiu onde guardá-la
- E diz a janela na resposta, sem gravá-la nas observações

## Regra: O horário é gravado como o texto HH:MM, de 24 horas

### Esquema do Cenário: Horário informado

- Dado que quem usa a habilidade diz "<fala>"
- Quando a janela é gravada
- Então a propriedade do horário recebe "<valor>"

  #### Exemplos

  | fala                   | valor |
  | ---------------------- | ----- |
  | não depois das 19h     | 19:00 |
  | só a partir das 8h30   | 08:30 |
