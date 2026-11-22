# Funcionalidade: Identificar o arquivo local da pessoa

Com o armazenamento em arquivos locais, cada pessoa tem um arquivo só, nomeado pelo identificador que o projeto escolhe. O e-mail é o padrão, e um identificador secundário aponta para o mesmo arquivo.

## Regra: O identificador do arquivo vem de um parâmetro

### Exemplo: Sem parâmetro

- Dado que `Tipo de armazenamento das pessoas` é `arquivos locais`
- E que `Identificador do arquivo da pessoa` está vazio
- Quando a pessoa é cadastrada
- Então o arquivo é nomeado pelo e-mail exato dela

### Exemplo: Identificador definido pelo projeto

- Dado que `Identificador do arquivo da pessoa` é `telefone`
- Quando a pessoa é cadastrada
- Então o arquivo é nomeado pelo telefone dela, no formato internacional

## Regra: A mesma pessoa não tem dois arquivos

### Exemplo: A pessoa chega pelo telefone e depois pelo e-mail

- Dado que `Identificadores secundários da pessoa` inclui o telefone
- E que a pessoa já tem arquivo, achado pelo telefone
- Quando o e-mail dela aparece
- Então o e-mail entra no mesmo arquivo e no índice
- E nenhum arquivo novo é criado

### Exemplo: A pessoa sem o identificador principal

- Dado que a pessoa só tem um identificador secundário
- Quando a pessoa é cadastrada
- Então o arquivo nasce com esse identificador
- E o principal entra no mesmo arquivo quando aparecer, sem criar outro
