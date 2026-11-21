# Funcionalidade: Respeitar a janela de contato antes de convidar

## Regra: O convite sai por qualquer canal só dentro da janela da pessoa

### Exemplo: Convite por WhatsApp e Google Agenda fora da janela

- Dado que o registro da convidada tem a terça-feira nos dias sem contato
- E que hoje, no fuso dela, é terça-feira
- Quando a pessoa pede para convidá-la por todos os canais
- Então nenhum convite sai, nem a mensagem nem o convite do Google Agenda
- E a resposta diz o motivo e o próximo horário permitido

### Exemplo: Convite a um grupo

- Dado que o texto convida uma pessoa nomeada que tem janela
- Quando o horário está fora da janela dela
- Então o convite ao grupo espera pelo próximo horário permitido
