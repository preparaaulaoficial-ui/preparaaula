import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { tema, contexto, disciplina, nivel, duracao, turma, qtdSlides = 12 } = await request.json()

    const authHeader = request.headers.get('authorization')
    if (!authHeader) return Response.json({ erro: 'Não autorizado' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return Response.json({ erro: 'Sessão inválida' }, { status: 401 })

    const { data: perfil } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!perfil) return Response.json({ erro: 'Perfil não encontrado' }, { status: 404 })

    // ─── Limites por plano ────────────────────────────────────────────────────
    // Custo API por aula ≈ R$0,75 | Dólar referência: R$5,80
    // Starter  R$57  → 20 aulas → custo API ~R$15,00 → margem ~72%
    // Pro      R$97  → 35 aulas → custo API ~R$26,25 → margem ~72%
    // Escola   R$197 → 60 aulas → custo API ~R$45,00 → margem ~74%
    const LIMITES_PLANO = {
      starter:      20,
      profissional: 35,
      escola:       60,
    }

    // Bloqueia se plano não está ativo (ex: pagamento pendente)
    if (!perfil.plano_ativo && perfil.plano !== 'starter') {
      return Response.json({
        erro: 'Seu plano está inativo. Verifique seu pagamento em /planos.',
        plano_inativo: true
      }, { status: 403 })
    }

    const limiteMes = LIMITES_PLANO[perfil.plano] ?? LIMITES_PLANO.starter
    const mesAtual  = new Date().toISOString().slice(0, 7)

    if (perfil.ultimo_reset_mes !== mesAtual) {
      await supabase.from('profiles').update({ aulas_mes: 0, ultimo_reset_mes: mesAtual }).eq('id', user.id)
      perfil.aulas_mes = 0
    }

    const aulasUsadas   = perfil.aulas_mes || 0
    const aulasRestantes = limiteMes - aulasUsadas

    if (aulasUsadas >= limiteMes) {
      const upgrades = { starter: 'Profissional', profissional: 'Escola' }
      const sugestao = upgrades[perfil.plano]
        ? ` Faça upgrade para o plano ${upgrades[perfil.plano]} em /planos.`
        : ' Entre em contato com o suporte.'

      return Response.json({
        erro: `Você atingiu o limite de ${limiteMes} aulas do plano ${perfil.plano} este mês.${sugestao}`,
        limite_atingido: true,
        aulas_usadas:    aulasUsadas,
        limite_mes:      limiteMes,
        reset_em:        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      }, { status: 429 })
    }

    // ─── Distribuição pedagógica dos slides ────────────────────────────────────
    // Estrutura obrigatória: introducao + desenvolvimento + execucao + revisao
    // Slides fixos: capa(1) + introducao(1) + execucao(1) + revisao(1) = 4
    // Slides de desenvolvimento: preenchem o restante
    const qtdTotal  = Math.max(6, Math.min(20, Number(qtdSlides)))
    const qtdDesenv = qtdTotal - 4

    // Dentro do desenvolvimento: 50% conceitos, 30% exemplos práticos, 20% dados
    const qtdConceitos = Math.max(1, Math.round(qtdDesenv * 0.5))
    const qtdExemplos  = Math.max(1, Math.round(qtdDesenv * 0.3))
    const qtdDados     = Math.max(0, qtdDesenv - qtdConceitos - qtdExemplos)

    const contextoCompleto = contexto?.trim()
      ? `O professor descreveu exatamente o que quer ensinar:\n"${contexto}"\n\nTodo o conteúdo da aula deve ser construído EXCLUSIVAMENTE sobre esse contexto.`
      : `Tema da aula: ${tema}`

    // ─── Monta blocos dinâmicos do desenvolvimento ────────────────────────────
    let num = 3 // slide 1=capa, 2=introducao, desenvolvimento começa em 3

    const blocosConceitos = Array.from({ length: qtdConceitos }, (_, i) => {
      const n = num++
      return `    {
      "slide": ${n},
      "etapa": "desenvolvimento",
      "tipo": "conceito",
      "titulo": "Título claro e informativo — um único tópico principal do tema",
      "conteudo": [
        "Tópico 1: conceito principal explicado de forma clara, com dado real ou contexto verificável. Mínimo 20 palavras.",
        "Tópico 2: explicação progressiva — aprofunde o conceito com causa, mecanismo ou consequência real. Mínimo 20 palavras.",
        "Tópico 3: exemplo prático de como esse conceito aparece no mundo real — nome, lugar, ano ou dado concreto.",
        "Tópico 4: aplicação — como esse conhecimento é usado na vida real ou no cotidiano do aluno de ${nivel}.",
        "Tópico 5: comparação ou analogia que facilite a compreensão para alunos de ${nivel}."
      ],
      "imagem_sugerida": "Descrição específica de imagem, diagrama, gráfico ou mapa que ilustre este conceito visualmente",
      "roteiro_professor": "O que explicar oralmente neste slide além do que está escrito: pontos de atenção, erros comuns dos alunos, como aprofundar o conceito, perguntas que o professor pode fazer à turma para verificar compreensão",
      "layout": "conceito",
      "cor_fundo": "${i % 2 === 0 ? '#ffffff' : '#0f172a'}",
      "cor_texto": "${i % 2 === 0 ? '#0f172a' : '#ffffff'}",
      "destaque": "Palavra-chave, dado numérico ou termo central deste conceito"
    }`
    }).join(',\n')

    const blocosExemplos = Array.from({ length: qtdExemplos }, (_, i) => {
      const n = num++
      return `    {
      "slide": ${n},
      "etapa": "desenvolvimento",
      "tipo": "exemplo",
      "titulo": "Nome do caso real, aplicação prática ou situação concreta",
      "conteudo": [
        "Contexto: quando aconteceu, onde, quem foram os envolvidos — nomes reais, datas e localização específica.",
        "O que aconteceu: descrição do fato ou aplicação com resultado concreto mensurável (número, percentual, escala).",
        "Por que isso importa para o tema desta aula — conexão direta com o conteúdo do desenvolvimento.",
        "O que o aluno pode aprender com esse exemplo e como isso aparece na vida real ou no mercado de trabalho.",
        "Reflexão: o que teria acontecido de diferente sem esse conhecimento ou aplicação."
      ],
      "imagem_sugerida": "Foto, mapa ou ilustração específica do caso ou aplicação mencionada neste slide",
      "roteiro_professor": "Como apresentar este caso em sala: contexto adicional, perguntas ao redor do exemplo, o que destacar, como conectar com experiências dos alunos",
      "layout": "exemplo",
      "cor_fundo": "#fffbeb",
      "cor_texto": "#0f172a",
      "destaque": "Nome do caso real ou resultado numérico mais impactante"
    }`
    }).join(',\n')

    const blocosDados = qtdDados > 0
      ? ',' + Array.from({ length: qtdDados }, (_, i) => {
          const n = num++
          return `    {
      "slide": ${n},
      "etapa": "desenvolvimento",
      "tipo": "dado_visual",
      "titulo": "Título que explica o significado e relevância deste dado para o tema",
      "conteudo": [
        "Origem do dado: quem mediu, quando, onde — fonte e contexto específico.",
        "O que este número revela sobre o tema e por que é relevante para esta aula.",
        "Como esse dado se compara com outros contextos ou períodos históricos.",
        "O que esse número significa na prática para o aluno de ${nivel}.",
        "Como esse dado pode mudar nos próximos anos e por quê."
      ],
      "imagem_sugerida": "Gráfico de barras, linha do tempo ou infográfico que mostre a evolução ou proporção deste dado",
      "roteiro_professor": "Como contextualizar este dado em sala: comparações que tornam o número mais compreensível, perguntas para engajar os alunos, dados complementares que o professor pode mencionar",
      "layout": "dado_visual",
      "cor_fundo": "#1a56db",
      "cor_texto": "#ffffff",
      "destaque": "O número, percentual ou valor mais impactante — ex: 68%, R$2,4tri, 40 anos"
    }`
        }).join(',\n')
      : ''

    const slideExecucao = num++
    const slideRevisao  = num

    const prompt = `Você é um professor especialista em ${disciplina} com 20 anos de experiência e designer de apresentações educacionais. Você cria aulas completas, claras e pedagogicamente organizadas.

${contextoCompleto}

DADOS DA AULA:
- Disciplina: ${disciplina}
- Nível: ${nivel}
- Duração: ${duracao}
- Turma: ${turma || 'não especificada'}
- Total de slides: ${qtdTotal}

════════════════════════════════════════════════════════
ESTRUTURA PEDAGÓGICA OBRIGATÓRIA — SIGA EXATAMENTE
════════════════════════════════════════════════════════

Toda aula segue esta sequência sem exceção:

┌─────────────────────────────────────────────────────┐
│ 1. INTRODUÇÃO                                       │
│    • Apresentar o tema da aula                      │
│    • Contextualizar o conteúdo                      │
│    • Despertar o interesse dos alunos               │
│    • Apresentar o objetivo da aula                  │
│    • Pergunta provocativa ou situação inicial       │
├─────────────────────────────────────────────────────┤
│ 2. DESENVOLVIMENTO  ← PARTE MAIS COMPLETA           │
│    • Conceitos fundamentais do tema                 │
│    • Explicações didáticas progressivas             │
│    • Exemplos práticos com casos reais              │
│    • Aplicações do conteúdo no mundo real           │
│    • Comparações e analogias para facilitar         │
├─────────────────────────────────────────────────────┤
│ 3. EXECUÇÃO                                         │
│    • Atividade prática diretamente ligada ao        │
│      conteúdo do desenvolvimento                   │
│    • Alunos aplicam o conhecimento aprendido        │
│    • Pode ser: exercício, debate, análise, problema │
├─────────────────────────────────────────────────────┤
│ 4. REVISÃO                                          │
│    • Resumo dos conceitos principais                │
│    • Perguntas de revisão                           │
│    • Síntese final para fixar o conhecimento        │
└─────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════
REGRAS DE CONTEÚDO DOS SLIDES — OBRIGATÓRIAS
════════════════════════════════════════════════════════

QUANTIDADE DE CONTEÚDO POR SLIDE:
→ Entre 5 e 8 tópicos (bullet points) por slide
→ Cada tópico: frase curta e objetiva (1 a 2 linhas)
→ PROIBIDO parágrafos longos ou blocos de texto
→ Cada slide trata de UM único tópico principal

ESTRUTURA INTERNA DE CADA SLIDE:
1. Conceito principal
2. Explicação resumida
3. Exemplo ou aplicação
4. Complemento informativo

QUALIDADE DO CONTEÚDO:
→ Linguagem clara e didática, adequada ao ${nivel}
→ Explicação progressiva dos conceitos
→ Exemplos práticos com dados reais e verificáveis
→ Coerência pedagógica — cada slide avança o raciocínio
→ PROIBIDO: respostas genéricas, definições vagas, conteúdo superficial
→ PROIBIDO: "é fundamental", "cabe destacar", "no contexto atual", "é importante ressaltar"

ROTEIRO DO PROFESSOR — OBRIGATÓRIO EM TODOS OS SLIDES:
→ Cada slide DEVE ter um "roteiro_professor" com:
   - O que explicar oralmente além do slide
   - Exemplos adicionais que o professor pode dar
   - Perguntas para engajar a turma
   - Observações pedagógicas e pontos de atenção
→ Os slides são suporte visual — a explicação vem do professor

ELEMENTOS VISUAIS — OBRIGATÓRIO EM TODOS OS SLIDES:
→ Cada slide DEVE ter "imagem_sugerida" descrevendo:
   - Imagem ilustrativa específica
   - Gráfico ou diagrama quando aplicável
   - Mapa, esquema ou infográfico quando útil
→ Elementos visuais reforçam o conteúdo explicado

════════════════════════════════════════════════════════
SOBRE A ATIVIDADE DE EXECUÇÃO
════════════════════════════════════════════════════════

A atividade NÃO é um slide — é um objeto separado.
Deve estar DIRETAMENTE relacionada ao conteúdo do desenvolvimento.
Pode ser: exercício em sala, debate, análise de caso, resolução de problema.
Deve incluir 5 exercícios: 3 de múltipla escolha + 2 dissertativos.

Responda SOMENTE com JSON válido, sem texto antes ou depois, sem markdown:

{
  "titulo_aula": "Título específico e informativo — máximo 8 palavras — não genérico",
  "subtitulo_aula": "Subtítulo que complementa com uma dimensão adicional do tema",
  "plano_aula": {
    "objetivo_geral": "Verbo no infinitivo + conteúdo específico + para quem + com qual finalidade",
    "objetivos_especificos": [
      "Identificar [conteúdo específico desta aula] a partir de [fonte ou método concreto]",
      "Analisar [aspecto específico] considerando [variável ou contexto real]",
      "Relacionar [conceito A] com [conceito B] por meio de [exemplo desta aula]"
    ],
    "competencias_bncc": [
      "Código BNCC real — descrição da habilidade conectada ao tema"
    ],
    "materiais": ["Material específico 1", "Material específico 2"],
    "avaliacao": "Instrumento de avaliação + critério + momento — específico a esta aula"
  },
  "atividade": {
    "titulo": "Título da atividade — verbo de ação + o que os alunos vão fazer",
    "descricao": "Descrição completa: o que fazer, como, com quem, em quanto tempo. Diretamente relacionada ao conteúdo do desenvolvimento. Mínimo 40 palavras.",
    "instrucoes": [
      "Passo 1: o que o aluno deve fazer — instrução clara e acionável",
      "Passo 2: como executar — continuação lógica",
      "Passo 3: conexão com conceito específico da aula",
      "Passo 4: produto final — o que entregar ou apresentar"
    ],
    "tempo": "X minutos",
    "dica_professor": "Como mediar esta atividade: o que antecipar, como lidar com dificuldades, o que observar",
    "exercicios": [
      {
        "numero": 1,
        "tipo": "multipla_escolha",
        "enunciado": "Questão contextualizada ao tema — exige raciocínio, não memorização. Inclua situação ou dado real no enunciado.",
        "alternativas": [
          "A) Alternativa plausível mas incorreta",
          "B) Alternativa correta e completa",
          "C) Alternativa parcialmente verdadeira que confunde",
          "D) Alternativa incorreta mas razoável"
        ],
        "resposta_correta": "B",
        "explicacao": "Por que B está certa — mecanismo completo. Por que A, C e D estão erradas — cada uma com razão específica."
      },
      {
        "numero": 2,
        "tipo": "multipla_escolha",
        "enunciado": "Segunda questão — aborda aspecto diferente do tema",
        "alternativas": ["A) Opção A", "B) Opção B", "C) Opção C correta", "D) Opção D"],
        "resposta_correta": "C",
        "explicacao": "Explicação completa do raciocínio"
      },
      {
        "numero": 3,
        "tipo": "multipla_escolha",
        "enunciado": "Terceira questão — terceiro ângulo do tema",
        "alternativas": ["A) Opção A", "B) Opção B", "C) Opção C", "D) Opção D correta"],
        "resposta_correta": "D",
        "explicacao": "Explicação completa"
      },
      {
        "numero": 4,
        "tipo": "dissertativa",
        "enunciado": "Questão aberta que exige relacionar dois ou mais conceitos da aula com uma situação nova ou real. Não pode ser respondida em uma frase.",
        "resposta_esperada": "Elementos específicos que devem aparecer em uma resposta completa",
        "criterios": "Três critérios objetivos e mensuráveis para avaliação"
      },
      {
        "numero": 5,
        "tipo": "dissertativa",
        "enunciado": "Segunda questão aberta — análise crítica, comparação ou previsão fundamentada no conteúdo",
        "resposta_esperada": "O que deve aparecer em uma boa resposta",
        "criterios": "Critérios de avaliação específicos"
      }
    ]
  },
  "slides": [
    {
      "slide": 1,
      "etapa": "introducao",
      "tipo": "capa",
      "titulo": "Título impactante e específico ao tema — máximo 6 palavras",
      "subtitulo": "Pergunta provocativa ou dado surpreendente que desperta curiosidade imediata",
      "conteudo": [
        "Uma frase que conecta o tema ao cotidiano ou ao futuro do aluno de ${nivel}"
      ],
      "imagem_sugerida": "Descrição de imagem de impacto que represente o tema da aula",
      "roteiro_professor": "Como abrir a aula nos primeiros 2 minutos: o que dizer para capturar a atenção, como conectar o tema com algo que os alunos já conhecem ou vivem",
      "layout": "capa",
      "cor_fundo": "#0f172a",
      "cor_texto": "#ffffff",
      "destaque": "A palavra ou número mais impactante do tema"
    },
    {
      "slide": 2,
      "etapa": "introducao",
      "tipo": "introducao",
      "titulo": "Título que apresenta o tema e desperta o interesse da turma",
      "conteudo": [
        "Dado ou fato real que ancora o tema com impacto imediato — número, nome ou contexto concreto",
        "Contextualização histórica ou social: por que esse tema existe e qual é sua relevância real hoje",
        "O problema ou tensão central que esta aula vai explorar — específico e concreto",
        "O que os alunos vão aprender ao final desta aula — objetivo claro e direto",
        "Pergunta provocativa: conecta o problema com a experiência real do aluno e abre o debate"
      ],
      "imagem_sugerida": "Imagem ou diagrama que represente o problema ou contexto central do tema",
      "roteiro_professor": "Como contextualizar o tema: o que perguntar para a turma antes de começar, como ligar ao conhecimento prévio dos alunos, quais experiências do cotidiano podem ser mencionadas para criar conexão",
      "layout": "introducao",
      "cor_fundo": "#ffffff",
      "cor_texto": "#0f172a",
      "destaque": "O número ou dado mais impactante da introdução"
    },
    ${blocosConceitos}${blocosExemplos.length > 0 ? ',\n    ' + blocosExemplos : ''}${blocosDados},
    {
      "slide": ${slideExecucao},
      "etapa": "execucao",
      "tipo": "execucao",
      "titulo": "Verbo de ação + o que os alunos vão fazer — título específico",
      "conteudo": [
        "O que fazer: descrição clara e objetiva da tarefa",
        "Como realizar: passo inicial da execução",
        "O que usar: material ou referência necessária para a atividade",
        "O que produzir: produto concreto esperado ao final",
        "Tempo disponível: X minutos para realização"
      ],
      "imagem_sugerida": "Ícone ou imagem que represente o tipo de atividade — trabalho em grupo, debate, análise, resolução de problema",
      "roteiro_professor": "Como explicar a atividade para a turma, como circular pela sala durante a execução, o que observar, como mediar dificuldades e garantir que todos participem",
      "layout": "execucao",
      "cor_fundo": "#f0fdf4",
      "cor_texto": "#0f172a",
      "destaque": "Verbo de ação — Analise, Debata, Resolva, Crie, Compare"
    },
    {
      "slide": ${slideRevisao},
      "etapa": "revisao",
      "tipo": "revisao",
      "titulo": "O que aprendemos hoje",
      "conteudo": [
        "Conceito 1: resumo do primeiro ponto principal — o que o aluno agora sabe",
        "Conceito 2: resumo do segundo ponto — dado, mecanismo ou aplicação aprendida",
        "Conceito 3: resumo do terceiro ponto — conexão com o mundo real",
        "Pergunta de revisão 1: verifica se o aluno compreendeu o conceito central",
        "Pergunta de revisão 2: aplica o conhecimento em uma situação nova"
      ],
      "imagem_sugerida": "Diagrama, mapa mental ou esquema visual que sintetize os conceitos principais da aula",
      "roteiro_professor": "Como conduzir a revisão: o que perguntar para verificar compreensão, como corrigir equívocos, como encerrar a aula conectando com o próximo conteúdo ou com o cotidiano dos alunos",
      "layout": "revisao",
      "cor_fundo": "#f8fafc",
      "cor_texto": "#0f172a",
      "destaque": null
    }
  ]
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }]
    })

    const rawText = message.content[0].text
    const jsonLimpo = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    let aulaGerada
    try {
      aulaGerada = JSON.parse(jsonLimpo)
    } catch (parseErro) {
      console.error('Erro ao parsear JSON:', parseErro)
      console.error('Texto recebido:', rawText.slice(0, 500))
      return Response.json({ erro: 'Erro ao processar resposta da IA. Tente novamente.' }, { status: 500 })
    }

    const slidesNormalizados = aulaGerada.slides.map(s => ({
      id: s.slide,
      etapa: s.etapa || null,
      tipo: s.tipo,
      titulo: s.titulo,
      subtitulo: s.subtitulo || null,
      conteudo: Array.isArray(s.conteudo) ? s.conteudo : [],
      imagem_sugerida: s.imagem_sugerida || null,
      roteiro_professor: s.roteiro_professor || null,
      layout: s.layout || 'default',
      cor_fundo: s.cor_fundo || '#ffffff',
      cor_texto: s.cor_texto || '#0f172a',
      destaque: s.destaque || null,
    }))

    const { data: aulaSalva, error: erroSalvar } = await supabase
      .from('aulas')
      .insert({
        user_id: user.id,
        titulo: aulaGerada.titulo_aula,
        tema: tema || contexto?.slice(0, 100),
        disciplina,
        nivel,
        duracao,
        plano_aula: JSON.stringify(aulaGerada.plano_aula || {}),
        slides: JSON.stringify(slidesNormalizados),
        atividade: JSON.stringify(aulaGerada.atividade || {}),
        exercicios: JSON.stringify(aulaGerada.atividade?.exercicios || []),
        gabarito: JSON.stringify(
          (aulaGerada.atividade?.exercicios || []).map(e => ({
            numero: e.numero,
            tipo: e.tipo,
            resposta: e.resposta_correta || e.resposta_esperada,
            explicacao: e.explicacao || e.criterios
          }))
        )
      })
      .select()
      .single()

    if (erroSalvar) {
      console.error('Erro Supabase ao salvar:', erroSalvar)
      return Response.json({ erro: 'Erro ao salvar aula: ' + erroSalvar.message }, { status: 500 })
    }

    await supabase
      .from('profiles')
      .update({ aulas_mes: (perfil.aulas_mes || 0) + 1 })
      .eq('id', user.id)

    return Response.json({ sucesso: true, aula: aulaSalva, aulas_usadas: aulasUsadas + 1, aulas_restantes: aulasRestantes - 1, limite_mes: limiteMes })

  } catch (erro) {
    console.error('Erro geral na API:', erro)
    return Response.json({ erro: erro.message }, { status: 500 })
  }
}