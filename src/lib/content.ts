export interface ServiceItem {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  formatNote: string;
  image: string;
  imageAlt: string;
}

export interface SectorItem {
  id: string;
  title: string;
  description: string;
  highlight: string;
  variant: "photo" | "contrast" | "elevated" | "card" | "bordered";
}

export interface ProcessStage {
  title: string;
  detail: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const BRAND = {
  name: "Libras Plus",
  subtitle: "Tradução e Interpretação",
  city: "São Carlos - SP",
  instagramHandle: "@libras.plus",
  instagramUrl: "https://www.instagram.com/libras.plus/",
  linktreeUrl: "https://linktr.ee/libras.plus",
  primaryCta: "Solicitar orçamento",
  secondaryCta: "Conhecer serviços",
} as const;

export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Atuação", href: "/atuacao" },
  { label: "Sobre", href: "/sobre" },
] as const;

export const TRUST_PILLARS = [
  {
    title: "Presencial e remoto",
    description: "Atuação em São Carlos, região e transmissões para todo o país.",
  },
  {
    title: "Conformidade legal",
    description: "Alinhamento à Lei Brasileira de Inclusão (13.146/2015) e ABNT NBR 15290.",
  },
  {
    title: "Atuação em dupla",
    description: "Revezamento técnico contínuo para eventos longos com precisão.",
  },
  {
    title: "Estudo prévio de pauta",
    description: "Glossário alinhado antes do evento para termos técnicos da área.",
  },
] as const;

export const SERVICES: ServiceItem[] = [
  {
    id: "interpretacao",
    title: "Interpretação Simultânea e Consecutiva",
    summary:
      "Atuação ao vivo em palestras, reuniões, congressos, audiências e atendimentos presenciais ou por videoconferência.",
    deliverables: [
      "Intérpretes qualificados com revezamento em eventos acima de 1 hora",
      "Atendimento presencial em São Carlos - SP e remoto nacional",
      "Suporte a transmissões ao vivo no YouTube, Zoom, Teams e Meet",
    ],
    formatNote: "Indicado para eventos, reuniões corporativas e solenidades.",
    image: "/images/hero-interpreter.jpg",
    imageAlt:
      "Intérprete de Libras em atuação simultânea em palco de auditório diante do público.",
  },
  {
    id: "audiovisual",
    title: "Janela de Libras e Tradução Audiovisual",
    summary:
      "Inserção de intérprete em janela proporcional, com enquadramento limpo e contraste adequado para campanhas, aulas e editais.",
    deliverables: [
      "Captação em estúdio com fundo neutro e iluminação dedicada",
      "Entrega sincronizada com o vídeo final ou em arquivo alpha separado",
      "Adequação às diretrizes de acessibilidade da ABNT NBR 15290",
    ],
    formatNote: "Indicado para vídeos institucionais, cursos EAD e projetos culturais.",
    image: "/images/studio-translation.jpg",
    imageAlt:
      "Intérprete de Libras gravando tradução audiovisual em estúdio com iluminação profissional e câmera.",
  },
  {
    id: "corporativo",
    title: "Acessibilidade Corporativa e RH",
    summary:
      "Acompanhamento contínuo para entrevistas, integrações, SIPAT, treinamentos internos e comunicação acessível com colaboradores surdos.",
    deliverables: [
      "Mediação em processos seletivos, feedbacks e reuniões de equipe",
      "Tradução de manuais, comunicados internos e integrações de segurança",
      "Consultoria prática para rotinas inclusivas de atendimento",
    ],
    formatNote: "Indicado para empresas, indústrias, comércios e áreas de pessoas.",
    image: "/images/corporate-inclusion.jpg",
    imageAlt:
      "Equipe corporativa em reunião com profissional surdo e intérprete de Libras ao redor da mesa.",
  },
  {
    id: "educacao",
    title: "Eventos Acadêmicos e Setor Público",
    summary:
      "Cobertura especializada para simpósios, defesas, oficinas, conferências municipais e programações culturais.",
    deliverables: [
      "Preparação terminológica prévia junto aos organizadores e docentes",
      "Emissão de documentação fiscal para empresas, universidades e editais",
      "Coordenação de escala para múltiplos auditórios simultâneos",
    ],
    formatNote: "Indicado para universidades, secretarias, museus e produtoras.",
    image: "/images/hero-interpreter.jpg",
    imageAlt:
      "Intérprete de Libras atuando em evento acadêmico em auditório iluminado.",
  },
];

export const SECTORS: SectorItem[] = [
  {
    id: "empresas",
    title: "Empresas e Corporativo",
    description:
      "Integração de colaboradores surdos, entrevistas, treinamentos de equipe, SIPAT e convenções anuais com comunicação fluida.",
    highlight: "RH, compliance e cultura inclusiva",
    variant: "photo",
  },
  {
    id: "eventos",
    title: "Eventos e Transmissões",
    description:
      "Congressos, fóruns, lançamentos e transmissões ao vivo com escala de dupla para garantir fluidez do início ao fim.",
    highlight: "Presencial ou transmissão ao vivo",
    variant: "contrast",
  },
  {
    id: "ensino",
    title: "Educação e Pesquisa",
    description:
      "Simpósios, defesas acadêmicas, semanas de curso e materiais EAD acessíveis para estudantes e pesquisadores.",
    highlight: "Preparo prévio de vocabulário técnico",
    variant: "card",
  },
  {
    id: "cultura",
    title: "Cultura e Setor Público",
    description:
      "Espetáculos, editais culturais, audiências públicas e atendimentos institucionais em conformidade com a legislação vigente.",
    highlight: "Atendimento com documentação fiscal",
    variant: "elevated",
  },
  {
    id: "audiovisual-sector",
    title: "Produção Audiovisual e Campanhas",
    description:
      "Gravação em estúdio de janela de Libras para vídeos institucionais, redes sociais, peças publicitárias e cursos gravados.",
    highlight: "Enquadramento e contraste NBR 15290",
    variant: "bordered",
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    title: "Diagnóstico da pauta",
    detail:
      "Recebemos formato, duração, local ou plataforma e público estimado para dimensionar a equipe correta.",
  },
  {
    title: "Escala técnica",
    detail:
      "Definimos intérprete solo ou dupla de revezamento conforme o tempo de fala e a complexidade do tema.",
  },
  {
    title: "Briefing e glossário",
    detail:
      "Analisamos roteiros, apresentações e termos específicos com antecedência para manter fidelidade de sentido.",
  },
  {
    title: "Entrega acessível",
    detail:
      "Atuação pontual ao vivo ou entrega do vídeo tratado com janela de Libras pronta para publicação.",
  },
];

export const FAQS: FaqItem[] = [
  {
    id: "prazo",
    question: "Com quanto tempo de antecedência devo contratar?",
    answer:
      "Para eventos presenciais ou transmissões ao vivo, recomendamos solicitar com pelo menos 7 dias de antecedência para estudo de material e reserva de agenda. Demandas urgentes são avaliadas conforme disponibilidade.",
  },
  {
    id: "dupla",
    question: "Quando é necessário contratar uma dupla de intérpretes?",
    answer:
      "Em eventos ou transmissões com mais de 1 hora de duração, a atuação em dupla com revezamento a cada 15 a 20 minutos garante conforto físico ao profissional e precisão contínua na interpretação.",
  },
  {
    id: "abrangencia",
    question: "A Libras Plus atende fora de São Carlos - SP?",
    answer:
      "Sim. Atendemos presencialmente em São Carlos e região, e realizamos interpretação remota e tradução audiovisual para empresas, produtoras e instituições em todo o Brasil.",
  },
  {
    id: "janela",
    question: "Como funciona o envio de vídeos para Janela de Libras?",
    answer:
      "Você envia o vídeo finalizado ou roteiro aprovado junto com a minutagem. Gravamos em estúdio, sincronizamos a faixa em Libras e devolvemos o vídeo montado ou em camada separada.",
  },
  {
    id: "nota",
    question: "Vocês emitem nota fiscal para empresas e editais culturais?",
    answer:
      "Sim. Emitimos nota fiscal de serviço e enviamos documentação regularizada para contratações corporativas, universidades e prestações de contas de editais.",
  },
];
