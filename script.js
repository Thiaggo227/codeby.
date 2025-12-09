// --- LÓGICA DA CALCULADORA ---
const display = document.getElementById('display');
const keys = document.querySelector('.calculator-keys');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false; // Flag para saber se estamos esperando o próximo número

/**
 * Função principal para realizar os cálculos.
 * @param {number} num1 O primeiro número.
 * @param {string} op O operador (+, -, *, /).
 * @param {number} num2 O segundo número.
 */
function calculate(num1, op, num2) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === '*') return num1 * num2;
    if (op === '/') {
        if (num2 === 0) {
            return 'Erro';
        }
        return num1 / num2;
    }
    return num2;
}

/**
 * Manipula a entrada de números.
 * @param {string} number O número clicado.
 */
function inputNumber(number) {
    if (waitingForSecondValue === true) {
        display.textContent = number;
        waitingForSecondValue = false;
    } else {
        // Evita múltiplos zeros no início
        if (display.textContent === '0') {
            display.textContent = number;
        } else {
            display.textContent += number;
        }
    }
}

/**
 * Manipula o ponto decimal.
 */
function inputDecimal() {
    if (waitingForSecondValue === true) {
        display.textContent = '0.';
        waitingForSecondValue = false;
        return;
    }

    if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
}

/**
 * Manipula a entrada de operadores (+, -, *, /).
 * @param {string} nextOperator O operador clicado.
 */
function handleOperator(nextOperator) {
    const inputValue = display.textContent;

    // Se já houver um valor e um operador, realiza o cálculo anterior
    if (firstValue !== null && operator && !waitingForSecondValue) {
        const result = calculate(firstValue, operator, inputValue);
        display.textContent = parseFloat(result.toFixed(5)); // Limita casas decimais
        firstValue = result;
    } else if (inputValue !== 'Erro') {
        firstValue = inputValue;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

/**
 * Manipula ações especiais (AC, DEL, %).
 * @param {string} action A ação clicada.
 */
function handleAction(action) {
    switch (action) {
        case 'clear':
            firstValue = null;
            operator = null;
            waitingForSecondValue = false;
            display.textContent = '0';
            break;
        case 'backspace':
            if (display.textContent === 'Erro') {
                display.textContent = '0';
                break;
            }
            display.textContent = display.textContent.slice(0, -1) || '0';
            break;
        case 'percentage':
            if (display.textContent !== 'Erro') {
                let value = parseFloat(display.textContent);
                value = value / 100;
                display.textContent = value;
                // Se for o primeiro valor, já armazena o percentual
                if (firstValue === null) {
                    firstValue = display.textContent;
                }
            }
            break;
    }
}

/**
 * Listener de eventos para os botões da calculadora.
 */
keys.addEventListener('click', (event) => {
    // Verifica se o clique foi em um botão
    if (!event.target.matches('button')) return;

    const key = event.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;

    if (action === 'clear' || action === 'backspace' || action === 'percentage') {
        handleAction(action);
        return;
    }

    if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
        handleOperator(keyContent);
        return;
    }

    if (action === 'decimal') {
        inputDecimal();
        return;
    }

    if (action === 'calculate') {
        if (firstValue === null || operator === null || waitingForSecondValue) {
            return; // Nada a fazer
        }
        
        const inputValue = display.textContent;
        const result = calculate(firstValue, operator, inputValue);
        
        // Limpa o estado e exibe o resultado
        display.textContent = (result === 'Erro') ? result : parseFloat(result.toFixed(5));
        firstValue = null;
        operator = null;
        waitingForSecondValue = true;
        return;
    }

    // Se for um número
    inputNumber(keyContent);
});

// Inicializa a calculadora ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Garante que o display inicie em 0 se o elemento for encontrado
    if (display) {
        display.textContent = '0';
    }
});

const btn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");
let open = false;

// Função para manipular o menu móvel
btn.addEventListener("click", () => {
    open = !open;

    if (open) {
        // Exibe o menu
        menu.style.transform = "translateY(0)";
        menu.style.opacity = "1";
    } else {
        // Oculta o menu
        menu.style.transform = "translateY(-300px)";
        menu.style.opacity = "0";
    }
});

const API_KEY = "53cf7994de62bed377725165c9baa3ee"; 
const LATITUDE = "-22.9068"; // Rio de Janeiro
const LONGITUDE = "-43.1729";
const CLIMA_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}&units=metric&lang=pt_br`;

async function obterClimaAtual() {
    const elementoTemperaturaDesktop = document.getElementById("temperaturaAtual");
    const elementoTemperaturaMobile = document.getElementById("temperaturaAtualMobile"); // Novo elemento para o menu mobile

    // Se a chave de API não for configurada, evita a requisição.
    if (API_KEY === "SUA_CHAVE_DE_API") {
        elementoTemperaturaDesktop.textContent = "Clima: Configure a chave de API";
        if (elementoTemperaturaMobile) {
            elementoTemperaturaMobile.textContent = "Clima: Configure a chave de API";
        }
        return;
    }

    try {
        const response = await fetch(CLIMA_API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro na API do Clima: ${response.status}`);
        }
        
        const dados = await response.json();
        
        // Extrai a temperatura e a descrição
        const temperatura = Math.round(dados.main.temp);
        const descricao = dados.weather[0].description;
        const icone = dados.weather[0].icon;
        
        // Constrói a URL do ícone do clima
        const iconeUrl = `https://openweathermap.org/img/wn/${icone}@2x.png`;
        const htmlClima = `<img src="${iconeUrl}" alt="${descricao}" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px;">${temperatura}°C (${descricao})`;

        // Atualiza o texto no header desktop
        elementoTemperaturaDesktop.innerHTML = htmlClima;
        
        // Atualiza o texto no menu mobile
        if (elementoTemperaturaMobile) {
            elementoTemperaturaMobile.innerHTML = `Clima: ${htmlClima}`;
        }

    } catch (error) {
        console.error("Erro ao buscar o clima:", error);
        elementoTemperaturaDesktop.textContent = "Clima indisponível";
        if (elementoTemperaturaMobile) {
            elementoTemperaturaMobile.textContent = "Clima indisponível";
        }
    }
}

// Chama a função para obter o clima quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', obterClimaAtual);

// URL do Apps Script para GASTOS
const APP_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyVO7arD6cCYjyVI56kc_ErThnJTEV6EN7IDCDPEh7SMmjlmz0qj4b0NMjElEcWpBLr/exec";


const btnRegistrar = document.getElementById("btnRegistrar");
const msgSucesso = document.getElementById("mensagemSucesso"); // div da mensagem de sucesso

// Controle do loading (para Gastos)
function toggleLoading(isLoading) {
    const btnText = btnRegistrar.querySelector('.button-text');
    if (isLoading) {
        btnRegistrar.disabled = true;
        btnRegistrar.classList.add("loading");
        btnText.textContent = 'Registrando...';
    } else {
        btnRegistrar.disabled = false;
        btnRegistrar.classList.remove("loading");
        btnText.textContent = 'Registrar →';
    }
}

// Registrar gasto
btnRegistrar.addEventListener("click", function () {
    // CORRIGIDO: Seletores usando IDs únicos para o formulário de GASTOS
    const data = document.getElementById("dataInput").value;
    const local = document.getElementById("localInput").value;
    const valor = document.getElementById("valorInput").value;

    if (!data || !local || !valor) {
        alert("Preencha todos os campos.");
        return;
    }

    // Limpeza de valor
    const valorLimpo = valor.replace(/[^\d.,]/g, '').replace(',', '.');

    if (isNaN(parseFloat(valorLimpo))) {
        alert("O valor inserido não é um número válido.");
        return;
    }

    toggleLoading(true);

    const formData = new FormData();
    formData.append("data", data);
    formData.append("local", local);
    formData.append("valor", valorLimpo);

    fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: formData,
    })
        .then((r) => r.text())
        .then((res) => {
            // Limpar campos
            cancelarRegistro();

            // Formatar valor para padrão brasileiro
            const valorFormatado = parseFloat(valorLimpo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            // Mostrar mensagem de sucesso com valor
            msgSucesso.innerHTML = `<i class="bi bi-check-circle-fill mr-2"></i> Valor gasto R$ ${valorFormatado} registrado com sucesso!`;
            msgSucesso.style.display = "flex";

            // Esconder após 4 segundos (opcional)
            setTimeout(() => {
                msgSucesso.style.display = "none";
            }, 4000);
        })
        .catch((err) => {
            console.error("Erro na requisição:", err);
            alert("Erro ao registrar. Verifique o console ou a implementação do Apps Script.");
        })
        .finally(() => {
            toggleLoading(false);
        });
});

// Limpar campos (para Gastos)
function cancelarRegistro() {
    document.getElementById("dataInput").value = "";
    document.getElementById("localInput").value = "";
    document.getElementById("valorInput").value = "";
}


// URL do Apps Script para RECEITA
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvcZShyiqFNeLsMusTfE8ZJDEVVQTAG9v1NyPAtF069xyWAvtpOx9VKP2MLjDoJE6l4g/exec"; 

async function enviarReceita(event) {
    event.preventDefault();

    const formulario = event.target;
    const btnRegistrar = document.getElementById('btnRegistrarReceita');
    const btnText = btnRegistrar.querySelector('.button-text');

    btnRegistrar.disabled = true;
    btnRegistrar.classList.add('loading'); 
    btnText.textContent = 'Registrando...';
    
    const dados = new FormData(formulario);
    const parametros = new URLSearchParams();
    
    // Garantir que o valor seja limpo e parseado corretamente antes de enviar
    const valorRaw = dados.get('valor');
    const valorLimpo = valorRaw.replace(/[^\d.,]/g, '').replace(',', '.'); // Limpeza e conversão para padrão JS

    if (isNaN(parseFloat(valorLimpo))) {
        alert("O valor inserido não é um número válido.");
        // Reverte o estado do botão em caso de erro de validação
        btnRegistrar.disabled = false;
        btnRegistrar.classList.remove('loading');
        btnText.textContent = 'Registrar →';
        return;
    }
    
    parametros.append('data', dados.get('data')); 
    parametros.append('valor', valorLimpo); // Envia o valor limpo e padronizado

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: parametros 
        });

        const resultado = await response.text(); 
        
        if (response.ok) {
            const mensagemSucesso = document.getElementById('mensagemSucessoReceita');
            
            // Formatar valor para exibição na mensagem
            const valorFormatado = parseFloat(valorLimpo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            mensagemSucesso.innerHTML = `<i class="bi bi-check-circle-fill mr-2"></i> Receita de R$ ${valorFormatado} registrada com sucesso!`;
            mensagemSucesso.style.display = 'flex';
            
            formulario.reset(); 
            
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
            }, 3000); 

        } else {
            alert("Erro ao registrar receita. Detalhes: " + resultado); 
            console.error("Erro na resposta do servidor:", resultado);
        }
        
    } catch (error) {
        alert("Erro de conexão. Verifique sua URL ou internet.");
        console.error("Erro de conexão:", error);
    } finally {
        btnRegistrar.disabled = false;
        btnRegistrar.classList.remove('loading');
        btnText.textContent = 'Registrar →';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const meuFormulario = document.getElementById('formReceita'); 
    if (meuFormulario) {
        meuFormulario.addEventListener('submit', enviarReceita);
    }
    
    // Adiciona listener para fechar o menu ao clicar em um link (opcional, melhora a UX)
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (open) {
                btn.click(); // Simula o clique no botão para fechar
            }
        });
    });
});

// Animação de Scroll (mantida, mas não requer alteração de responsividade)
const fadeElements = document.querySelectorAll('.textReceita');

function checkFade() {
    const triggerBottom = window.innerHeight * 0.85; // ponto de ativação
    fadeElements.forEach(el => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
            el.classList.add('showOnScroll');
        } else {
            el.classList.remove('showOnScroll');
        }
    });
}

// Verifica ao carregar e ao rolar a página
window.addEventListener('scroll', checkFade);
window.addEventListener('load', checkFade);

// A meta diária de consumo de água é 2.5 litros (2500 ml)
const GOAL_ML = 2500;
let currentConsumptionML = 0;

// Elementos DOM
const waterFill = document.getElementById('water-fill');
const currentAmountDisplay = document.getElementById('current-amount');
const inputAmount = document.getElementById('input-amount');
const statusMessage = document.getElementById('status-message');

/**
 * Atualiza a interface (visual do copo e texto) com o consumo atual.
 */
function updateDisplay() {
    // 1. Calcular a porcentagem de preenchimento
    let percentage = (currentConsumptionML / GOAL_ML) * 100;
    
    // Garantir que a porcentagem não exceda 100% (para preenchimento)
    if (percentage > 100) {
        percentage = 100;
    }
    
    // Garantir que a porcentagem não seja negativa
    if (percentage < 0) {
        percentage = 0;
    }

    // 2. Aplicar a altura ao elemento 'water-fill'
    waterFill.style.height = percentage + '%';
    
    // 3. Atualizar o texto de quantidade consumida
    currentAmountDisplay.textContent = `${currentConsumptionML} ml`;

    // 4. Checar e exibir a mensagem de status
    if (currentConsumptionML >= GOAL_ML) {
        statusMessage.textContent = '🎉 Meta de 2.5L Atingida! Parabéns!';
        statusMessage.classList.add('success');
    } else {
        const remaining = GOAL_ML - currentConsumptionML;
        statusMessage.textContent = `Faltam ${remaining} ml para a meta.`;
        statusMessage.classList.remove('success');
    }
}

/**
 * Adiciona a quantidade de água do input ao consumo total.
 */
function addConsumption() {
    // Tenta obter o valor do input e converter para número inteiro
    const addedAmount = parseInt(inputAmount.value);

    // Validação básica
    if (isNaN(addedAmount) || addedAmount <= 0) {
        alert("Por favor, insira uma quantidade válida (em ml) maior que zero.");
        return;
    }

    // Adiciona ao consumo total
    currentConsumptionML += addedAmount;
    
    // Limpa o input após adicionar
    inputAmount.value = '';
    
    // Atualiza a interface
    updateDisplay();
}

/**
 * Reseta o consumo para 0 e inicia um novo ciclo.
 */
function startNewCycle() {
    const confirmReset = confirm("Tem certeza que deseja iniciar um novo ciclo? O consumo atual será zerado.");
    
    if (confirmReset) {
        currentConsumptionML = 0;
        updateDisplay();
        alert("Novo ciclo iniciado! Consumo zerado.");
    }
}

// Inicializa a exibição ao carregar a página
updateDisplay();