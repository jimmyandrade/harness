# language: pt

Funcionalidade: Registrar a conversa com uma empresa ou pessoa
  A habilidade grava cada troca de mensagens ou reunião na discussão da página certa
  e consulta as fontes do projeto antes de perguntar um fato que a conversa já respondeu.

  Regra: Conversa com negócio fica na negociação

    Exemplo: Cotação com uma empresa
      Dado que a conversa trata de uma cotação com a empresa fictícia "Alfa Serviços"
      E que a negociação dela com a oportunidade ainda não existe
      Quando a pessoa pede para registrar a conversa
      Então a habilidade busca a negociação pela empresa e pela oportunidade antes de criar
      E cria a negociação ligada à empresa abordada, à pessoa abordada e à oportunidade
      E grava a troca como comentário na discussão da página da negociação

    Exemplo: Segunda pessoa da mesma empresa
      Dado que a negociação já tem uma pessoa abordada
      E que uma segunda pessoa da mesma empresa respondeu
      Quando a habilidade registra a resposta
      Então ela confere no schema se a pessoa abordada aceita mais de uma antes de somar
      E pergunta quando não aceita

  Regra: Conversa sem negócio fica na página da pessoa

    Exemplo: Agradecimento e convite para um café
      Dado que a conversa é o agradecimento de uma pessoa fictícia "Bia Souza" e um convite para um café
      E que não há cotação, proposta, parceria nem venda
      Quando a pessoa pede para registrar a conversa
      Então a habilidade grava na discussão da página da pessoa e na da empresa quando há uma
      E não cria negociação

  Regra: O comentário segue um formato

    Exemplo: Mensagem com data
      Dado que a mensagem chegou por WhatsApp em uma data conhecida
      Quando a habilidade grava o comentário
      Então ele começa com "Data da mensagem:" e a data
      E diz o canal e quem falou
      E resume datas, horários, valores, decisões e pendências

    Exemplo: Ação do negócio sem mensagem
      Dado que o registro é uma ação do negócio, sem mensagem
      Quando a habilidade grava o comentário
      Então ele começa com "Data do registro:"

    Exemplo: Conversa sem data
      Dado que a conversa não tem data
      Quando a habilidade grava o comentário
      Então ele começa com "Data aproximada:" e diz de onde a data veio

    Exemplo: Mensagem já registrada
      Dado que a discussão já tem um comentário com a mesma mensagem
      Quando a habilidade vai gravar
      Então ela lê os comentários antes e não repete a mensagem

    Exemplo: Correção de um fato gravado
      Dado que a pessoa corrige um fato já gravado
      Quando a habilidade registra a correção
      Então ela grava um novo comentário datado e não apaga o anterior

  Regra: O registro acontece na mesma rodada do envio

    Exemplo: Mensagem enviada a uma empresa
      Dado que a habilidade acabou de enviar uma mensagem à empresa fictícia "Alfa Serviços"
      Quando a rodada termina
      Então a troca já está registrada, sem perguntar se deve registrar
      E a resposta diz o que foi registrado, com o link da página, e o que não foi, com o motivo

    Exemplo: Comprovante de pagamento já lançado como despesa
      Dado que o comprovante enviado já foi registrado como despesa
      Quando a habilidade registra a troca
      Então o comentário traz o link da despesa

  Regra: As fontes são consultadas antes de perguntar

    Exemplo: Horário que o cronograma já responde
      Dado que a pessoa pergunta a que horas chega à montagem de um ponto de contato
      E que o cronograma tem o horário
      Quando a habilidade responde
      Então ela consultou os comentários, o cronograma, as inscrições, as páginas e o e-mail
      E responde com o horário e a fonte, sem perguntar

    Exemplo: Fato que nenhuma fonte responde
      Dado que nenhuma fonte responde ao fato
      Quando a habilidade pergunta à pessoa
      Então ela pergunta só o que faltou
      E diz quais fontes consultou

  Regra: A divergência entre fontes aparece com datas

    Exemplo: Dois horários diferentes
      Dado que a mensagem de WhatsApp de uma data diz um horário
      E que o manual de outra data diz outro
      Quando a habilidade responde
      Então ela mostra os dois, com a fonte e a data de cada um
      E não escolhe nenhum, mesmo que um seja o mais recente

  Regra: A fonte precisa estar no workspace conectado

    Exemplo: Lista ausente
      Dado que a lista de negociações não está no workspace conectado
      Quando a pessoa pede o registro
      Então a habilidade para e pede a lista

    Exemplo: Nome da lista fora do mapeamento
      Dado que o mapeamento do projeto não traz o nome da lista de negociações
      E que as instruções do projeto não definem esse parâmetro
      Quando a pessoa pede o registro
      Então a habilidade para e pede o nome, sem adivinhar nem usar um nome padrão
