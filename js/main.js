/* Daniel Kaiã | Portfólio — comportamento do site */
document.addEventListener("DOMContentLoaded", () => {
  iniciarAno();
  iniciarTema();
  iniciarMenu();
  iniciarDigitacao();
  iniciarFormulario();
});

/* 1. Ano atual no rodapé */
function iniciarAno() {
  const alvo = document.getElementById("ano");
  if (alvo) alvo.textContent = new Date().getFullYear();
}

/* 2. Tema claro/escuro (lembra a escolha no navegador) */
function iniciarTema() {
  const botao = document.getElementById("btn-tema");
  const raiz = document.documentElement;
  let salvo = null;
  try { salvo = localStorage.getItem("tema"); } catch (e) {}
  const escuroSistema = window.matchMedia("(prefers-color-scheme: dark)").matches;
  aplicar(salvo || (escuroSistema ? "dark" : "light"));

  function aplicar(tema) {
    raiz.setAttribute("data-theme", tema);
    if (botao) {
      botao.textContent = tema === "dark" ? "☀" : "☾";
      botao.setAttribute("aria-label", tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
    }
  }
  if (botao) {
    botao.addEventListener("click", () => {
      const novo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
      aplicar(novo);
      try { localStorage.setItem("tema", novo); } catch (e) {}
    });
  }
}

/* 3. Menu hambúrguer no celular */
function iniciarMenu() {
  const botao = document.getElementById("btn-menu");
  const menu = document.getElementById("menu");
  if (!botao || !menu) return;
  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
  });
  menu.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
    })
  );
}

/* 4. Efeito de digitação no hero */
function iniciarDigitacao() {
  const alvo = document.getElementById("digitando");
  if (!alvo) return;
  const frases = [
    "estudante de Análise e Desenvolvimento de Sistemas",
    "futuro especialista em Inteligência Artificial",
    "desenhista, leitor e cinéfilo nas horas vagas"
  ];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    alvo.textContent = frases[0];
    return;
  }
  let f = 0, c = 0, apagando = false;
  function passo() {
    const frase = frases[f];
    c += apagando ? -1 : 1;
    alvo.textContent = frase.slice(0, c);
    let espera = apagando ? 35 : 70;
    if (!apagando && c === frase.length) { apagando = true; espera = 1600; }
    else if (apagando && c === 0) { apagando = false; f = (f + 1) % frases.length; espera = 400; }
    setTimeout(passo, espera);
  }
  passo();
}

/* 5. Formulário "Fale comigo": valida e abre o app de e-mail */
const EMAIL_DESTINO = "dferreiramascarenhas@gmail.com"; // <-- troque pelo seu e-mail

function iniciarFormulario() {
  const form = document.getElementById("form-contato");
  if (!form) return;
  const status = document.getElementById("status");

  const regras = {
    nome: v => v.trim().length >= 2 || "Escreva seu nome (mínimo 2 letras).",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Digite um e-mail válido, como nome@exemplo.com.",
    mensagem: v => v.trim().length >= 10 || "A mensagem precisa ter pelo menos 10 caracteres."
  };

  function validar(campo) {
    const resultado = regras[campo.name](campo.value);
    const caixa = campo.closest(".campo");
    const erro = caixa.querySelector(".erro");
    const ok = resultado === true;
    caixa.classList.toggle("invalido", !ok);
    campo.setAttribute("aria-invalid", !ok);
    erro.textContent = ok ? "" : resultado;
    return ok;
  }

  form.querySelectorAll("input, textarea").forEach(campo =>
    campo.addEventListener("blur", () => validar(campo))
  );

  form.addEventListener("submit", evento => {
    evento.preventDefault();
    const campos = [...form.querySelectorAll("input, textarea")];
    const todosOk = campos.map(validar).every(Boolean);
    if (!todosOk) {
      status.textContent = "Corrija os campos destacados e envie de novo.";
      campos.find(c => c.getAttribute("aria-invalid") === "true").focus();
      return;
    }
    const nome = form.nome.value.trim();
    const assunto = encodeURIComponent("Contato pelo portfólio: " + nome);
    const corpo = encodeURIComponent(
      form.mensagem.value.trim() + "\n\n— " + nome + " (" + form.email.value.trim() + ")"
    );
    status.textContent = "Obrigado, " + nome + "! Seu app de e-mail vai abrir com a mensagem pronta.";
    window.location.href = "mailto:" + EMAIL_DESTINO + "?subject=" + assunto + "&body=" + corpo;
    form.reset();
  });
}
