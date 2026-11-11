# language: pt

Funcionalidade: A mesma aba do WhatsApp Web no Chrome
  Toda habilidade que usa o WhatsApp Web passa por aqui e reaproveita a mesma aba.

  Regra: O WhatsApp Web abre no Chrome da pessoa

    Exemplo: O navegador embutido recusa
      Dado que o navegador embutido do app mostra o aviso de navegador incompatível
      Quando a habilidade precisa abrir o WhatsApp Web
      Então ela usa o Chrome, pela extensão Claude in Chrome
      E não pergunta antes de trocar de navegador

  Regra: Uma aba só, reaproveitada em tudo

    Exemplo: A aba já está aberta
      Dado que a dona já abriu a aba do WhatsApp Web
      Quando outra habilidade precisa ler ou enviar
      Então ela usa a mesma aba, sem abrir outra nem recarregar
      E confere no cabeçalho o nome da conversa

    Exemplo: A tarefa termina
      Dado que a tarefa no WhatsApp Web acabou
      Quando a habilidade fecha as abas da tarefa
      Então a aba do WhatsApp Web continua aberta

    Exemplo: Aviso de outra janela
      Dado que o WhatsApp mostra o aviso de que está aberto em outra janela
      Quando a habilidade usa a aba
      Então ela clica uma vez no botão do aviso e lê na mesma sequência
      E, ao terminar, diz que a outra janela ficou desconectada

  Regra: Sem conexão, para e lembra

    Exemplo: Aparece o QR code
      Dado que o WhatsApp Web mostra o QR code
      Quando a habilidade tenta ler
      Então ela para e pede para a pessoa conectar o celular
      E cria, com `definir-rotina`, uma rotina que lembra de reconectar

  Regra: Toda habilidade delega a esta

    Exemplo: Outra habilidade precisa do WhatsApp Web
      Dado que uma habilidade precisa abrir, ler, enviar ou anexar no WhatsApp Web
      Quando ela chega a esse passo
      Então ela segue `usar-whatsapp-web` e não descreve a aba nem o aviso por conta própria
