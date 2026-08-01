export interface AlternativeExercise {
  id: string;
  name: string;
  muscleGroup: string;
  type: 'composto' | 'isolador' | 'core';
  description: string;
  instructions: string;
}

export const EXERCISE_ALTERNATIVES_BY_MUSCLE: Record<string, AlternativeExercise[]> = {
  Peitoral: [
    {
      id: 'supino_inclinado_halteres',
      name: 'Supino Inclinado com Halteres',
      muscleGroup: 'Peitoral',
      type: 'composto',
      description: 'Foco no peitoral superior. Permite maior amplitude e movimento natural do ombro.',
      instructions: 'Banco em 30°. Mantenha as escápulas aduzidas e desça até alinhar os halteres ao peito.',
    },
    {
      id: 'supino_reto_halteres',
      name: 'Supino Reto com Halteres',
      muscleGroup: 'Peitoral',
      type: 'composto',
      description: 'Ativação global do peitoral com excelente controle e estabilidade unilateral.',
      instructions: 'Mantenha os pés bem fincados no chão gerando estabilidade corporal.',
    },
    {
      id: 'supino_inclinado_barra',
      name: 'Supino Inclinado com Barra',
      muscleGroup: 'Peitoral',
      type: 'composto',
      description: 'Exercício clássico de sobrecarga para o peitoral superior e deltoide anterior.',
      instructions: 'Pegada um pouco mais larga que a largura dos ombros, toque a barra na parte alta do peito.',
    },
    {
      id: 'supino_reto_barra',
      name: 'Supino Reto com Barra',
      muscleGroup: 'Peitoral',
      type: 'composto',
      description: 'O rei da força para peitoral. Permite utilizar cargas elevadas com segurança.',
      instructions: 'Mantenha o arco fisiológico da coluna e escápulas travadas no banco.',
    },
    {
      id: 'supino_maquina_smith',
      name: 'Supino Máquina ou Smith Plano',
      muscleGroup: 'Peitoral',
      type: 'composto',
      description: 'Ótimo para isolar a musculatura do peitoral sem demandar extrema estabilização.',
      instructions: 'Pegada firme, controle a fase excêntrica de 2 a 3 segundos.',
    },
    {
      id: 'crucifixo_maquina',
      name: 'Crucifixo Máquina (Peck Deck / Fly)',
      muscleGroup: 'Peitoral',
      type: 'isolador',
      description: 'Tensão contínua em toda a extensão do peitoral com foco na adução de braço.',
      instructions: 'Cotovelos levemente dobrados, alongue bem o peito sem hipertensionar ombros.',
    },
    {
      id: 'crossover_polia',
      name: 'Crossover na Polia (Cabo)',
      muscleGroup: 'Peitoral',
      type: 'isolador',
      description: 'Permite cruzar as mãos na frente do corpo maximizando a contração do peitoral.',
      instructions: 'Incline o tronco levemente à frente e mantenha a curvatura constante dos cotovelos.',
    },
    {
      id: 'crucifixo_inclinado_halteres',
      name: 'Crucifixo Inclinado com Halteres',
      muscleGroup: 'Peitoral',
      type: 'isolador',
      description: 'Foco de alongamento e isolamento na porção clavicular do peitoral.',
      instructions: 'Abra os braços em arco suave até sentir o alongamento do peito e feche no topo.',
    },
    {
      id: 'flexao_braco',
      name: 'Flexão de Braço (Push-up)',
      muscleGroup: 'Peitoral',
      type: 'composto',
      description: 'Exercício calistênico fundamental com excelente ativação de core e serrátil.',
      instructions: 'Corpo alinhado como uma prancha, desça o peito próximo ao chão.',
    },
  ],

  Costas: [
    {
      id: 'puxada_alta_pronada',
      name: 'Puxada Alta (Pegada Pronada)',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Desenvolve a largura das costas (latíssimo do dorso).',
      instructions: 'Puxe a barra em direção ao peitoral superior levando os cotovelos para baixo e para trás.',
    },
    {
      id: 'puxada_alta_neutra',
      name: 'Puxada Alta (Pegada Neutra)',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Menor estresse nos ombros e grande recrutamento da porção média e inferior do dorsal.',
      instructions: 'Uso de barra paralela ou pegadores individuais para menor estresse no ombro.',
    },
    {
      id: 'puxada_alta_supinada',
      name: 'Puxada Alta (Pegada Supinada)',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Combina trabalho intenso de dorsal com maior auxílio do bíceps braquial.',
      instructions: 'Palmas voltadas para você, puxe até o peito mantendo tronco estável.',
    },
    {
      id: 'remada_curvada_barra',
      name: 'Remada Curvada com Barra',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Constrói espessura na região dorsal e romboides.',
      instructions: 'Tronco inclinado a 45°. Mantenha abdômen contraído e puxe a barra na direção do umbigo.',
    },
    {
      id: 'remada_baixa_triangulo',
      name: 'Remada Baixa (Triângulo)',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Trabalho de densidade das costas com boa estabilização da coluna.',
      instructions: 'Coluna neutra, puxe até a linha do umbigo espremendo os dorsais.',
    },
    {
      id: 'remada_serrote',
      name: 'Remada Unilateral (Serrote)',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Permite corrigir assimetrias e focar na contração de um lado por vez.',
      instructions: 'Apoie a mão e o joelho oposto no banco, puxe o halter na direção do quadril.',
    },
    {
      id: 'remada_articulada',
      name: 'Remada Articulada na Máquina',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Trajetória guiada com suporte de peito para isolar as costas sem fadigar a lombar.',
      instructions: 'Mantenha o peito apoiado no estofado e puxe os pegadores espremendo as escápulas.',
    },
    {
      id: 'pulldown_polia',
      name: 'Pulldown com Corda / Barra na Polia',
      muscleGroup: 'Costas',
      type: 'isolador',
      description: 'Isola o latíssimo do dorso sem exigir flexão do cotovelo.',
      instructions: 'Braços semi-estendidos, puxe a barra da altura dos olhos até a coxa.',
    },
    {
      id: 'barra_fixa',
      name: 'Barra Fixa (Pull-up / Chin-up)',
      muscleGroup: 'Costas',
      type: 'composto',
      description: 'Exercício rei para costas com peso do próprio corpo.',
      instructions: 'Inicie na extensão completa dos braços e suba até o queixo passar da barra.',
    },
  ],

  Ombros: [
    {
      id: 'desenvolvimento_halteres',
      name: 'Desenvolvimento com Halteres',
      muscleGroup: 'Ombros',
      type: 'composto',
      description: 'Aumento de força e massa no deltoide anterior e lateral.',
      instructions: 'Sentado com apoio lombar, empurre até extensão quase completa dos cotovelos.',
    },
    {
      id: 'desenvolvimento_arnold',
      name: 'Desenvolvimento Arnold',
      muscleGroup: 'Ombros',
      type: 'composto',
      description: 'Trabalha os três feixes do deltoide com rotação fluida durante a subida.',
      instructions: 'Inicie com a palma virada para o rosto e rode ao empurrar acima da cabeça.',
    },
    {
      id: 'desenvolvimento_smith',
      name: 'Desenvolvimento no Smith / Barra',
      muscleGroup: 'Ombros',
      type: 'composto',
      description: 'Permite cargas mais pesadas focando na fase concêntrica.',
      instructions: 'Ajuste a barra na altura do queixo e empurre verticalmente com controle.',
    },
    {
      id: 'elevacao_lateral',
      name: 'Elevação Lateral com Halteres',
      muscleGroup: 'Ombros',
      type: 'isolador',
      description: 'Essencial para a largura dos ombros e formato "V-taper".',
      instructions: 'Cotovelos levemente flexionados, eleve até a altura dos ombros focando no deltoide lateral.',
    },
    {
      id: 'elevacao_lateral_polia',
      name: 'Elevação Lateral na Polia',
      muscleGroup: 'Ombros',
      type: 'isolador',
      description: 'Tensão constante em todo o arco de movimento devido ao cabo.',
      instructions: 'Puxe o cabo por trás ou pela frente do corpo mantendo o movimento fluído.',
    },
    {
      id: 'elevacao_lateral_inclinada',
      name: 'Elevação Lateral Inclinada no Banco',
      muscleGroup: 'Ombros',
      type: 'isolador',
      description: 'Elimina o impulso e isola perfeitamente a porção lateral.',
      instructions: 'Banco em 75°, isolamento com foco em tensão contínua do deltoide.',
    },
    {
      id: 'elevacao_frontal_halteres',
      name: 'Elevação Frontal com Halteres / Anilha',
      muscleGroup: 'Ombros',
      type: 'isolador',
      description: 'Isolamento da cabeça anterior do deltoide.',
      instructions: 'Eleve o halter à frente do corpo até a linha dos olhos com controle na descida.',
    },
  ],

  Tríceps: [
    {
      id: 'triceps_corda',
      name: 'Tríceps Corda (Polia Alta)',
      muscleGroup: 'Tríceps',
      type: 'isolador',
      description: 'Ótima contração final e pico de tensão no tríceps.',
      instructions: 'Cotovelos fixos ao lado do corpo, abra a corda no final da extensão.',
    },
    {
      id: 'triceps_barra_reta',
      name: 'Tríceps Barra Reta / W na Polia',
      muscleGroup: 'Tríceps',
      type: 'isolador',
      description: 'Permite maior sobrecarga mantendo articulação dos pulsos protegida.',
      instructions: 'Mantenha os cotovelos colados ao corpo e estenda completamente os braços.',
    },
    {
      id: 'triceps_frances_unilateral',
      name: 'Tríceps Francês Unilateral',
      muscleGroup: 'Tríceps',
      type: 'isolador',
      description: 'Enfatiza o alongamento da cabeça longa do tríceps.',
      instructions: 'Halter ou polia atrás da cabeça, alongue completamente a cabeça longa do tríceps.',
    },
    {
      id: 'triceps_testa',
      name: 'Tríceps Testa com Barra W / Halteres',
      muscleGroup: 'Tríceps',
      type: 'isolador',
      description: 'Exercício clássico de massa para a cabeça lateral e longa do tríceps.',
      instructions: 'Deitado no banco, flexione os cotovelos levando a barra em direção à testa e estenda.',
    },
    {
      id: 'mergulho_banco',
      name: 'Mergulho em Banco / Paralelas',
      muscleGroup: 'Tríceps',
      type: 'composto',
      description: 'Trabalho composto com peso corporal para tríceps e peitoral inferior.',
      instructions: 'Apoie as mãos no banco atrás de você e flexione os cotovelos a 90°.',
    },
    {
      id: 'triceps_coice',
      name: 'Tríceps Coice na Polia / Halter',
      muscleGroup: 'Tríceps',
      type: 'isolador',
      description: 'Contração de pico máxima no final do movimento.',
      instructions: 'Tronco inclinado à frente, estenda o braço para trás paralelo ao tronco.',
    },
  ],

  Bíceps: [
    {
      id: 'rosca_direta_barra',
      name: 'Rosca Direta com Barra (Reta ou W)',
      muscleGroup: 'Bíceps',
      type: 'isolador',
      description: 'Exercício construtor principal de volume e força no bíceps.',
      instructions: 'Cotovelos junto ao tronco sem balançar o corpo.',
    },
    {
      id: 'rosca_martelo',
      name: 'Rosca Martelo com Halteres',
      muscleGroup: 'Bíceps',
      type: 'isolador',
      description: 'Fortalece o braquial e braquiorradial, aumentando a largura do braço.',
      instructions: 'Pegada neutra (palmas voltadas para dentro), fortalecendo antebraço e braquiorradial.',
    },
    {
      id: 'rosca_alternada',
      name: 'Rosca Alternada com Halteres',
      muscleGroup: 'Bíceps',
      type: 'isolador',
      description: 'Permite a supinação do pulso durante a subida para pico de contração.',
      instructions: 'Suba o halter girando a palma para cima no topo do movimento.',
    },
    {
      id: 'rosca_scott',
      name: 'Rosca Scott no Banco / Máquina',
      muscleGroup: 'Bíceps',
      type: 'isolador',
      description: 'Isola o bíceps impedindo qualquer tipo de roubo ou impulso com o tronco.',
      instructions: 'Apoie os tríceps no estofado e suba a barra até a contração máxima.',
    },
    {
      id: 'rosca_inclinada_halteres',
      name: 'Rosca Inclinada com Halteres',
      muscleGroup: 'Bíceps',
      type: 'isolador',
      description: 'Maior alongamento da cabeça longa do bíceps no início do movimento.',
      instructions: 'Banco em 45°, deixe os braços caírem para trás antes de flexionar os cotovelos.',
    },
    {
      id: 'rosca_concentrada',
      name: 'Rosca Concentrada com Halter',
      muscleGroup: 'Bíceps',
      type: 'isolador',
      description: 'Foco total no pico do bíceps com controle estrito.',
      instructions: 'Sentado, apoie o cotovelo na coxa interna e flexione o braço lentamente.',
    },
  ],

  Quadríceps: [
    {
      id: 'agachamento_goblet',
      name: 'Agachamento Goblet',
      muscleGroup: 'Quadríceps',
      type: 'composto',
      description: 'Excelente padrão de agachamento frontal com carga centralizada.',
      instructions: 'Mantenha a postura ereta, cotovelos apontando para baixo e base firme com halter no peito.',
    },
    {
      id: 'agachamento_livre_barra',
      name: 'Agachamento Livre com Barra',
      muscleGroup: 'Quadríceps',
      type: 'composto',
      description: 'O exercício rei dos membros inferiores para força e hipertrofia global.',
      instructions: 'Barra apoiada nos trapézios, agache mantendo o tronco firme e calcanhares presos ao chão.',
    },
    {
      id: 'leg_press_45',
      name: 'Leg Press 45°',
      muscleGroup: 'Quadríceps',
      type: 'composto',
      description: 'Sobrecarga de quadríceps com segurança e estabilização para a coluna.',
      instructions: 'Pés afastados na largura do quadril, empurre pelo calcanhar mantendo joelhos alinhados.',
    },
    {
      id: 'passada_split_squat',
      name: 'Passada no Lugar (Split Squat)',
      muscleGroup: 'Quadríceps',
      type: 'composto',
      description: 'Trabalho unilateral para corrigir assimetrias de força e massa.',
      instructions: 'Trabalho unilateral com foco no controle do movimento e estabilidade do quadril.',
    },
    {
      id: 'agachamento_bulgaro',
      name: 'Agachamento Búlgaro com Halteres',
      muscleGroup: 'Quadríceps',
      type: 'composto',
      description: 'Excelente para recrutamento intenso de quadríceps e glúteo de forma unilateral.',
      instructions: 'Apoie o pé traseiro em um banco e desça a perna da frente em ângulo de 90°.',
    },
    {
      id: 'extensao_joelho',
      name: 'Cadeira Extensora',
      muscleGroup: 'Quadríceps',
      type: 'isolador',
      description: 'Isola diretamente todas as 4 cabeças do quadríceps em cadeia aberta.',
      instructions: 'Controle a fase concêntrica e segure 1s no topo da extensão para contração total.',
    },
    {
      id: 'agachamento_hack',
      name: 'Agachamento Hack Machine',
      muscleGroup: 'Quadríceps',
      type: 'composto',
      description: 'Suporte de costas para focar a força nos quadríceps com segurança.',
      instructions: 'Apoie as costas no encosto e desça até os joelhos atingirem 90° de flexão.',
    },
  ],

  Glúteos: [
    {
      id: 'elevacao_pelvica',
      name: 'Elevação Pélvica (Hip Thrust)',
      muscleGroup: 'Glúteos',
      type: 'composto',
      description: 'O melhor exercício para máxima hipertrofia de glúteo máximo.',
      instructions: 'Escápulas apoiadas no banco, empurre pelos calcanhares até alinhamento total do quadril.',
    },
    {
      id: 'hip_thrust_barra',
      name: 'Hip Thrust com Barra Pesada',
      muscleGroup: 'Glúteos',
      type: 'composto',
      description: 'Permite grande sobrecarga de peso para densidade de glúteo.',
      instructions: 'Força concentrada nos glúteos e estabilização de pelve com almofada na barra.',
    },
    {
      id: 'abducao_quadril',
      name: 'Abdução de Quadril (Cadeira Abdutora)',
      muscleGroup: 'Glúteos',
      type: 'isolador',
      description: 'Ativação do glúteo médio e mínimo para formato e estabilidade da bacia.',
      instructions: 'Aposte na extensão para fora e faça uma pequena pausa de 1s no ponto de abertura.',
    },
    {
      id: 'gluteo_polia',
      name: 'Glúteo Coice na Polia (Kickback)',
      muscleGroup: 'Glúteos',
      type: 'isolador',
      description: 'Isolamento fino com cabo para o topo e extensão do glúteo.',
      instructions: 'Incline o corpo à frente e chuta a perna para trás contraindo o glúteo.',
    },
    {
      id: 'agachamento_sumo',
      name: 'Agachamento Sumô com Halter / Barra',
      muscleGroup: 'Glúteos',
      type: 'composto',
      description: 'Base larga que recruta ativamente adutores e glúteos.',
      instructions: 'Pés apontados para fora a 45°, agache empurrando os joelhos na direção dos pés.',
    },
  ],

  'Posterior de Coxa': [
    {
      id: 'stiff_halteres',
      name: 'Stiff com Halteres / Barra',
      muscleGroup: 'Posterior de Coxa',
      type: 'composto',
      description: 'Trabalha a cadeia posterior em alongamento intenso.',
      instructions: 'Mantenha joelhos levemente flexionados, coluna neutra e empurre o quadril para trás.',
    },
    {
      id: 'cadeira_flexora',
      name: 'Cadeira Flexora',
      muscleGroup: 'Posterior de Coxa',
      type: 'isolador',
      description: 'Excelente isolamento dos isquiotibiais em posição sentada.',
      instructions: 'Fortalecimento isolado do posterior de coxa. Segure 1s na máxima contração.',
    },
    {
      id: 'mesa_flexora',
      name: 'Mesa Flexora Deitada',
      muscleGroup: 'Posterior de Coxa',
      type: 'isolador',
      description: 'Inicia o movimento com os isquiotibiais em extensão completa.',
      instructions: 'Deitado de bruços, flexione as pernas trazendo o rolo até os glúteos.',
    },
    {
      id: 'rdl_romanian_deadlift',
      name: 'Romanian Deadlift (RDL)',
      muscleGroup: 'Posterior de Coxa',
      type: 'composto',
      description: 'Variante do levantamento terra focada em força de posterior e glúteos.',
      instructions: 'Desça a barra rente às pernas até a linha do joelho sentindo o alongamento do posterior.',
    },
  ],

  'Deltoide Posterior': [
    {
      id: 'face_pull',
      name: 'Face Pull na Polia',
      muscleGroup: 'Deltoide Posterior',
      type: 'isolador',
      description: 'Desenvolve deltoide posterior e manguito rotador.',
      instructions: 'Puxe a corda em direção aos olhos separando as mãos e rodando externamente os ombros.',
    },
    {
      id: 'crucifixo_invertido_maquina',
      name: 'Crucifixo Invertido na Máquina (Peck Deck Inverso)',
      muscleGroup: 'Deltoide Posterior',
      type: 'isolador',
      description: 'Isolamento guiado para a parte de trás dos ombros.',
      instructions: 'Sentado de frente para a máquina, abra os braços para trás sentindo o deltoide posterior.',
    },
    {
      id: 'crucifixo_invertido_halteres',
      name: 'Crucifixo Invertido com Halteres (Curvado)',
      muscleGroup: 'Deltoide Posterior',
      type: 'isolador',
      description: 'Trabalho livre para a porção posterior do ombro.',
      instructions: 'Tronco inclinado a 45°, eleve os halteres para os lados focando na porção posterior.',
    },
  ],

  Gastrocnêmio: [
    {
      id: 'panturrilha_em_pe',
      name: 'Panturrilha em Pé',
      muscleGroup: 'Gastrocnêmio',
      type: 'isolador',
      description: 'Ativação das duas cabeças do gastrocnêmio com pernas estendidas.',
      instructions: 'Pausa de 1 segundo na máxima contração no topo.',
    },
    {
      id: 'panturrilha_leg_press',
      name: 'Panturrilha no Leg Press',
      muscleGroup: 'Gastrocnêmio',
      type: 'isolador',
      description: 'Permite grande amplitude de movimento na ponta dos pés.',
      instructions: 'Apoie apenas as pontas dos pés na base do leg press e flexione o tornozelo.',
    },
  ],

  Sóleo: [
    {
      id: 'panturrilha_sentado',
      name: 'Panturrilha Sentado (Gêmeos)',
      muscleGroup: 'Sóleo',
      type: 'isolador',
      description: 'Com joelhos flexionados, o músculo sóleo assume o trabalho principal.',
      instructions: 'Movimento lento com foco em extensão do tornozelo.',
    },
  ],

  'Core / Abdômen': [
    {
      id: 'prancha_isometrica',
      name: 'Prancha Isométrica',
      muscleGroup: 'Core / Abdômen',
      type: 'core',
      description: 'Estabilidade do tronco e ativação do reto abdominal e transverso.',
      instructions: 'Alinhamento da cabeça ao calcanhar, contraindo glúteos e abdômen.',
    },
    {
      id: 'abdominal_infra',
      name: 'Abdominal Infra na Barra / Banco',
      muscleGroup: 'Core / Abdômen',
      type: 'core',
      description: 'Foco na porção inferior do abdômen.',
      instructions: 'Eleve os joelhos ou pernas estendidas até a altura do quadril com controle.',
    },
    {
      id: 'abdominal_supra_cabo',
      name: 'Abdominal Supra na Polia (Crunches na Ajoelhado)',
      muscleGroup: 'Core / Abdômen',
      type: 'core',
      description: 'Permite adicionar sobrecarga progressiva ao treino de abdômen.',
      instructions: 'Ajoelhado com a corda atrás da cabeça, flexione o tronco trazendo os cotovelos aos joelhos.',
    },
  ],
};

/**
 * Retorna lista de exercícios alternativos sugeridos para o mesmo grupo muscular.
 */
export function getAlternativesForMuscle(muscleGroup: string, currentExerciseId?: string): AlternativeExercise[] {
  // Procura correspondência exata ou parcial no grupo muscular
  let key = Object.keys(EXERCISE_ALTERNATIVES_BY_MUSCLE).find(
    (k) => k.toLowerCase() === muscleGroup.toLowerCase() || muscleGroup.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(muscleGroup.toLowerCase())
  );

  if (!key) {
    // Fallback: se o grupo for "Quadríceps / Glúteo", tenta Quadríceps ou Glúteos
    if (muscleGroup.toLowerCase().includes('quadríceps')) key = 'Quadríceps';
    else if (muscleGroup.toLowerCase().includes('glúteo')) key = 'Glúteos';
    else if (muscleGroup.toLowerCase().includes('costas')) key = 'Costas';
    else if (muscleGroup.toLowerCase().includes('peitoral')) key = 'Peitoral';
    else if (muscleGroup.toLowerCase().includes('ombro')) key = 'Ombros';
    else if (muscleGroup.toLowerCase().includes('bíceps')) key = 'Bíceps';
    else if (muscleGroup.toLowerCase().includes('tríceps')) key = 'Tríceps';
    else if (muscleGroup.toLowerCase().includes('posterior')) key = 'Posterior de Coxa';
    else key = 'Peitoral';
  }

  const list = EXERCISE_ALTERNATIVES_BY_MUSCLE[key] || [];

  // Filtra o exercício atual da lista de alternativas se fornecido
  if (currentExerciseId) {
    return list.filter((item) => item.id !== currentExerciseId);
  }

  return list;
}
