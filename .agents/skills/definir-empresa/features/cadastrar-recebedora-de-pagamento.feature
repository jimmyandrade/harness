# language: pt

Funcionalidade: Cadastrar a empresa recebedora para rastrear um pagamento
  O cadastro mínimo financeiro preserva a identificação comprovada sem inventar contatos.

  Regra: A ausência de contato não impede o cadastro financeiro identificado

    Exemplo: A recebedora só é conhecida pelo comprovante
      Dado que um comprovante informa o nome e o CNPJ da empresa recebedora
      E não há empresa equivalente nem pessoa responsável conhecida
      Quando o cadastro é solicitado para vincular essa recebedora ao pagamento
      Então a empresa é cadastrada com os dados comprovados e a página é devolvida ao fluxo de origem
      E o contato responsável permanece pendente sem declarar concluída a validação comercial