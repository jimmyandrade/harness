# language: pt

Funcionalidade: Previsão do tempo de viagem
  A pessoa pergunta a que horas sair ou a que horas chega, e a previsão sai do histórico do mesmo trecho, sem escolher a saída por ela.

  Exemplo: Saída para uma chegada desejada
    Dado que a pessoa informa a chegada desejada e o trecho tem viagens concluídas no mesmo sentido
    Quando a pessoa pergunta a que horas sair
    Então a resposta mostra a base, a base com folga e o pior caso, cada um com a hora de saída
    E a resposta diz quantos trechos sustentam a previsão e usa a folga como pior caso com menos de três
    E a escolha da saída fica com a pessoa

  Exemplo: Chegada para uma saída dada
    Dado que a pessoa informa a hora de saída e o trecho tem viagens concluídas no mesmo sentido
    Quando a pessoa pergunta a que horas chega
    Então a resposta mostra a chegada da base, da base com folga e do pior caso, com a margem para a janela do compromisso

  Exemplo: Tempo do computador de bordo
    Dado que o histórico traz só a leitura do computador de bordo
    Quando a skill calcula a duração
    Então a duração soma as paradas com o motor desligado e diz qual fonte sustentou a base

  Exemplo: Registro ao fim do trecho
    Dado que o trecho terminou
    Quando a pessoa informa a saída, as paradas e a chegada
    Então o cronograma ganha uma linha por saída, por parada e por chegada, sem hora inventada

  Exemplo: Pergunta sobre a posição com a viagem em andamento
    Dado que há uma viagem ativa com o veículo e as leituras registradas
    Quando a pessoa pergunta em que pedágio está
    Então a skill lê a viagem ativa e a localização do celular antes de responder
    E a resposta diz o que veio da localização e o que veio da viagem
    E a resposta diz o que a localização não mostra, como o sentido e se a praça já foi passada

  Exemplo: Previsão do aplicativo de navegação
    Dado que a pessoa informa km restantes, tempo restante e hora de chegada do aplicativo
    Quando a skill registra a informação
    Então a viagem ganha uma linha própria com km restantes, tempo restante, previsão de chegada e a fonte
    E as leituras anteriores continuam como estavam

  Exemplo: Previsões diferentes
    Dado que a previsão do aplicativo difere da previsão da skill
    Quando a skill responde
    Então a resposta mostra as duas e a diferença
    E a skill usa a do aplicativo para o trecho que falta
