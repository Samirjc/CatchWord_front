# UNIVERSIDADE FEDERAL DE JUIZ DE FORA – UFJF
## DEPARTAMENTO DE CIÊNCIA DA COMPUTAÇÃO (DCC)
### DISCIPLINA: DCC061 – ENGENHARIA DE SOFTWARE
**Professor:** Fabrício Martins Mendonça  
**Projeto Prático:** Plataforma Educacional Catch Word  
**Temas Escolhidos:** Qualidade de Software e Testes de Software  

---

# RELATÓRIO TÉCNICO E PRÁTICO

## Integrantes do Grupo
* [Nome do Aluno 1] - Matrícula: [XXXXXXXXX]
* [Nome do Aluno 2] - Matrícula: [XXXXXXXXX]
* [Nome do Aluno 3] - Matrícula: [XXXXXXXXX]
* [Nome do Aluno 4] - Matrícula: [XXXXXXXXX]
* [Nome do Aluno 5] - Matrícula: [XXXXXXXXX]

---

## SUMÁRIO
1. [Introdução](#1-introdução)
2. [TEMA 1: Qualidade de Software](#2-tema-1-qualidade-de-software)
   - 2.1 Definição do Tema
   - 2.2 Histórico na Engenharia de Software
   - 2.3 Importância em Engenharia de Software
   - 2.4 Tecnologias e Ferramentas Relacionadas
   - 2.5 Padrões e Normas Aplicáveis (ISO/IEC 25010, CMMI)
   - 2.6 Profissões no Mercado de TI
   - 2.7 Certificações Profissionais
   - 2.8 Impactos da Inteligência Artificial
3. [TEMA 2: Testes de Software](#3-tema-2-testes-de-software)
   - 3.1 Definição do Tema
   - 3.2 Histórico na Engenharia de Software
   - 3.3 Importância em Engenharia de Software
   - 3.4 Tecnologias e Ferramentas Relacionadas
   - 3.5 Padrões e Normas Aplicáveis (ISO/IEC/IEEE 29119, ISTQB)
   - 3.6 Profissões no Mercado de TI
   - 3.7 Certificações Profissionais
   - 3.8 Impactos da Inteligência Artificial
4. [Aplicação Prática no Projeto Catch Word](#4-aplicação-prática-no-projeto-catch-word)
   - 4.1 Visão Geral do Sistema Catch Word
   - 4.2 Qualidade de Software na Prática: Refatoração Arquitetural em Camadas
   - 4.3 Testes de Software na Prática: A Pirâmide de Testes Implementada
   - 4.4 Cobertura de Código e Métricas Obtidas
   - 4.5 Pipeline de Integração Contínua (CI/CD)
5. [Roteiro para Apresentação em Sala de Aula (15-20 min)](#5-roteiro-para-apresentação-em-sala-de-aula)
6. [Conclusão e Referências](#6-conclusão-e-referências)

---

## 1. Introdução

O desenvolvimento de software moderno exige metodologias e práticas que garantam não apenas o funcionamento das aplicações, mas também a sua manutenibilidade, confiabilidade, segurança e escalabilidade ao longo do tempo. Este trabalho tem como objetivo aprofundar dois dos pilares mais fundamentais da Engenharia de Software contemporânea: **Qualidade de Software** e **Testes de Software**.

Além da contextualização histórica, normativa e mercadológica, este trabalho demonstra a aplicação prática direta desses conceitos no desenvolvimento e evolução da plataforma educacional **Catch Word**, evidenciando como a refatoração arquitetural, o design modular, o isolamento com mocks, as suítes de testes unitários e de integração, e a automação de CI/CD transformam um sistema acadêmico em uma solução de padrão profissional.

---

## 2. TEMA 1: Qualidade de Software

### 2.1 Definição do Tema
Qualidade de Software pode ser definida como o grau em que um sistema de software satisfaz tanto os seus requisitos funcionais explícitos quanto as expectativas e requisitos não funcionais implícitos de seus usuários e partes interessadas (stakeholders), tais como manutenibilidade, desempenho, confiabilidade, usabilidade, segurança e portabilidade (Pressman & Maxim, 2021). A qualidade subdivide-se em **qualidade de processo** (como o software é construído) e **qualidade de produto** (as propriedades intrínsecas e comportamentais do artefato entregue).

### 2.2 Histórico na Engenharia de Software
* **Década de 1960 (A Crise do Software)**: Com o aumento exponencial da complexidade dos computadores na conferência da OTAN (1968), percebeu-se que softwares eram entregues com atraso, acima do orçamento e repletos de falhas, dando origem formal à disciplina de Engenharia de Software.
* **Décadas de 1970 e 1980**: Adaptação dos princípios de controle estatístico da qualidade industrial (W. Edwards Deming e Joseph Juran) para a computação. Surgem as primeiras métricas de software, como a Complexidade Ciclomática de Thomas McCabe (1976) e as métricas de Halstead (1977).
* **Década de 1990**: Foco em maturidade de processos com o modelo CMM (*Capability Maturity Model*) pelo SEI (*Software Engineering Institute*), além da publicação da norma ISO/IEC 9126.
* **Anos 2000 até hoje**: Movimento Ágil (*Manifesto Ágil*, 2001), *Clean Code* (Robert C. Martin), *DevOps*, observabilidade e garantia contínua de qualidade (Shift-Left Quality).

### 2.3 Importância em Engenharia de Software
Sem qualidade de software, os custos de manutenção (*débito técnico*) tornam-se insustentáveis, consumindo até 80% do tempo dos desenvolvedores em correções de defeitos em vez de inovação. A qualidade afeta diretamente:
* **Confiabilidade e Segurança**: Prevenção de falhas críticas e vulnerabilidades de segurança (ex: vazamento de dados, injeções SQL).
* **Custo Total de Propriedade (TCO)**: Defeitos identificados nas fases iniciais de arquitetura/código custam até 100 vezes menos para corrigir do que após o lançamento em produção (Lei de Boehm).
* **Manutenibilidade e Evolutividade**: Código com alta coesão e baixo acoplamento permite adicionar novos recursos sem quebrar funcionalidades existentes.

### 2.4 Tecnologias e Ferramentas Relacionadas
* **Análise Estática de Código (SAST)**: SonarQube, ESLint, Prettier, Checkstyle.
* **Métricas de Complexidade e Manutenibilidade**: CodeClimate, JaCoCo, Istanbul/Jest Coverage.
* **Integração e Entrega Contínua (CI/CD)**: GitHub Actions, GitLab CI, Jenkins.

### 2.5 Padrões e Normas Aplicáveis
* **ISO/IEC 25010 (SQuaRE - Software Product Quality Requirements and Evaluation)**: Modelo de referência internacional que categoriza a qualidade do produto em 8 características principais: Adequação Funcional, Eficiência de Desempenho, Compatibilidade, Usabilidade, Confiabilidade, Segurança, Manutenibilidade e Portabilidade.
* **CMMI (Capability Maturity Model Integration)** e **MPS.BR (Melhoria de Processo do Software Brasileiro)**: Modelos de avaliação da maturidade dos processos de desenvolvimento em organizações.

### 2.6 Profissões no Mercado de TI
* **Engenheiro de Confiabilidade de Sites (SRE - Site Reliability Engineer)**;
* **Engenheiro de Qualidade de Software (Software Quality Engineer / QA Lead)**;
* **Arquiteto de Software** (foco em atributos de qualidade e design patterns);
* **DevOps Engineer / Release Manager**.

### 2.7 Certificações Profissionais
* **CSQE (Certified Software Quality Engineer)** pela ASQ (*American Society for Quality*);
* **CMMI Associate / CMMI Lead Appraiser**;
* **Certificações IEEE Computer Society (CSDP - Certified Software Development Professional)**.

### 2.8 Impactos da Inteligência Artificial
A Inteligência Artificial revolucionou a Qualidade de Software através de:
* **Revisão Automatizada de Código**: IAs identificam code smells, violações de design e vulnerabilidades antes da aprovação de Pull Requests.
* **Detecção Preditiva de Falhas**: Modelos de Machine Learning prevêem quais módulos do repositório têm maior probabilidade de introduzir bugs com base no histórico de commits e churn rate.
* **Refatoração Inteligente**: Ferramentas auxiliadas por LLMs auxiliam na decomposição de classes e funções monolíticas em componentes altamente coesos.

---

## 3. TEMA 2: Testes de Software

### 3.1 Definição do Tema
Teste de software é a atividade de investigação e execução sistemática de um artefato de software com o objetivo de avaliar seus atributos, verificar se ele atende aos requisitos especificados (Verificação) e validar se atende às necessidades reais do usuário no ambiente operacional (Validação - V&V) (Myers et al., 2011).

### 3.2 Histórico na Engenharia de Software
* **Fase Inicial (Anos 50/60)**: Testes eram vistos como mero processo de depuração (*debugging*) pós-codificação conduzido exclusivamente pelo programador.
* **Anos 70/80**: Glenford Myers publica *"The Art of Software Testing"* (1979), formalizando a distinção entre testar (encontrar defeitos) e depurar (corrigir defeitos).
* **Anos 90**: Criação do TDD (*Test-Driven Development*) por Kent Beck no Extreme Programming (XP), transformando o teste em ferramenta de design e especificação viva.
* **Anos 2000 e Atualidade**: Mike Cohn propõe o conceito da **Pirâmide de Testes**, priorizando testes unitários rápidos e isolados na base, testes de integração/serviços no meio e testes E2E/UI no topo. Automação passa a ser mandatória em pipelines de CI/CD.

### 3.3 Importância em Engenharia de Software
* **Prevenção de Regressão**: Garante que melhorias ou correções não reintroduzam falhas antigas ou quebrem partes já consolidadas.
* **Redução do Ciclo de Feedback**: Desenvolvedores recebem resposta imediata sobre a corretude de suas alterações em questão de segundos.
* **Documentação Viva e Segurança para Refatoração**: Uma suíte de testes confiável permite refatorar e modernizar a arquitetura do sistema com total segurança.

### 3.4 Tecnologias e Ferramentas Relacionadas
* **Frameworks de Testes Unitários e Mocking**: Jest, Mocha/Chai, JUnit, PyTest.
* **Testes de Integração e APIs HTTP**: Supertest, Postman/Newman, REST Assured.
* **Testes de Componentes e Interface (Frontend)**: React Testing Library, Cypress, Playwright, Selenium.
* **Análise de Cobertura de Código**: Istanbul (Jest Coverage), JaCoCo, Coveralls.

### 3.5 Padrões e Normas Aplicáveis
* **ISO/IEC/IEEE 29119**: Padrão internacional abrangente para testes de software (Processos, Documentação, Técnicas e Modelos).
* **ISTQB (International Software Testing Qualifications Board)**: Glossário e corpo de conhecimento (*Syllabus*) de referência mundial em processos e níveis de teste.

### 3.6 Profissões no Mercado de TI
* **Engenheiro de Testes / QA Automation Engineer (SDET - Software Development Engineer in Test)**;
* **Analista de Testes / QA Manual e Exploratório**;
* **Performance / Load Test Engineer**;
* **Security Tester / Pentester**.

### 3.7 Certificações Profissionais
* **ISTQB CTFL (Certified Tester Foundation Level)** e níveis avançados (CTAL-TA, CTAL-TTA, CTAL-TM);
* **Certified Software Test Engineer (CSTE)** da QAI Global Institute;
* **ASTQB Mobile & Automation Specialist**.

### 3.8 Impactos da Inteligência Artificial
* **Geração Automática de Casos de Teste**: Modelos generativos criam testes unitários e de borda (*edge cases*) automaticamente a partir do código ou da assinatura de funções.
* **Self-Healing Tests (Testes Auto-recuperáveis)**: Frameworks E2E modernos usam visão computacional e IA para reconhecer elementos de interface mesmo quando IDs ou classes CSS mudam.
* **Geração de Dados Sintéticos e Fuzzing**: Criação de payloads complexos para descobrir vulnerabilidades e condições de corrida inesperadas.

---

## 4. Aplicação Prática no Projeto Catch Word

### 4.1 Visão Geral do Sistema Catch Word
O **Catch Word** é um sistema educacional completo para criação, gerenciamento e aplicação de caça-palavras em ambiente escolar. O projeto é composto por:
* **Backend (`CatchWord_back`)**: API REST em Node.js (ES Modules) com Express, Prisma ORM e PostgreSQL, estruturado em arquitetura em camadas.
* **Frontend (`CatchWord_front`)**: SPA desenvolvida em React 18 com React Router v6, componentes modulares e controle de acesso baseado em papéis (RBAC).

---

### 4.2 Qualidade de Software na Prática: Refatoração Arquitetural em Camadas

#### O Problema do "Fat Controller" (Código Anterior)
Inicialmente, toda a lógica de negócio, regras matemáticas de colocação de palavras no grid, envio de e-mails, validação de tokens JWT e queries diretas ao banco de dados residiam concentradas nos arquivos de Controllers do Express. Essa abordagem violava princípios fundamentais de qualidade:
* Violação do Princípio da Responsabilidade Única (SRP - SOLID);
* Alto acoplamento com objetos HTTP (`req`, `res`);
* Impossibilidade de testar as regras de negócio isoladamente sem subir o servidor HTTP.

#### A Solução Arquitetural em 3 Camadas + Middlewares (Código Refatorado)
A arquitetura foi refatorada aplicando o princípio de **Separação de Preocupações (Separation of Concerns - SoC)**:

```
[Requisição HTTP]
       │
       ▼
┌──────────────────┐
│   Middlewares    │ ➔ Validação de JWT (autenticar) e Autorização por Role (autorizarRoles)
└─────────┬────────┘
          ▼
┌──────────────────┐
│   Controllers    │ ➔ Adaptador HTTP (extrai body/params, formata status 200, 201, 400, 404, 500)
└─────────┬────────┘
          ▼
┌──────────────────┐
│    Services      │ ➔ Regras de Negócio Puras (validação geométrica do grid, hash de senhas, regras de turmas)
└─────────┬────────┘
          ▼
┌──────────────────┐
│   Repositories   │ ➔ Camada de Persistência (Isolamento do ORM Prisma / Banco de Dados)
└──────────────────┘
```

#### Benefícios Diretos de Qualidade:
1. **Alta Coesão e Baixo Acoplamento**: A camada de serviços (`src/services/`) não importa nem conhece o Express ou o Prisma; recebe apenas parâmetros puros e retorna estruturas de dados ou lança `ServiceError`.
2. **Alta Testabilidade**: Permitiu mockar 100% dos repositórios e dependências externas nos testes unitários.
3. **Tratamento Padronizado de Exceções**: A classe `ServiceError` centraliza o código de status e a mensagem de erro padronizada.

---

### 4.3 Testes de Software na Prática: A Pirâmide de Testes Implementada

O projeto foi estruturado seguindo rigorosamente a **Pirâmide de Testes**:

```
           / \
          /   \
         /     \
        /  E2E  \       [Frontend Component Tests: React Testing Library]
       /─────────\      -> LoginScreen, PrivateRoute, ConfirmModal, App
      /           \
     / Integração  \    [API HTTP Integration Tests: Supertest]
    /───────────────\   -> /auth/login, /turma (Rotas Protegidas com JWT)
   /                 \
  /    Unitários      \ [Backend Unit Tests: Jest + Mocks]
 /─────────────────────\[Services e Controllers: Jogo, Turma, Usuário, Escola, Partida]
```

#### 1. Testes Unitários de Backend (`CatchWord_back/tests/services` e `controllers`)
* **Padrão AAA (Arrange, Act, Assert)**: Todos os testes seguem uma estrutura clara de preparação de mocks, execução da regra e asserção dos resultados.
* **Técnicas de Caixa-Preta**:
  * *Valores Limite*: Validação de dimensões de grid no `jogoService.test.js` (dimensões mínimas de 5 e máximas de 30; rejeição de dimensões como 4 ou 31).
  * *Particionamento por Equivalência*: Coordenadas válidas vs. fora do grid, direções válidas (horizontal, vertical, diagonal) vs. ângulos inválidos.
* **Técnicas de Caixa-Branca**: Cobertura de branches de erro, permissões por tipo de usuário (`COORDENADOR`, `PROFESSOR`, `ALUNO`) e tratamento de exceções 500.

#### 2. Testes de Integração da API (`CatchWord_back/tests/integration`)
* Utilização do **Supertest** contra o `src/app.js` desacoplado.
* Teste da cadeia completa: **Roteador $\rightarrow$ Middleware de Autenticação/JWT $\rightarrow$ Controller $\rightarrow$ Service**.
* Validação de respostas `401 Unauthorized` na ausência ou envio de token JWT inválido, e respostas `200/201` com payloads válidos.

#### 3. Testes de Componentes Frontend (`CatchWord_front/src`)
* Utilização do **React Testing Library** e **Jest DOM**:
  * `LoginScreen.test.js`: Validações de entrada de formulário, exibição de mensagens de erro reativas, alternância de visibilidade da senha (eye icon) e integração mockada de API (`fetch`).
  * `PrivateRoute.test.js`: Proteção e redirecionamento de rotas com base no `authToken` do `localStorage`.
  * `ConfirmModal.test.js`: Verificação de renderização condicional, variantes visuais e disparo de eventos de callback.

---

### 4.4 Cobertura de Código e Métricas Obtidas

A execução da suíte de testes no Backend via `npm run test:coverage` apresentou resultados excepcionais:

| Camada / Arquivo | % Declarações (Stmts) | % Decisões/Branches | % Funções | % Linhas |
| :--- | :---: | :---: | :---: | :---: |
| **`src/services/` (Regras de Negócio)** | **100%** | **100%** | **100%** | **100%** |
| **`src/controllers/` (Adaptadores HTTP)** | **100%** | **100%** | **100%** | **100%** |
| **`src/routes/` (Roteadores)** | **100%** | **100%** | **100%** | **100%** |
| **Total Geral Backend** | **94.46%** | **97.75%** | **73.38%** | **94.29%** |

* **Total de Testes Automatizados no Backend**: **269 testes passando** (16 suítes).
* **Total de Testes Automatizados no Frontend**: **13 testes passando** (4 suítes).

---

### 4.5 Pipeline de Integração Contínua (CI/CD)

Foi configurado um workflow automatizado no GitHub Actions em `.github/workflows/ci.yml`. A cada `push` ou `pull request`, a esteira de CI executa em paralelo:
1. **Job `test-backend`**: Checkout $\rightarrow$ Setup Node.js $\rightarrow$ Instalação limpa $\rightarrow$ Execução de testes unitários, integração e validação de cobertura.
2. **Job `test-frontend`**: Checkout $\rightarrow$ Setup Node.js $\rightarrow$ Instalação $\rightarrow$ Execução da suíte de testes de componentes no React.

Essa automação materializa o conceito de **Garantia Contínua de Qualidade**, impedindo que qualquer regressão ou quebra de contrato seja mesclada à branch principal do repositório.

---

## 5. Roteiro para Apresentação em Sala de Aula

**Tempo Total:** 15 a 20 minutos  
**Divisão da Apresentação:**

| Bloco | Tempo | Conteúdo a Apresentar | Responsável Sugerido |
| :--- | :---: | :--- | :--- |
| **1. Abertura & Visão Geral** | 2 min | Introdução do grupo, apresentação dos temas (Qualidade e Testes de Software) e contexto do projeto Catch Word. | Integrante 1 |
| **2. Fundamentação Teórica de Qualidade** | 3 min | Normas ISO/IEC 25010, manutenibilidade, coesão, acoplamento e impactos da IA na qualidade. | Integrante 2 |
| **3. Fundamentação Teórica de Testes** | 3 min | Pirâmide de testes (Unitários, Integração, UI), padrões ISTQB, técnicas caixa-preta/branca e TDD. | Integrante 3 |
| **4. Demonstração Prática: Refatoração & Arquitetura** | 4 min | Mostrar o antes x depois (Fat Controllers vs Controller/Service/Repository) e como o design facilitou a testabilidade. | Integrante 4 |
| **5. Demonstração Prática: Execução dos Testes & CI/CD** | 5 min | • Rodar `npm run test:coverage` no terminal do backend (mostrar os 269 testes e 100% de cobertura nos services).<br>• Rodar `npm test` no frontend.<br>• Mostrar o arquivo `.github/workflows/ci.yml` do GitHub Actions. | Integrante 5 |
| **6. Conclusão & Perguntas** | 2 min | Recapitulação dos ganhos de qualidade alcançados e encerramento. | Todo o grupo |

---

## 6. Conclusão e Referências

A aplicação prática dos princípios de Engenharia de Software no desenvolvimento do Catch Word demonstrou de forma inequívoca que **Qualidade e Testes não são etapas adicionais pós-desenvolvimento, mas sim disciplinas fundamentais que moldam toda a arquitetura de software**.

A refatoração em camadas desacopladas aliada a uma estratégia multifacetada de testes automatizados (unitários, integração e componentes) e integração contínua (CI/CD) conferiu ao sistema alta manutenibilidade, resistência a falhas de regressão e documentação executável das regras de negócio.

### Referências Bibliográficas
1. PRESSMAN, Roger S.; MAXIM, Bruce R. *Engenharia de Software: Uma Abordagem Profissional*. 9ª ed. Porto Alegre: McGraw-Hill, 2021.
2. SOMMERVILLE, Ian. *Engenharia de Software*. 10ª ed. São Paulo: Pearson, 2019.
3. MARTIN, Robert C. *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall, 2008.
4. MYERS, Glenford J.; BADGETT, Tom; SANDLER, Corey. *The Art of Software Testing*. 3rd ed. John Wiley & Sons, 2011.
5. ISO/IEC 25010:2011. *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*.
6. ISTQB. *Certified Tester Foundation Level (CTFL) Syllabus*. International Software Testing Qualifications Board, 2023.
7. COHN, Mike. *Succeeding with Agile: Software Development Using Scrum*. Addison-Wesley Professional, 2009.
