document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- MENU MOBILE (transição suave via classe .open) ---------------- */
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');

  if (btn && menu) {
    // garante estado inicial coerente (opcional)
    menu.classList.remove('open');

    btn.addEventListener('click', () => {
      menu.classList.toggle('open');

      // opcional: trocar ícone do botão (hamburguer <-> x)
      const isOpen = menu.classList.contains('open');
      btn.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });

    // fecha o menu ao clicar em qualquer link dentro dele
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (menu.classList.contains('open')) {
          menu.classList.remove('open');
          btn.innerHTML = '<i class="bi bi-list"></i>';
        }
      });
    });
  } // end if btn & menu

  /* ---------------- CLIMA (mantive sua lógica, com checagem de elementos) ---------------- */
  const API_KEY = "53cf7994de62bed377725165c9baa3ee"; 
  const LATITUDE = "-22.9068"; // Rio de Janeiro
  const LONGITUDE = "-43.1729";
  const CLIMA_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}&units=metric&lang=pt_br`;

  async function obterClimaAtual() {
    const elementoTemperaturaDesktop = document.getElementById("temperaturaAtual");
    const elementoTemperaturaMobile = document.getElementById("temperaturaAtualMobile");

    if (!elementoTemperaturaDesktop) return; // nada a fazer se header não existir

    try {
      const response = await fetch(CLIMA_API_URL);
      if (!response.ok) throw new Error('Erro na API do clima');
      const dados = await response.json();

      const temperatura = Math.round(dados.main.temp);
      const descricao = dados.weather[0].description;
      const icone = dados.weather[0].icon;
      const iconeUrl = `https://openweathermap.org/img/wn/${icone}@2x.png`;
      const htmlClima = `<img src="${iconeUrl}" style="width:20px;height:20px;margin-right:5px;vertical-align:middle;"> ${temperatura}°C (${descricao})`;

      elementoTemperaturaDesktop.innerHTML = htmlClima;
      if (elementoTemperaturaMobile) elementoTemperaturaMobile.innerHTML = `Clima: ${htmlClima}`;
    } catch (err) {
      console.error('Erro ao obter clima:', err);
      elementoTemperaturaDesktop.textContent = "Clima indisponível";
      if (elementoTemperaturaMobile) elementoTemperaturaMobile.textContent = "Clima indisponível";
    }
  }

  obterClimaAtual();

  /* ---------------- SALDO (mantive e coloquei checagens) ---------------- */
  const balanceEl = document.getElementById('balance') || document.getElementById('saldo'); // aceita ambos
  const increaseBtn = document.getElementById('increase');
  const decreaseBtn = document.getElementById('decrease');
  const resetBtn = document.getElementById('reset');
  const setValueInput = document.getElementById('setValueInput') || document.getElementById('valor');
  const setValueBtn = document.getElementById('setValueBtn');

  const STEP = 1.00;
  let balance = 0;

  if (balanceEl) {
    balance = parseFloat(localStorage.getItem('balance')) || 0;
    updateBalanceDisplay();
  }

  function formatMoney(value) {
    return Number(value).toFixed(2);
  }

  function updateBalanceDisplay() {
    if (!balanceEl) return;
    balanceEl.textContent = formatMoney(balance);
    balanceEl.style.transform = "scale(1.03)";
    setTimeout(() => balanceEl.style.transform = "", 120);
    balanceEl.style.color = balance < 0 ? "#b02a37" : balance === 0 ? "#0b2540" : "#0b6b3a";
    localStorage.setItem('balance', balance);
  }

  if (increaseBtn) increaseBtn.addEventListener('click', () => { balance += STEP; updateBalanceDisplay(); });
  if (decreaseBtn) decreaseBtn.addEventListener('click', () => { balance -= STEP; updateBalanceDisplay(); });

  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (!confirm('Deseja zerar o saldo?')) return;
    balance = 0; updateBalanceDisplay();
  });

  if (setValueBtn && setValueInput) setValueBtn.addEventListener('click', () => {
    const value = parseFloat(setValueInput.value);
    if (!Number.isFinite(value)) { alert('Digite um valor válido!'); return; }
    balance = value; updateBalanceDisplay();
  });

}); // end DOMContentLoaded
