let dadosDate = { data: '', hora: '', comida: '' };

function ativarBorda(ativar) {
    const container = document.getElementById('booking-box');
    if (ativar) container.classList.add('active-border');
    else container.classList.remove('active-border');
}

function proximaTela(numero) {
    const telas = document.querySelectorAll('.screen');
    const telaAtual = document.querySelector('.screen.active');
    
    if (telaAtual) {
        telaAtual.style.opacity = '0';
        telaAtual.style.transform = 'translateY(-10px)';
    }

    setTimeout(() => {
        telas.forEach(s => s.classList.remove('active'));
        const novaTela = document.getElementById(`tela${numero}`);
        novaTela.classList.add('active');
        
        setTimeout(() => {
            novaTela.style.opacity = '1';
            novaTela.style.transform = 'translateY(0)';
        }, 50);
    }, 250);

    if(numero === 4) {
        dadosDate.data = document.getElementById('date-input').value;
        dadosDate.hora = document.getElementById('time-input').value;

        const dataFormatada = new Date(dadosDate.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        document.getElementById('resumo-data').innerText = dataFormatada;
        document.getElementById('resumo-hora').innerText = dadosDate.hora;
        document.getElementById('resumo-comida').innerText = (dadosDate.comida || 'Você escolhe!').replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');
    }
}

function selecionarComida(elemento, tipo) {
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    elemento.classList.add('selected');
    dadosDate.comida = tipo;
}

function salvarNaAgenda() {
    const dataLimpa = dadosDate.data.replace(/-/g, '');
    const horaLimpa = dadosDate.hora.replace(/:/g, '');
    const horaFim = String(parseInt(horaLimpa.substring(0,2)) + 2).padStart(2, '0') + horaLimpa.substring(2,4);
    
    const dataInicioFormatada = `${dataLimpa}T${horaLimpa}00`;
    const dataFimFormatada = `${dataLimpa}T${horaFim}00`;

    const titulo = encodeURIComponent("Date 🖤🌹");
    const detalhes = encodeURIComponent(`Cardápio combinado: ${dadosDate.comida || 'Surpresa'}.`);

    const urlGoogleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataInicioFormatada}/${dataFimFormatada}&details=${detalhes}`;
    window.open(urlGoogleCalendar, '_blank');
}

const btnNao = document.getElementById('btn-nao');
const emoji = document.getElementById('main-emoji');

function desviar() {
    tocarSomErro();
    
    if(emoji) {
        emoji.innerText = '😜';
        setTimeout(() => { emoji.innerText = '🥺'; }, 500);
    }

    const container = document.querySelector('.btn-container');
    const maxX = container.clientWidth - btnNao.clientWidth;
    const maxY = container.clientHeight - btnNao.clientHeight;
    
    const randomX = Math.max(10, Math.min(Math.random() * maxX, maxX - 10));
    const randomY = Math.max(10, Math.min(Math.random() * maxY, maxY - 10));
    
    btnNao.style.left = randomX + 'px';
    btnNao.style.top = randomY + 'px';
}
btnNao.addEventListener('mouseover', desviar);
btnNao.addEventListener('touchstart', (e) => { e.preventDefault(); desviar(); });

// Partículas de corações discretas no fundo
setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('heart-bg');
    heart.innerText = ['🖤', '❤️'][Math.floor(Math.random() * 2)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 6000);
}, 800);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function tocarSomErro() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
}