# Verificar antes de perguntar

Uma pergunta ao autor custa uma rodada de revisão.
O que a revisão consegue conferir sozinha, ela confere, e o achado sai como fato com a evidência.

## O que se confere

- Comportamento observável de uma resposta, como status, cabeçalhos e cache: rode o caso real no ambiente do PR, se o corpo ou um comentário traz a URL, ou na cópia separada. Um `curl -I` mostra o cabeçalho que de fato sai.
- Se o framework ou a dependência mantém ou sobrescreve o que o código define: rode o caso, ou leia o código da dependência na versão fixada.
- O que um serviço ou outro repositório devolve, inclusive para uma entrada fora do limite: leia o código, o contrato ou o schema dele no repositório, ou no que o contexto cita, com o `gh`.
- Efeito em monitor, métrica ou custo: consulte o dado, não suponha.

## Como

- Leitura e requisição `GET` ou `HEAD` a um ambiente de preview ou local: faça.
- Nada que grave, nada que dispare efeito em produção e nenhuma credencial que a pessoa não autorizou.
- O comentário diz o que foi rodado e o que apareceu: comando, resultado e link.
- Se a conferência confirma o problema, o comentário traz a evidência e segue a `Postura dos comentários`.
- Se ela mostra que está certo, o ponto não vira pergunta.

## Quando perguntar mesmo

- O sistema não está ao alcance: código privado, ambiente sem URL ou sem permissão. O comentário diz o que foi tentado, o que cada tentativa devolveu e pergunta só a parte que faltou.
- A dúvida é de intenção ou de decisão do autor, e não de fato.

## Onde escrever

- Todo ponto que tem linha vai inline na review, inclusive o que antes ficaria só no resumo.
- O resumo para quem chamou traz só o que não tem linha para ancorar.
