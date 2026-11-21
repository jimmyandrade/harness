# Funcionalidade: Respeitar a janela de contato na abordagem

## Regra: Pessoa já cadastrada com janela não recebe a primeira mensagem fora dela

### Exemplo: Pessoa cadastrada em dia sem contato

- Dado que a pessoa a abordar já está cadastrada e tem o dia de hoje nos dias sem contato
- Quando a mensagem aprovada está pronta para enviar
- Então ela não é enviada
- E a resposta diz o motivo e o próximo horário permitido

### Exemplo: Pessoa sem cadastro

- Dado que a pessoa a abordar não está cadastrada
- Quando a mensagem aprovada está pronta para enviar
- Então não há janela a respeitar e a mensagem segue o fluxo de sempre
