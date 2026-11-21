# Armazenamento das pessoas em arquivos locais

Com `Tipo de armazenamento das pessoas` em `arquivos locais`, `Endereço das pessoas` é a pasta, com um arquivo por pessoa, nomeado pelo e-mail exato dela, no `Nome do arquivo da pessoa`, e um arquivo de índice com uma linha por pessoa: nome completo, como é chamada, e-mail, papel, time e o arquivo.
Os campos são o nome completo, como a pessoa é chamada, as variações de grafia, as transcrições erradas do nome, o papel, o time, o e-mail, o ID no Slack, o login no GitHub, o ID da conta no Jira, os pronomes e a fonte deles, e os canais e grupos em que ela aparece.
Os pronomes só se gravam quando a própria pessoa os declarou ou quem usa a habilidade os informou, e a fonte diz qual dos dois foi: sem isso, o campo fica vazio e os textos citam a pessoa sem pronome.
O login e o ID do Jira servem para citar a pessoa com menção real fora do Slack, como `mencionar-pessoa` manda.
O arquivo local tem ainda o campo `extensions`, que guarda dados de outras habilidades sobre a pessoa, uma entrada por habilidade ou assunto, como o idioma em que ela prefere receber uma revisão.
Esta habilidade não define nem valida o conteúdo de `extensions`: ao atualizar o registro, deixa o campo e tudo o que há nele como estão.
