---
name: emitir-ccmei
description: Emite ou baixa o CCMEI (Certificado da Condição de Microempreendedor Individual) em PDF pelo portal gov.br. Usada quando precisar do certificado para inscrições em editais, credenciamentos ou pastas de certidões, mesmo sem dizer CCMEI. NÃO serve para emitir outros certificados ou certidões do gov.br nem para abrir MEI.
metadata:
  author: jimmyandrade
  version: "0.1.0"
---

# Emitir CCMEI
    10|
## Parâmetros de configuração

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

    20|Verifique que o navegador já está logado no gov.br do titular do MEI.
Se pedir login, pare e siga a skill de autenticação no gov.br quando ela existir.
O CNPJ vem da fonte de verdade (Notion ou cofre), nunca de memória.

### Passo 2

Abra direto `https://mei.receita.economia.gov.br/certificado/login` (atalho para o serviço).
Caminho alternativo: acesse `https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/emissao-de-comprovante-ccmei` e clique no botão azul "Emissão de Comprovante (CCMEI)" na lateral direita.
    30|Não clique na imagem "App MEI", que leva a outra página.

### Passo 3

Feche pop-ups (dica do gov.br, Google Tradutor) e aceite cookies se aparecerem.
Clique em "Entrar com gov.br".

### Passo 4

Na tela "Autorização para compartilhamento de Dados Pessoais", clique em "Autorizar".
    40|

### Passo 5

Em `.../certificado/consulta`, mantenha "Tipo de Consulta" = CNPJ.
Digite o CNPJ (só números; a máscara formata automaticamente).
Clique em "Continuar".

### Passo 6

Confira no certificado: nome, CNPJ, situação cadastral ativa e CNAEs.
    50|

### Passo 7

Role até o fim e clique em "Fazer Download do Certificado em PDF".
O arquivo sai como `CCMEI_<CNPJ>.pdf` na pasta de downloads.
Feche o pop-up de avaliação do serviço (avaliar.servicos.gov.br), se abrir.

### Passo 8

Guarde o PDF onde a tarefa pede (pasta de certidões / página no Notion).
    60|Registre a data de emissão.
Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Pop-up que bloqueia a navegação

Se você não conseguir avançar porque há um pop-up sobrepondo a tela, o navegador carregou elementos extras.

1. Feche cada pop-up (dica do gov.br, Google Tradutor, cookies).
    70|2. Aceite cookies se a opção aparecer.
3. Só então clique em "Entrar com gov.br".

### Sessão expirada

Se você vir a tela de login do gov.br em vez da autorização, a sessão expirou.

1. Pare e avise que a autenticação precisa ser refeita.
2. Não tente preencher credenciais sem a confirmação da pessoa.
    80|
### Certificado com CNPJ errado

Se você emitir o certificado com um CNPJ diferente do esperado, o CNPJ não veio da fonte de verdade.

1. Confira o CNPJ na fonte de verdade (Notion ou cofre).
2. Não use CNPJ de memória nem de conversa anterior.
3. Emita novamente com o CNPJ correto.

## Exemplos de entrada e saída
    90|
Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Preciso do CCMEI para o edital da prefeitura

O certificado é emitido e guardado na pasta indicada, com a data de emissão registrada.

### Baixa o certificado do MEI

O CCMEI é baixado em PDF e guardado onde a tarefa pede.
   100|
## Casos-limite

- O navegador não está logado no gov.br: pare e avise que a autenticação precisa ser feita primeiro.
- O CNPJ não está na fonte de verdade: peça o CNPJ antes de emitir.
- A situação cadastral não está ativa: emita o certificado mesmo assim e registre a situação na resposta.
- O certificado é pedido para arquivo geral: guarde na pasta de certidões com a data de emissão.
- O certificado é pedido para uma tarefa específica: guarde onde a tarefa pede e registre o contexto.
- O pop-up de avaliação não abre: prossiga sem fechar.
- A pessoa pede "certidão do MEI": o CCMEI é o certificado, não uma certidão negativa. Emita o CCMEI.
   110|- A pessoa pede o certificado sem dizer onde guardar: pergunte o destino antes de guardar.

## Pegadinhas

- O CNPJ de memória parece correto. A fonte de verdade pode ter mudado. Sempre consulte.
- A sessão ativa parece permanente. Ela expira. Se pedir login, pare e avise.
- "Certidão do MEI" parece outro documento. O CCMEI é o que se usa para comprovar a condição de MEI.
- O botão "App MEI" parece o caminho certo. Ele leva a outra página. Use o botão "Emissão de Comprovante (CCMEI)".
- O CCMEI parece ter validade fixa. Ele reflete a situação no dia. Para editais, emita uma versão recente.
- Pop-ups parecem parte do fluxo. São elementos extras. Feche antes de prosseguir.
   120|
## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
