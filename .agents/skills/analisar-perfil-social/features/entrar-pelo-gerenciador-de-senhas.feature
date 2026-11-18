# language: pt
Funcionalidade: Entrar na conta pelo gerenciador de senhas
  Como pessoa que guarda as senhas num gerenciador
  Quero que a habilidade ofereça o login pelo gerenciador quando o perfil abre atrás de um aviso de login
  De forma que a análise seja completa sem que a senha passe pela conversa

  Cenário: A sessão tem a ferramenta de credencial do gerenciador de senhas
    Dado que o perfil abre com um aviso de login
    E que a sessão tem a ferramenta de credencial do gerenciador de senhas
    Quando a habilidade pede o login à pessoa
    Então a habilidade oferece o login pelo gerenciador e espera o sim da pessoa
    E a pessoa aprova o item no próprio gerenciador
    E a habilidade nunca vê a senha nem o código de verificação

  Cenário: A sessão não tem a ferramenta de credencial
    Dado que o perfil abre com um aviso de login
    E que a sessão não tem a ferramenta de credencial do gerenciador de senhas
    Quando a habilidade pede o login à pessoa
    Então a habilidade pede que a pessoa entre pelo navegador
    E nunca pede nem digita a senha da pessoa
