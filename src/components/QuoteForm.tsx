"use client";

import {
  ArrowSquareOut,
  CheckCircle,
  PaperPlaneTilt,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { BRAND } from "@/lib/content";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  details?: string;
}

export function QuoteForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Interpretação simultânea");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState("");

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (name.trim().length < 2) {
      next.name = "Informe seu nome ou nome da empresa.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Informe um e-mail válido para retorno.";
    }
    if (phone.trim().replace(/\D/g, "").length < 10) {
      next.phone = "Informe um telefone ou WhatsApp com DDD.";
    }
    if (!service.trim()) {
      next.service = "Selecione o tipo de atendimento.";
    }
    if (details.trim().length < 10) {
      next.details = "Descreva brevemente data, formato ou duração prevista.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service,
          details: details.trim(),
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setServerMessage(
          payload.message ||
            "Não foi possível enviar sua solicitação agora. Tente novamente ou acesse nossos canais diretos."
        );
        return;
      }

      setStatus("success");
      setServerMessage(
        payload.message ||
          "Solicitação registrada. Nossa equipe retornará com a proposta."
      );
      setName("");
      setEmail("");
      setPhone("");
      setDetails("");
    } catch {
      setStatus("error");
      setServerMessage(
        "Falha de conexão ao enviar. Você também pode falar diretamente pelos canais oficiais abaixo."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand/40 bg-surface-card p-6 sm:p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-text">
          <CheckCircle size={26} weight="fill" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink">
          Solicitação enviada
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {serverMessage}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="rounded-full border border-border bg-surface-elevated px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Enviar outra solicitação
          </button>
          <a
            href={BRAND.linktreeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover"
          >
            <span>Abrir canais diretos</span>
            <ArrowSquareOut size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="quote-name" className="text-sm font-semibold text-ink">
            Nome ou empresa
          </label>
          <input
            id="quote-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Marina Souza / Instituto Horizonte"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "quote-name-error" : "quote-name-help"}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted/75 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand"
          />
          <p id="quote-name-help" className="text-xs text-ink-muted">
            Informe quem será o ponto de contato para a proposta.
          </p>
          {errors.name && (
            <p id="quote-name-error" className="text-xs font-medium text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="quote-email" className="text-sm font-semibold text-ink">
              E-mail
            </label>
            <input
              id="quote-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.com.br"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "quote-email-error" : undefined}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted/75 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand"
            />
            {errors.email && (
              <p id="quote-email-error" className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="quote-phone" className="text-sm font-semibold text-ink">
              WhatsApp ou telefone
            </label>
            <input
              id="quote-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(16) 99999-0000"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "quote-phone-error" : undefined}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted/75 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand"
            />
            {errors.phone && (
              <p id="quote-phone-error" className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quote-service" className="text-sm font-semibold text-ink">
            Serviço desejado
          </label>
          <select
            id="quote-service"
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand"
          >
            <option value="Interpretação simultânea">
              Interpretação simultânea / evento ao vivo
            </option>
            <option value="Janela de Libras">
              Janela de Libras / tradução audiovisual
            </option>
            <option value="Acessibilidade corporativa">
              Acessibilidade corporativa e RH
            </option>
            <option value="Educação ou edital cultural">
              Educação, pesquisa ou edital cultural
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quote-details" className="text-sm font-semibold text-ink">
            Detalhes da demanda
          </label>
          <textarea
            id="quote-details"
            name="details"
            rows={4}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Conte a data prevista, cidade ou formato online, duração estimada e tema do encontro ou vídeo."
            aria-invalid={Boolean(errors.details)}
            aria-describedby={errors.details ? "quote-details-error" : "quote-details-help"}
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted/75 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand"
          />
          <p id="quote-details-help" className="text-xs text-ink-muted">
            Quanto mais contexto, mais rápido dimensionamos a equipe ideal.
          </p>
          {errors.details && (
            <p id="quote-details-error" className="text-xs font-medium text-red-600 dark:text-red-400">
              {errors.details}
            </p>
          )}
        </div>

        {status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-700 dark:text-red-300"
          >
            <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{serverMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink transition-all duration-150 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
        >
          <PaperPlaneTilt size={18} weight="bold" aria-hidden="true" />
          <span>
            {status === "submitting" ? "Enviando solicitação..." : BRAND.primaryCta}
          </span>
        </button>

        <div className="border-t border-border pt-4 text-xs text-ink-muted flex flex-wrap items-center justify-between gap-2">
          <span>Prefere contato direto?</span>
          <a
            href={BRAND.linktreeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-brand-text hover:underline"
          >
            <span>linktr.ee/libras.plus</span>
            <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </form>
  );
}
