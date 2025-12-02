📘 ClamaBoo – Backend

API REST para gerenciamento de empresas e usuários, incluindo cadastro, autenticação JWT, redefinição de senha, upload de imagens e dashboard.

🚀 1. Pré-requisitos

Antes de iniciar, você precisa ter instalado:

Node.js 18+

MySQL 8+

MySQL Workbench

NPM

🗄️ 2. Configuração do Banco de Dados

O arquivo abaixo cria automaticamente:

✔ O banco clamaboo
✔ O usuário clamaboo_user
✔ E concede todas as permissões necessárias

Como executar
Opção A – Pelo MySQL Workbench

Abra o Workbench

Vá em File → Open SQL Script

Selecione: backend/clamaboo.sql

Clique no botão ⚡ (executar)

Opção B – Pelo Terminal

No terminal, dentro da pasta backend:

mysql -u root -p < clamaboo.sql

Conteúdo do arquivo clamaboo.sql:
CREATE DATABASE IF NOT EXISTS clamaboo;
USE clamaboo;

CREATE USER IF NOT EXISTS 'clamaboo_user'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON clamaboo.* TO 'clamaboo_user'@'localhost';
FLUSH PRIVILEGES;

🛠️ 3. Configurando o Backend
Dentro da pasta backend:
cd backend
npm install

▶️ 4. Executando o Servidor

Para iniciar:

node server.js


Se tudo estiver certo, você verá algo como:

✔ Database connected  
✔ Server running on port 5000


O Sequelize irá criar automaticamente as tabelas no banco clamaboo.

🔑 5. Fluxo de Autenticação

A API suporta dois tipos de autenticação:

Tipo	Descrição
company	Empresas (CNPJ, certificado, categorias etc.)
user	Usuários comuns

O token JWT contém:

id

type → "company" ou "user"

Exemplo de header:

Authorization: Bearer SEU_TOKEN

📮 6. Rotas Principais
Empresa
Método	            Rota	                    Descrição
POST	/api/company/register	            Registra empresa
POST	/api/company/login	                Login
POST	/api/company/forgot-password	    Solicita código de recuperação
POST	/api/company/reset-password	        Redefine senha
GET	    /api/company/me	                    Dados da empresa logada
PUT	    /api/company/me	                    Atualiza perfil da empresa
POST	/api/company/upload-logo	        Upload de imagem
GET	    /api/company/:id	                Buscar empresa por ID
GET	    /api/company/search?category=...	Busca por categoria
