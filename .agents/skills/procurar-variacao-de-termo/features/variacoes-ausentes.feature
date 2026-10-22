# language: pt

Funcionalidade: Dizer quais variações de um termo estão no vocabulário
  Cada forma de gênero, número e grafia tem a própria linha e o próprio estado.

  Regra: A forma ausente espera o estado

    Exemplo: Plural que faltou
      Dado que casa está no vocabulário e casas não está
      Quando a pessoa pergunta se faltou casas
      Então a resposta diz que casas não existe e é o plural de casa
      E sugere o cadastro sem gravar
