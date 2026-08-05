import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client with telemetry header
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Fallback algorithm for progressive overload in case Gemini is unavailable
function generateLocalOverloadSuggestions(body: any) {
  const { user, logs, targetWorkoutId, workouts } = body;
  const currentWeek = user?.currentWeek || 4;
  const isDeload = currentWeek === 8;

  const targetWorkout = workouts?.find((w: any) => w.id === targetWorkoutId) || workouts?.[0];
  const workoutName = targetWorkout?.name || 'Treino Principal';

  const suggestions = (targetWorkout?.exercises || []).slice(0, 6).map((ex: any) => {
    // Find last log for this exercise
    let lastSetWeight = 20;
    let lastSetReps = ex.repRange?.[0] || 8;
    let lastRpe = 8;
    let foundInLogs = false;

    if (logs && Array.isArray(logs)) {
      for (const log of logs) {
        const foundEx = log.exercises?.find((e: any) => e.exerciseId === ex.id);
        if (foundEx && foundEx.sets?.length > 0) {
          const validSets = foundEx.sets.filter((s: any) => s.completed && s.weight > 0);
          if (validSets.length > 0) {
            lastSetWeight = validSets[0].weight;
            lastSetReps = validSets[0].reps;
            lastRpe = foundEx.rpe || 8;
            foundInLogs = true;
            break;
          }
        }
      }
    }

    const isCompound = ex.type === 'composto';
    let actionType: 'increase_weight' | 'increase_reps' | 'maintain_form' | 'deload_recovery' = 'increase_weight';
    let recWeight = lastSetWeight;
    let recReps = lastSetReps;
    let rationale = '';
    let kneeCaution = null;

    if (isDeload) {
      actionType = 'deload_recovery';
      recWeight = Math.max(2, Math.round(lastSetWeight * 0.7 * 2) / 2);
      recReps = ex.repRange?.[1] || 10;
      rationale = 'Semana de Deload: redução estratégica de 30% na carga para regeneração ligamentar e articular.';
    } else if (foundInLogs && lastSetReps >= (ex.repRange?.[1] || 10) && lastRpe <= 8) {
      actionType = 'increase_weight';
      const inc = isCompound ? 2.5 : 1.0;
      recWeight = Math.round((lastSetWeight + inc) * 2) / 2;
      recReps = ex.repRange?.[0] || 8;
      rationale = `Você atingiu o topo das repetições (${lastSetReps} reps) com boa reserva de força (RPE ${lastRpe}). Subir +${inc}kg mantendo ${recReps} reps controladas.`;
    } else if (foundInLogs && lastSetReps < (ex.repRange?.[1] || 10)) {
      actionType = 'increase_reps';
      recWeight = lastSetWeight;
      recReps = Math.min(ex.repRange?.[1] || 10, lastSetReps + 1);
      rationale = `Dupla Progressão: mantenha ${recWeight}kg e busque +1 repetição por série antes de aumentar a carga absoluta.`;
    } else {
      actionType = 'maintain_form';
      recWeight = lastSetWeight;
      recReps = ex.repRange?.[1] || 10;
      rationale = 'Consolidação de técnica e cadência excêntrica de 3s para maximizar tensão mecânica sem sobrecarga nas articulações.';
    }

    if (ex.kneeSensitive || ex.id?.includes('agachamento') || ex.id?.includes('leg') || ex.id?.includes('extensora') || ex.id?.includes('bulgaro')) {
      kneeCaution = '🛡️ Proteção LCA: Mantenha o joelho alinhado ao 2º dedo do pé, sem colapso em valgo. Priorize 3s na descida.';
    }

    return {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup || 'Geral',
      actionType,
      lastPerformance: foundInLogs ? `${ex.sets}x${lastSetReps} com ${lastSetWeight}kg @ RPE ${lastRpe}` : 'Sem registro recente',
      nextTarget: `${ex.sets}x${recReps} com ${recWeight}kg`,
      recommendedWeight: recWeight,
      recommendedReps: recReps,
      recommendedSets: ex.sets || 3,
      rationale,
      priority: isCompound ? 'alta' : 'média',
      kneeCaution,
      biomechanicalTip: isCompound
        ? 'Controle a fase excêntrica e faça contração máxima no pico do movimento.'
        : 'Foco no isolamento e na conexão mente-músculo sem balanço corporal.',
    };
  });

  return {
    coachSummary: `Análise da Semana ${currentWeek}: Seu momento é favorável para progressões sólidas. O foco deve ser a sobrecarga controlada nos exercícios base e consolidação no modelo de Dupla Progressão.`,
    readinessScore: 92,
    overallStrategy: isDeload
      ? 'Fase de Deload: Regeneração do sistema neuromuscular e tendíneo com foco em amplitude limpa.'
      : 'Fase de Hipertrofia: Priorizar acréscimo de carga nos compostos e repetições nos isoladores.',
    targetWorkout: {
      id: targetWorkout?.id || 'push',
      name: workoutName,
    },
    suggestions,
    weeklyFocus: [
      'Executar cadência excêntrica controlada (2-3s) em todos os movimentos.',
      'Garantir estabilidade articular e controle unilateral para proteção do LCA.',
      'Registrar o RPE real após cada série para calibrar os próximos saltos.',
    ],
    timestamp: new Date().toISOString(),
    isFallback: true,
  };
}

// POST endpoint for Gemini Progressive Overload Analysis
app.post('/api/ai/progressive-overload', async (req, res) => {
  try {
    const { user, logs, targetWorkoutId, workouts } = req.body;

    const ai = getGeminiClient();

    // If no API key configured, use intelligent rule-based engine
    if (!ai) {
      console.log('Gemini API key not found in server environment, using local engine.');
      const localResult = generateLocalOverloadSuggestions(req.body);
      return res.json(localResult);
    }

    const currentWeek = user?.currentWeek || 4;
    const userGoal = user?.goal || 'Hipertrofia & Sobrecarga Progressiva';
    const userLevel = user?.level || 'intermediário';
    const targetWorkout = workouts?.find((w: any) => w.id === targetWorkoutId) || workouts?.[0];

    // Filter relevant recent logs (up to last 10 logs)
    const recentLogs = (logs || []).slice(0, 10).map((l: any) => ({
      date: l.date,
      workoutId: l.workoutId,
      workoutName: l.workoutName,
      totalVolumeKg: l.totalVolumeKg,
      exercises: (l.exercises || []).map((e: any) => ({
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        rpe: e.rpe,
        notes: e.notes,
        sets: (e.sets || []).map((s: any) => ({
          weight: s.weight,
          reps: s.reps,
          targetWeight: s.targetWeight,
          targetReps: s.targetReps,
          completed: s.completed,
        })),
      })),
    }));

    const promptText = `
Você é o treinador principal e biomecânico de elite do aplicativo "Treinologia", especialista em hipertrofia, periodização de sobrecarga progressiva (Double Progression) e reabilitação/performance de atletas com reconstrução de Ligamento Cruzado Anterior (LCA) e praticantes de handebol.

DADOS DO ATLETA:
- Nome: ${user?.name || 'Atleta'}
- Nível: ${userLevel}
- Objetivo: ${userGoal}
- Ciclo Atual: ${user?.currentCycle || 1}
- Semana Atual do Ciclo: Semana ${currentWeek} de 8
- Treino Alvo para Próxima Sessão: ${targetWorkout?.name || 'Treino do Dia'} (${targetWorkout?.subtitle || ''})
- Exercícios do Treino Alvo: ${JSON.stringify(targetWorkout?.exercises || [])}

HISTÓRICO RECENTE DE TREINOS (LOGS):
${JSON.stringify(recentLogs, null, 2)}

DIRETRIZES DE SOBRECARGA PROGRESSIVA E FISIOLOGIA:
1. "Double Progression" (Dupla Progressão):
   - Se o atleta completou o teto do intervalo de repetições em todas as séries com RPE <= 8 (ex: meta era 8-10 reps e ele fez 10-10-10), recomende subir a carga (+2.5kg a 5kg em compostos, +1kg a 2kg em isoladores) e reiniciar no piso do intervalo (8 reps).
   - Se o atleta fez repetições intermediárias (ex: 10, 9, 8), recomende manter a mesma carga e buscar +1 repetição na série que falhou antes do teto.
   - Se o RPE foi 9.5-10 ou falhou muito cedo, recomende manter ou consolidar execução.
2. Atenção Especial ao Joelho / LCA (Membros Inferiores & Pliometria):
   - Em exercícios de perna (Agachamento, Leg Press, Búlgaro, Cadeira Extensora, Stiff), inclua orientações biomecânicas de proteção (alinhamento joelho-pé, não permitir valgo dinâmico, cadência excêntrica controlada de 3s, ativação de glúteo médio e isquiotibiais).
3. Semana 8 (Deload):
   - Se estiver na semana 8, prescreva redução de 40-50% no volume de séries e 25-30% na carga para regeneração neural e ligamentar.

Gere uma análise concisa, altamente técnica e motivadora em formato JSON estruturado com recomendações diretas para cada exercício do treino alvo.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction:
          'Você é um treinador de força e fisiologista especialista em sobrecarga progressiva, hipertrofia e reabilitação de LCA. Responda estritamente em JSON válido seguindo o esquema solicitado.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coachSummary: {
              type: Type.STRING,
              description: 'Resumo executivo do treinador para a sessão e momento do ciclo.',
            },
            readinessScore: {
              type: Type.NUMBER,
              description: 'Score de prontidão física de 1 a 100.',
            },
            overallStrategy: {
              type: Type.STRING,
              description: 'Estratégia central para o treino alvo.',
            },
            targetWorkout: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
              },
              required: ['id', 'name'],
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  exerciseId: { type: Type.STRING },
                  exerciseName: { type: Type.STRING },
                  muscleGroup: { type: Type.STRING },
                  actionType: {
                    type: Type.STRING,
                    description: 'Tipo de ação: increase_weight, increase_reps, maintain_form, ou deload_recovery',
                  },
                  lastPerformance: {
                    type: Type.STRING,
                    description: 'Descrição do último desempenho encontrado (ex: 3x10 com 28kg @ RPE 8)',
                  },
                  nextTarget: {
                    type: Type.STRING,
                    description: 'Meta exata para a próxima sessão (ex: 3x8 com 30kg)',
                  },
                  recommendedWeight: { type: Type.NUMBER },
                  recommendedReps: { type: Type.NUMBER },
                  recommendedSets: { type: Type.NUMBER },
                  rationale: {
                    type: Type.STRING,
                    description: 'Justificativa fisiológica e de sobrecarga progressiva para este ajuste.',
                  },
                  priority: {
                    type: Type.STRING,
                    description: 'Prioridade: alta, média ou baixa',
                  },
                  kneeCaution: {
                    type: Type.STRING,
                    description: 'Dica específica de proteção articular/LCA se aplicável, ou string vazia.',
                  },
                  biomechanicalTip: {
                    type: Type.STRING,
                    description: 'Dica biomecânica prática de execução e cadência.',
                  },
                },
                required: [
                  'exerciseId',
                  'exerciseName',
                  'actionType',
                  'lastPerformance',
                  'nextTarget',
                  'recommendedWeight',
                  'recommendedReps',
                  'recommendedSets',
                  'rationale',
                  'priority',
                  'biomechanicalTip',
                ],
              },
            },
            weeklyFocus: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista com 3 pontos chave de foco para a semana.',
            },
          },
          required: ['coachSummary', 'readinessScore', 'overallStrategy', 'targetWorkout', 'suggestions', 'weeklyFocus'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Resposta vazia do modelo Gemini');
    }

    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      timestamp: new Date().toISOString(),
      aiPowered: true,
    });
  } catch (err: any) {
    console.error('Erro na chamada do Gemini API:', err);
    // Fallback gracefully so the athlete never sees a blank or broken screen
    const fallback = generateLocalOverloadSuggestions(req.body);
    return res.json({
      ...fallback,
      errorNotice: err?.message || 'Falha na comunicação com o Gemini. Gerado via motor local de progressão.',
    });
  }
});

// Setup Vite dev server or static dist serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Treinologia Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
