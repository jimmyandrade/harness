# language: pt

Funcionalidade: Token da sincronização
  O token passa da área de transferência para o segredo sem que o agente veja o valor.

  Regra: O agente nunca vê o token

    Exemplo: A pessoa oferece o token na conversa
      Dado que a pessoa vai colar o token na conversa
      Quando a skill guia o passo do token
      Então ela pede para não colar e guarda o token direto da área de transferência

  Regra: O token é testado antes de ser guardado

    Esquema do Cenário: Teste do token na área de transferência
      Dado que a pessoa copiou o token pelo botão de copiar
      Quando a busca na API do Notion responde <código>
      Então a skill <ação>

      Exemplos:
        | código | ação                                                          |
        | 200    | guarda o segredo com a área de transferência e depois a limpa |
        | 401    | pede para copiar de novo, sem gerar outro token               |

  Regra: A conferência do segredo diz a hora no fuso da pessoa

    Exemplo: Lista de segredos em UTC
      Dado que a lista de segredos mostra a hora em UTC
      Quando a skill confirma que o segredo foi guardado
      Então ela diz a hora convertida para o fuso da pessoa
