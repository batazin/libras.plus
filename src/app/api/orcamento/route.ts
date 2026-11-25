import { NextResponse } from "next/server";

interface QuotePayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  details?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuotePayload;

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const service = body.service?.trim() ?? "";
    const details = body.details?.trim() ?? "";

    if (
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      phone.replace(/\D/g, "").length < 10 ||
      !service ||
      details.length < 10
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Preencha todos os campos obrigatórios com dados válidos para receber sua proposta.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Recebemos o contato de ${name}. Nossa equipe retornará em breve pelo e-mail ${email}.`,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível processar a solicitação.",
      },
      { status: 400 }
    );
  }
}
