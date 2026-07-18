import {
  rotaruralBanner,
  rotaruralHome,
  rotaruralMapa,
  rotaruralNovoRelato,
  rotaruralGestaoPainel,
  rotaruralReputacao,
  rotaruralGestaoGraficos,
  rotaruralGestaoDesempenho,
  rotaruralGestaoEquipe,
  rotaruralVoz,
  rotaruralLogo,
  kiusevenHero,
  kiusevenLogo,
  wkcodeHero,
  bonaireLogin,
  bonaireMenu,
  bonaireLogo,
  netmanagerDashboard,
  netmanagerLogin,
  edsaasLogin,
} from "@/assets/projects";

export type ProjectStatus = "Em produção" | "Em desenvolvimento" | "Concluído" | "Protótipo";

export type ProjectTheme =
  | "topography"
  | "route"
  | "garage"
  | "grid"
  | "diner"
  | "signal"
  | "aurora"
  | "solar"
  | "shield";

export interface TeamMember {
  name: string;
  role: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface StackGroup {
  area: string;
  items: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  isPrivateRepo?: boolean;
  role: string;
  team?: TeamMember[];
  theme: ProjectTheme;
  image?: string;
  /** Brand logo shown on the project tab (currently Kiuseven). */
  brandLogo?: string;
  gallery?: string[];
  extraLinks?: ProjectLink[];
  disclaimer?: string;
  caseStudy: {
    overview: string;
    problem: string;
    solution: string;
    architecture: string;
    stackDetail: StackGroup[];
    highlights: string[];
    challenges: string;
    results: string;
    learnings: string;
  };
}

export const projects: Project[] = [
  {
    slug: "rotarural",
    title: "RotaRural",
    tagline: "Plataforma preditiva de trafegabilidade para estradas rurais, construída em 48h de hackathon.",
    year: "2026",
    status: "Protótipo",
    featured: true,
    tech: ["Flutter", "FastAPI", "PostgreSQL", "PostGIS", "Riverpod", "Docker Compose", "MinIO"],
    githubUrl: "https://github.com/PolarIF/RotaRural",
    role: "Inteligência de Negócio — risco, reputação e manutenções",
    team: [
      { name: "Felipe", role: "Engenharia Geográfica — PostGIS, motor espacial" },
      { name: "Kauan", role: "Backend Core — API, autenticação, relatos e notificações" },
      { name: "Wellyson Caetano", role: "Inteligência de Negócio — risco, reputação e manutenções" },
      { name: "Julio César", role: "Aplicativo Flutter" },
    ],
    theme: "topography",
    image: rotaruralBanner,
    brandLogo: rotaruralLogo,
    gallery: [
      rotaruralHome,
      rotaruralMapa,
      rotaruralNovoRelato,
      rotaruralGestaoPainel,
      rotaruralReputacao,
      rotaruralGestaoGraficos,
      rotaruralGestaoDesempenho,
      rotaruralGestaoEquipe,
      rotaruralVoz,
    ],
    extraLinks: [{ label: "Vídeo pitch", url: "https://youtu.be/w5QK_uUqE5Q" }],
    caseStudy: {
      overview:
        "Nas linhas rurais de Ariquemes (RO), a trafegabilidade muda com uma chuva forte: atoleiros, bueiros quebrados, rios que sobem — e quem sente o problema primeiro é quem depende da estrada, não a prefeitura. O RotaRural nasceu no Hackathon Extensionista IFRO Ariquemes 2026 para transformar relatos da comunidade e dados do território em um score de risco por trecho, explicável e auditável, funcionando mesmo sem sinal de internet.",
      problem:
        "Gestores públicos não sabem onde investir manutenção primeiro, e quem trafega pela estrada descobre o bloqueio já em cima dele. Soluções de previsão de risco costumam usar machine learning como caixa-preta — difícil de auditar e de justificar para uma prefeitura com orçamento limitado. E boa parte da área de cobertura simplesmente não tem internet.",
      solution:
        "Duas experiências sobre a mesma base de dados: um app para o cidadão relatar problemas (com foto e GPS, mesmo offline) e consultar o risco perto dele, e um painel para a prefeitura priorizar onde agir e registrar manutenções. Em vez de um modelo de ML opaco, o RotaRural usa 'Inteligência Territorial': um score de 0 a 100 somado a partir de fatores interpretáveis — condição estrutural da via, chuva das últimas 24h, relatos recentes ponderados pela reputação de quem relatou, e abatimento por manutenção recente. Toda resposta da API retorna os fatores que compõem o score.",
      architecture:
        "Flutter (MVVM + Feature-First, Riverpod, GoRouter, cache offline com Hive + FMTC) fala com uma API FastAPI (SQLAlchemy, Alembic, JWT), que persiste em PostgreSQL com extensão PostGIS para os cálculos espaciais (OSMnx, GeoPandas, Shapely). Fotos dos relatos vão para MinIO/S3. O backend roda em Docker Compose, com migrações aplicadas automaticamente no boot.",
      stackDetail: [
        { area: "Mobile", items: ["Flutter", "Riverpod", "GoRouter", "Dio", "Freezed", "flutter_map", "Hive + FMTC (cache offline)"] },
        { area: "Backend", items: ["FastAPI", "SQLAlchemy", "Alembic", "Pydantic", "JWT", "OSMnx / GeoPandas / Shapely"] },
        { area: "Dados & Infra", items: ["PostgreSQL + PostGIS", "MinIO/S3", "Open-Meteo API", "Docker Compose"] },
      ],
      highlights: [
        "Score de risco 100% explicável: cada resposta da API detalha os fatores que somam o resultado, sem caixa-preta de ML",
        "Correlação espacial — um relato de enchente propaga risco para outros trechos do mesmo rio e avisa quem está rio abaixo",
        "Peso por reputação: relatos de autores validados pela comunidade pesam mais que relatos não verificados",
        "Offline-first de verdade: mapa em cache, fila local de relatos/fotos/votos, sincronização automática quando a conexão volta",
      ],
      challenges:
        "O maior desafio não foi técnico, foi de modelagem de confiança: como ponderar um relato sem excluir quem mora na zona rural, sem sinal, sem histórico de app. A equipe optou por reputação incremental por votos da comunidade em vez de um sistema binário de confiança, e por manter o cálculo somável e auditável em vez de treinar um modelo — decisão que também acelerou a entrega dentro da janela de 48h do hackathon.",
      results:
        "MVP funcional entregue dentro do prazo do Hackathon Extensionista IFRO Ariquemes 2026, com app Flutter operacional offline, painel web para a prefeitura e API documentada, avaliado pela banca do evento.",
      learnings:
        "Ficou claro em campo o valor de arquitetar para ausência de rede desde o primeiro commit — retrofitar offline-first depois é ordens de magnitude mais caro do que planejar para isso desde a modelagem dos dados.",
    },
  },
  {
    slug: "netmanager",
    title: "NetManager",
    tagline: "Plataforma em nuvem para provedores de internet: campo, estoque e frota (TCO) em um só sistema.",
    year: "2026",
    status: "Em desenvolvimento",
    featured: true,
    tech: ["React", "React Native", "Node.js", "NestJS", "PostgreSQL", "TypeScript"],
    demoUrl: "https://net-manager-five.vercel.app",
    isPrivateRepo: true,
    role: "Solo",
    theme: "garage",
    image: netmanagerDashboard,
    gallery: [netmanagerDashboard, netmanagerLogin],
    caseStudy: {
      overview:
        "Provedores de internet regionais operam com uma mistura de planilhas, grupos de WhatsApp e processos manuais para controlar técnicos em campo, estoque de equipamentos e a frota de veículos usada nas instalações. O NetManager centraliza essas três frentes — operação de campo, estoque e frota — em uma única plataforma, com dados em tempo real para quem gerencia.",
      problem:
        "Sem visibilidade unificada, o gestor de um ISP toma decisões às cegas: não sabe quanto cada veículo realmente custa (TCO), aprova reembolsos sem comprovante centralizado, e descobre falta de material só quando o técnico já está na rua.",
      solution:
        "Dois módulos conectados pela mesma base: um app mobile offline-first para o técnico (autenticação Zero Trust, formulários rápidos de abastecimento e serviços, solicitação de materiais) e um painel web para o gestor (dashboard em tempo real, aprovações em Kanban, estoque com baixa automática, e gestão de frota com análise de TCO — consumo, anomalias, custo total por veículo, alertas de IPVA/seguro/manutenção por quilometragem).",
      architecture:
        "Frontend web em React e app mobile em React Native compartilhando contratos de API com um backend Node.js/NestJS, persistindo em PostgreSQL. O app mobile funciona offline e sincroniza automaticamente quando a conexão volta, para não travar o técnico em campo sem sinal.",
      stackDetail: [
        { area: "Frontend Web", items: ["React", "TypeScript"] },
        { area: "Mobile", items: ["React Native", "Sincronização offline-first"] },
        { area: "Backend", items: ["Node.js", "NestJS", "PostgreSQL", "PL/pgSQL"] },
        { area: "Infra", items: ["Deploy contínuo (Vercel)", "Arquitetura pensada para AWS/Azure/GCP"] },
      ],
      highlights: [
        "Controle de TCO por veículo: consumo (km/L), detecção de anomalias e custo total, não só quilometragem",
        "Aprovações de despesas em Kanban com baixa automática de estoque ao aprovar a saída",
        "Zero Trust no app do técnico: cada usuário só acessa seus próprios dados e tarefas",
        "Offline-first no mobile, com fila de sincronização automática",
      ],
      challenges:
        "Modelar TCO de frota de forma que fizesse sentido para um ISP pequeno, sem virar um ERP genérico de frota que ninguém usa. A resposta foi amarrar o custo do veículo à operação real (abastecimento por técnico, uso diário, manutenção por km) em vez de importar um módulo de frota desacoplado do dia a dia do provedor.",
      results:
        "Em desenvolvimento ativo, com deploy contínuo em produção (mais de 90 deployments até agora) e ambiente de demonstração publicado.",
      learnings:
        "Desenhar o módulo do técnico offline-first desde o início evitou o retrabalho de reescrever a camada de sincronização depois — a mesma lição do RotaRural, em um domínio completamente diferente.",
    },
  },
  {
    slug: "bonaire-delivery",
    title: "Bonaire Delivery",
    tagline: "Plataforma completa de gestão para o Restaurante Bonaire — cardápio digital, pedidos, estoque e financeiro.",
    year: "2026",
    status: "Em produção",
    featured: true,
    tech: ["Flask", "SQLAlchemy", "PostgreSQL", "Bootstrap 5", "Chart.js", "Mercado Pago", "Cloudinary"],
    demoUrl: "https://bonaire-delivery.onrender.com",
    isPrivateRepo: true,
    role: "Solo",
    theme: "diner",
    image: bonaireMenu,
    brandLogo: bonaireLogo,
    gallery: [bonaireMenu, bonaireLogin],
    caseStudy: {
      overview:
        "O Restaurante Bonaire opera em Ariquemes (RO) desde 2001, vendendo prato feito e marmitex no balcão e por delivery via WhatsApp. O Bonaire Delivery substitui esse fluxo manual por uma plataforma própria: cardápio digital público integrado ao WhatsApp e um painel administrativo completo para o dono gerenciar pedidos, estoque e financeiro.",
      problem:
        "Pedido por WhatsApp sem sistema significa sem histórico de cliente, sem controle de estoque em tempo real, sem visão de fluxo de caixa, e nenhuma forma de saber o que mais vende sem abrir o caderno. Para um restaurante que atende presencial e delivery ao mesmo tempo, esse controle manual não escala.",
      solution:
        "Cardápio digital público com busca, categorias e botão 'Pedir' que abre o WhatsApp já com a mensagem pronta — e por trás dele, um painel administrativo completo: pedidos em Kanban, controle de estoque com alerta de nível mínimo, módulo financeiro com fluxo de caixa diário/mensal/anual, relatórios em PDF/Excel, e controle de acesso por cargo (Admin/Gerente/Funcionário).",
      architecture:
        "Aplicação Flask com arquitetura em blueprints (auth, dashboard, produtos, categorias, pedidos, clientes, financeiro, estoque, configurações, público, relatórios), SQLAlchemy sobre SQLite em desenvolvimento e PostgreSQL em produção, deploy no Render com upload de imagens migrado para Cloudinary (disco do Render é efêmero) e checkout online via Mercado Pago (Checkout Pro) como opção além do pagamento na entrega.",
      stackDetail: [
        { area: "Backend", items: ["Flask", "SQLAlchemy", "Flask-Login", "Flask-WTF"] },
        { area: "Frontend", items: ["Bootstrap 5", "Chart.js", "Jinja2"] },
        { area: "Dados", items: ["SQLite (dev)", "PostgreSQL (prod)"] },
        { area: "Integrações", items: ["Mercado Pago (Checkout Pro)", "Cloudinary (imagens)", "WhatsApp"] },
        { area: "Infra", items: ["Render", "Gunicorn"] },
      ],
      highlights: [
        "Cardápio real do restaurante publicado (14 produtos, preços reais) com pedido direto pelo WhatsApp",
        "Checkout Pro do Mercado Pago integrado como opção de pagamento online, com fallback automático para pagamento na entrega se o gateway falhar",
        "Hardening OWASP aplicado deliberadamente: headers de segurança, auditoria de upload, validação e logs",
        "Financeiro completo (entradas, saídas, fluxo de caixa) e relatórios exportáveis em PDF e Excel",
      ],
      challenges:
        "Rodar em uma plataforma com disco efêmero (Render) sem perder as fotos de produto enviadas pelo painel — resolvido com suporte a Cloudinary que ativa automaticamente quando a variável de ambiente está configurada, sem exigir mudança de código entre dev e produção.",
      results:
        "Sistema em produção no Render, com o cardápio real do Restaurante Bonaire publicado e o banco de dados populado com os produtos e preços reais do negócio.",
      learnings:
        "Documentar o estado do projeto — o que já está pronto, o que falta, credenciais pendentes — em um arquivo dedicado economizou retrabalho toda vez que o desenvolvimento foi retomado.",
    },
  },
  {
    slug: "barberpro",
    title: "BarberPro",
    tagline: "Micro-SaaS multi-tenant de gestão para barbearias, com segurança levada a sério.",
    year: "2026",
    status: "Concluído",
    featured: false,
    tech: ["Flask", "SQLAlchemy", "PostgreSQL", "Tailwind CSS", "Chart.js", "Docker", "Gunicorn"],
    githubUrl: "https://github.com/walloncode/Saas-BarberPro",
    role: "Solo",
    theme: "grid",
    caseStudy: {
      overview:
        "BarberPro é um sistema completo de gestão para barbearias — agendamentos, clientes, barbeiros, serviços e pagamentos — desenhado para atender múltiplos negócios na mesma base de dados, cada um isolado do outro.",
      problem:
        "Barbearias pequenas normalmente gerenciam agenda por WhatsApp e caderno. Um sistema multi-tenant real precisa resolver isolamento de dados entre estabelecimentos diferentes, autenticação segura e proteção contra abuso — sem virar caro ou complexo demais para o público-alvo.",
      solution:
        "Backend em Flask 3 com SQLAlchemy e Flask-Login, front-end server-rendered com Jinja2 + Tailwind + Chart.js para os dashboards, e uma API REST para agendamentos e clientes. Todo dado sensível de negócio carrega um barber_shop_id, garantindo isolamento multi-tenant em nível de query.",
      architecture:
        "Arquitetura em camadas dentro de uma factory Flask (create_app): models (SQLAlchemy), routes (blueprints/controllers), services (regras de negócio) e utils (segurança e helpers). Deploy via Gunicorn atrás de Docker Compose, com SQLite para desenvolvimento local sem fricção e PostgreSQL em produção.",
      stackDetail: [
        { area: "Backend", items: ["Flask 3", "SQLAlchemy", "Flask-Login", "bcrypt (werkzeug)"] },
        { area: "Frontend", items: ["Jinja2", "Tailwind CSS", "Chart.js"] },
        { area: "Dados", items: ["SQLite (dev)", "PostgreSQL (prod)"] },
        { area: "Infra & Testes", items: ["Docker + Docker Compose", "Gunicorn", "pytest"] },
      ],
      highlights: [
        "Isolamento multi-tenant real via barber_shop_id em todas as tabelas de negócio, não só um filtro na tela",
        "Bloqueio automático após 5 tentativas de login — proteção contra brute-force",
        "Headers de segurança configurados manualmente (CSP, X-Frame-Options, X-XSS-Protection)",
        "Suíte de testes cobrindo o fluxo de agendamentos",
      ],
      challenges:
        "Garantir isolamento multi-tenant sem espalhar checagens de barber_shop_id por todo o código — a solução foi centralizar esse filtro na camada de services, então cada rota nova herda o isolamento por padrão em vez de precisar lembrar de aplicá-lo.",
      results:
        "Sistema funcional de ponta a ponta: login, agendamentos, estoque de clientes/barbeiros/serviços e dashboard com gráficos, rodando tanto localmente via SQLite quanto em produção via Docker + PostgreSQL.",
      learnings:
        "Tratar segurança (brute-force, headers, isolamento de tenant) como parte do escopo inicial, não como um adendo, evitou retrabalho estrutural mais tarde.",
    },
  },
  {
    slug: "pulseid",
    title: "PulseID",
    tagline: "Sistema de identificação por RFID — leitura de cartões integrada a uma interface de gestão de identidades.",
    year: "2025",
    status: "Protótipo",
    featured: false,
    tech: ["RFID", "Integração de hardware", "Python"],
    role: "Solo",
    theme: "signal",
    caseStudy: {
      overview:
        "PulseID é um sistema de identificação baseado em RFID: cartões são lidos por um leitor conectado ao computador e reconhecidos por uma aplicação que gerencia as identidades e registra as leituras. Foi o projeto em que Wellyson saiu do software puro para a integração com hardware.",
      problem:
        "Controlar identificação por cartão exige unir duas camadas que raramente conversam bem: a leitura física do RFID — sujeita a ruído, leituras repetidas e timing do leitor — e a lógica de negócio que decide o que cada identidade representa.",
      solution:
        "Uma aplicação que fala com o leitor RFID, traduz cada cartão lido em uma identidade cadastrada e expõe uma interface para gerenciar cartões, pessoas e o histórico de leituras — mantendo a camada de hardware separada da lógica de identificação.",
      architecture:
        "Leitor RFID conectado à máquina, uma camada que captura os eventos do dispositivo e normaliza as leituras, e uma aplicação com interface e persistência para o cadastro de identidades e o registro de cada leitura.",
      stackDetail: [
        { area: "Hardware", items: ["Leitor RFID", "Cartões RFID"] },
        { area: "Software", items: ["Interface de gestão", "Lógica de identificação"] },
        { area: "Dados", items: ["Cadastro de identidades", "Histórico de leituras"] },
      ],
      highlights: [
        "Primeiro projeto integrando software e hardware, saindo da tela para o dispositivo físico",
        "Separação clara entre a camada de leitura RFID e a lógica de identificação",
        "Cadastro de identidades com histórico de cada leitura registrada",
      ],
      challenges:
        "Lidar com a imprevisibilidade do hardware — leituras repetidas, ruído e timing do leitor — sem deixar isso vazar para a lógica de identificação foi o principal aprendizado do projeto.",
      results:
        "Protótipo demonstrando o fluxo completo: aproximar o cartão, reconhecer a identidade cadastrada e registrar a leitura.",
      learnings:
        "Integrar hardware ensina a projetar tolerância a falha desde o começo — o mundo físico não entrega eventos limpos como uma API.",
    },
  },
  {
    slug: "edsaas",
    title: "EdSaaS",
    tagline: "Plataforma educacional com correção automática e mapeamento das respostas às competências da BNCC via IA.",
    year: "2025",
    status: "Em desenvolvimento",
    featured: false,
    tech: ["Python", "OpenCV", "IA aplicada", "Leitura de PDF"],
    role: "Solo",
    theme: "grid",
    image: edsaasLogin,
    gallery: [edsaasLogin],
    caseStudy: {
      overview:
        "EdSaaS é uma plataforma educacional pensada para automatizar a correção de avaliações e relacionar cada resposta às competências da BNCC, usando visão computacional para ler as provas e IA para analisar o conteúdo.",
      problem:
        "Correção manual de avaliações consome o tempo do professor e raramente conecta o desempenho do aluno às competências da BNCC de forma estruturada — o dado existe, mas não vira diagnóstico.",
      solution:
        "Um fluxo que lê as provas (inclusive PDFs digitalizados) com visão computacional, corrige automaticamente e usa IA para mapear cada resposta às competências correspondentes da BNCC, gerando relatórios de desempenho por aluno e por competência.",
      architecture:
        "Pipeline de leitura com OpenCV para extrair as respostas das provas, uma camada de IA para analisar e classificar o conteúdo por competência da BNCC, e uma camada de relatórios que consolida o desempenho.",
      stackDetail: [
        { area: "Visão computacional", items: ["OpenCV", "Leitura de PDF"] },
        { area: "IA", items: ["Análise de respostas", "Mapeamento à BNCC"] },
        { area: "Backend", items: ["Python", "Automação de correção"] },
        { area: "Saída", items: ["Relatórios por aluno e por competência"] },
      ],
      highlights: [
        "Correção automática de avaliações a partir de provas digitalizadas",
        "Mapeamento das respostas às competências da BNCC via IA",
        "Leitura de PDF e visão computacional (OpenCV) para extrair as respostas",
        "Relatórios de desempenho por aluno e por competência",
      ],
      challenges:
        "O desafio central é confiar na automação sem abrir mão da revisão do professor: correção e classificação por IA precisam ser auditáveis, não uma caixa-preta que atribui competências sem explicar o porquê.",
      results:
        "Em desenvolvimento, com o escopo definido em torno de leitura de provas, correção automática e mapeamento à BNCC.",
      learnings:
        "Educação é um domínio onde IA opaca não serve: o valor está em explicar por que uma resposta mapeia para uma competência, não só em automatizar a nota.",
    },
  },
  {
    slug: "agente-ixc",
    title: "Agente IXC",
    tagline: "Automação determinística do fluxo de NF-e no IXC — regras primeiro, IA só para exceções.",
    year: "2026",
    status: "Em desenvolvimento",
    featured: true,
    tech: ["Python", "FastAPI", "Playwright", "Pydantic", "SQLite", "Loguru"],
    githubUrl: "https://github.com/walloncode/bot-ixc",
    role: "Solo",
    theme: "signal",
    caseStudy: {
      overview:
        "O Agente IXC automatiza o fluxo de emissão de nota fiscal eletrônica (NF-e) dentro da plataforma de gestão IXC, usada por provedores de internet, substituindo um processo manual e repetitivo por um agente supervisionado.",
      problem:
        "Automação de UI legada (sem API oficial para o fluxo) tende a quebrar silenciosamente ou, pior, tomar decisões erradas com confiança quando encontra algo inesperado na tela. O risco real não é o agente ser lento — é ele agir errado sem ninguém perceber.",
      solution:
        "A decisão de arquitetura central: 80% do fluxo é regra fixa determinística, e os 20% restantes — exceções que uma regra não previu — passam por um gate de confiança de IA. Se a IA não está confiante o suficiente, o agente para e pede intervenção humana em vez de arriscar uma ação errada. Previsibilidade deliberadamente colocada acima de 'inteligência'.",
      architecture:
        "Loop de estados percebe → decide → age → reavalia, orquestrado por um brain que sempre reavalia o estado antes de executar a próxima ação. agent/state.py mantém uma máquina de estados tipada em Pydantic; automation/ executa via Playwright como driver principal, com PyAutoGUI, OpenCV e Tesseract como fallback para quando a página não expõe seletores confiáveis; business_rules/ traduz um documento vivo (regras.md) em regras puras, sem IA; um painel FastAPI expõe start/stop/status.",
      stackDetail: [
        { area: "Orquestração", items: ["Python", "Pydantic (máquina de estados)", "Loop percebe-decide-age-reavalia"] },
        { area: "Automação de UI", items: ["Playwright (principal)", "PyAutoGUI + OpenCV + Tesseract (fallback visual)"] },
        { area: "IA", items: ["Gate de confiança — IA decide só as exceções, nunca a regra"] },
        { area: "Observabilidade", items: ["SQLite (log de decisões/erros)", "Loguru", "FastAPI (painel start/stop/status)"] },
      ],
      highlights: [
        "Filosofia declarada e aplicada no código: '80% regras fixas + 20% IA, só exceções' — não é uma frase de README, é o fluxo real de decisão",
        "Nunca encadeia ações às cegas: reavalia o estado da tela antes de cada ação, uma de cada vez",
        "Fallback de visão computacional (OpenCV + Tesseract) quando a automação estrutural via Playwright não é confiável",
        "Trava de segurança explícita: seletores não confirmados fazem o agente parar e pedir intervenção humana em vez de adivinhar a tela",
      ],
      challenges:
        "Decidir onde termina 'regra' e começa 'exceção que a IA pode resolver' é o problema real desse tipo de agente. A resposta foi documentar as regras de negócio como fonte da verdade (regras.md) separada do código, para que a fronteira entre determinismo e IA fosse uma decisão explícita e revisável, não implícita no meio da automação.",
      results:
        "Arquitetura e loop de decisão implementados e testados (pytest); o fluxo aguarda o preenchimento dos seletores reais de produção antes de operar em ambiente real — por design, o agente se recusa a rodar contra a tela do IXC sem essa confirmação.",
      learnings:
        "Automação de UI legada empresarial é mais um problema de gestão de confiança do que de scripting — vale mais investir na trava que impede o agente de errar do que na cobertura de casos que ele consegue 'resolver sozinho'.",
    },
  },
  {
    slug: "wkcode",
    title: "WKCODE",
    tagline: "Agência própria de desenvolvimento web, com prazo, clareza e foco em resultado.",
    year: "2026",
    status: "Em produção",
    featured: false,
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/walloncode/WKcode-LandingPage",
    demoUrl: "https://wkcode.com.br",
    role: "Solo — fundador",
    theme: "aurora",
    image: wkcodeHero,
    caseStudy: {
      overview:
        "WKCODE é a marca própria através da qual Wellyson entrega sites institucionais, landing pages, e-commerces e sistemas web sob medida, com prazo de entrega fixo de até 15 dias e comunicação transparente em cada etapa.",
      problem:
        "Pequenas empresas que precisam de presença digital geralmente enfrentam prazos incertos e escopo que muda no meio do projeto. O WKCODE nasceu para resolver isso com um processo estruturado, do briefing à entrega.",
      solution:
        "Site institucional construído em Next.js com foco em performance e SEO, apresentando os cinco serviços da agência (institucional, landing page, e-commerce, portfólio, sistema web sob medida), processo de trabalho em 4 etapas, portfólio de entregas e modelo de investimento com pagamento dividido 50/50.",
      architecture:
        "Next.js com App Router, TypeScript e Tailwind CSS, animações pontuais com Framer Motion, otimizado mobile-first e para SEO.",
      stackDetail: [
        { area: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
        { area: "Deploy", items: ["Vercel"] },
      ],
      highlights: [
        "Processo de entrega formalizado em 4 etapas, com prazo máximo de 15 dias por projeto",
        "Modelo de pagamento 50/50 e 2 semanas de suporte pós-entrega documentados publicamente",
        "Portfólio real com clientes entregues, incluindo a Kiuseven Energia Solar",
      ],
      challenges:
        "Construir a própria vitrine com o mesmo padrão de qualidade que promete entregar para clientes — o site precisa provar a proposta de valor só de ser visitado.",
      results:
        "No ar em produção, com portfólio de projetos entregues e canal de contato ativo via WhatsApp.",
      learnings:
        "Ter uma agência própria disciplinou o processo de entrega — prazo e escopo fixos deixaram de ser 'boas intenções' e viraram parte do produto.",
    },
  },
  {
    slug: "kiuseven",
    title: "Kiuseven Energia Solar",
    tagline: "Site institucional com calculadora de economia para uma empresa de energia solar em Rondônia.",
    year: "2026",
    status: "Em produção",
    featured: false,
    tech: ["WordPress", "JavaScript", "WhatsApp API"],
    demoUrl: "https://www.kiuseven.com.br",
    role: "Entrega via WKCODE",
    theme: "solar",
    image: kiusevenHero,
    brandLogo: kiusevenLogo,
    caseStudy: {
      overview:
        "Kiuseven é uma empresa de energia solar de Rondônia, com instalações residenciais, comerciais e rurais. O site entregue pela WKCODE precisava converter interesse em economia de energia em contato qualificado — não só 'ter uma página'.",
      problem:
        "Empresas de energia solar competem vendendo um benefício abstrato (economia futura). Sem uma forma concreta de o visitante visualizar o próprio retorno, a conversão de visita em lead é baixa.",
      solution:
        "Calculadora de economia interativa como peça central do site, projetando economia anual, retorno do investimento e projeção de 25 anos a partir dos dados do próprio visitante, além de galeria de instalações reais (11 a 68 painéis), depoimentos de clientes e contato direto via WhatsApp.",
      architecture:
        "Site institucional em WordPress com responsividade completa, calculadora embutida e integração de contato via WhatsApp — escolha deliberada de stack para um cliente que precisa editar conteúdo (depoimentos, galeria) sem depender de deploy técnico.",
      stackDetail: [
        { area: "Plataforma", items: ["WordPress"] },
        { area: "Funcionalidades", items: ["Calculadora de economia interativa", "Integração WhatsApp", "Galeria de instalações"] },
      ],
      highlights: [
        "Calculadora de economia como ferramenta de conversão, não decoração",
        "Negócio real em operação, com instalações de 11 a 68 painéis fotovoltaicos documentadas",
        "Editorial pensado para o cliente manter o conteúdo sozinho depois da entrega",
      ],
      challenges:
        "Escolher WordPress em vez do stack padrão da WKCODE (Next.js) foi uma decisão deliberada: o cliente precisava de autonomia editorial contínua mais do que da performance extra de um stack headless.",
      results:
        "Site em produção, usado ativamente pela Kiuseven para captar leads via calculadora e WhatsApp.",
      learnings:
        "Nem todo projeto pede o stack 'mais moderno' — pede o stack certo para quem vai operar o site depois da entrega.",
    },
  },
  {
    slug: "phishing-awareness",
    title: "Simulação de Phishing — Conscientização em Segurança",
    tagline: "Simulação acadêmica de phishing para medir e ensinar atenção a golpes digitais.",
    year: "2025",
    status: "Concluído",
    featured: false,
    tech: ["Python", "Flask", "Tailwind CSS", "PythonAnywhere"],
    githubUrl: "https://github.com/walloncode/Pishing-trab",
    role: "Solo — trabalho acadêmico",
    theme: "shield",
    disclaimer:
      "Projeto exclusivamente educacional e autorizado, desenvolvido para a disciplina de Segurança da Informação. Coletava apenas informações não sensíveis para fins estatísticos, sem reutilização de credenciais reais, e redirecionava para uma tela explicando a simulação. Fora de ambientes autorizados e controlados, técnicas de phishing são ilegais e antiéticas — este projeto existe apenas como demonstração acadêmica.",
    caseStudy: {
      overview:
        "Projeto acadêmico para a disciplina de Segurança da Informação no IFRO, simulando uma campanha de phishing (acesso Wi-Fi institucional falso) para demonstrar, na prática, como a engenharia social explora páginas de login aparentemente legítimas.",
      problem:
        "Treinamentos de conscientização em segurança costumam ser teóricos e pouco memoráveis. Medir o comportamento real de usuários diante de uma página de login falsa ensina mais do que uma palestra.",
      solution:
        "Página de login clonando visualmente um portal de autenticação Wi-Fi comum, servida via Flask, coletando apenas estatísticas de interação, e redirecionando para uma tela explicativa que revela a simulação e ensina os sinais de um golpe de phishing.",
      architecture:
        "Aplicação Flask simples com front-end em Tailwind CSS, hospedada no PythonAnywhere durante o período do estudo.",
      stackDetail: [
        { area: "Backend", items: ["Python", "Flask"] },
        { area: "Frontend", items: ["Tailwind CSS"] },
        { area: "Hospedagem", items: ["PythonAnywhere"] },
      ],
      highlights: [
        "Interface visualmente convincente o suficiente para gerar dados reais de comportamento",
        "Redirecionamento educativo pós-interação, revelando a simulação e ensinando os sinais de alerta",
        "Escopo de coleta deliberadamente limitado a estatísticas, sem reaproveitar nenhuma informação sensível",
      ],
      challenges:
        "O maior desafio não foi técnico — foi ético: desenhar um experimento que gerasse dados de comportamento realistas sem cruzar a linha de coletar ou expor qualquer informação sensível dos participantes.",
      results:
        "Simulação conduzida dentro do escopo autorizado da disciplina, gerando dados estatísticos sobre a atenção de usuários a páginas de autenticação falsas.",
      learnings:
        "Entender phishing construindo um, em ambiente controlado, ensina mais sobre os sinais de alerta do que só estudar a teoria — e reforça por que interfaces de autenticação legítimas precisam ser desenhadas para reduzir esse tipo de confusão.",
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const secondaryProjects = projects.filter((p) => !p.featured);

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
