# language: pt

Funcionalidade: Evitar duplicata de ativo
  A busca de parecidos acontece antes de criar ou atualizar.

  Exemplo: Bem parecido já cadastrado
    Dado que existe um bem durável que já tem cadastro parecido
    Quando a pessoa pede para cadastrar arara, máquina, equipamento, mobiliário ou ferramenta
    Então a busca ocorre antes de criar
    Mas não nasce uma segunda página do mesmo bem

  Exemplo: Atualização de bem já cadastrado
    Dado que existe um bem durável que já tem cadastro
    Quando a pessoa pede para atualizar esse bem
    Então a busca no Notion ocorre antes de atualizar
    Mas não nasce uma segunda página

  Regra: A criação espera a busca pelos sinais

    Contexto:
      Dado que existe um item prestes a nascer na lista de ativos imobilizados

    Exemplo: Sinais presentes antes de criar
      Quando há nome, categoria, tipo, marca, modelo, SKU, medidas, fornecedor, data de compra, preço, foto, link do produto ou lançamento financeiro
      Então a busca usa esses sinais
      Mas não cria a página antes da busca

    Exemplo: Ativo compatível
      Quando a busca encontra um ativo compatível
      Então a análise mostra o que bate e o que diverge
      E pede confirmação antes de mesclar, atualizar, vincular ou criar

    Exemplo: Título ligeiramente diferente
      Quando o título ou a descrição vem ligeiramente diferente no comprovante, na nota, no link ou na conversa
      Então a análise não cria outra página
      Mas trata o ativo compatível como o mesmo bem
