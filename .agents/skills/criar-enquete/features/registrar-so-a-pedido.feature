# language: pt
Funcionalidade: Registrar só a pedido
  Ideia, escrita e registro são camadas separadas.

  Regra: Sem pedido de registro, só sugere

    Exemplo: Sugestão sem registro
      Dado que a pessoa pediu só a sugestão
      Quando a skill entrega a enquete
      Então ela não cria página em banco nenhum

  Regra: Enquete já publicada preserva o texto

    Exemplo: Registrar enquete publicada
      Dado que a pessoa pede para registrar uma enquete já publicada
      Quando a skill registra o post e as opções
      Então o texto publicado fica como saiu
      E a melhoria vira aprendizado para a próxima enquete

  Regra: Enquete aprovada com potencial de reuso

    Exemplo: Cadastrar como modelo
      Dado que a enquete foi aprovada e pode ser reutilizada
      Quando a pessoa pede o cadastro
      Então a skill recomenda cadastrar o modelo com título, objetivo, formato, modelo de copy e referência
