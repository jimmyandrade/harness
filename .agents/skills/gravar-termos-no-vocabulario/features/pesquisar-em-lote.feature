# language: pt

Funcionalidade: Pesquisar vários termos de uma vez
  A skill descobre quais termos do plano já estão no vocabulário sem uma consulta por termo.

  Regra: O teste do lote responde pelo plano inteiro

    Exemplo: Plano com termos novos e termos que já estão
      Dado que o plano tem 13 termos e 2 deles já estão no vocabulário
      Quando a skill roda o teste do lote em insert
      Então a resposta lista os 2 termos em unchanged
      E lista os 11 em inserted
      E a skill não faz uma consulta por termo

    Exemplo: Ler a linha de um termo que já está
      Dado que a resposta do teste listou "que tal?" em unchanged
      Quando a skill precisa ver o estado e as notas dele
      Então consulta só esse termo
