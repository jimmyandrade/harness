---
name: atualizar-cadastro-do-mei
description: Altera dados cadastrais de um MEI (endereço, complemento, telefone, e-mail, ocupação, uso do nome social) no Portal do Empreendedor e emite o CCMEI atualizado. Usada quando o titular de um MEI precisa atualizar informações de contato, endereço comercial ou residencial, ocupação principal ou secundárias, ou ativar o uso do nome social no nome empresarial. Requer login gov.br do titular. NÃO serve para abertura de MEI, alteração de atividade principal sem atualização de outros dados, nem mudança de natureza jurídica.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - emitir-ccmei
---

# Atualizar cadastro do MEI

## Parâmetros de configuração

```yaml
# Banco do Notion onde ficam os registros de Organizações.
"Banco de organizações no Notion": ""
# `Modo de aprendizado` define quando seguir `evoluir-habilidade`. `perguntar` pede feedback ao fim. `automático` evolui sempre. Vazio pula.
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Confirme com o titular quais dados devem ser alterados.
Liste os campos disponíveis para atualização: uso do nome social no nome empresarial, telefone para contato, telefone celular, e-mail, ocupação principal, ocupações secundárias, complemento do endereço comercial e complemento do endereço residencial.
Nunca prossiga sem a confirmação explícita do titular dos dados que serão alterados.

### Passo 2

Abra o Portal do Empreendedor em `https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/atualizacao-cadastral`.
Clique em Solicitar, ou acesse diretamente `https://mei.receita.economia.gov.br/alteracao/solicitar`.
O titular deve fazer login com a conta gov.br dele.

### Passo 3

Na tela de Consentimento, marque "Estou ciente e desejo prosseguir com o formulário" e clique em Continuar.

### Passo 4

No formulário de atualização cadastral, altere apenas os campos que o titular confirmou no Passo 1.
Para a caixa "Desejo usar o nome social no nome empresarial", marque ou desmarque conforme solicitado.
Para Telefone para Contato, Telefone Celular e E-mail, insira os novos valores nos campos correspondentes.
Para Ocupação Principal e ocupações secundárias, selecione as opções corretas nas listas disponíveis.
Para Complemento do Endereço Comercial, clique no campo para abrir a janela com as linhas de Tipo Complemento e texto, preencha e clique em OK.
Para Complemento do Endereço Residencial, quando o endereço residencial deve ser igual ao comercial, repita o mesmo procedimento.
Não altere campos que não foram confirmados pelo titular no Passo 1.

### Passo 5

Marque todas as Declarações obrigatórias e o Termo de Ciência e Responsabilidade.
Clique em Continuar.

### Passo 6

Na Tela para conferência de dados, revise todos os campos alterados.
Se houver erro, clique em Corrigir para voltar ao formulário.
Se estiver correto, clique em Confirmar.
Confirme novamente o aviso de limite diário de alterações.

### Passo 7

Após a confirmação, siga `emitir-ccmei` para emitir o Certificado da Condição de Microempreendedor Individual atualizado.

### Passo 8

Atualize os dados oficiais da empresa no banco de organizações do Notion indicado em `Banco de organizações no Notion`.
Localize a página do MEI correspondente.
Atualize os campos que foram alterados no Portal do Empreendedor com os novos valores confirmados.
O Notion é a fonte oficial dos números da organização após a atualização.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Alteração sem confirmação do titular

Se você alterar dados cadastrais do MEI sem o ok explícito do titular, a alteração pode estar incorreta ou não autorizada.

1. Pare a execução imediatamente.
2. Liste os campos disponíveis para atualização.
3. Peça ao titular a confirmação explícita de quais dados devem ser alterados e quais são os novos valores.
4. Só então prossiga com o Passo 2.

### Campos não solicitados alterados

Se você alterar campos que não foram confirmados pelo titular no Passo 1, a atualização cadastral incluirá mudanças não autorizadas.

1. Volte à tela de conferência de dados.
2. Clique em Corrigir.
3. Restaure os valores originais dos campos que não devem ser alterados.
4. Mantenha alterados apenas os campos confirmados pelo titular no Passo 1.
5. Prossiga com o Passo 5.

### Banco de organizações não informado

Se você não tiver o banco de organizações no Notion em `Banco de organizações no Notion`, não poderá atualizar os dados oficiais no Passo 8.

1. Peça ao titular o banco de organizações no Notion onde os dados do MEI devem ser atualizados.
2. Confirme que o banco está no workspace conectado.
3. Se não estiver, pare e informe que o banco não está acessível na conexão atual.
4. Se estiver, atualize os dados conforme o Passo 8.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Atualização de telefone e e-mail de contato

Titular: "Preciso atualizar o telefone celular para (11) 98765-4321 e o e-mail para contato@exemplo.com.br"

Skill confirma: "Você quer alterar: Telefone Celular para (11) 98765-4321 e E-mail para contato@exemplo.com.br. Confirma?"

Titular: "Sim, confirmo."

Skill executa Passos 2 a 9, alterando apenas telefone celular e e-mail.

### Atualização de complemento de endereço comercial e residencial

Titular: "O complemento do endereço comercial deve ser 'Sala 302' e o residencial deve ser igual ao comercial."

Skill confirma: "Você quer alterar: Complemento do Endereço Comercial para 'Sala 302' e Complemento do Endereço Residencial para 'Sala 302'. Confirma?"

Titular: "Confirmo."

Skill executa Passos 2 a 9, preenchendo os complementos conforme solicitado.

## Casos-limite

- O titular quer alterar apenas um campo: confirme apenas esse campo e altere somente ele no formulário.
- O complemento do endereço comercial tem tipo e texto: preencha ambos na janela e clique em OK.
- O endereço residencial deve ser igual ao comercial: repita o mesmo complemento em ambos os campos.
- A ocupação principal muda: selecione a nova ocupação na lista, mas não altere ocupações secundárias se não foram mencionadas.
- O banco de organizações no Notion não está informado: pergunte ao titular qual banco usar antes do Passo 8.
- A conexão do Notion não tem acesso ao banco informado: pare e informe que o banco não está acessível na conexão atual.
- O titular diz "não" ao confirmar os dados na Tela para conferência: clique em Corrigir, retorne ao formulário e corrija os erros apontados.
- O limite diário de alterações foi atingido: informe ao titular que não é possível fazer mais alterações hoje e que ele deve tentar novamente amanhã.

## Pegadinhas

- O Portal do Empreendedor requer login gov.br do próprio titular. Não é possível fazer login com outra conta ou sem autenticação.
- O formulário de atualização cadastral mostra todos os campos, mas você deve alterar apenas os que foram confirmados pelo titular no Passo 1. Alterar campos não solicitados pode levar a dados incorretos.
- O complemento do endereço comercial abre uma janela com tipo e texto. Não é um campo de texto simples. Preencha ambos e clique em OK.
- O aviso de limite diário de alterações aparece após clicar em Confirmar na tela de conferência. Confirme novamente para concluir.
- O CCMEI atualizado só fica disponível após a confirmação da alteração cadastral. Siga `emitir-ccmei` no Passo 7, não antes.
- O banco de organizações no Notion é a fonte oficial dos números após a atualização. Não use outro banco nem deixe os dados desatualizados.
- Nunca confirme uma alteração sem o ok explícito do titular. Listar os campos e pedir confirmação é obrigatório no Passo 1.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
