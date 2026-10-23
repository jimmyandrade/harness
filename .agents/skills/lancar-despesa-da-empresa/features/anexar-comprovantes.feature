# language: pt
Funcionalidade: Anexar comprovantes ao lançamento
  Regra: Os originais enviados acompanham o registro sem nova confirmação
    Exemplo: Comprovantes já enviados na conversa
      Dado que a pessoa já enviou os comprovantes originais de uma despesa confirmada
      Quando o agente registra ou complementa o lançamento
      Então os comprovantes ficam anexados na propriedade mapeada nessa execução
      E o agente confere os anexos salvos sem pedir nova confirmação
