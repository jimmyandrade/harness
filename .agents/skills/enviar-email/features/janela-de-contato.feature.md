# Funcionalidade: Respeitar a janela de contato antes de enviar o e-mail

## Regra: O e-mail só sai dentro da janela de quem o recebe

### Exemplo: Destinatária em dia sem contato

- Dado que o registro da destinatária principal tem a segunda-feira nos dias sem contato
- E que hoje, no fuso dela, é segunda-feira
- Quando a pessoa dá o sim ao rascunho
- Então o e-mail não é enviado
- E a resposta diz o motivo e o próximo horário permitido
- E o rascunho fica na caixa para esse horário, e o envio só é agendado se a pessoa decidir

### Exemplo: Cópia fora da janela

- Dado que uma pessoa em cópia tem janela, e a destinatária principal não
- Quando o horário está fora da janela da pessoa em cópia
- Então o e-mail não sai, e a resposta diz de quem é a janela

## Regra: Fora da janela, a pessoa pode agendar o envio

### Exemplo: Opção de agendar

- Dado que o envio cai fora da janela de contato da destinatária
- Quando a habilidade responde
- Então ela oferece deixar o rascunho ou agendar o envio para o próximo horário permitido, calculado por comando
- E não oferece enviar agora

### Exemplo: A pessoa pede para programar

- Dado que a pessoa pede para programar o e-mail
- Quando o horário pedido está dentro da janela
- Então a habilidade oferece o agendamento ao lado de enviar agora e de deixar o rascunho

### Exemplo: Agendamento aprovado

- Dado que o conector de e-mail não agenda envio
- E que a pessoa dá o sim ao texto, ao destino e ao horário
- Quando a habilidade agenda o envio
- Então a tarefa agendada só é criada depois de a ferramenta de envio estar liberada nas permissões
- E a tarefa reconfere a janela na hora de enviar e, se ela mudou, não envia e avisa
