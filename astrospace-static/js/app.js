// AstroSpace - versão estática (sem servidor)
// Banco de dados interno usando memória + localStorage

// ---------- Dados iniciais (seed) ----------

const PLANETAS = [
  {
    id: 1, nome: 'Mercúrio', ordem: 1, cor: '#b5b5b5',
    descricao: 'O menor planeta do Sistema Solar e o mais próximo do Sol. Não possui atmosfera significativa e sua superfície é cheia de crateras.',
    diametro_km: 4879, temperatura_c: 167, distancia_sol_milhoes_km: 57.9,
    composicao: 'Rochosa, com grande núcleo de ferro'
  },
  {
    id: 2, nome: 'Vênus', ordem: 2, cor: '#e8c48a',
    descricao: 'Possui uma atmosfera densa de dióxido de carbono, que gera um intenso efeito estufa. É o planeta mais quente do Sistema Solar.',
    diametro_km: 12104, temperatura_c: 464, distancia_sol_milhoes_km: 108.2,
    composicao: 'Rochosa; atmosfera de CO₂ com nuvens de ácido sulfúrico'
  },
  {
    id: 3, nome: 'Terra', ordem: 3, cor: '#3d7bd9',
    descricao: 'Único planeta conhecido onde existe vida. Possui oceanos de água líquida e atmosfera rica em nitrogênio e oxigênio.',
    diametro_km: 12742, temperatura_c: 15, distancia_sol_milhoes_km: 149.6,
    composicao: 'Rochosa; cerca de 71% da superfície coberta por água'
  },
  {
    id: 4, nome: 'Marte', ordem: 4, cor: '#c1440e',
    descricao: 'Conhecido como planeta vermelho por causa do óxido de ferro presente no solo. Abriga o Monte Olimpo, o maior vulcão do Sistema Solar.',
    diametro_km: 6779, temperatura_c: -63, distancia_sol_milhoes_km: 227.9,
    composicao: 'Rochosa; atmosfera fina de CO₂'
  },
  {
    id: 5, nome: 'Júpiter', ordem: 5, cor: '#d9a066',
    descricao: 'É o maior planeta do Sistema Solar. Sua massa é mais que o dobro da soma de todos os outros planetas. Possui a Grande Mancha Vermelha, uma tempestade maior que a Terra.',
    diametro_km: 139820, temperatura_c: -110, distancia_sol_milhoes_km: 778.5,
    composicao: 'Gasosa; hidrogênio e hélio'
  },
  {
    id: 6, nome: 'Saturno', ordem: 6, cor: '#e6d19a',
    descricao: 'Famoso por seus anéis formados principalmente de gelo e rocha. Sua densidade média é menor que a da água.',
    diametro_km: 116460, temperatura_c: -140, distancia_sol_milhoes_km: 1434,
    composicao: 'Gasosa; hidrogênio e hélio, com anéis de gelo e rocha'
  },
  {
    id: 7, nome: 'Urano', ordem: 7, cor: '#7fd3e0',
    descricao: 'Gira "deitado", com o eixo de rotação quase paralelo ao plano de sua órbita. Sua cor azul-esverdeada vem do metano na atmosfera.',
    diametro_km: 50724, temperatura_c: -195, distancia_sol_milhoes_km: 2871,
    composicao: 'Gelo e gás; hidrogênio, hélio e metano'
  },
  {
    id: 8, nome: 'Netuno', ordem: 8, cor: '#3f5fd6',
    descricao: 'É o planeta mais distante do Sol. Seus ventos podem ultrapassar 2.000 km/h. Foi descoberto em 1846 a partir de cálculos matemáticos sobre Urano.',
    diametro_km: 49244, temperatura_c: -200, distancia_sol_milhoes_km: 4495,
    composicao: 'Gelo e gás; hidrogênio, hélio e metano'
  }
];

const CURIOSIDADES_INICIAIS = [
  { id: 1, titulo: 'Luz do Sol', categoria: 'Sol',
    conteudo: 'A luz do Sol leva cerca de 8 minutos e 20 segundos para chegar à Terra.' },
  { id: 2, titulo: 'Um dia em Vênus', categoria: 'Planetas',
    conteudo: 'Vênus gira tão devagar que um dia venusiano (uma rotação completa) dura mais que o seu próprio ano.' },
  { id: 3, titulo: 'Vizinhas galácticas', categoria: 'Galáxias',
    conteudo: 'A Via Láctea e a galáxia de Andrômeda estão se aproximando e devem colidir daqui a alguns bilhões de anos.' },
  { id: 4, titulo: 'Pegadas na Lua', categoria: 'Exploração',
    conteudo: 'As pegadas deixadas na Lua pela missão Apollo 11 podem permanecer por milhões de anos, pois lá não há vento nem chuva para apagá-las.' },
  { id: 5, titulo: 'Estrelas que já morreram', categoria: 'Estrelas',
    conteudo: 'Algumas estrelas que vemos no céu podem já não existir, pois a luz delas levou anos, séculos ou até milhões de anos para chegar até nós.' },
  { id: 6, titulo: 'Matéria extrema', categoria: 'Estrelas',
    conteudo: 'Uma pequena porção de matéria de uma estrela de nêutrons teria uma massa de bilhões de toneladas.' }
];

// ---------- Banco de dados interno (localStorage) ----------

const DB = {
  // Carrega ou inicializa a lista de curiosidades
  getCuriosidades() {
    try {
      const salvos = localStorage.getItem('astrospace_curiosidades');
      if (salvos) return JSON.parse(salvos);
    } catch (_) {}
    // Primeira visita: grava o seed
    localStorage.setItem('astrospace_curiosidades', JSON.stringify(CURIOSIDADES_INICIAIS));
    return [...CURIOSIDADES_INICIAIS];
  },

  salvarCuriosidades(lista) {
    localStorage.setItem('astrospace_curiosidades', JSON.stringify(lista));
  },

  getFavoritos() {
    try {
      const salvos = localStorage.getItem('astrospace_favoritos');
      if (salvos) return JSON.parse(salvos);
    } catch (_) {}
    return [];
  },

  salvarFavoritos(lista) {
    localStorage.setItem('astrospace_favoritos', JSON.stringify(lista));
  },

  // Gera um id simples e único
  proximoId(lista) {
    if (!lista.length) return 1;
    return Math.max(...lista.map((item) => item.id)) + 1;
  }
};

// ---------- Utilitários ----------

function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

// ---------- Estrelas no fundo (canvas) ----------

function iniciarEstrelas() {
  const canvas = document.getElementById('estrelas-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let estrelas = [];

  function ajustar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const qtd = Math.min(220, Math.floor((canvas.width * canvas.height) / 9000));
    estrelas = Array.from({ length: qtd }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      v: Math.random() * 0.25 + 0.05,
      brilho: Math.random() * Math.PI * 2
    }));
  }

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of estrelas) {
      s.brilho += 0.02;
      const alpha = 0.5 + Math.sin(s.brilho) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(169, 199, 255, ${alpha})`;
      ctx.fill();
      s.y += s.v;
      if (s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(desenhar);
  }

  ajustar();
  window.addEventListener('resize', ajustar);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    desenhar();
  }
}

// ---------- Menu responsivo ----------

function iniciarMenu() {
  const botao = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  if (!botao || !menu) return;

  botao.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', String(aberto));
  });

  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
    })
  );

  const links = menu.querySelectorAll('a');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('ativo', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section').forEach((s) => observador.observe(s));
}

// ---------- Animação ao rolar ----------

function iniciarRevelacao() {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visivel');
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observador.observe(el));
}

// ---------- Planetas ----------

function carregarPlanetas() {
  const lista = document.getElementById('lista-planetas');
  if (!lista) return;

  lista.innerHTML = PLANETAS.map((p) => `
    <article class="card reveal">
      <div class="planeta-visual">
        <span class="planeta-esfera" style="--cor:${escapar(p.cor)}" aria-hidden="true"></span>
      </div>
      <h3>${escapar(p.nome)}</h3>
      <p>${escapar(p.descricao)}</p>
      <dl class="stats">
        <div><dt>Diâmetro</dt><dd>${Number(p.diametro_km).toLocaleString('pt-BR')} km</dd></div>
        <div><dt>Temperatura média</dt><dd>${escapar(String(p.temperatura_c))} °C</dd></div>
        <div><dt>Distância do Sol</dt><dd>${escapar(String(p.distancia_sol_milhoes_km))} milhões de km</dd></div>
        <div><dt>Composição</dt><dd>${escapar(p.composicao)}</dd></div>
      </dl>
    </article>
  `).join('');
  iniciarRevelacao();
}

// ---------- Curiosidades ----------

function cartaoCuriosidade(c) {
  return `
    <article class="card reveal" data-id="${c.id}">
      <span class="badge">${escapar(c.categoria)}</span>
      <h4>${escapar(c.titulo)}</h4>
      <p>${escapar(c.conteudo)}</p>
      <div class="acoes">
        <button class="btn btn-pequeno btn-secundario btn-editar" data-id="${c.id}">Editar</button>
        <button class="btn btn-pequeno btn-perigo btn-excluir" data-id="${c.id}">Excluir</button>
      </div>
    </article>`;
}

function carregarCuriosidades() {
  const lista = document.getElementById('lista-curiosidades');
  if (!lista) return;

  const itens = DB.getCuriosidades();
  lista.innerHTML = itens.length
    ? itens.map(cartaoCuriosidade).join('')
    : '<p class="aviso">Nenhuma curiosidade cadastrada.</p>';
  iniciarRevelacao();
}

function sortearCuriosidade() {
  const area = document.getElementById('curiosidade-aleatoria');
  if (!area) return;

  const itens = DB.getCuriosidades();
  if (!itens.length) {
    area.innerHTML = '<p>Nenhuma curiosidade cadastrada.</p>';
    return;
  }
  const c = itens[Math.floor(Math.random() * itens.length)];
  area.innerHTML = `
    <span class="badge">${escapar(c.categoria)}</span>
    <h3>${escapar(c.titulo)}</h3>
    <p>${escapar(c.conteudo)}</p>`;
}

function iniciarFormCuriosidade() {
  const form = document.getElementById('form-curiosidade');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    const lista = DB.getCuriosidades();
    const novo = {
      id: DB.proximoId(lista),
      titulo: dados.titulo.trim(),
      conteudo: dados.conteudo.trim(),
      categoria: dados.categoria
    };
    lista.unshift(novo); // mais recente primeiro
    DB.salvarCuriosidades(lista);
    form.reset();
    carregarCuriosidades();
    alert('Curiosidade salva com sucesso!');
  });
}

function iniciarAcoesCuriosidades() {
  const listaEl = document.getElementById('lista-curiosidades');
  if (!listaEl) return;

  listaEl.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('btn-excluir')) {
      if (!confirm('Excluir esta curiosidade?')) return;
      const lista = DB.getCuriosidades().filter((c) => c.id !== id);
      DB.salvarCuriosidades(lista);
      carregarCuriosidades();
    }

    if (e.target.classList.contains('btn-editar')) {
      const titulo = prompt('Novo título:');
      if (titulo === null) return;
      const conteudo = prompt('Novo conteúdo:');
      if (conteudo === null) return;

      const lista = DB.getCuriosidades().map((c) => {
        if (c.id === id) {
          return { ...c, titulo: titulo.trim(), conteudo: conteudo.trim() };
        }
        return c;
      });
      DB.salvarCuriosidades(lista);
      carregarCuriosidades();
    }
  });
}

// ---------- Favoritos ----------

function carregarFavoritos() {
  const ul = document.getElementById('lista-favoritos');
  if (!ul) return;

  const itens = DB.getFavoritos();
  ul.innerHTML = itens.length
    ? itens.map((f) => `
        <li>
          <span>${escapar(f.nome)} <small>(${escapar(f.tipo)})</small></span>
          <button class="btn btn-pequeno btn-perigo btn-remover-fav" data-id="${f.id}">Remover</button>
        </li>`).join('')
    : '<li class="aviso">Nenhum favorito ainda.</li>';
}

function iniciarFavoritos() {
  const form = document.getElementById('form-favorito');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    const lista = DB.getFavoritos();
    lista.unshift({
      id: DB.proximoId(lista),
      nome: dados.nome.trim(),
      tipo: dados.tipo
    });
    DB.salvarFavoritos(lista);
    form.reset();
    carregarFavoritos();
  });

  const ul = document.getElementById('lista-favoritos');
  if (ul) {
    ul.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-remover-fav')) return;
      const id = Number(e.target.dataset.id);
      const lista = DB.getFavoritos().filter((f) => f.id !== id);
      DB.salvarFavoritos(lista);
      carregarFavoritos();
    });
  }
}

// ---------- Inicialização ----------

document.addEventListener('DOMContentLoaded', () => {
  iniciarEstrelas();
  iniciarMenu();
  iniciarRevelacao();
  carregarPlanetas();
  carregarCuriosidades();
  carregarFavoritos();
  iniciarFormCuriosidade();
  iniciarAcoesCuriosidades();
  iniciarFavoritos();
  sortearCuriosidade();

  const btnSortear = document.getElementById('btn-sortear');
  if (btnSortear) {
    btnSortear.addEventListener('click', sortearCuriosidade);
  }
});
