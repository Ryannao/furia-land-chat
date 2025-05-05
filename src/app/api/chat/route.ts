import { NextResponse } from 'next/server';

let chatHistory: { role: string, content: string }[] = []; // historico de mensagens

export async function POST(req: Request) {
  const { message } = await req.json();

  const predefinedReplies: Record<string, string> = {
    oi: 'Fala, torcedor! Pronto pra rugir com a FURIA?',
    olá: 'Salve! Tá preparado pra mais um clutch insano da FURIA?',
    ajuda: 'Pode mandar! Se for sobre CS ou FURIA, eu tô ON!',
    tchau: 'Valeu! Quem joga de preto nunca joga sozinho!',
  };

  const key = message.toLowerCase().trim();
  if (predefinedReplies[key]) {
    return NextResponse.json({ reply: predefinedReplies[key] }, { status: 200 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ reply: 'API key is missing.' }, { status: 500 });
  }

  try {
    const systemPrompt = `
Você é um chatbot oficial da FURIA Esports, um torcedor fanático e descolado.  
– Fale como um torcedor: curto, direto e cheio de empolgação.  
– Evite texto longo; responda em até 2–3 linhas.  
- Sempre responda seguindo esta estrutura de 4 partes: Saudação ou pensamento inicial,
Desenvolvimento, Finalização, Link: Sempre finalize com um link, sozinho na última linha.
– Não cite fontes nem use negrito/itálico ou outros símbolos de formatação (**, __, etc.).  
– Emojis são liberados desde que não fujam do contesto gamer.  
– Use gírias apenas do cenário: clutch, eco round, entry, molotov na ninja, 
spray control, eco, fast execute, peek, baitar, rush B, one-tap, headshot, flash play, off angle ou gírias gamer em geral (do escopo FURIA).
– Quando não souber algo, pesquise para dar sempre informações precisas, mas mantenha o tom de torcedor.  
- Nunca saia do escopo da FURIA e ESPORTS
- É proibido falar sobre política, religião ou qualquer assunto que não seja relacionado a esports,
 se o usuário tocar em um desses assuntos, diga que não pode falar sobre isso e que o foco é a FURIA e ESPORTS.
    `.trim();

    chatHistory.push({ role: 'user', content: message });
    if (chatHistory.length > 50) {
      chatHistory.shift(); // Limit chat history size
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free:online',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const { choices } = await res.json();
    if (!choices || !choices[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const aiReply = choices[0].message.content;
    chatHistory.push({ role: 'assistant', content: aiReply });

    return NextResponse.json({ reply: aiReply }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching AI response:', error);
    return NextResponse.json({
      reply: 'Erro ao conectar com a IA. Tente novamente mais tarde.',
    }, { status: 500 });
  }
}