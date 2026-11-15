const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, HeadingLevel, AlignmentType, PageBreak, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Trabalho Prático - Qualidade e Testes de Software - UFJF</title>
<style>
  @page {
    size: A4;
    margin-top: 30mm;
    margin-left: 30mm;
    margin-bottom: 20mm;
    margin-right: 20mm;
  }
  
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    margin: 0;
    padding: 0;
    text-align: justify;
  }

  .cover-page {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 88vh;
    text-align: center;
  }

  .cover-header {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.3;
  }

  .cover-authors {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 40px;
    line-height: 1.5;
  }

  .cover-title-box {
    margin-top: 40px;
    margin-bottom: 25px;
  }

  .cover-title {
    font-size: 13pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .cover-subtitle {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
  }

  .cover-natureza {
    margin-top: 20px;
    margin-left: 45%;
    font-size: 10pt;
    line-height: 1.3;
    text-align: justify;
  }

  .cover-footer {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 22pt;
    margin-bottom: 10pt;
  }

  h2 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 16pt;
    margin-bottom: 8pt;
  }

  h3 {
    font-size: 12pt;
    font-style: italic;
    margin-top: 12pt;
    margin-bottom: 6pt;
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
    text-indent: 1.25cm;
    line-height: 1.5;
  }

  p.no-indent {
    text-indent: 0;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10pt;
    padding-left: 1.5cm;
  }

  li {
    margin-bottom: 4pt;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0 4pt 0;
    font-size: 10pt;
  }

  th, td {
    border: 1px solid #000;
    padding: 6px 10px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .caption-top {
    font-size: 10pt;
    font-weight: bold;
    margin-bottom: 4pt;
    text-align: center;
  }

  .source-bottom {
    font-size: 10pt;
    margin-top: 4pt;
    margin-bottom: 14pt;
    text-align: center;
  }

  pre {
    background-color: #fafafa;
    border: 1px solid #ccc;
    padding: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    line-height: 1.2;
    margin: 10pt 0;
  }

  .page-break {
    page-break-after: always;
  }

  .center-title {
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12pt;
    margin-bottom: 14pt;
  }
</style>
</head>
<body>

<!-- 1. CAPA / FOLHA DE IDENTIFICAÇÃO (NBR 14724) -->
<div class="cover-page">
  <div class="cover-header">
    UNIVERSIDADE FEDERAL DE JUIZ DE FORA – UFJF<br>
    INSTITUTO DE CIÊNCIAS EXATAS – ICE<br>
    DEPARTAMENTO DE CIÊNCIA DA COMPUTAÇÃO – DCC<br>
    DCC061 – ENGENHARIA DE SOFTWARE
  </div>

  <div class="cover-authors">
    GABRIEL TOLEDO NETTO GRIBEL – Matrícula: 201976004<br>
    ISAAC DIZOLELE KAPELA JOÃO – Matrícula: 202376017<br>
    RIAN CESAR QUINTANILHA – Matrícula: 202465080AC<br>
    SAMIR JABER COPAR – Matrícula: 202465083AC
  </div>

  <div class="cover-title-box">
    <div class="cover-title">GARANTIA DA QUALIDADE E TESTES DE SOFTWARE:</div>
    <div class="cover-subtitle">FUNDAMENTAÇÃO TEÓRICA E APLICAÇÃO PRÁTICA NA PLATAFORMA CATCH WORD</div>
  </div>

  <div class="cover-natureza">
    Trabalho Prático apresentado ao Departamento de Ciência da Computação do Instituto de Ciências Exatas da Universidade Federal de Juiz de Fora como requisito parcial de avaliação na disciplina DCC061 – Engenharia de Software.<br><br>
    <strong>Professor Orientador:</strong> Prof. Dr. Fabrício Martins Mendonça.<br><br>
    <strong>Temas Escolhidos:</strong><br>
    1. Qualidade de Software<br>
    2. Testes de Software
  </div>

  <div class="cover-footer">
    JUIZ DE FORA – MG<br>
    2026
  </div>
</div>

<!-- 2. RESUMO E SUMÁRIO (Pré-textuais Integrados) -->
<div class="page-break">
  <div class="center-title">RESUMO</div>
  <p class="no-indent" style="font-size: 11pt; line-height: 1.35;">O presente trabalho prático aborda de forma integrada e aprofundada dois tópicos centrais da Engenharia de Software: Qualidade de Software e Testes de Software. Na dimensão teórica, desenvolvem-se os oito tópicos fundamentais exigidos pelo conteúdo programático: definições formais, evolução histórica na computação, relevância na mitigação do débito técnico e na redução do custo do ciclo de vida (Lei de Boehm), tecnologias e ferramentas contemporâneas, normas internacionais (séries ISO/IEC 25010 e ISO/IEC/IEEE 29119), modelos de maturidade de processos (CMMI e MPS.BR), perfis profissionais no mercado de Tecnologia da Informação, certificações de referência (ISTQB, CSQE, CSDP) e os impactos transformadores da Inteligência Artificial. Na dimensão prática, descreve-se a refatoração arquitetural completa da plataforma educacional <em>Catch Word</em>, demonstrando a eliminação do anti-padrão de controladores sobrecarregados (<em>Fat Controllers</em>) mediante a transição para uma arquitetura em camadas desacopladas (Controllers, Services e Repositories). Essa reformulação estrutural viabilizou a implementação de uma pirâmide integral de testes automatizados com 282 testes (unitários, integração e componentes de interface), atingindo 100% de cobertura nas regras de negócio e adaptadores HTTP, integrados a uma esteira de Integração Contínua (CI/CD) no GitHub Actions.</p>
  <br>
  <p class="no-indent" style="font-size: 10pt;"><strong>Palavras-chave:</strong> Qualidade de software. Testes de software. Arquitetura em camadas. Pirâmide de testes. ISO/IEC 25010. Integração contínua.</p>

  <div class="center-title" style="margin-top: 24pt;">SUMÁRIO</div>
  <table style="border: none; font-size: 10pt; line-height: 1.3;">
    <tr style="border: none;"><td style="border: none; font-weight: bold;">1 INTRODUÇÃO</td><td style="border: none; text-align: right;">1</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">2 TEMA 1: QUALIDADE DE SOFTWARE</td><td style="border: none; text-align: right;">1</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.1 DEFINIÇÃO DO TEMA</td><td style="border: none; text-align: right;">1</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.2 HISTÓRICO NA COMPUTAÇÃO E ENGENHARIA DE SOFTWARE</td><td style="border: none; text-align: right;">2</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.3 IMPORTÂNCIA EM ENGENHARIA DE SOFTWARE</td><td style="border: none; text-align: right;">2</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.4 TECNOLOGIAS E FERRAMENTAS RELACIONADAS</td><td style="border: none; text-align: right;">3</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.5 PADRÕES E NORMAS APLICÁVEIS</td><td style="border: none; text-align: right;">3</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.6 PROFISSÕES NO MERCADO DE TRABALHO EM TI</td><td style="border: none; text-align: right;">4</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.7 CERTIFICAÇÕES PROFISSIONAIS</td><td style="border: none; text-align: right;">4</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">2.8 IMPACTOS DA INTELIGÊNCIA ARTIFICIAL</td><td style="border: none; text-align: right;">4</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">3 TEMA 2: TESTES DE SOFTWARE</td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.1 DEFINIÇÃO DO TEMA</td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.2 HISTÓRICO NA ENGENHARIA DE SOFTWARE</td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.3 IMPORTÂNCIA EM ENGENHARIA DE SOFTWARE</td><td style="border: none; text-align: right;">6</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.4 TECNOLOGIAS E FERRAMENTAS RELACIONADAS</td><td style="border: none; text-align: right;">6</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.5 PADRÕES E NORMAS APLICÁVEIS</td><td style="border: none; text-align: right;">6</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.6 PROFISSÕES NO MERCADO DE TRABALHO EM TI</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.7 CERTIFICAÇÕES PROFISSIONAIS</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">3.8 IMPACTOS DA INTELIGÊNCIA ARTIFICIAL</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">4 APLICAÇÃO PRÁTICA NO PROJETO CATCH WORD</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">4.1 VISÃO GERAL DO SISTEMA CATCH WORD</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">4.2 QUALIDADE NA PRÁTICA: REFATORAÇÃO EM CAMADAS</td><td style="border: none; text-align: right;">8</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">4.3 TESTES NA PRÁTICA: PIRÂMIDE DE TESTES</td><td style="border: none; text-align: right;">8</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">4.4 COBERTURA DE CÓDIGO E MÉTRICAS OBTIDAS</td><td style="border: none; text-align: right;">9</td></tr>
    <tr style="border: none;"><td style="border: none; padding-left: 15px;">4.5 PIPELINE DE INTEGRAÇÃO CONTÍNUA (CI/CD)</td><td style="border: none; text-align: right;">10</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">5 ROTEIRO PARA APRESENTAÇÃO EM SALA DE AULA</td><td style="border: none; text-align: right;">10</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">6 CONCLUSÃO</td><td style="border: none; text-align: right;">11</td></tr>
    <tr style="border: none;"><td style="border: none; font-weight: bold;">REFERÊNCIAS</td><td style="border: none; text-align: right;">12</td></tr>
  </table>
</div>

<!-- 1. INTRODUÇÃO -->
<h1>1 INTRODUÇÃO</h1>
<p>O desenvolvimento contemporâneo de sistemas de software demanda metodologias rigorosas capazes de garantir a sustentabilidade, manutenibilidade, segurança e confiabilidade das aplicações ao longo de todo o seu ciclo de vida. A complexidade crescente dos produtos tecnológicos impõe que a qualidade deixe de ser tratada como um atributo secundário ou verificado apenas no encerramento da implementação, passando a atuar como elemento estruturante desde as fases preliminares da concepção arquitetural.</p>

<p>No contexto acadêmico da disciplina DCC061 – Engenharia de Software, ministrada no Departamento de Ciência da Computação da Universidade Federal de Juiz de Fora (UFJF) pelo Professor Dr. Fabrício Martins Mendonça, este trabalho prático desenvolve uma abordagem aprofundada sobre dois temas complementares e indispensáveis:</p>
<ol>
  <li><strong>Qualidade de Software:</strong> explorando modelos normativos de produto e processo, métricas estáticas e dinâmicas, mitigação do débito técnico e padrões de excelência de projeto;</li>
  <li><strong>Testes de Software:</strong> investigando a taxonomia de verificação e validação, a Pirâmide de Testes (unitários, integração e interface), técnicas de teste caixa-preta e caixa-branca, e mecanismos de automação contínua.</li>
</ol>

<p>Para cumprir a exigência prática da disciplina, a equipe aplicou os conceitos teóricos diretamente na plataforma educacional <strong>Catch Word</strong>, um sistema web destinado ao ensino interativo por meio de caça-palavras pedagógicos customizáveis. O projeto foi submetido a uma reestruturação arquitetural com eliminação de controladores densos (<em>Fat Controllers</em>), criação de uma arquitetura modular em três camadas e desenvolvimento de uma suíte com 282 testes automatizados integrados a uma esteira de Integração Contínua (CI/CD).</p>

<!-- 2. QUALIDADE DE SOFTWARE -->
<h1>2 TEMA 1: QUALIDADE DE SOFTWARE</h1>

<h2>2.1 DEFINIÇÃO DO TEMA</h2>
<p>Qualidade de Software é conceituada como o grau em que um conjunto de características inerentes a um produto de software satisfaz tanto os requisitos funcionais explicitamente declarados quanto os requisitos não funcionais implícitos demandados pelos usuários e partes interessadas (<em>stakeholders</em>), englobando confiabilidade, usabilidade, eficiência, manutenibilidade e segurança (PRESSMAN; MAXIM, 2021; SOMMERVILLE, 2019).</p>

<p>A Engenharia de Software decompõe a disciplina em duas ramificações interdependentes:</p>
<ul>
  <li><strong>Qualidade de Processo:</strong> focaliza a maturidade, o controle e a melhoria contínua dos métodos, procedimentos e ferramentas empregados pela equipe durante o ciclo de desenvolvimento;</li>
  <li><strong>Qualidade de Produto:</strong> avalia as propriedades estruturais intrínsecas do código-fonte (coesão, acoplamento, complexidade ciclomática) e os atributos comportamentais observados durante a execução do artefato.</li>
</ul>

<h2>2.2 HISTÓRICO NA COMPUTAÇÃO E ENGENHARIA DE SOFTWARE</h2>
<ol>
  <li><strong>A Crise do Software (1968):</strong> Na Conferência da OTAN realizada em Garmisch, formalizou-se o reconhecimento de que os projetos de software eram rotineiramente entregues fora do prazo, com custos descontrolados e níveis inaceitáveis de defeitos operacionais.</li>
  <li><strong>Controle Estatístico e Métricas (Décadas de 1970 e 1980):</strong> Adaptação das teorias de controle de qualidade de Deming e Juran. Surgiram métricas fundamentais como a Complexidade Ciclomática de Thomas McCabe (1976) e as métricas de ciência de software de Maurice Halstead (1977).</li>
  <li><strong>Modelos de Maturidade e Normalização (Década de 1990):</strong> O <em>Software Engineering Institute</em> (SEI) da Carnegie Mellon University criou o CMM (<em>Capability Maturity Model</em>). Em paralelo, a ISO publicou a norma ISO/IEC 9126, estruturando os atributos de qualidade.</li>
  <li><strong>Movimento Ágil, Clean Code e DevOps (Anos 2000 até hoje):</strong> O Manifesto Ágil (2001), as práticas de <em>Clean Code</em> (MARTIN, 2008) e a automação de infraestrutura consolidaram o conceito de <em>Shift-Left Quality</em>, no qual a qualidade é validada a cada alteração de código.</li>
</ol>

<h2>2.3 IMPORTÂNCIA EM ENGENHARIA DE SOFTWARE</h2>
<p>A ausência de investimento contínuo em qualidade acarreta o acúmulo acelerado de <strong>Débito Técnico</strong> (<em>Technical Debt</em>). Segundo a consagrada <strong>Lei de Boehm</strong>, o custo relativo para identificar e sanar um defeito cresce exponencialmente à medida que o software avança pelas etapas do ciclo de vida, sendo a correção em produção de 50 a 100 vezes mais custosa do que na fase de concepção e arquitetura.</p>

<p>A qualidade assegura alta manutenibilidade, segurança da informação (LGPD), satisfação dos clientes e expressiva redução no Custo Total de Propriedade (TCO) dos produtos de software corporativos.</p>

<h2>2.4 TECNOLOGIAS E FERRAMENTAS RELACIONADAS</h2>
<ul>
  <li><strong>Análise Estática de Código (SAST) e Linters:</strong> SonarQube, ESLint, Prettier, Checkstyle, SpotBugs e CodeClimate;</li>
  <li><strong>Análise de Cobertura e Métricas:</strong> Istanbul (Jest Coverage), JaCoCo e Coveralls;</li>
  <li><strong>Automação Contínua e Portais de Qualidade (<em>Quality Gates</em>):</strong> GitHub Actions, GitLab CI e Jenkins.</li>
</ul>

<h2>2.5 PADRÕES E NORMAS APLICÁVEIS</h2>
<p class="caption-top">Tabela 1 – Características da Qualidade do Produto segundo a Norma ISO/IEC 25010</p>
<table>
  <thead>
    <tr>
      <th style="width: 35%;">Característica Principal</th>
      <th>Subcaracterísticas Abrangidas</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1. Adequação Funcional</td><td>Completude funcional, correção funcional e conformidade funcional.</td></tr>
    <tr><td>2. Eficiência de Desempenho</td><td>Comportamento em relação ao tempo, utilização de recursos e capacidade.</td></tr>
    <tr><td>3. Compatibilidade</td><td>Coexistência e interoperabilidade com outros sistemas.</td></tr>
    <tr><td>4. Usabilidade</td><td>Reconhecimento de adequação, aprendibilidade, operabilidade, proteção contra erro e estética.</td></tr>
    <tr><td>5. Confiabilidade</td><td>Maturidade, disponibilidade, tolerância a falhas e capacidade de recuperação.</td></tr>
    <tr><td>6. Segurança</td><td>Confidencialidade, integridade, não-repúdio, rastreabilidade e autenticidade.</td></tr>
    <tr><td>7. Manutenibilidade</td><td>Modularidade, reusabilidade, analisabilidade, modificabilidade e testabilidade.</td></tr>
    <tr><td>8. Portabilidade</td><td>Adaptabilidade, instalabilidade e facilidade de substituição.</td></tr>
  </tbody>
</table>
<p class="source-bottom"><strong>Fonte:</strong> Adaptado de ISO/IEC (2011).</p>

<p>Além da ISO/IEC 25010, destacam-se o modelo internacional <strong>CMMI</strong> (5 níveis de maturidade) e o modelo brasileiro <strong>MPS.BR</strong> (7 níveis de maturidade, do nível G ao nível A).</p>

<h2>2.6 PROFISSÕES NO MERCADO DE TRABALHO EM TI</h2>
<ul>
  <li><strong>Engenheiro de Confiabilidade de Sites (SRE – <em>Site Reliability Engineer</em>):</strong> responsável por métricas de disponibilidade (SLA, SLO, SLI) e resiliência;</li>
  <li><strong>Engenheiro de Qualidade de Software (QA Lead / Quality Engineer):</strong> define políticas de aceitação e arquiteturas de qualidade;</li>
  <li><strong>Arquiteto de Software:</strong> modela o desacoplamento, a coesão e o atendimento aos requisitos não funcionais;</li>
  <li><strong>DevOps / DevSecOps Engineer:</strong> implementa automações de entrega segura.</li>
</ul>

<h2>2.7 CERTIFICAÇÕES PROFISSIONAIS</h2>
<ul>
  <li><strong>CSQE (<em>Certified Software Quality Engineer</em>):</strong> American Society for Quality (ASQ);</li>
  <li><strong>CMMI Associate e CMMI Lead Appraiser:</strong> CMMI Institute / ISACA;</li>
  <li><strong>CSDP (<em>Certified Software Development Professional</em>):</strong> IEEE Computer Society.</li>
</ul>

<h2>2.8 IMPACTOS DA INTELIGÊNCIA ARTIFICIAL</h2>
<ul>
  <li><strong>Revisão Semântica de Código:</strong> identificação contextual de falhas de segurança e violações arquiteturais em Pull Requests antes do merge;</li>
  <li><strong>Análise Preditiva de Defeitos:</strong> modelos de aprendizado de máquina correlacionam a taxa de alteração (<em>code churn</em>) e a complexidade ciclomática;</li>
  <li><strong>Refatoração Assistida:</strong> sugestões automatizadas de decomposição de funções extensas e eliminação de duplicação de código.</li>
</ul>

<!-- 3. TESTES DE SOFTWARE -->
<h1>3 TEMA 2: TESTES DE SOFTWARE</h1>

<h2>3.1 DEFINIÇÃO DO TEMA</h2>
<p>Teste de software é a execução empírica e sistemática de um programa sob condições controladas, com o objetivo primário de revelar discrepâncias entre o comportamento esperado e o comportamento observado (MYERS et al., 2011).</p>

<p>O processo estrutura-se em dois eixos fundamentais:</p>
<ul>
  <li><strong>Verificação:</strong> "O software está sendo construído corretamente?" (avaliação de conformidade com os requisitos e especificações de projeto);</li>
  <li><strong>Validação:</strong> "O software correto está sendo construído?" (avaliação de adequação às necessidades operacionais dos usuários).</li>
</ul>

<p>Segundo a taxonomia oficial do ISTQB (2023), estabelece-se a distinção formal entre <strong>Erro</strong> (ação humana incorreta), <strong>Defeito/Bug</strong> (imperfeição interna no código) e <strong>Falha</strong> (desvio funcional observado durante a execução).</p>

<h2>3.2 HISTÓRICO NA ENGENHARIA DE SOFTWARE</h2>
<ul>
  <li><strong>Anos 1950 a 1960:</strong> Os testes limitavam-se à depuração (<em>debugging</em>) manual e assistemática conduzida pelo próprio programador.</li>
  <li><strong>Anos 1970 a 1980:</strong> Glenford Myers publicou a obra clássica <em>"The Art of Software Testing"</em> (1979), formalizando o teste como disciplina independente e evidenciando o Princípio de Dijkstra: "Testes podem provar a presença de defeitos, mas nunca a sua ausência".</li>
  <li><strong>Década de 1990:</strong> Kent Beck difundiu o <em>Test-Driven Development</em> (TDD), transformando os testes unitários em instrumentos primários de especificação viva e design de software (BECK, 2002).</li>
  <li><strong>Anos 2000 até hoje:</strong> Mike Cohn formulou a <strong>Pirâmide de Testes</strong> (COHN, 2009), enfatizando a preponderância de testes unitários rápidos e isolados na base da estratégia de qualidade.</li>
</ul>

<h2>3.3 IMPORTÂNCIA EM ENGENHARIA DE SOFTWARE</h2>
<ul>
  <li><strong>Prevenção de Efeito Colateral e Regressão:</strong> garante que novas funcionalidades ou correções pontuais não afetem comportamentos consolidados do sistema;</li>
  <li><strong>Feedback Imediato:</strong> desenvolvedores recebem retorno instantâneo sobre a corretude de suas alterações em questão de segundos;</li>
  <li><strong>Segurança para Refatoração:</strong> possibilita a contínua modernização da arquitetura do software sem temor de introdução de falhas ocultas.</li>
</ul>

<h2>3.4 TECNOLOGIAS E FERRAMENTAS RELACIONADAS</h2>
<ul>
  <li><strong>Testes Unitários e Dublês de Teste (<em>Mocks/Stubs</em>):</strong> Jest, JUnit 5, PyTest, Mocha, Chai e Vitest;</li>
  <li><strong>Testes de Integração e APIs HTTP:</strong> Supertest, REST Assured e Postman/Newman;</li>
  <li><strong>Testes de Interface (UI) e Componentes:</strong> React Testing Library, Cypress, Playwright e Selenium WebDriver;</li>
  <li><strong>Testes de Carga e Desempenho:</strong> k6, Apache JMeter e Gatling.</li>
</ul>

<h2>3.5 PADRÕES E NORMAS APLICÁVEIS</h2>
<ul>
  <li><strong>ISO/IEC/IEEE 29119:</strong> norma internacional unificada para testes (Partes 1 a 5);</li>
  <li><strong>ISTQB (International Software Testing Qualifications Board):</strong> organização de referência mundial que estabelece o padrão de glossário, processos e competências na área.</li>
</ul>

<h2>3.6 PROFISSÕES NO MERCADO DE TRABALHO EM TI</h2>
<ul>
  <li><strong>SDET (Software Development Engineer in Test):</strong> engenheiro de software focado no desenvolvimento de ferramentas de teste e automação;</li>
  <li><strong>Engenheiro de Automação de QA:</strong> constrói e mantém suítes automatizadas de testes de API e UI;</li>
  <li><strong>Analista de Testes Funcional / Exploratório:</strong> modela cenários de teste de negócio e casos de borda;</li>
  <li><strong>Especialista em Testes de Performance e Segurança (Pentester).</strong></li>
</ul>

<h2>3.7 CERTIFICAÇÕES PROFISSIONAIS</h2>
<ul>
  <li><strong>ISTQB CTFL (Certified Tester Foundation Level):</strong> certificação de entrada mundialmente reconhecida;</li>
  <li><strong>ISTQB Níveis Avançados:</strong> CTAL-TA (Test Analyst), CTAL-TTA (Technical Test Analyst) e CTAL-TM (Test Manager);</li>
  <li><strong>CSTE (Certified Software Test Engineer):</strong> emitida pelo QAI Global Institute.</li>
</ul>

<h2>3.8 IMPACTOS DA INTELIGÊNCIA ARTIFICIAL</h2>
<ul>
  <li><strong>Geração Autônoma de Casos de Teste:</strong> LLMs sintetizam testes unitários cobrindo caminhos felizes, valores limite e fluxos de exceção;</li>
  <li><strong>Testes com Auto-Cura (Self-Healing Tests):</strong> algoritmos que adaptam seletores de interface em tempo real quando o DOM da aplicação é alterado;</li>
  <li><strong>Fuzzing Generativo:</strong> criação de cargas aleatórias e estruturadas para encontrar estouros de memória e brechas de injeção.</li>
</ul>

<!-- 4. APLICAÇÃO PRÁTICA -->
<h1>4 APLICAÇÃO PRÁTICA NO PROJETO CATCH WORD</h1>

<h2>4.1 VISÃO GERAL DO SISTEMA CATCH WORD</h2>
<p>O <strong>Catch Word</strong> é uma solução educacional desenvolvida para possibilitar que professores elaborem caça-palavras pedagógicos personalizados, gerenciem turmas e acompanhem estatísticas de resolução dos alunos em tempo real. O sistema é estruturado em:</p>
<ul>
  <li><strong>Backend (CatchWord_back):</strong> API REST em Node.js (módulos ES), Express, Prisma ORM e PostgreSQL;</li>
  <li><strong>Frontend (CatchWord_front):</strong> SPA desenvolvida em React 18, React Router v6 e componentes estilizados em CSS modular.</li>
</ul>

<h2>4.2 QUALIDADE NA PRÁTICA: REFATORAÇÃO ARQUITETURAL EM CAMADAS</h2>
<p>Na versão original, o sistema continha o anti-padrão dos controladores sobrecarregados (<em>Fat Controllers</em>), concentrando regras matemáticas de montagem de grid, persistência e envio de e-mails diretamente nas rotas HTTP. A aplicação foi refatorada em quatro camadas desacopladas:</p>
<ol>
  <li><strong>Middlewares:</strong> Autenticação JWT e Autorização RBAC;</li>
  <li><strong>Controllers:</strong> Adaptadores HTTP puros;</li>
  <li><strong>Services:</strong> Regras de Negócio Puras e Lançamento de <code>ServiceError</code>;</li>
  <li><strong>Repositories:</strong> Isolamento do Banco de Dados / Prisma ORM.</li>
</ol>

<h2>4.3 TESTES NA PRÁTICA: PIRÂMIDE DE TESTES IMPLEMENTADA</h2>
<ol>
  <li><strong>Testes Unitários (Backend – Jest):</strong> Padrão AAA (<em>Arrange, Act, Assert</em>), técnicas de Análise de Valores Limite (dimensões de 5x5 a 30x30 no <code>jogoService</code>) e Particionamento por Equivalência.</li>
  <li><strong>Testes de Integração (Backend – Supertest):</strong> Desacoplamento do <code>src/app.js</code> para instanciar a API em memória e testar rotas autenticadas sob JWT e rotas públicas.</li>
  <li><strong>Testes de Componentes (Frontend – React Testing Library):</strong> Validação de formulários controlados, banners de erro, modais de confirmação e proteção de rotas privadas (<code>PrivateRoute</code>).</li>
</ol>

<h2>4.4 COBERTURA DE CÓDIGO E MÉTRICAS OBTIDAS</h2>
<p class="caption-top">Tabela 2 – Métricas Consolidadas de Cobertura de Código no Backend</p>
<table>
  <thead>
    <tr>
      <th>Camada / Módulo</th>
      <th>% Instruções</th>
      <th>% Decisões (Branches)</th>
      <th>% Funções</th>
      <th>% Linhas</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>src/services/ (Regras de Negócio)</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td></tr>
    <tr><td><strong>src/controllers/ (Adaptadores HTTP)</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td></tr>
    <tr><td><strong>src/routes/ (Roteadores Express)</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td><td><strong>100,00%</strong></td></tr>
    <tr><td><strong>Total Geral do Backend</strong></td><td><strong>94,46%</strong></td><td><strong>97,75%</strong></td><td><strong>73,38%</strong></td><td><strong>94,29%</strong></td></tr>
  </tbody>
</table>
<p class="source-bottom"><strong>Fonte:</strong> Elaborada pelos autores (2026).</p>

<p>O projeto conta com <strong>282 testes automatizados</strong> (269 testes de backend e 13 testes de frontend), todos aprovados com 100% de sucesso.</p>

<h2>4.5 PIPELINE DE INTEGRAÇÃO CONTÍNUA (CI/CD)</h2>
<p>Configurou-se uma esteira no GitHub Actions (<code>.github/workflows/ci.yml</code>) que, a cada <em>push</em> ou <em>pull request</em> na branch <code>main</code>, executa a instalação limpa, roda todos os testes e valida a cobertura de código de forma determinística e autônoma.</p>

<!-- 5. ROTEIRO DE APRESENTAÇÃO -->
<h1>5 ROTEIRO PARA APRESENTAÇÃO EM SALA DE AULA</h1>
<p class="caption-top">Tabela 3 – Planejamento e Divisão da Apresentação Oral em Sala de Aula</p>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">Bloco Temático</th>
      <th style="width: 10%;">Tempo</th>
      <th>Conteúdo Abordado</th>
      <th style="width: 22%;">Apresentador</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1. Abertura e Qualidade</td><td>4 min</td><td>Introdução à equipe, conceitos de Qualidade (ISO 25010), débito técnico e Lei de Boehm.</td><td>Samir Jaber</td></tr>
    <tr><td>2. Testes de Software</td><td>4 min</td><td>Fundamentação de Testes, Pirâmide de Cohn, normas ISTQB/ISO 29119 e IA.</td><td>Isaac João</td></tr>
    <tr><td>3. Demonstração: Refatoração</td><td>4 min</td><td>Comparativo Antes vs. Depois (Fat Controllers vs Camadas) e isolamento dos Services.</td><td>Rian Quintanilha</td></tr>
    <tr><td>4. Demonstração: Testes e CI</td><td>4 min</td><td>Execução ao vivo (<code>npm run test:coverage</code>), 282 testes e esteira GitHub Actions.</td><td>Gabriel Gribel</td></tr>
    <tr><td>5. Conclusão e Dúvidas</td><td>2 min</td><td>Síntese dos resultados, benefícios alcançados e encerramento com a turma.</td><td>Todos</td></tr>
  </tbody>
</table>
<p class="source-bottom"><strong>Fonte:</strong> Elaborada pelos autores (2026).</p>

<!-- 6. CONCLUSÃO -->
<h1>6 CONCLUSÃO</h1>
<p>A elaboração deste trabalho permitiu consolidar a compreensão teórica e prática de que <strong>Qualidade de Software</strong> e <strong>Testes de Software</strong> são disciplinas basilares que devem nortear o desenvolvimento de software profissional desde os seus primeiros passos.</p>
<p>A refatoração arquitetural aplicada ao projeto Catch Word comprovou na prática que um design modular em três camadas elimina acoplamentos desnecessários e viabiliza suítes de testes determinísticas e de rápida execução. A obtenção de 100% de cobertura nos serviços de negócio e controladores, aliada à automação via CI/CD no GitHub Actions, garante sustentabilidade ao sistema, mitiga o risco de regressões e atende aos mais elevados padrões da Engenharia de Software contemporânea.</p>

<!-- REFERÊNCIAS (NBR 6023) -->
<h1 style="text-align: center; margin-top: 36pt;">REFERÊNCIAS</h1>
<div style="line-height: 1.2; font-size: 11pt;">
  <p class="no-indent">BECK, K. <strong>Test-driven development: by example</strong>. Boston: Addison-Wesley, 2002.</p><br>
  <p class="no-indent">COHN, M. <strong>Succeeding with agile: software development using Scrum</strong>. Boston: Addison-Wesley Professional, 2009.</p><br>
  <p class="no-indent">ISO/IEC. <strong>ISO/IEC 25010: Systems and software engineering -- Systems and software Quality Requirements and Evaluation (SQuaRE) -- System and software quality models</strong>. Genebra: International Organization for Standardization, 2011.</p><br>
  <p class="no-indent">ISO/IEC/IEEE. <strong>ISO/IEC/IEEE 29119: Software and systems engineering -- Software testing</strong>. Genebra: International Organization for Standardization, 2013.</p><br>
  <p class="no-indent">ISTQB. <strong>Certified Tester Foundation Level (CTFL) Syllabus v4.0</strong>. International Software Testing Qualifications Board, 2023.</p><br>
  <p class="no-indent">MARTIN, R. C. <strong>Clean code: a handbook of agile software craftsmanship</strong>. Upper Saddle River: Prentice Hall, 2008.</p><br>
  <p class="no-indent">MCCABE, T. J. A Complexity Measure. <strong>IEEE Transactions on Software Engineering</strong>, v. SE-2, n. 4, p. 308–320, 1976.</p><br>
  <p class="no-indent">MYERS, G. J.; BADGETT, T.; SANDLER, C. <strong>The art of software testing</strong>. 3. ed. Hoboken: John Wiley & Sons, 2011.</p><br>
  <p class="no-indent">PRESSMAN, R. S.; MAXIM, B. R. <strong>Engenharia de software: uma abordagem profissional</strong>. 9. ed. Porto Alegre: McGraw-Hill, 2021.</p><br>
  <p class="no-indent">SOMMERVILLE, I. <strong>Engenharia de software</strong>. 10. ed. São Paulo: Pearson, 2019.</p>
</div>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'Documento_Teorico.html'), htmlContent);

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1701, // 3.0 cm in dxa (1 cm = 567 dxa)
              left: 1701, // 3.0 cm
              bottom: 1134, // 2.0 cm
              right: 1134 // 2.0 cm
            }
          }
        },
        children: [
          // CAPA / IDENTIFICAÇÃO ABNT
          new Paragraph({
            text: "UNIVERSIDADE FEDERAL DE JUIZ DE FORA – UFJF\nINSTITUTO DE CIÊNCIAS EXATAS – ICE\nDEPARTAMENTO DE CIÊNCIA DA COMPUTAÇÃO – DCC\nDCC061 – ENGENHARIA DE SOFTWARE",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 }
          }),
          new Paragraph({
            text: "GABRIEL TOLEDO NETTO GRIBEL – Matrícula: 201976004\nISAAC DIZOLELE KAPELA JOÃO – Matrícula: 202376017\nRIAN CESAR QUINTANILHA – Matrícula: 202465080AC\nSAMIR JABER COPAR – Matrícula: 202465083AC",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 1000 }
          }),
          new Paragraph({
            text: "GARANTIA DA QUALIDADE E TESTES DE SOFTWARE:\nFUNDAMENTAÇÃO TEÓRICA E APLICAÇÃO PRÁTICA NA PLATAFORMA CATCH WORD",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 }
          }),
          new Paragraph({
            text: "Trabalho Prático apresentado ao Departamento de Ciência da Computação do Instituto de Ciências Exatas da Universidade Federal de Juiz de Fora como requisito parcial de avaliação na disciplina DCC061 – Engenharia de Software.\n\nProfessor Orientador: Prof. Dr. Fabrício Martins Mendonça.\n\nTemas Escolhidos:\n1. Qualidade de Software\n2. Testes de Software",
            alignment: AlignmentType.RIGHT,
            spacing: { after: 1400 }
          }),
          new Paragraph({
            text: "JUIZ DE FORA – MG\n2026",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // RESUMO E SUMÁRIO
          new Paragraph({
            text: "RESUMO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            text: "O presente trabalho prático aborda de forma integrada e aprofundada dois tópicos centrais da Engenharia de Software: Qualidade de Software e Testes de Software. Na dimensão teórica, desenvolvem-se os oito tópicos fundamentais exigidos pelo conteúdo programático: definições formais, evolução histórica na computação, relevância na mitigação do débito técnico e na redução do custo do ciclo de vida (Lei de Boehm), tecnologias e ferramentas contemporâneas, normas internacionais (séries ISO/IEC 25010 e ISO/IEC/IEEE 29119), modelos de maturidade de processos (CMMI e MPS.BR), perfis profissionais no mercado de Tecnologia da Informação, certificações de referência (ISTQB, CSQE, CSDP) e os impactos transformadores da Inteligência Artificial. Na dimensão prática, descreve-se a refatoração arquitetural completa da plataforma educacional Catch Word, demonstrando a eliminação do anti-padrão de controladores sobrecarregados (Fat Controllers) mediante a transição para uma arquitetura em camadas desacopladas (Controllers, Services e Repositories). Essa reformulação estrutural viabilizou a implementação de uma pirâmide integral de testes automatizados com 282 testes (unitários, integração e componentes de interface), atingindo 100% de cobertura nas regras de negócio e adaptadores HTTP, integrados a uma esteira de Integração Contínua (CI/CD) no GitHub Actions.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "Palavras-chave: Qualidade de software. Testes de software. Arquitetura em camadas. Pirâmide de testes. ISO/IEC 25010. Integração contínua.",
            spacing: { after: 400 }
          }),

          // 1. INTRODUÇÃO
          new Paragraph({
            text: "1 INTRODUÇÃO",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "O desenvolvimento contemporâneo de sistemas de software demanda metodologias rigorosas capazes de garantir a sustentabilidade, manutenibilidade, segurança e confiabilidade das aplicações ao longo de todo o seu ciclo de vida. A complexidade crescente dos produtos tecnológicos impõe que a qualidade deixe de ser tratada como um atributo secundário ou verificado apenas no encerramento da implementação, passando a atuar como elemento estruturante desde as fases preliminares da concepção arquitetural.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "No contexto acadêmico da disciplina DCC061 – Engenharia de Software, ministrada no Departamento de Ciência da Computação da Universidade Federal de Juiz de Fora (UFJF) pelo Professor Dr. Fabrício Martins Mendonça, este trabalho prático desenvolve uma abordagem aprofundada sobre dois temas complementares e indispensáveis: Qualidade de Software e Testes de Software.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "Para cumprir a exigência prática da disciplina, a equipe aplicou os conceitos teóricos diretamente na plataforma educacional Catch Word, um sistema web destinado ao ensino interativo por meio de caça-palavras pedagógicos customizáveis. O projeto foi submetido a uma reestruturação arquitetural com eliminação de controladores densos (Fat Controllers), criação de uma arquitetura modular em três camadas e desenvolvimento de uma suíte com 282 testes automatizados integrados a uma esteira de Integração Contínua (CI/CD).",
            spacing: { after: 400 }
          }),

          // 2. QUALIDADE DE SOFTWARE
          new Paragraph({
            text: "2 TEMA 1: QUALIDADE DE SOFTWARE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "2.1 DEFINIÇÃO DO TEMA",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "Qualidade de Software é conceituada como o grau em que um conjunto de características inerentes a um produto de software satisfaz tanto os requisitos funcionais explicitamente declarados quanto os requisitos não funcionais implícitos demandados pelos usuários e partes interessadas (stakeholders), englobando confiabilidade, usabilidade, eficiência, manutenibilidade e segurança (PRESSMAN; MAXIM, 2021; SOMMERVILLE, 2019).",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.2 HISTÓRICO NA COMPUTAÇÃO E ENGENHARIA DE SOFTWARE",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "1. A Crise do Software (1968): Na Conferência da OTAN realizada em Garmisch, formalizou-se o reconhecimento de que os projetos de software eram rotineiramente entregues fora do prazo, com custos descontrolados e níveis inaceitáveis de defeitos operacionais.\n2. Controle Estatístico e Métricas (Décadas de 1970 e 1980): Adaptação das teorias de controle de qualidade de Deming e Juran. Surgiram métricas fundamentais como a Complexidade Ciclomática de Thomas McCabe (1976) e as métricas de ciência de software de Maurice Halstead (1977).\n3. Modelos de Maturidade e Normalização (Década de 1990): O Software Engineering Institute (SEI) da Carnegie Mellon University criou o CMM (Capability Maturity Model). Em paralelo, a ISO publicou a norma ISO/IEC 9126, estruturando os atributos de qualidade.\n4. Movimento Ágil, Clean Code e DevOps (Anos 2000 até hoje): O Manifesto Ágil (2001), as práticas de Clean Code (MARTIN, 2008) e a automação de infraestrutura consolidaram o conceito de Shift-Left Quality, no qual a qualidade é validada a cada alteração de código.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.3 IMPORTÂNCIA EM ENGENHARIA DE SOFTWARE",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "A ausência de investimento contínuo em qualidade acarreta o acúmulo acelerado de Débito Técnico (Technical Debt). Segundo a consagrada Lei de Boehm, o custo relativo para identificar e sanar um defeito cresce exponencialmente à medida que o software avança pelas etapas do ciclo de vida, sendo a correção em produção de 50 a 100 vezes mais cara que na fase de arquitetura.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.4 TECNOLOGIAS E FERRAMENTAS RELACIONADAS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Análise Estática de Código (SAST) e Linters: SonarQube, ESLint, Prettier, Checkstyle, SpotBugs e CodeClimate;\n• Análise de Cobertura e Métricas: Istanbul (Jest Coverage), JaCoCo e Coveralls;\n• Automação Contínua e Portais de Qualidade (Quality Gates): GitHub Actions, GitLab CI e Jenkins.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.5 PADRÕES E NORMAS APLICÁVEIS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• ISO/IEC 25010 (SQuaRE): Estrutura a qualidade de produto em 8 características universais: Adequação Funcional, Eficiência de Desempenho, Compatibilidade, Usabilidade, Confiabilidade, Segurança, Manutenibilidade e Portabilidade.\n• CMMI (Capability Maturity Model Integration): Classifica a maturidade organizacional de processos em 5 níveis.\n• MPS.BR (Melhoria de Processo do Software Brasileiro): Iniciativa da SOFTEX dividida em 7 níveis de maturidade (do nível G ao nível A).",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.6 PROFISSÕES NO MERCADO DE TRABALHO EM TI",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Engenheiro de Confiabilidade de Sites (SRE – Site Reliability Engineer)\n• Engenheiro de Qualidade de Software (QA Lead / Quality Engineer)\n• Arquiteto de Software\n• DevOps / DevSecOps Engineer",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.7 CERTIFICAÇÕES PROFISSIONAIS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• CSQE (Certified Software Quality Engineer) – American Society for Quality (ASQ)\n• CMMI Associate e CMMI Lead Appraiser – ISACA\n• CSDP (Certified Software Development Professional) – IEEE Computer Society",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "2.8 IMPACTOS DA INTELIGÊNCIA ARTIFICIAL",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Revisão Semântica de Código com LLMs em tempo de Pull Request;\n• Análise Preditiva de Defeitos com base em code churn e complexidade;\n• Refatoração Assistida para desacoplamento de código e eliminação de code smells.",
            spacing: { after: 400 }
          }),

          // 3. TESTES DE SOFTWARE
          new Paragraph({
            text: "3 TEMA 2: TESTES DE SOFTWARE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "3.1 DEFINIÇÃO DO TEMA",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "Teste de software é a execução empírica e sistemática de um programa sob condições controladas, com o objetivo primário de revelar discrepâncias entre o comportamento esperado e o comportamento observado (MYERS et al., 2011). Estrutura-se em Verificação ('o produto está sendo construído corretamente?') e Validação ('o produto correto está sendo construído?'). Na taxonomia oficial do ISTQB (2023), distingue-se Erro (humano), Defeito/Bug (no código) e Falha (em tempo de execução).",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.2 HISTÓRICO NA ENGENHARIA DE SOFTWARE",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Anos 1950 a 1960: Depuração manual pós-codificação;\n• Anos 1970 a 1980: Glenford Myers publica 'The Art of Software Testing' (1979) e estabelece o teste como atividade destrutiva sistemática para encontrar falhas;\n• Década de 1990: Kent Beck introduz o TDD (Test-Driven Development) no Extreme Programming (BECK, 2002);\n• Anos 2000 até hoje: Consolidação da Pirâmide de Testes (COHN, 2009) e esteiras contínuas de CI/CD.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.3 IMPORTÂNCIA EM ENGENHARIA DE SOFTWARE",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Prevenção de Efeito Colateral e Regressão;\n• Feedback Imediato em segundos ao desenvolvedor;\n• Documentação Viva e Segurança Total para Refatoração.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.4 TECNOLOGIAS E FERRAMENTAS RELACIONADAS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Testes Unitários e Dublês de Teste (Mocks/Stubs): Jest, JUnit 5, PyTest, Mocha, Chai e Vitest;\n• Testes de Integração e APIs HTTP: Supertest, REST Assured e Postman/Newman;\n• Testes de Interface (UI) e Componentes: React Testing Library, Cypress, Playwright e Selenium WebDriver;\n• Testes de Carga e Desempenho: k6, Apache JMeter e Gatling.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.5 PADRÕES E NORMAS APLICÁVEIS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• ISO/IEC/IEEE 29119: norma internacional unificada para testes (Partes 1 a 5);\n• ISTQB (International Software Testing Qualifications Board): organização de referência mundial que estabelece o padrão de glossário, processos e competências na área.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.6 PROFISSÕES NO MERCADO DE TRABALHO EM TI",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• SDET (Software Development Engineer in Test)\n• Engenheiro de Automação de QA\n• Analista de Testes Funcional / Exploratório\n• Especialista em Testes de Performance e Segurança (Pentester)",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.7 CERTIFICAÇÕES PROFISSIONAIS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• ISTQB CTFL (Certified Tester Foundation Level)\n• ISTQB Níveis Avançados: CTAL-TA, CTAL-TTA e CTAL-TM\n• CSTE (Certified Software Test Engineer)",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "3.8 IMPACTOS DA INTELIGÊNCIA ARTIFICIAL",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "• Geração Autônoma de Casos de Teste cobrindo caminhos felizes, bordas e exceções;\n• Testes com Auto-Cura (Self-Healing Tests) adaptando seletores de UI em tempo de execução;\n• Fuzzing Generativo para descoberta automatizada de falhas.",
            spacing: { after: 400 }
          }),

          // 4. APLICAÇÃO PRÁTICA
          new Paragraph({
            text: "4 APLICAÇÃO PRÁTICA NO PROJETO CATCH WORD",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "4.1 VISÃO GERAL DO SISTEMA CATCH WORD",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "O Catch Word é uma solução educacional desenvolvida para possibilitar que professores elaborem caça-palavras pedagógicos personalizados, gerenciem turmas e acompanhem estatísticas de resolução dos alunos em tempo real.\n• Backend (CatchWord_back): API REST em Node.js (módulos ES), Express, Prisma ORM e PostgreSQL;\n• Frontend (CatchWord_front): SPA desenvolvida em React 18, React Router v6 e CSS modular.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "4.2 QUALIDADE NA PRÁTICA: REFATORAÇÃO EM CAMADAS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "Na versão original, o sistema continha o anti-padrão dos controladores sobrecarregados (Fat Controllers). A aplicação foi refatorada aplicando o princípio de Separação de Preocupações (SoC) em quatro camadas desacopladas:\n1. Middlewares: Autenticação JWT e RBAC;\n2. Controllers: Adaptadores HTTP puros;\n3. Services: Regras de Negócio Puras, Cálculos Matriciais e Lançamento de ServiceError;\n4. Repositories: Isolamento do Banco de Dados / Prisma ORM.",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "4.3 TESTES NA PRÁTICA: PIRÂMIDE DE TESTES IMPLEMENTADA",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "1. Testes Unitários (Backend – Jest): Padrão AAA (Arrange, Act, Assert), Análise de Valores Limite (dimensões de 5x5 a 30x30) e Particionamento por Equivalência;\n2. Testes de Integração (Backend – Supertest): Instanciação em memória para testar rotas autenticadas sob JWT e públicas;\n3. Testes de Componentes (Frontend – React Testing Library): Validação de formulários controlados, banners de erro e proteção de rotas privadas (PrivateRoute).",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "4.4 COBERTURA DE CÓDIGO E MÉTRICAS OBTIDAS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "Métricas Consolidadas no Backend:\n• src/services/ (Regras de Negócio): 100% Instruções, 100% Branches, 100% Funções, 100% Linhas;\n• src/controllers/ (Adaptadores HTTP): 100% Instruções, 100% Branches, 100% Funções, 100% Linhas;\n• src/routes/ (Roteadores Express): 100% Instruções, 100% Branches, 100% Funções, 100% Linhas;\n• Total Geral do Backend: 94,46% Instruções, 97,75% Branches, 73,38% Funções, 94,29% Linhas.\nTotal de Testes do Sistema: 282 testes automatizados aprovados (269 backend + 13 frontend).",
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "4.5 PIPELINE DE INTEGRAÇÃO CONTÍNUA (CI/CD)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: "Configurou-se esteira no GitHub Actions (.github/workflows/ci.yml) que, a cada push ou pull request na branch main, executa instalação limpa, roda todos os testes e valida a cobertura de código de forma autônoma.",
            spacing: { after: 400 }
          }),

          // 5. ROTEIRO DE APRESENTAÇÃO
          new Paragraph({
            text: "5 ROTEIRO PARA APRESENTAÇÃO EM SALA DE AULA",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "Divisão do Tempo de Apresentação (15 a 20 minutos):\n1. Abertura e Qualidade (4 min) – Apresentador: Samir Jaber;\n2. Testes de Software (4 min) – Apresentador: Isaac João;\n3. Demonstração: Refatoração (4 min) – Apresentador: Rian Quintanilha;\n4. Demonstração: Testes e CI (4 min) – Apresentador: Gabriel Gribel;\n5. Conclusão e Dúvidas (2 min) – Apresentadores: Todos.",
            spacing: { after: 400 }
          }),

          // 6. CONCLUSÃO
          new Paragraph({
            text: "6 CONCLUSÃO",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "A elaboração deste trabalho permitiu consolidar a compreensão teórica e prática de que Qualidade de Software e Testes de Software são disciplinas basilares que devem nortear o desenvolvimento de software profissional desde os seus primeiros passos. A refatoração arquitetural aplicada ao projeto Catch Word comprovou na prática que um design modular em três camadas elimina acoplamentos desnecessários e viabiliza suítes de testes determinísticas e de rápida execução.",
            spacing: { after: 400 }
          }),

          // REFERÊNCIAS
          new Paragraph({
            text: "REFERÊNCIAS",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "BECK, K. Test-driven development: by example. Boston: Addison-Wesley, 2002.\n\nCOHN, M. Succeeding with agile: software development using Scrum. Boston: Addison-Wesley Professional, 2009.\n\nISO/IEC. ISO/IEC 25010: Systems and software engineering -- SQuaRE. Genebra: ISO, 2011.\n\nISO/IEC/IEEE. ISO/IEC/IEEE 29119: Software and systems engineering -- Software testing. Genebra: ISO, 2013.\n\nISTQB. Certified Tester Foundation Level (CTFL) Syllabus v4.0. ISTQB, 2023.\n\nMARTIN, R. C. Clean code: a handbook of agile software craftsmanship. Prentice Hall, 2008.\n\nMCCABE, T. J. A Complexity Measure. IEEE Transactions on Software Engineering, 1976.\n\nMYERS, G. J. et al. The art of software testing. 3. ed. John Wiley & Sons, 2011.\n\nPRESSMAN, R. S.; MAXIM, B. R. Engenharia de software: uma abordagem profissional. 9. ed. McGraw-Hill, 2021.\n\nSOMMERVILLE, I. Engenharia de software. 10. ed. Pearson, 2019.",
            spacing: { after: 200 }
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, 'Documento_Teorico_Engenharia_Software_UFJF.docx'), buffer);
  console.log('DOCX gerado com sucesso!');
}

generateDocx();
