# language: pt
Funcionalidade: Ler os sinais que a plataforma mostra em cada post
  Como pessoa que decide com base na análise
  Quero que a habilidade registre o rótulo da plataforma e os contadores de cada post
  De forma que a leitura use evidência que o perfil já mostra

  Cenário: Post marcado como conteúdo de IA
    Dado que um post do perfil tem o rótulo de conteúdo de IA da plataforma
    Quando a habilidade lê o post
    Então o rótulo entra na análise como sinal, com o post e a data
    E a habilidade não o trata como acusação

  Cenário: Contadores de curtidas, comentários e compartilhamentos
    Dado que cada post mostra três contadores sem rótulo no texto da página
    Quando a habilidade lê o engajamento
    Então ela confere o que cada número é antes de usá-lo
    E compara os números com o tamanho do perfil
