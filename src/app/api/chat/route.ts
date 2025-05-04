import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  const predefinedReplies: { [key: string]: string } = {
    oi: 'Olá! Como posso te ajudar?',
    olá: 'Oi! Tudo certo por aí?',
    ajuda: 'Claro, me diga no que posso te ajudar.',
    tchau: 'Até logo!',
  };

  const lowerMessage = message.toLowerCase().trim();
  const reply =
    predefinedReplies[lowerMessage] ||
    "Desculpe, ainda não entendi isso. Você pode tentar de outro jeito?";

  return NextResponse.json({ reply });
}
