export interface PlyometricExercise {
  id: string;
  name: string;
  phase: 1 | 2 | 3;
  type: 'bilateral' | 'unilateral' | 'transição' | 'específico_handebol';
  vector: 'vertical' | 'horizontal' | 'lateral' | 'multidirecional';
  targetContacts: string; // ex: "3 séries x 6 reps (18 contatos)"
  sets: number;
  reps: number;
  restSeconds: number;
  objective: string;
  executionSteps: string[];
  biomechanicalCues: string[]; // Pistas mecânicas como "Ninja landing", "Zero valgo"
  commonMistakes: string[];
  handballRelevance: string;
  difficulty: 'Iniciante/Baixo Impacto' | 'Intermediário/Reativo' | 'Avançado/Multidirecional';
}

export interface PlyoPhaseInfo {
  phaseNumber: 1 | 2 | 3;
  name: string;
  subtitle: string;
  weeksRange: string;
  contactRangePerSession: string; // Ex: "40 a 60 contatos"
  primaryFocus: string;
  description: string;
  biomechanicalGoal: string;
  criteriaToAdvance: string[];
  exercises: PlyometricExercise[];
}

export interface WeeklyScheduleOption {
  id: '2_days' | '3_days';
  title: string;
  subtitle: string;
  recommendedFor: string;
  days: {
    dayName: string;
    activity: string;
    plyoSession?: string;
    handballNotes?: string;
    gymNotes?: string;
    intensity: 'Baixa' | 'Moderada' | 'Alta' | 'Recuperação';
  }[];
  goldenRules: string[];
}

export const PLYOMETRIC_PHASES: PlyoPhaseInfo[] = [
  {
    phaseNumber: 1,
    name: 'Fase 1: Baixo Impacto & Controle de Aterrissagem',
    subtitle: 'Frenagem Excêntrica, Absorção de Força e Aterrissagem Cravada (Stick the Landing)',
    weeksRange: 'Semanas 1 a 3 (ou até atingir critérios)',
    contactRangePerSession: '40 a 60 contatos por sessão',
    primaryFocus: 'Aterrissagem sem rebote (Stick 2-3s), eliminação de valgo dinâmico e tripla flexão amortecida.',
    description:
      'Esta fase constrói a fundação biomecânica essencial para quem operou LCA e menisco. Antes de saltar alto ou rápido, o cérebro e os músculos (quadríceps, glúteos e isquiotibiais) precisam reaprender a frear e absorver as forças de impacto silenciosamente, protegendo o enxerto em maturação e o reparo meniscal.',
    biomechanicalGoal:
      'Reeducação do valgo dinâmico, inclinação anterior do tronco (20-30°) para ativação de glúteos e isquiotibiais, e aterrissagem silenciosa (Ninja Landing).',
    criteriaToAdvance: [
      'Zero dor articular durante ou 24h após as sessões (EVA ≤ 2/10).',
      'Zero edema ou derrame no joelho operado no dia seguinte ao treino.',
      'Aterrissagens 100% simétricas e sem colapso do joelho para dentro (zero valgo visual).',
      'Capacidade de segurar a aterrissagem em 1 perna ("Stick") por 3 segundos sem oscilações bruscas.',
      'Mínimo de 3 semanas consistentes completadas nesta fase.',
    ],
    exercises: [
      {
        id: 'snap_downs_bilaterais',
        name: 'Snap Downs Bilaterais com Tripla Extensão',
        phase: 1,
        type: 'bilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 6 repetições (18 contatos)',
        sets: 3,
        reps: 6,
        restSeconds: 60,
        objective: 'Desenvolver velocidade de descida excêntrica e frear instantaneamente na posição atlética.',
        executionSteps: [
          'Fique em pé com os pés na largura dos ombros e suba na ponta dos pés com os braços estendidos acima da cabeça.',
          'Puxe rapidamente os braços para baixo e projete os quadris para trás, descendo instantaneamente para a posição de agachamento atlético (joelhos a 30-45°).',
          'Aterrisse no chão de forma firme, estável e silenciosa, mantendo os joelhos alinhados com o segundo dedo do pé.',
          'Segure a posição final travada ("Stick") por 2 a 3 segundos antes de retornar.',
        ],
        biomechanicalCues: [
          'Braços puxam o corpo para baixo com agressividade.',
          'Quadris para trás, peito inclinado a 30° (ativa glúteos).',
          'Joelhos não se tocam e não colapsam para dentro.',
        ],
        commonMistakes: [
          'Aterrissar com os joelhos estendidos e tronco ereto (aumenta estresse no LCA).',
          'Deixar os joelhos oscilarem para dentro (valgo dinâmico).',
        ],
        handballRelevance: 'Prepara a postura base defensiva e a absorção rápida do peso corporal no handebol.',
        difficulty: 'Iniciante/Baixo Impacto',
      },
      {
        id: 'box_jumps_aterrissagem_suave',
        name: 'Box Jump com Aterrissagem Suave (Caixa 30-40cm)',
        phase: 1,
        type: 'bilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 5 repetições (15 contatos)',
        sets: 3,
        reps: 5,
        restSeconds: 75,
        objective: 'Propulsão vertical máxima com estresse articular mínimo na aterrissagem (caixa reduz a queda).',
        executionSteps: [
          'Posicione-se a cerca de 30cm de uma caixa ou banco estável de 30 a 40cm de altura.',
          'Inicie em posição atlética, balance os braços e salte verticalmente para o topo da caixa.',
          'Aterrisse no topo da caixa exatamente na mesma posição de agachamento que você usou para sair do chão (suave e silencioso).',
          'Permaneça firme por 2 segundos. Em seguida, DÊ UM PASSO PARA TRÁS com a perna NÃO operada para descer (NUNCA salte para trás).',
        ],
        biomechanicalCues: [
          'Aterrissagem "como uma pluma" no topo da caixa.',
          'Pés totalmente apoiados (não aterrissar só na ponta dos dedos).',
          'Descida sempre dando um passo (Step-Down seguro).',
        ],
        commonMistakes: [
          'Pular para trás ao descer (altíssimo estresse mecânico de cisalhamento no LCA e menisco).',
          'Usar caixas altas demais que forçam hiperflexão profunda do joelho.',
        ],
        handballRelevance: 'Constrói potência vertical para o salto de arremesso e bloqueio sem sobrecarregar o joelho.',
        difficulty: 'Iniciante/Baixo Impacto',
      },
      {
        id: 'drop_landings_baixo_desnivel',
        name: 'Drop Landings / Aterrissagens de Desnível (Caixa 15-20cm)',
        phase: 1,
        type: 'bilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 5 repetições (15 contatos)',
        sets: 3,
        reps: 5,
        restSeconds: 60,
        objective: 'Treinar a capacidade pura de absorção de impacto gravitacional sem impulso prévio.',
        executionSteps: [
          'Fique em pé no topo de uma caixa baixa ou degrau de 15 a 20cm.',
          'Dê um passo suave para frente com uma perna no ar (NÃO salte para cima, apenas dê o passo para o vazio).',
          'Aterrisse com ambos os pés tocando o solo simultaneamente na largura do quadril.',
          'Amorteça a queda imediatamente dobrando tornozelos, joelhos e quadris (tripla flexão) e trave por 3 segundos.',
        ],
        biomechanicalCues: [
          'Barulho zero de impacto no solo ("Ninja Landing").',
          'Distribuição 50%/50% simétrica de peso entre perna operada e perna sã.',
          'Manter o tronco ligeiramente inclinado para frente.',
        ],
        commonMistakes: [
          'Descarregar mais peso na perna boa por medo (assimetria motora compensatória).',
          'Joelho rígido sem flexão amortecida.',
        ],
        handballRelevance: 'Simula o momento exato em que o atleta desce de um salto de bloqueio no handebol.',
        difficulty: 'Iniciante/Baixo Impacto',
      },
      {
        id: 'pogo_jumps_tornozelo',
        name: 'Pogo Jumps Lineares no Lugar (Rigidez de Tornozelo)',
        phase: 1,
        type: 'bilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 10 repetições (30 contatos)',
        sets: 3,
        reps: 10,
        restSeconds: 60,
        objective: 'Ativar o ciclo alongamento-encurtamento (SSC) do complexo panturrilha/aquiles mantendo o joelho estável.',
        executionSteps: [
          'Fique ereto com joelhos levemente destravados (cerca de 15-20° de flexão fixa).',
          'Salte repetidamente usando primariamente a flexão plantar dos tornozelos e a elasticidade do tendão de Aquiles.',
          'O contato com o chão deve ser rápido e elástico como uma mola, sem deixar os calcanhares baterem com força.',
          'Mantenha as mãos na cintura ou braços coordenados.',
        ],
        biomechanicalCues: [
          'Contato rápido na bola do pé.',
          'Joelhos firmes e alinhados, sem dobrar excessivamente a cada salto.',
          'Ritmo constante e controlado.',
        ],
        commonMistakes: [
          'Transformar o exercício em agachamento saltado profundo.',
          'Perda do alinhamento frontal dos joelhos.',
        ],
        handballRelevance: 'Reatividade indispensável para os deslocamentos rápidos na ponta dos pés na linha defensiva.',
        difficulty: 'Iniciante/Baixo Impacto',
      },
      {
        id: 'single_leg_snap_down',
        name: 'Single-Leg Snap Down (Aterrissagem Unilateral Estática)',
        phase: 1,
        type: 'unilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 4 reps por perna (24 contatos)',
        sets: 3,
        reps: 4,
        restSeconds: 75,
        objective: 'Estabelecer estabilidade unilateral, alinhamento pélvico e confiança na perna operada.',
        executionSteps: [
          'Fique na ponta dos pés com os braços estendidos acima da cabeça.',
          'Desça rapidamente caindo sobre UMA perna (inicie pela perna sã, depois faça a perna operada).',
          'Aterrisse no meio do pé, empurrando o quadril para trás e mantendo o joelho alinhado sobre o pé.',
          'Segure o equilíbrio estátio cravado por 3 segundos inteiros antes de apoiar o outro pé.',
        ],
        biomechanicalCues: [
          'Sem queda da pelve do lado oposto (ativação forte do glúteo médio).',
          'Joelho não pode colapsar nem 1cm para dentro.',
          'Tronco e quadril firmes.',
        ],
        commonMistakes: [
          'Balançar o tronco lateralmente para compensar falta de força no quadril.',
          'Não segurar o tempo de 3 segundos para testar estabilização.',
        ],
        handballRelevance: 'A base da sustentação monopodálica exigida em todas as passadas e finalizações de handebol.',
        difficulty: 'Iniciante/Baixo Impacto',
      },
    ],
  },
  {
    phaseNumber: 2,
    name: 'Fase 2: Reatividade, Vetor Horizontal & Saltos Unilaterais',
    subtitle: 'Introdução de Forças de Propulsão Horizontal e Saltos com 1 Perna (Unilateral Stick)',
    weeksRange: 'Semanas 4 a 6 (ou após atingir critérios da Fase 1)',
    contactRangePerSession: '60 a 80 contatos por sessão',
    primaryFocus: 'Saltos em distância (Broad Jumps), saltos laterais controlados (Skaters) e absorção unilateral progressiva.',
    description:
      'Com o controle excêntrico bilateral consolidado, esta fase introduz vetores horizontais e saltos unilaterais lineares. O handebol é um esporte de deslocamento no espaço: aqui aumentamos a exigência dos isquiotibiais para conter a translação anterior da tíbia e aprimoramos a reatividade muscular.',
    biomechanicalGoal:
      'Geração de força horizontal e absorção unilateral com simetria entre membros (LSI) acima de 85%, co-contração de quadríceps e isquiotibiais.',
    criteriaToAdvance: [
      'Índice de Simetria de Membros (LSI) ≥ 85% no teste de salto unilateral (Single Hop for Distance).',
      'Aterrissagens unilaterais estáveis sem compensação de tronco ou valgo dinâmico.',
      'Ausência total de dor e inchaço nas 24h pós-treino com 70-80 contatos.',
      'Excelente tolerância aos saltos de patinador laterais (Skater jumps) sem instabilidade subjetiva.',
      'Sensação de segurança e confiança no membro operado durante os saltos.',
    ],
    exercises: [
      {
        id: 'broad_jump_stick',
        name: 'Broad Jump com Aterrissagem Cravada (Salto Horizontal)',
        phase: 2,
        type: 'bilateral',
        vector: 'horizontal',
        targetContacts: '3 séries x 5 repetições (15 contatos)',
        sets: 3,
        reps: 5,
        restSeconds: 75,
        objective: 'Propulsão horizontal com frenagem em desaceleração bilateral sem dar passos extras à frente.',
        executionSteps: [
          'Pés paralelos na largura dos ombros. Balance os braços para trás flexionando quadris e joelhos.',
          'Projete-se agressivamente para frente e para cima em um salto em distância.',
          'Aterrisse com ambos os pés simultaneamente, amortecendo aterrissagem em tripla flexão.',
          'Cravar a aterrissagem por 2 a 3 segundos sem dar passos à frente ou oscilar.',
        ],
        biomechanicalCues: [
          'Empurrar o chão e puxar os calcanhares para frente antes de aterrissar.',
          'Tronco inclinado para a frente para absorver no quadril e isquiotibiais.',
          'Fixar os pés como se estivesse colado no chão.',
        ],
        commonMistakes: [
          'Saltar mais longe do que consegue frear com controle.',
          'Dar passinhos de desequilíbrio após aterrissar.',
        ],
        handballRelevance: 'Essencial para a impulsão horizontal em infiltrações na área de 6 metros.',
        difficulty: 'Intermediário/Reativo',
      },
      {
        id: 'single_leg_box_jump',
        name: 'Single-Leg Box Jump (Subida Unilateral na Caixa de 20-25cm)',
        phase: 2,
        type: 'unilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 4 reps por perna (24 contatos)',
        sets: 3,
        reps: 4,
        restSeconds: 90,
        objective: 'Potência concêntrica unilateral com baixo estresse de aterrissagem no topo da caixa.',
        executionSteps: [
          'Fique apoiado em uma perna em frente a uma caixa baixa de 20 a 25cm.',
          'Flexione o quadril e joelho e salte verticalmente para o topo da caixa com a mesma perna.',
          'Aterrisse suavemente no topo com o mesmo pé e trave o equilíbrio por 2 segundos.',
          'Desça com segurança dando um passo com a outra perna.',
        ],
        biomechanicalCues: [
          'Extensão completa de quadril na decolagem.',
          'Aterrissagem com o joelho alinhado com o pé.',
          'Uso ativo dos braços para propulsão.',
        ],
        commonMistakes: [
          'Usar caixas muito altas que forcem o joelho a dobrar em valgo na subida.',
          'Descer pulando de volta ao invés de dar o passo.',
        ],
        handballRelevance: 'Desenvolve a impulsão de 1 perna específica do arremesso em suspensão do handebol.',
        difficulty: 'Intermediário/Reativo',
      },
      {
        id: 'lateral_skater_jumps_stick',
        name: 'Lateral Skater Jumps com Pausa (Salto Lateral Controlado)',
        phase: 2,
        type: 'unilateral',
        vector: 'lateral',
        targetContacts: '3 séries x 6 saltos alternados (18 contatos)',
        sets: 3,
        reps: 6,
        restSeconds: 75,
        objective: 'Introduzir desaceleração e absorção de força no plano frontal (estabilidade lateral do joelho e glúteo médio).',
        executionSteps: [
          'Fique apoiado na perna direita com joelho levemente flexionado.',
          'Empurre o chão lateralmente saltando para a esquerda, aterrissando na perna esquerda.',
          'Aterrisse absorvendo no quadril, com o joelho esquerdo alinhado e sem colapsar medialmente.',
          'Mantenha o equilíbrio estático por 2 segundos. Em seguida, salte de volta para a perna direita.',
        ],
        biomechanicalCues: [
          'Aterrissar no centro do pé, empurrando o glúteo para trás.',
          'Joelho não deve apontar para dentro durante o impacto lateral.',
          'A perna livre fica suspensa atrás para equilibrar o tronco.',
        ],
        commonMistakes: [
          'Fazer saltos rápidos contínuos sem cravar o equilíbrio (perde o objetivo de controle).',
          'Joelho entrar em valgo no momento da absorção lateral.',
        ],
        handballRelevance: 'Proteção fundamental contra lesões em movimentos laterais de marcação defensiva.',
        difficulty: 'Intermediário/Reativo',
      },
      {
        id: 'continuous_line_hurdle_jumps',
        name: 'Continuous Line Jumps (Saltos Rápidos Sobre Linha)',
        phase: 2,
        type: 'bilateral',
        vector: 'vertical',
        targetContacts: '3 séries x 8 saltos contínuos (24 contatos)',
        sets: 3,
        reps: 8,
        restSeconds: 60,
        objective: 'Treinar reatividade e tempo de contato rápido no solo no plano sagital e frontal.',
        executionSteps: [
          'Fique em frente a uma linha no chão ou fita adesiva.',
          'Salte para frente e para trás sobre a linha de maneira contínua e ritmada.',
          'Mantenha os joelhos estáveis e alinhados, usando a elasticidade dos tornozelos.',
          'Realize 8 repetições rápidas mantendo postura ereta e ritmo fluído.',
        ],
        biomechanicalCues: [
          'Tempo de contato mínimo com o piso ("como se o chão estivesse quente").',
          'Sem desvio medial dos joelhos.',
          'Manter postura atlética.',
        ],
        commonMistakes: [
          'Deixar os calcanhares tocarem o chão com força.',
          'Perder o ritmo e o alinhamento dos pés.',
        ],
        handballRelevance: 'Melhora o jogo de pernas (footwork) rápido nos duelos 1x1.',
        difficulty: 'Intermediário/Reativo',
      },
      {
        id: 'single_leg_forward_hop_stick',
        name: 'Single-Leg Forward Hop & Stick (Salto Unilateral à Frente com Fixação)',
        phase: 2,
        type: 'unilateral',
        vector: 'horizontal',
        targetContacts: '3 séries x 4 reps por perna (24 contatos)',
        sets: 3,
        reps: 4,
        restSeconds: 90,
        objective: 'Exercício padrão-ouro para retorno ao esporte: propulsão e frenagem unilateral no plano sagital.',
        executionSteps: [
          'Fique em pé em uma perna só.',
          'Salte para frente cobrindo cerca de 50% a 70% da sua distância máxima confortável.',
          'Aterrisse na MESMA perna, absorvendo o impacto com o quadril e joelho.',
          'Fixe a aterrissagem por 2 a 3 segundos completos sem apoiar a outra perna e sem dar pulinhos.',
        ],
        biomechanicalCues: [
          'Flexionar o joelho a pelo menos 30-40° na aterrissagem.',
          'Foco no olhar fixo à frente para estabilizar o sistema vestibular.',
          'Glúteos e isquiotibiais ativos para absorver o vetor horizontal.',
        ],
        commonMistakes: [
          'Tentar pular muito longe e perder o controle da aterrissagem.',
          'Aterrissar com perna rígida e tronco ereto.',
        ],
        handballRelevance: 'Prepara o joelho para a desaceleração após um arremesso ou passe em movimento.',
        difficulty: 'Intermediário/Reativo',
      },
    ],
  },
  {
    phaseNumber: 3,
    name: 'Fase 3: Pliometria Multidirecional & Específica para Handebol',
    subtitle: 'Mudanças de Direção (45° e 90°), Desacelerações em Corrida e Gesto Motor do Handebol',
    weeksRange: 'Semanas 7 a 9+ (Preparação Direta para Retorno Competitivo)',
    contactRangePerSession: '80 a 100 contatos por sessão',
    primaryFocus: 'Desacelerações multidirecionais, saltos cruzados (Crossover), aproximação de 3 tempos e aterrissagem reativa.',
    description:
      'A fase de coroamento do protocolo. O handebol exige desacelerações brutas, saltos em suspensão com oposição e mudanças repentinas de direção. Esta fase prepara a articulação, o enxerto e a musculatura estabilizadora para todas as demandas imprevisíveis do jogo, simulando a mecânica de quadra.',
    biomechanicalGoal:
      'Controle neuromuscular em planos múltiplos (sagital, frontal e transversal), simetria LSI ≥ 90% em testes de salto triplo e desaceleração de alta velocidade.',
    criteriaToAdvance: [
      'Índice de Simetria de Membros (LSI) ≥ 90% em Triple Hop for Distance e Crossover Hop.',
      'Execução limpa de desacelerações em velocidade moderada a alta sem hesitação.',
      'Aproximação de 3 tempos de handebol com salto e aterrissagem natural e sem dor.',
      'Confiança psicológica máxima (ACL-RSI score alto, sem medo de pisar forte).',
      'Aprovação final do fisioterapeuta/médico ortopedista para retorno irrestrito aos treinos com contato.',
    ],
    exercises: [
      {
        id: 'diagonal_bound_stick',
        name: '45-Degree Diagonal Bounds & Stick (Saltos em Zigue-Zague)',
        phase: 3,
        type: 'unilateral',
        vector: 'multidirecional',
        targetContacts: '3 séries x 6 saltos alternados (18 contatos)',
        sets: 3,
        reps: 6,
        restSeconds: 90,
        objective: 'Integrar propulsão e absorção angular a 45°, simulando cortes diagonais do handebol.',
        executionSteps: [
          'Comece apoiado na perna esquerda.',
          'Salte diagonalmente para frente e para a direita em ângulo de 45°, aterrissando na perna direita.',
          'Aterrisse cravando o equilíbrio por 1 a 2 segundos com o joelho perfeitamente alinhado.',
          'Em seguida, salte diagonalmente para frente e para a esquerda, aterrissando na perna esquerda.',
        ],
        biomechanicalCues: [
          'Ângulo de 45° nítido (não ir apenas para frente nem apenas para o lado).',
          'Tronco acompanha a direção do salto.',
          'Absorção profunda no quadril para proteger o menisco de rotações excessivas.',
        ],
        commonMistakes: [
          'Deixar o joelho girar em valgo durante o ângulo do corte.',
          'Não segurar o tempo de controle antes do próximo salto.',
        ],
        handballRelevance: 'Movimento exato das fintas diagonais de infiltração na defesa.',
        difficulty: 'Avançado/Multidirecional',
      },
      {
        id: 'rotational_jump_90_stick',
        name: '90-Degree Rotational Jump & Stick (Salto com Giro de 90°)',
        phase: 3,
        type: 'transição',
        vector: 'multidirecional',
        targetContacts: '3 séries x 4 reps para cada lado (24 contatos)',
        sets: 3,
        reps: 4,
        restSeconds: 75,
        objective: 'Treinar desaceleração rotacional controlada (plano transversal) sem torção lesiva na articulação.',
        executionSteps: [
          'Fique em pé com os dois pés na largura dos ombros.',
          'Salte verticalmente girando 90° no ar para a direita.',
          'Aterrisse no chão simultaneamente com os dois pés virados para a nova direção, absorvendo em posição atlética.',
          'Cravar a aterrissagem por 2 segundos. Repita para a esquerda.',
        ],
        biomechanicalCues: [
          'O giro acontece no ar, os pés tocam o solo já alinhados.',
          'Aterrissagem sem descompasso entre os dois pés.',
          'Tronco e joelhos alinhados no pouso.',
        ],
        commonMistakes: [
          'Aterrissar com os pés no chão enquanto o corpo ainda está girando (torção prejudicial ao menisco).',
          'Colapso em valgo.',
        ],
        handballRelevance: 'Giro de marcação e transição rápida de ataque para defesa.',
        difficulty: 'Avançado/Multidirecional',
      },
      {
        id: 'deceleration_run_drill',
        name: 'Deceleration Drill: Corrida 5m + Frenagem em 2-3 Passos',
        phase: 3,
        type: 'específico_handebol',
        vector: 'horizontal',
        targetContacts: '4 séries x 3 repetições (12 desacelerações)',
        sets: 4,
        reps: 3,
        restSeconds: 90,
        objective: 'Capacidade excêntrica máxima de frear corrida em velocidade progressiva sem sobrecarga no LCA.',
        executionSteps: [
          'Posicione 2 cones a 5 metros de distância.',
          'Acelere moderadamente do primeiro cone em direção ao segundo cone.',
          'Ao atingir o segundo cone, desça o centro de gravidade e freie completamente em exatamente 2 a 3 passos curtos e rápidos.',
          'Termine em base atlética baixa e equilibrada, alternando qual perna dá o passo final de frenagem.',
        ],
        biomechanicalCues: [
          'Centro de gravidade baixo (abaixe os quadris).',
          'Passos curtos e rápidos de frenagem ("Choppy feet").',
          'Tronco ligeiramente inclinado para trás no início da frenagem e depois neutro.',
        ],
        commonMistakes: [
          'Tentar frear em um passo único longo com a perna esticada (pico extremo de estresse no LCA).',
          'Tronco muito ereto.',
        ],
        handballRelevance: 'A manobra com maior incidência de lesão de LCA no handebol — dominar esta técnica blinda o joelho.',
        difficulty: 'Avançado/Multidirecional',
      },
      {
        id: 'handball_approach_jump',
        name: 'Aproximação 3 Passos de Handebol + Salto & Aterrissagem Suave',
        phase: 3,
        type: 'específico_handebol',
        vector: 'vertical',
        targetContacts: '3 séries x 5 repetições (15 contatos)',
        sets: 3,
        reps: 5,
        restSeconds: 90,
        objective: 'Integrar a passada rítmica clássica do handebol (1-2-3) com impulsão vertical e aterrissagem bilateral/unilateral suave.',
        executionSteps: [
          'Inicie a 3 metros da linha. Execute a passada clássica de 3 tempos do handebol (ex: Esquerda-Direita-Esquerda se for destro).',
          'No terceiro passo, impulsione-se verticalmente para o alto simulando o arremesso em suspensão.',
          'No topo do salto, faça o gesto do braço sem bola.',
          'Aterrisse no chão de forma equilibrada, suave e silenciosa com flexão de 45° nos joelhos.',
        ],
        biomechanicalCues: [
          'Ritmo da passada fluido e controlado.',
          'Transformação da velocidade horizontal em altura vertical.',
          'Aterrissagem controlada sem desequilíbrio.',
        ],
        commonMistakes: [
          'Acelerar a passada além do controle motor da aterrissagem.',
          'Descer desbalanceado para um dos lados.',
        ],
        handballRelevance: 'O gesto esportivo mais importante do handebol — a ponte definitiva para a quadra.',
        difficulty: 'Avançado/Multidirecional',
      },
      {
        id: 'crossover_hop_stick',
        name: 'Crossover Hop & Stick (Salto Cruzado Unilateral)',
        phase: 3,
        type: 'unilateral',
        vector: 'multidirecional',
        targetContacts: '3 séries x 4 reps por perna (24 contatos)',
        sets: 3,
        reps: 4,
        restSeconds: 90,
        objective: 'Salto unilateral cruzando uma linha central, testando estabilidade em múltiplos planos.',
        executionSteps: [
          'Fique apoiado na perna operada ao lado de uma linha reta de 3 metros no chão.',
          'Salte para frente cruzando a linha para o lado oposto, aterrissando na mesma perna.',
          'Segure a aterrissagem por 2 segundos antes do próximo salto.',
          'Realize 3 a 4 saltos em zigue-zague ao longo da linha.',
        ],
        biomechanicalCues: [
          'Manter a pelve estável durante o cruzamento da linha.',
          'Joelho alinhado com o pé em cada aterrissagem.',
          'Foco no controle fino dos músculos do pé e tornozelo.',
        ],
        commonMistakes: [
          'Oscilação lateral descontrolada do tronco.',
          'Perder o equilíbrio e apoiar o pé oposto.',
        ],
        handballRelevance: 'Teste clínico funcional reconhecido mundialmente para liberação esportiva completa.',
        difficulty: 'Avançado/Multidirecional',
      },
    ],
  },
];

export const WEEKLY_SCHEDULES: WeeklyScheduleOption[] = [
  {
    id: '2_days',
    title: 'Opção 1: 2 Sessões de Pliometria por Semana (Recomendada)',
    subtitle: 'Melhor relação estímulo/recuperação para monitorar a resposta do enxerto e do menisco aos 6 meses.',
    recommendedFor: 'Ideal para as Semanas 1 a 4 do protocolo ou enquanto você se adapta ao aumento de impacto.',
    days: [
      {
        dayName: 'Segunda-feira',
        activity: 'Pliometria (Sessão 1) + Musculação (Push - Peito/Ombro/Tríceps)',
        plyoSession: 'Sessão 1: 15-20 min antes da musculação (Frescor Neuromuscular)',
        gymNotes: 'Treino Push focado em membros superiores. Não sobrecarrega membros inferiores.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Terça-feira',
        activity: 'Handebol (Treino Técnico / Quadra Leve)',
        handballNotes: 'Atividades sem contato, passes, arremessos parados e deslocamentos controlados.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Quarta-feira',
        activity: 'Musculação (Pull - Costas/Bíceps + Core)',
        gymNotes: 'Puxadas, remadas e estabilização de core/abdômen.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Quinta-feira',
        activity: 'Pliometria (Sessão 2) + Handebol (Treino Leve)',
        plyoSession: 'Sessão 2: Realizar antes do treino de quadra ou em horário separado (mínimo 48h após Sessão 1).',
        handballNotes: 'Fundamentos de jogo e finalizações com foco em mecânica de aterrissagem.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Sexta-feira',
        activity: 'Musculação (Legs - Força & Hipertrofia Inferiores)',
        gymNotes: 'Agachamentos controlados, Stiff, Cadeira Flexora/Extensora, Elevação Pélvica. Cadeia posterior forte protege o LCA.',
        intensity: 'Alta',
      },
      {
        dayName: 'Sábado',
        activity: 'Descanso Ativo ou Mobilidade / Alongamento',
        gymNotes: 'Caminhada leve, liberação miofascial e mobilidade de tornozelo e quadril.',
        intensity: 'Baixa',
      },
      {
        dayName: 'Domingo',
        activity: 'Descanso Total (Regeneração Tecidual)',
        intensity: 'Recuperação',
      },
    ],
    goldenRules: [
      'Pliometria SEMPRE antes da musculação ou da quadra, nunca com o corpo em fadiga extrema.',
      'Intervalo mínimo de 48h a 72h entre as duas sessões de pliometria.',
      'Treino pesado de pernas (Legs) na Sexta garante o fim de semana inteiro para recuperação muscular e articular.',
    ],
  },
  {
    id: '3_days',
    title: 'Opção 2: 3 Sessões de Pliometria por Semana (Fase Consolidada)',
    subtitle: 'Para quando a articulação já tolera perfeitamente o volume de 2 dias sem qualquer dor ou inchaço.',
    recommendedFor: 'Fase 2 e 3 avançadas, com volume distribuído em estímulos mais curtos e precisos.',
    days: [
      {
        dayName: 'Segunda-feira',
        activity: 'Pliometria (Sessão A) + Musculação (Upper A)',
        plyoSession: 'Sessão A: Ênfase em saltos verticais e controle de impacto (15 min).',
        gymNotes: 'Peito, Costas, Ombros.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Terça-feira',
        activity: 'Handebol (Treino de Quadra)',
        handballNotes: 'Treino tático e técnico em quadra.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Quarta-feira',
        activity: 'Pliometria (Sessão B) + Musculação (Legs)',
        plyoSession: 'Sessão B: Ênfase em saltos horizontais e laterais antes do treino de pernas.',
        gymNotes: 'Treino de força de pernas logo em seguida.',
        intensity: 'Alta',
      },
      {
        dayName: 'Quinta-feira',
        activity: 'Handebol (Treino Técnico Leve) ou Descanso Ativo',
        handballNotes: 'Foco em arremesso e posicionamento sem sprints máximos.',
        intensity: 'Baixa',
      },
      {
        dayName: 'Sexta-feira',
        activity: 'Pliometria (Sessão C) + Musculação (Upper B)',
        plyoSession: 'Sessão C: Reatividade e desacelerações específicas de handebol.',
        gymNotes: 'Braços, Ombros e Core.',
        intensity: 'Moderada',
      },
      {
        dayName: 'Sábado',
        activity: 'Descanso Ativo / Recuperação Articular',
        intensity: 'Baixa',
      },
      {
        dayName: 'Domingo',
        activity: 'Descanso Total',
        intensity: 'Recuperação',
      },
    ],
    goldenRules: [
      'As 3 sessões devem ter volume individual um pouco menor (40-60 contatos por sessão) para somar 120-150 contatos/semana.',
      'Sempre monitorar inchaço articular na Quarta e no Sábado após os dias mais densos.',
    ],
  },
];

export interface RedFlagSign {
  id: string;
  severity: 'grave' | 'moderado' | 'normal';
  title: string;
  symptom: string;
  whatItMeans: string;
  recommendedAction: string;
}

export const RED_FLAGS: RedFlagSign[] = [
  {
    id: 'edema_derrame',
    severity: 'grave',
    title: 'Inchaço ou Derrame Articular Matinal (Joint Effusion)',
    symptom: 'Sensação de joelho cheio, perda do contorno da patela ou aumento da circunferência do joelho > 1cm no dia seguinte.',
    whatItMeans: 'Sobrecarga direta na cartilagem articular, sinóvia ou no reparo meniscal em cicatrização.',
    recommendedAction: 'PARAR a pliometria imediatamente por 48-72h. Aplicar gelo, elevar o membro e regredir 1 fase no volume.',
  },
  {
    id: 'dor_persiste_24h',
    severity: 'grave',
    title: 'Dor Articular > 3/10 que Persiste por mais de 2 Horas',
    symptom: 'Dor em pontada, dor atrás da patela ou na linha interarticular do menisco durante ou após o treino.',
    whatItMeans: 'A carga mecânica excedeu a capacidade de absorção dos tecidos moles estabilizadores.',
    recommendedAction: 'Não treine no dia seguinte com dor. Reduza o número de contatos em 50% na próxima sessão.',
  },
  {
    id: 'sensacao_falseio',
    severity: 'grave',
    title: 'Sensação de Falseio, Bloqueio ou "Ceder" do Joelho',
    symptom: 'O joelho parece que vai sair do lugar durante o salto ou aterrissagem, ou ocorre estalido com travamento.',
    whatItMeans: 'Inibição neuromuscular reflexa ou irritação no enxerto/menisco.',
    recommendedAction: 'Suspenda exercícios de impacto e consulte o fisioterapeuta/médico para avaliação ligamentar e meniscal.',
  },
  {
    id: 'perda_controle_valgo',
    severity: 'moderado',
    title: 'Fadiga com Perda do Alinhamento (Valgo Dinâmico na Série)',
    symptom: 'Nas últimas repetições da série, o joelho começa a tremer ou cair para dentro ao aterrissar.',
    whatItMeans: 'Fadiga aguda dos músculos estabilizadores (glúteo médio, quadríceps e isquiotibiais). Sobrecarga imediata no LCA.',
    recommendedAction: 'INTERROMPA a série imediatamente. Na pliometria, a qualidade é inegociável — jamais treine até a falha motora.',
  },
  {
    id: 'dor_muscular_tardia',
    severity: 'normal',
    title: 'Dor Muscular Tardia (Nos Glúteos, Panturrilha ou Coxa)',
    symptom: 'Sensação de cansaço e queimação muscular normal nos ventres musculares 24-48h após o treino (sem dor na articulação).',
    whatItMeans: 'Adaptação fisiológica natural ao treinamento excêntrico e pliométrico.',
    recommendedAction: 'Sinal verde. Mantenha hidratação, sono adequado e aquecimento neuromuscular pré-treino.',
  },
];

export interface AdvancementChecklist {
  id: string;
  category: 'Clínico' | 'Biomecânico' | 'Funcional / LSI' | 'Psicológico';
  title: string;
  description: string;
  threshold: string;
}

export const ADVANCEMENT_CRITERIA: AdvancementChecklist[] = [
  {
    id: 'crit_pain',
    category: 'Clínico',
    title: 'Escala Visual Analógica de Dor (EVA)',
    description: 'Avaliação de dor durante o treino e nas 24 horas seguintes à sessão.',
    threshold: 'Dor ≤ 2 em 10 (onde 0 é sem dor e 10 é dor máxima insuportável).',
  },
  {
    id: 'crit_effusion',
    category: 'Clínico',
    title: 'Teste de Derrame Articular (Stroke Test)',
    description: 'Verificação de inchaço intra-articular após 24h de repouso.',
    threshold: 'Grau 0 ou Traço (sem acúmulo visível de líquido na bursa suprapatelar).',
  },
  {
    id: 'crit_valgus',
    category: 'Biomecânico',
    title: 'Avaliação de Valgo Dinâmico em Vídeo (Smartphone 240fps)',
    description: 'Filme uma aterrissagem em câmera lenta de frente.',
    threshold: 'Alinhamento neutro entre quadril, centro da patela e 2º dedo do pé (sem adução/rotação interna do fêmur).',
  },
  {
    id: 'crit_landing_sound',
    category: 'Biomecânico',
    title: 'Índice de Aterrissagem Silenciosa (Ninja Landing)',
    description: 'Capacidade de amortecer a força de impacto com tripla flexão suave de tornozelo, joelho e quadril.',
    threshold: 'Aterrissagem sem som de batida seca e com flexão mínima de joelho de 30-45°.',
  },
  {
    id: 'crit_lsi_single_hop',
    category: 'Funcional / LSI',
    title: 'Índice de Simetria de Membros (LSI) - Single Hop for Distance',
    description: 'Distância alcançada no salto com 1 perna (Perna Operada ÷ Perna Sã × 100).',
    threshold: '≥ 85% para avançar para Fase 2; ≥ 90% para avançar para Fase 3.',
  },
  {
    id: 'crit_lsi_triple_hop',
    category: 'Funcional / LSI',
    title: 'Índice de Simetria de Membros (LSI) - Triple Hop & Crossover Hop',
    description: 'Salto triplo contínuo em 1 perna e salto cruzado sobre linha.',
    threshold: '≥ 90% de simetria com aterrissagem cravada e sem perda de equilíbrio.',
  },
  {
    id: 'crit_strength_quad_ham',
    category: 'Funcional / LSI',
    title: 'Relação de Força Isquiotibiais / Quadríceps (I/Q Ratio)',
    description: 'Força na cadeira flexora e extensora ou dinamometria manual.',
    threshold: 'Isquiotibiais fortes (agonistas do LCA) e simetria de força global ≥ 85-90%.',
  },
  {
    id: 'crit_acl_rsi',
    category: 'Psicológico',
    title: 'Escala de Prontidão Psicológica (ACL-RSI)',
    description: 'Confiança subjetiva do atleta para saltar, aterrissar e mudar de direção.',
    threshold: 'Sentir-se seguro, sem medo paralisante de pisar forte na perna operada.',
  },
];
