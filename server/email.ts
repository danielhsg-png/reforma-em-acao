const SMTP2GO_API_URL = "https://api.smtp2go.com/v3/email/send";
const SMTP2GO_API_KEY = process.env.SMTP2GO_API_KEY || "api-308FBF5EA63A4D189CF923FBE0854A11";
const EMAIL_SENDER = process.env.EMAIL_SENDER || "Reforma em Ação <nao-responda@reformaemacao.com.br>";
const APP_URL = process.env.APP_URL || "https://app.reformaemacao.com.br";
const LOGO_URL = "https://reformaemacao.com.br/assets/logo-png-branca-DZl1S4is.png";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  textFallback?: string;
};

export async function sendEmail({ to, subject, html, textFallback }: SendEmailInput): Promise<void> {
  const response = await fetch(SMTP2GO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Smtp2go-Api-Key": SMTP2GO_API_KEY,
    },
    body: JSON.stringify({
      sender: EMAIL_SENDER,
      to: [to],
      subject,
      html_body: html,
      text_body: textFallback ?? stripHtml(html),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SMTP2GO returned ${response.status}: ${body}`);
  }
}

function stripHtml(html: string): string {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function buildPasswordResetHtml(params: { userName: string | null; resetLink: string; expiresInMinutes: number }): string {
  const displayName = params.userName?.trim() || "por aí";
  const expiresText = params.expiresInMinutes >= 60
    ? `${Math.round(params.expiresInMinutes / 60)}h`
    : `${params.expiresInMinutes} minutos`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redefinir sua senha | Reforma em Ação</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #06101F; font-family: 'Inter', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    .email-wrapper { width: 100%; background-color: #06101F; padding: 40px 16px; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #0A1628; border-radius: 16px; overflow: hidden; border: 1px solid rgba(249,115,22,0.15); }
    .header { background: linear-gradient(135deg, #0A1628 0%, #0F1F3D 50%, #0A1628 100%); padding: 40px 40px 32px; text-align: center; position: relative; border-bottom: 1px solid rgba(249,115,22,0.2); }
    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #F59E0B, #FBBF24, #F59E0B, transparent); }
    .logo-wrap { display: inline-block; margin-bottom: 24px; }
    .logo-wrap img { height: 44px; width: auto; display: block; }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.40); border-radius: 100px; padding: 6px 18px; margin-bottom: 20px; }
    .badge .dot { width: 8px; height: 8px; border-radius: 50%; background: #F59E0B; display: inline-block; }
    .badge span { font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #F59E0B; }
    .header h1 { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; color: #FFFFFF; line-height: 1.25; margin-bottom: 10px; }
    .header h1 span { color: #F97316; }
    .header p { font-size: 15px; color: #94A3B8; line-height: 1.6; }
    .hero-strip { background: linear-gradient(90deg, #D97706, #F59E0B); padding: 14px 40px; text-align: center; }
    .hero-strip p { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px; }
    .body-section { padding: 40px 40px 32px; }
    .greeting { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px; }
    .greeting span { color: #F97316; }
    .body-text { font-size: 15px; color: #94A3B8; line-height: 1.75; margin-bottom: 32px; }
    .cta-box { background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03)); border: 1px solid rgba(245,158,11,0.30); border-radius: 12px; padding: 28px 24px; margin-bottom: 16px; text-align: center; }
    .cta-box .icon { font-size: 36px; margin-bottom: 12px; display: block; }
    .cta-box h3 { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; }
    .cta-box p { font-size: 14px; color: #94A3B8; line-height: 1.65; margin-bottom: 20px; }
    .btn-reset { display: inline-block; background: linear-gradient(135deg, #F97316, #EA6D10); color: #FFFFFF !important; text-decoration: none; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 8px; letter-spacing: 0.3px; }
    .link-fallback { margin-top: 18px; font-size: 12px; color: #64748B; line-height: 1.6; word-break: break-all; }
    .link-fallback a { color: #F97316; text-decoration: none; }
    .urgency-box { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20); border-radius: 10px; padding: 16px 20px; margin-bottom: 32px; display: table; width: 100%; }
    .urgency-icon { display: table-cell; vertical-align: middle; font-size: 20px; width: 36px; padding-right: 8px; }
    .urgency-text { display: table-cell; vertical-align: middle; }
    .urgency-text p { font-size: 13px; color: #FCA5A5; line-height: 1.6; }
    .urgency-text strong { color: #FCA5A5; font-weight: 700; }
    .next-section { padding: 0 40px 32px; }
    .section-label { font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #F97316; margin-bottom: 16px; }
    .steps-list { list-style: none; padding: 0; }
    .step-item { display: table; width: 100%; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .step-item:last-child { border-bottom: none; }
    .step-num { display: table-cell; vertical-align: top; width: 36px; }
    .step-num-inner { width: 28px; height: 28px; border-radius: 50%; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.35); font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700; color: #F97316; text-align: center; line-height: 28px; }
    .step-text { display: table-cell; vertical-align: top; padding-left: 4px; }
    .step-text strong { display: block; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #E2E8F0; margin-bottom: 3px; }
    .step-text span { font-size: 13px; color: #64748B; line-height: 1.5; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(249,115,22,0.2), transparent); margin: 0 40px; }
    .support-section { padding: 28px 40px; text-align: center; }
    .support-section p { font-size: 13px; color: #475569; line-height: 1.7; }
    .support-section a { color: #F97316; text-decoration: none; font-weight: 600; }
    .footer { background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); padding: 28px 40px; text-align: center; }
    .footer-logo img { height: 28px; width: auto; opacity: 0.5; margin-bottom: 14px; }
    .footer p { font-size: 12px; color: #334155; line-height: 1.7; }
    .footer a { color: #475569; text-decoration: underline; }
    @media only screen and (max-width: 480px) {
      .email-wrapper { padding: 20px 8px; }
      .header { padding: 32px 24px 24px; }
      .header h1 { font-size: 22px; }
      .body-section { padding: 32px 24px 24px; }
      .next-section { padding: 0 24px 24px; }
      .divider { margin: 0 24px; }
      .support-section { padding: 24px; }
      .footer { padding: 24px; }
    }
  </style>
</head>
<body>
<div class="email-wrapper">
  <div class="email-container">
    <div class="header">
      <div class="logo-wrap">
        <img src="${LOGO_URL}" alt="Reforma em Ação" />
      </div>
      <div class="badge">
        <span class="dot"></span>
        <span>Redefinição de Senha</span>
      </div>
      <h1>Vamos criar uma <span>nova senha</span></h1>
      <p>Recebemos uma solicitação para redefinir o acesso da sua conta.<br />Confirme abaixo e defina sua nova senha.</p>
    </div>

    <div class="hero-strip">
      <p>🔐 Link seguro · Expira em ${expiresText} · Uso único</p>
    </div>

    <div class="body-section">
      <p class="greeting">Olá, <span>${escapeHtml(displayName)}</span> 👋</p>

      <p class="body-text">
        Alguém — provavelmente você — solicitou a redefinição de senha da sua conta na plataforma <strong style="color:#E2E8F0;">Reforma em Ação</strong>.
        <br /><br />
        Para continuar, clique no botão abaixo. Se você não fez esta solicitação, ignore este e-mail — sua senha atual permanece ativa e segura.
      </p>

      <div class="cta-box">
        <span class="icon">🔑</span>
        <h3>Redefinir minha senha</h3>
        <p>Este link é pessoal, intransferível e expira em ${expiresText}. Após o uso, ele é invalidado automaticamente.</p>
        <a href="${params.resetLink}" class="btn-reset">Criar nova senha →</a>
        <p class="link-fallback">
          Se o botão não abrir, copie e cole este endereço no navegador:<br />
          <a href="${params.resetLink}">${params.resetLink}</a>
        </p>
      </div>

      <div class="urgency-box">
        <div class="urgency-icon">⚠️</div>
        <div class="urgency-text">
          <p><strong>Importante:</strong> se você não pediu essa redefinição, recomendamos ativar uma senha forte e verificar os acessos recentes. Nenhuma alteração foi feita na sua conta.</p>
        </div>
      </div>
    </div>

    <div class="next-section">
      <p class="section-label">Dicas para uma senha forte</p>
      <ul class="steps-list">
        <li class="step-item">
          <div class="step-num"><div class="step-num-inner">1</div></div>
          <div class="step-text">
            <strong>Mínimo de 8 caracteres</strong>
            <span>Quanto maior a senha, mais difícil de quebrar. Combine letras, números e símbolos.</span>
          </div>
        </li>
        <li class="step-item">
          <div class="step-num"><div class="step-num-inner">2</div></div>
          <div class="step-text">
            <strong>Evite dados pessoais</strong>
            <span>Nada de nome, data de nascimento, CPF ou nome da empresa. Previsíveis demais.</span>
          </div>
        </li>
        <li class="step-item">
          <div class="step-num"><div class="step-num-inner">3</div></div>
          <div class="step-text">
            <strong>Use um gerenciador de senhas</strong>
            <span>1Password, Bitwarden ou o próprio navegador geram e guardam senhas únicas para cada serviço.</span>
          </div>
        </li>
        <li class="step-item">
          <div class="step-num"><div class="step-num-inner">4</div></div>
          <div class="step-text">
            <strong>Não reutilize senhas</strong>
            <span>Se um site vaza, vazam todos os outros onde você usou a mesma senha.</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="divider"></div>

    <div class="support-section">
      <p>
        Não reconhece esta solicitação?<br />
        Entre em contato em <a href="mailto:contato@reformaemacao.com.br">contato@reformaemacao.com.br</a><br />
        que a gente investiga para você.
      </p>
    </div>

    <div class="divider"></div>

    <div class="footer">
      <div class="footer-logo">
        <img src="${LOGO_URL}" alt="Reforma em Ação" />
      </div>
      <p>
        Você está recebendo este e-mail porque alguém solicitou a redefinição de senha em<br />
        <a href="https://reformaemacao.com.br">reformaemacao.com.br</a><br /><br />
        © 2026 Reforma em Ação. Todos os direitos reservados.
      </p>
    </div>
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPasswordResetEmail(params: { to: string; userName: string | null; token: string }): Promise<void> {
  const resetLink = `${APP_URL}/redefinir-senha?token=${encodeURIComponent(params.token)}`;
  const expiresInMinutes = 60;
  const html = buildPasswordResetHtml({ userName: params.userName, resetLink, expiresInMinutes });
  await sendEmail({
    to: params.to,
    subject: "Redefinir senha — Reforma em Ação",
    html,
    textFallback: `Olá! Recebemos um pedido para redefinir sua senha na Reforma em Ação. Acesse o link abaixo para criar uma nova senha (válido por ${expiresInMinutes} minutos):\n\n${resetLink}\n\nSe você não solicitou, ignore este e-mail.`,
  });
}
