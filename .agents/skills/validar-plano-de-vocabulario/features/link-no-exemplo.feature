# language: pt
Funcionalidade: Link no termo e nos exemplos
  O termo e os exemplos mostram o uso da palavra e nunca levam link real.

  Regra: O link vira marcador e o endereço fica na origem

    Exemplo: Exemplo copiado com o link de uma tarefa
      Dado que o plano traz o exemplo "Veja a tarefa em https://example.com/tarefa"
      Quando o plano é validado antes de gravar
      Então o exemplo fica "Veja a tarefa em [link da tarefa]"
      E o endereço da página de origem fica em source
