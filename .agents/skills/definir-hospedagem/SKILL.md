---
name: definir-hospedagem
description: Define a hospedagem de uma viagem, da cotação que decide a data até o que ela pede depois da reserva, como nome e documento dos hóspedes, veículo e chegada, e a resposta a quem hospeda, com o sim se leva dado pessoal. Usada quando o anfitrião ou o hotel escreve, ou a pessoa pede para agradecer ou avisar. Não serve para ler a reserva, registrar a viagem nem redigir no tom da marca.
metadata:
  author: jimmyandrade
  version: "0.26.0"
  aliases:
    - responder-pedido-da-hospedagem
  related:
    - acompanhar-veiculo
    - conversar-no-whatsapp
    - definir-pessoa
    - acompanhar-retornos-pendentes
    - definir-viagem
    - evoluir-habilidade
    - lancar-despesa-da-empresa
    - procurar-email
    - redigir-com-tom-de-voz
---

# Definir hospedagem

## Parâmetros de configuração

```yaml
# `Nome civil na resposta` é `não`, que manda só o nome completo do cadastro, ou `sim`, que acrescenta o nome civil de registro entre parênteses.
"Nome civil na resposta": "não"
"Modo de aprendizado": "perguntar"
# `Política de viagem` é o link da página da política de viagem do negócio. Vazio, a habilidade não a lê.
"Política de viagem": ""
```

## Instruções

### Passo 1

```mermaid
flowchart LR
  Q{O pedido é?} -->|responder o que a hospedagem pediu| E[Esta habilidade]
  Q -->|cotar antes de decidir a data da viagem| E
  Q -->|agradecer ou avisar quem hospeda| E
  Q -->|achar nome, endereço ou código da reserva| V[definir-viagem]
  Q -->|escrever o texto no tom da marca| R[redigir-com-tom-de-voz]
  Q -->|cadastrar o hóspede| P[definir-pessoa]
```

Esta habilidade cuida da hospedagem, da cotação que antecede a data da viagem até o pedido de dados do anfitrião ou do hotel depois da reserva. Achar a reserva e ligar a hospedagem à viagem segue `definir-viagem`.

A hospedagem pede os dados logo depois da reserva, e a reserva feita à mão não deixa rastro no Notion.

Procure o pedido antes de perguntar à pessoa: na conversa da plataforma de hospedagem, no e-mail da reserva e no WhatsApp ou no e-mail do hotel.
Leia o que a hospedagem pediu e a data da mensagem.

Para ler a conversa, siga a ordem de `definir-viagem`: CLI, API, MCP, skill e, por último, o navegador na aba em que a pessoa já entrou.
Não entre na plataforma por ela.

Hotel responde por e-mail ou WhatsApp, com `procurar-email` ou `conversar-no-whatsapp`.
Anfitrião de plataforma responde na própria conversa da reserva.

### Passo 2

Junte só o que a hospedagem pediu, nesta ordem de busca: a viagem e a hospedagem no Notion, o cadastro de cada pessoa e, para o veículo, o cadastro que `acompanhar-veiculo` usa.

Quem viaja vem das pessoas da viagem ou dos hóspedes da hospedagem, e o veículo vem dos veículos da viagem, nas propriedades que o mapeamento de dados do projeto indica.
O banco de veículos tem a placa como título e a pessoa proprietária.

Sem a lista de quem viaja, pergunte, e não suponha uma pessoa pelo histórico de outra viagem.

O nome de cada hóspede é o nome completo do cadastro, que em quem tem nome social é o nome social: a pessoa se cadastra na hospedagem com ele e é tratada por ele.
Com `Nome civil na resposta` em `não`, o nome civil de registro não vai na resposta nem na tela de confirmação, e nenhuma mensagem trata a pessoa por ele.
Com `sim`, o nome civil entra entre parênteses só onde o documento o exige, e o tratamento segue o nome social.

Documento, placa e telefone são dados sensíveis: leia do cadastro, mostre na tela de confirmação e nunca copie para outro lugar além da resposta.
Dado que falta no cadastro, pergunte uma vez, com o nome da pessoa, e grave a resposta por `definir-pessoa`.

O banco da viagem ou da hospedagem sem propriedade para as pessoas ou para os veículos é limitação do banco.
Diga isso na resposta e recomende a propriedade, uma relação com o banco de pessoas e outra com o de veículos.
Não crie nem altere propriedade sem a autorização da pessoa.

Veículo só entra quando a pessoa vai de carro.
Sem o transporte definido, pergunte antes de pedir a placa.

### Passo 3

O rascunho mostrado à pessoa segue este formato:

```
Hospedagem: <nome ou endereço, com o código da reserva>
Canal: <plataforma, e-mail ou WhatsApp em que a resposta vai>
O que a hospedagem pediu: <o pedido em uma linha, com a data da mensagem>

Hóspedes
| Hóspede | Nome completo | Documento | Origem do dado |
| 1 | <nome> | <documento, ou "falta"> | <página do cadastro, ou "informado agora"> |

Veículo: <marca, modelo, cor e placa, ou "não vai de carro">
Chegada: <dia e horário previstos, ou "falta">
Dados que não entram: <o que a hospedagem não pediu>

<texto exato da resposta, num bloco de código>

Falta antes de enviar: <o que a pessoa ainda precisa informar, ou "nada">
Posso enviar? <pergunta que pede o sim>
```
O texto da resposta passa por `redigir-com-tom-de-voz` antes de ser mostrado. A resposta traz só o pedido: quem chega, o veículo se foi pedido e o horário previsto. Não acrescente dado que a hospedagem não pediu.
Quando a pessoa dita o texto, como um agradecimento ou um aviso de chegada, e ele não leva dado pessoal nem promessa além do que ela disse, o pedido já é o sim: envie pelo canal da reserva, sem a tela de confirmação, e diga o que enviou. Devolver só o rascunho nesse caso deixa o envio para a pessoa.
Quando a resposta leva dado pessoal, mostre o rascunho completo, com o que falta, e espere o sim. Enviar dado pessoal a outra empresa é ação que só a pessoa autoriza, e o sim dado a um dado não vale para o seguinte.

### Passo 4

Com o sim, envie pelo canal em que o pedido chegou e confira na conversa que a mensagem saiu. Na plataforma de hospedagem, a conversa mostra a mensagem como enviada e lida.
Registre na hospedagem do Notion que os dados foram enviados e quando, sem repetir o documento nem a placa. Se a hospedagem prometeu algo em troca, como liberar a portaria ou a vaga, registre o combinado e o prazo na viagem.

### Passo 5

Toda reserva com canal de mensagens do anfitrião entra no acompanhamento no mesmo turno, sem perguntar, por `acompanhar-retornos-pendentes`.
Não crie uma rotina para a reserva: etiquete a conversa do e-mail como aguardando retorno e acrescente uma linha ao registro das pendências.

A hospedagem costuma mandar o que falta, como a senha de acesso, perto do check-in.
Não espere ela escrever primeiro.

Hospedagem com vaga ou garagem de parceiro: pergunte ao anfitrião, pelo canal da reserva, os dias e os horários em que a garagem funciona em toda a estadia, do check-in ao check-out, se é preciso interfonar ou avisar antes de entrar e se há outra opção quando ela fecha cedo.
A pergunta não cita só o dia do problema: o anfitrião entenderia que a pessoa só chega nesse dia. Também não conta o motivo da volta tarde, como o evento.
Compare a resposta com a hora mais tarde em que a pessoa volta, como o fim de uma desmontagem, e registre-a na hospedagem.

A rotina do canal avisa a pessoa a cada mensagem nova e entrega o resumo à sessão que espera.
A senha de acesso nunca vai no aviso, no Notion nem em outro lugar: o aviso só diz que ela chegou e onde ver.

Quando a hospedagem faz uma pergunta e a pessoa ainda não mandou responder, deixe um rascunho de resposta, sem enviar.
O envio segue o Passo 3.

A cada resposta, registre na hospedagem em quantos minutos ela veio.
Esse tempo ensina quando conferir.

### Passo 6

O dado da hospedagem vai nas propriedades da página, nunca no corpo dela.
Uma hospedagem nova nasce do modelo de hospedagem do banco, cujo aviso no topo repete essa regra.
Registre o check-in e o check-out com data e hora, os hóspedes, o anfitrião quando se sabe quem é, e o endereço.
Uma viagem pode ter várias hospedagens, cada uma com o seu registro. Viagem longa com poucas noites cadastradas é lacuna: pergunte onde a pessoa ficou nas outras.

Antes de decidir a data de uma viagem, cote a hospedagem das datas candidatas: cada opção é uma hospedagem em cotação, ligada à viagem, e a data sai da comparação.

As datas candidatas vêm das preferências de viagem: leia os dias para não viajar e os preferenciais da localidade, e os melhores dias de cada pessoa que viaja, nas propriedades que o mapeamento de dados do projeto indica. Data que cai num dia a evitar não é candidata. Sem essas propriedades no mapeamento, diga a limitação e pergunte à pessoa os dias. Com `Política de viagem` preenchida, leia também a política e siga as regras gerais dela, como a antecedência e o dia da volta.

Antes de buscar, leia no cadastro de cada pessoa que viaja as necessidades e as preferências, como cama de casal, ar-condicionado e sensibilidade a barulho, e pergunte uma vez só o que o cadastro não diz: se vão de carro próprio, e se a cama precisa ser de casal ou podem ser duas camas. De carro, a hospedagem precisa de estacionamento e o veículo entra na viagem.

O teto por noite é o que a pessoa disser. Sem ele, não pergunte: use o maior valor por noite das hospedagens anteriores da mesma localidade, lido nas propriedades de preço e de noites que o mapeamento de dados do projeto indica, e diga que o teto veio do histórico. Sem histórico da localidade ou sem essas propriedades no mapeamento, diga a limitação e pergunte o teto.
Busque pelo endereço exato do compromisso, não pelo bairro: digite o endereço completo na busca da plataforma, centre o mapa nele e anote a distância de cada candidata até o local. A busca pelo nome do bairro ou por um retângulo do bairro no mapa não é a busca pelo endereço. Filtre a busca pelo que o cadastro e a pessoa pedem, como estacionamento, ar-condicionado e a cama preferida. Candidata sem a cama preferida não entra na tabela: a pessoa a recusa sem precisar dizer. Cama queen ou king vale como cama de casal.

Classifique cada candidata lendo primeiro as avaliações mais baixas, para ver o risco. Na plataforma que ordena as avaliações, ordene pelas mais baixas e leia as piores, em vez de ler as mais relevantes.

Leia cada avaliação baixa inteira, abrindo o "Mostrar mais" e conferindo que o texto não foi cortado, porque a queixa costuma vir no fim, depois dos elogios. Uma avaliação de 4★ ou 3★ pode trazer o problema, como o acesso difícil por falta de biometria para hóspede, e vale tanto quanto uma de 1★. Nunca declare "sem queixa" por um trecho cortado. Leia também a resposta do anfitrião a cada avaliação baixa: culpar o hóspede, ser passivo-agressivo, ignorar a queixa ou colar um texto de IA é sinal de risco.

Guarde no Notion toda candidata lida na sessão, também a descartada, sem esperar pedido, com as avaliações baixas, a postura do anfitrião e o motivo, para a próxima busca não reler o Airbnb. De toda hospedagem usada, guarde o link do anúncio na própria hospedagem, para a pessoa poder voltar a ela.

Cadastre também o anfitrião de toda candidata lida, por `definir-pessoa`, ligado à hospedagem, com as observações do que as avaliações mostram e o ID do perfil da plataforma como chave: ao achar outro anúncio de um anfitrião conhecido, diga que é o mesmo e o que já se sabe dele.

Confira na página de comodidades de cada candidata, uma a uma, se o que é necessidade existe e não aparece como indisponível: o filtro da busca não garante, e a candidata que passou no filtro pode listar "Indisponível: Ar-condicionado". Avaliação que cita colchão manchado, sem lençol ou com plástico conta como incidente de colchão e descarta a candidata.

Com poucas avaliações a ordenação não abre: leia todas, diga que a evidência é pouca e não trate a nota máxima como segurança. Anfitrião com pouca história se verifica pelos outros anúncios e avaliações dele, para saber se o perfil é real. Descarte a que cair numa regra da política ou numa sensibilidade de quem viaja, lida no cadastro de cada pessoa, como o histórico de mofo ou o barulho extremo para quem não tolera barulho.

Toda vez que citar uma hospedagem, na tabela ou no texto, cite-a como link, e todo link leva as datas da viagem e o número de hóspedes já preenchidos, como `?check_in=AAAA-MM-DD&check_out=AAAA-MM-DD&adults=N` no Airbnb, para a pessoa abrir o preço e a disponibilidade do período. Sem o formato da plataforma, mostre o link simples e diga que as datas não vêm preenchidas.

O preço de uma candidata é o total do período que a página do anúncio mostra para as datas e os hóspedes, lido nela e não no cartão da busca. Com desconto, diga o total e o preço original riscado, como "R$ 1.130, de R$ 1.288", e diga se a plataforma mostra taxas separadas. Nunca cite só um dos dois valores.

Na falta de candidata boa, ou antes de buscar na plataforma, procure entre as hospedagens anteriores da mesma localidade a avaliada como voltaria, porque a pessoa já conhece e se sente confortável nela. Mostre a distância em km dela até o compromisso e compare, lado a lado, o preço da diária, a distância e a avaliação, para a pessoa equilibrar os três.

O preço de uma hospedagem anterior vem da despesa dela, ligada à viagem, e não de um campo da hospedagem: some as despesas de hospedagem da viagem e divida pelas noites. Sem a despesa, leia o valor, as noites e as taxas no extrato ou no recibo da plataforma e registre-a por `lancar-despesa-da-empresa`, com o recibo, para o histórico servir à próxima comparação.

Antes de sugerir onde ficar, leia a avaliação e o motivo de todas as hospedagens anteriores, de qualquer lugar, porque um incidente de uma cidade vale para as outras. A avaliada como evitar não é sugerida, e a avaliada como talvez vem com o motivo.
A avaliação tem o motivo, o dia e quem avaliou, cada um na sua propriedade. Grave quando a pessoa a disser, com o nome de quem decidiu. A casa de um parente segue a mesma regra.
Incidente que a pessoa conta, como mofo, colchão com plástico ou tratamento na portaria, é motivo da avaliação da hospedagem em que aconteceu: pergunte qual foi se não souber, e não o deixe só numa política, porque as avaliações são a fonte que guia a busca seguinte.
Avaliação que a pessoa ainda não fez fica como pendência: não a preencha por ela.

Antes de gravar a avaliação ou uma despesa, e antes de criar uma página, procure a hospedagem já cadastrada nas hospedagens da viagem pelas datas e pelo código, porque o cadastro pode ter só o anfitrião no título. Identifique a hospedagem pela reserva, com o nome do anúncio, o código e as datas, que a página da reserva da plataforma mostra, e não pelo bairro que a pessoa citou: dois endereços do mesmo bairro podem ser estadias diferentes. A linha do extrato só traz o valor, as datas e a cidade, então abra a reserva antes de perguntar à pessoa.
Estadia deixada antes do fim ou trocada por outra registra o check-out do dia em que a pessoa saiu, não o da reserva, e o motivo da troca vai no motivo da avaliação, com o que deu errado e o que foi resolvido.

### Passo 7

Para completar viagens passadas, leia o histórico de reservas na conta da plataforma de quem reservou, numa aba em que a pessoa já esteja logada. A conta pode não ser a da sessão: peça à pessoa que entre na conta certa e não troque de usuário por ela.
Leia só datas, horários e o primeiro nome do anfitrião, nunca valor, documento nem endereço, e compare com o Notion antes de gravar.
A reserva vale mais que a cotação: a data e o status vêm dela, e a cotação fica como histórico.
Hospedagem paga por terceiro, como a de uma missão ou de um evento, não aparece na plataforma: pergunte quem foi e quem pagou, em vez de concluir que falta.
A tabela do que achou cita, em cada linha, a viagem e o ponto de contato, ou diz que não há. Viagem sem ponto de contato, como uma formatura, também é viagem, e se cadastra por `definir-viagem`.
Com só o primeiro nome do anfitrião, não cadastre a pessoa: o nome vai no título da hospedagem e a relação fica vazia.
Grave só depois que a pessoa aprovar a tabela.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Mensagem do anfitrião sem ninguém lendo

Se você deixar para a pessoa abrir a conversa da plataforma, a mensagem com a senha ou com uma exigência chega e fica sem leitura até o dia da chegada.

1. Etiquete a conversa e acrescente a linha ao registro, sem criar rotina.
2. A rotina do canal avisa a pessoa e a sessão a cada mensagem nova, sem escrever a senha.
3. Registre o tempo de resposta da hospedagem.

### Dado inventado

Se você preencher o nome de quem viaja com a pessoa da última viagem ou completar um documento que falta, a hospedagem libera o acesso para a pessoa errada.

1. Leia quem viaja na viagem do Notion.
2. Dado que falta fica marcado como falta.
3. Pergunte à pessoa só o que faltar, uma vez.

### Documento fora da tela de confirmação

Se você enviar o documento ou a placa sem mostrá-los antes, a pessoa não decide o que sai da empresa.

1. Mostre o rascunho completo com cada dado sensível.
2. Espere o sim.
3. Envie só depois dele.

### Dado a mais

Se você mandar telefone, endereço ou documento que a hospedagem não pediu, a resposta expõe a pessoa sem necessidade.

1. Releia o pedido.
2. Mande só o que ele lista.
3. Dado fora do pedido fica no cadastro.

### Resposta fora do canal

Se você responder o anfitrião de plataforma por e-mail, ou o hotel pela plataforma, a hospedagem não vê a resposta e o acesso não sai.

1. Responda no canal em que o pedido chegou.
2. Sem acesso a esse canal, entregue o texto pronto e diga onde colar.

### Rascunho no lugar do envio

Se você devolver só o rascunho de um agradecimento ou de um aviso que a pessoa ditou, ela tem de copiar e colar o texto, e o anfitrião fica sem resposta.

1. Texto ditado, sem dado pessoal nem promessa além do dito: envie pelo canal da reserva e confira que saiu.
2. Dado pessoal na resposta: mostre o rascunho e espere o sim.
3. Diga o que enviou e onde.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o anfitrião pediu, na conversa da reserva, o nome do segundo hóspede, o CPF de ambos e os dados do carro

Li o pedido na conversa da plataforma, pelo navegador, na aba em que a pessoa já estava.

A viagem não traz o segundo hóspede e o transporte não está definido: perguntei quem é e se vão de carro.

Com as respostas, montei o rascunho no modelo, mostrei o CPF de cada um e a placa, e esperei o sim.
Com o sim, enviei na conversa, conferi que saiu e registrei o envio na hospedagem, sem repetir os documentos.

### o hotel pediu por e-mail a lista de hóspedes e o horário de chegada

Respondi pelo e-mail em que o pedido chegou. Mandei nomes e horário. Não mandei documento, porque o hotel não pediu.

## Casos-limite

- A hospedagem pede um dado que o cadastro não tem e a pessoa não sabe: avise a pessoa, não envie a resposta pela metade e registre a pendência na viagem.
- A pessoa não vai de carro: a resposta diz isso só se a hospedagem perguntou pelo veículo.
- O pedido chegou por um canal que a sessão não alcança: entregue o texto pronto e diga onde colar.
- A pessoa já respondeu à mão: leia a conversa, não repita os dados e só registre o envio.
- O pedido é só uma pergunta de confirmação, sem dado pessoal: responda sem o modelo.
- A pessoa dita um agradecimento ou um aviso, como a hora em que chegou: envie sem a tela de confirmação, pelo canal da reserva.

## Pegadinhas

- A reserva da plataforma parece mostrar a estadia vivida. Quem trocou de lugar no meio mostra o período reservado, e o vivido é o que a pessoa conta.
- A conta da plataforma que está logada parece ter todas as reservas. Cada pessoa tem a sua, e as viagens de outra só aparecem na conta dela.
- A hospedagem de um parente parece não precisar de avaliação. A decisão de não voltar vale também para ela, e o motivo é o que a pessoa disse.
- A reserva feita à mão não cria página no Notion, e o banco de viagens e o de hospedagens podem nem ter onde registrar quem viaja e o veículo. Quem viaja e o transporte podem não estar em lugar nenhum.
- A vaga que a hospedagem oferece parece valer a qualquer hora. A garagem de um parceiro tem horário, e quem volta à noite precisa saber até quando ela abre e se deve interfonar.
- O pedido de documento costuma vir antes do check-in e some da lista de mensagens com a tradução automática. Leia a mensagem original, não a prévia da lista.
- O cadastro tem o nome completo e o nome civil de registro. Quem tem nome social se cadastra e é tratada por ele, e tratá-la pelo nome civil a constrange. O nome civil só sai com `Nome civil na resposta` em `sim`, ou se a pessoa pedir.
- Dado sensível não vira texto de memória, de nota nem de comentário na negociação. Ele fica no cadastro e na resposta enviada.
- A hospedagem que pede os dados também libera o acesso com base neles: um erro no documento trava a entrada.
- A busca por bairro parece bastar. O endereço exato do compromisso é o centro da busca, e a nota alta de uma candidata não mostra o risco que as avaliações baixas mostram.
- A data da viagem parece vir antes da hospedagem. A cotação vem antes e decide a data.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
