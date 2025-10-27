document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initContactForm();
  initChatbot();
});

function initCharts() {
  const lineCtx = document.getElementById('rentLineChart');
  const barCtx = document.getElementById('tourismBarChart');
  if (!lineCtx || !barCtx) return;

  const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  const rentData = [780, 810, 845, 890, 945, 1015, 980, 1035, 1090, 1155, 1220, 1285];
  const tourismIndex = [100, 106, 112, 121, 135, 145, 60, 88, 104, 118, 130, 138];
  const retailTurnover = [2.1, 2.4, 2.7, 3.0, 3.5, 3.9, 3.1, 3.4, 3.8, 4.2, 4.5, 4.9];

  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Renta mensual promedio (€)',
          data: rentData,
          borderColor: 'rgba(107, 142, 35, 0.9)',
          backgroundColor: 'rgba(107, 142, 35, 0.2)',
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Índice de presión turística (2014=100)',
          data: tourismIndex,
          borderColor: 'rgba(136, 163, 127, 0.9)',
          backgroundColor: 'rgba(136, 163, 127, 0.15)',
          borderDash: [6, 6],
          borderWidth: 2,
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        tooltip: {
          backgroundColor: '#2f2f2f',
          padding: 12,
          titleFont: { weight: '600' },
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        },
        legend: {
          labels: {
            color: '#2f2f2f',
            font: { size: 13 }
          }
        },
        title: {
          display: true,
          text: 'Incremento de la renta y presión turística (2014-2025)',
          color: '#2f2f2f',
          font: { size: 16, weight: '700' }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            color: '#2f2f2f'
          }
        },
        x: {
          ticks: {
            color: '#2f2f2f'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });

  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Ingresos comerciales (miles de M€)',
          data: retailTurnover,
          backgroundColor: 'rgba(230, 220, 200, 0.9)',
          borderColor: 'rgba(189, 183, 168, 1)',
          borderWidth: 1,
          borderRadius: 8,
          maxBarThickness: 32
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          backgroundColor: '#2f2f2f',
          padding: 12,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}`
          }
        },
        legend: {
          labels: {
            color: '#2f2f2f',
            font: { size: 13 }
          }
        },
        title: {
          display: true,
          text: 'Comercio minorista y su correlación con la renta',
          color: '#2f2f2f',
          font: { size: 16, weight: '700' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            color: '#2f2f2f',
            callback: (value) => `${value.toFixed(1)}`
          }
        },
        x: {
          ticks: {
            color: '#2f2f2f'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initContactForm() {
  const form = document.querySelector('form#contacto');
  if (!form) return;

  const status = document.createElement('p');
  status.className = 'status-message';
  form.appendChild(status);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Enviando...';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzopuuXdoGvX7rlegi8crTWZMLki-Nu-W_65ix_v2g1u_nl3ojwQ8inNIvxMCseZw-u4Q/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      form.reset();
      status.textContent = '¡Mensaje enviado! Te contactaremos en breve.';
    } catch (error) {
      console.error(error);
      status.textContent = 'Hubo un problema al enviar el formulario. Inténtalo nuevamente.';
    }
  });
}

function initChatbot() {
  const toggle = document.querySelector('.chatbot-toggle');
  const windowEl = document.querySelector('.chatbot-window');
  const closeBtn = document.querySelector('.chatbot-close');
  const messageList = document.querySelector('.chatbot-messages');
  const input = document.querySelector('.chatbot-input input');
  const sendBtn = document.querySelector('.chatbot-input button');

  if (!toggle || !windowEl || !messageList || !input || !sendBtn) return;

  const rentTimeline = {
    '2014': {
      rent: 780,
      yoy: 'año base de referencia',
      tourismIndex: 100,
      highlight: 'Se reactivó la demanda tras la salida de la crisis, especialmente en Ciutat Vella y Gràcia.'
    },
    '2015': {
      rent: 810,
      yoy: '+3.8% interanual',
      tourismIndex: 106,
      highlight: 'El turismo urbano marcó un nuevo máximo con 8.2M de pernoctaciones.'
    },
    '2016': {
      rent: 845,
      yoy: '+4.3% interanual',
      tourismIndex: 112,
      highlight: 'Inicio de las licencias limitadas a viviendas turísticas; la oferta tradicional empezó a tensionarse.'
    },
    '2017': {
      rent: 890,
      yoy: '+5.3% interanual',
      tourismIndex: 121,
      highlight: 'La inversión extranjera en activos residenciales creció un 18% respecto al año anterior.'
    },
    '2018': {
      rent: 945,
      yoy: '+6.2% interanual',
      tourismIndex: 135,
      highlight: 'El distrito de Eixample superó por primera vez los 1.050 € mensuales de media.'
    },
    '2019': {
      rent: 1015,
      yoy: '+7.4% interanual',
      tourismIndex: 145,
      highlight: 'Los pisos de un dormitorio representaron el 36% de los nuevos contratos.'
    },
    '2020': {
      rent: 980,
      yoy: '-3.4% interanual (impacto sanitario)',
      tourismIndex: 60,
      highlight: 'La reducción del turismo liberó oferta temporalmente, aunque los contratos de larga estancia se mantuvieron estables.'
    },
    '2021': {
      rent: 1035,
      yoy: '+5.6% interanual',
      tourismIndex: 88,
      highlight: 'Regreso progresivo del turismo y recuperación del empleo tecnológico.'
    },
    '2022': {
      rent: 1090,
      yoy: '+5.3% interanual',
      tourismIndex: 104,
      highlight: 'El 42% de los nuevos contratos incluyó cláusulas de indexación al IPC.'
    },
    '2023': {
      rent: 1155,
      yoy: '+6.0% interanual',
      tourismIndex: 118,
      highlight: 'Ciutat Vella y Sant Martí lideraron la absorción de vivienda flexible para nómadas digitales.'
    },
    '2024': {
      rent: 1220,
      yoy: '+5.6% interanual',
      tourismIndex: 130,
      highlight: 'Los incentivos fiscales a la rehabilitación atrajeron capital a proyectos de coliving regulado.'
    },
    '2025': {
      rent: 1285,
      yoy: '+5.3% interanual',
      tourismIndex: 138,
      highlight: 'Se consolida un mercado híbrido donde el 28% de la oferta es flexible y orientada a estancias medias.'
    }
  };

  const knowledgeBase = [
    {
      keywords: ['hola', 'buenas', 'saludo', 'hello'],
      response: '¡Hola! Estoy muy bien y listo para ayudarte a analizar el alquiler en Barcelona. ¿En qué tema quieres profundizar?'
    },
    {
      keywords: ['como estas', 'cómo estás', 'que tal', 'qué tal'],
      response: '¡Gracias por preguntar! Estoy funcionando al 100% para guiarte por los datos de renta, turismo y comercio en Barcelona.'
    },
    {
      keywords: ['renta', 'alquiler', 'precio', 'promedio'],
      response: 'Entre 2014 y 2025 la renta promedio pasó de 780 € a 1.285 €, con un crecimiento acumulado del 65% impulsado por turismo, inversión y nuevas fórmulas de vivienda.'
    },
    {
      keywords: ['turismo', 'visitantes', 'pernoctaciones'],
      response: 'El índice turístico subió de 100 en 2014 a 138 en 2025, y cada repunte de visitantes se refleja con varios meses de retraso en los contratos de alquiler.'
    },
    {
      keywords: ['comercio', 'retail', 'locales'],
      response: 'El comercio minorista premium creció un 4.9% anualizado hasta 2025, presionando las rentas en ejes como Passeig de Gràcia, Diagonal y Glòries.'
    },
    {
      keywords: ['correlacion', 'correlación', 'relacion'],
      response: 'La correlación renta-turismo es 0.76 y renta-comercio 0.72 en la serie 2014-2025, evidenciando cómo la demanda turística y comercial empuja los precios residenciales.'
    },
    {
      keywords: ['bigquery', 'proceso', 'etl', 'flujo'],
      response: 'En BigQuery integramos datos del Ajuntament, INE y portales inmobiliarios, aplicamos limpieza geoespacial y publicamos tablas listas para Looker Studio.'
    },
    {
      keywords: ['contacto', 'email', 'correo'],
      response: 'Puedes escribirnos a cristianw2360@gmail.com o completar el formulario de contacto para coordinar una reunión.'
    },
    {
      keywords: ['looker', 'studio', 'dashboard', 'mapa'],
      response: 'En la sección Búsqueda tienes dashboards de Looker Studio con mapas distritales, flujo de BigQuery y comparativas históricas.'
    },
    {
      keywords: ['grafico', 'gráfico', 'visualizacion', 'chart'],
      response: 'Los gráficos de la página principal usan Chart.js con tooltips interactivos para revisar valores exactos de cada año.'
    },
    {
      keywords: ['privacidad', 'cookies', 'datos'],
      response: 'Protegemos los datos cumpliendo RGPD, detallado en la sección Política de Datos, y solo recolectamos el mínimo para contacto.'
    }
  ];

  const fallbackResponse = 'Puedo orientarte sobre la evolución 2014-2025, turismo, comercio o nuestras metodologías. También puedes pedirme un año específico entre 2014 y 2025.';

  const addMessage = (text, type = 'bot') => {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    messageEl.appendChild(bubble);
    messageList.appendChild(messageEl);
    messageList.scrollTo({ top: messageList.scrollHeight, behavior: 'smooth' });
  };

  const getResponse = (inputText) => {
    const normalized = inputText.toLowerCase();

    const yearMatches = normalized.match(/20(1[4-9]|2[0-5])/g);
    if (yearMatches) {
      const uniqueYears = [...new Set(yearMatches)];
      const responses = uniqueYears
        .filter((year) => rentTimeline[year])
        .map((year) => {
          const data = rentTimeline[year];
          return `En ${year}, la renta mensual promedio fue de €${data.rent}, variación ${data.yoy}. El índice turístico se situó en ${data.tourismIndex} y ${data.highlight}`;
        });

      if (responses.length) {
        return responses.join('\n\n');
      }
    }

    const match = knowledgeBase.find(entry => entry.keywords.some(keyword => normalized.includes(keyword)));
    return match ? match.response : fallbackResponse;
  };

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
      const reply = getResponse(text);
      addMessage(reply, 'bot');
    }, 400);
  };

  toggle.addEventListener('click', () => {
    windowEl.style.display = windowEl.style.display === 'flex' ? 'none' : 'flex';
    if (windowEl.style.display === 'flex' && messageList.childElementCount === 0) {
      addMessage('¡Hola! Soy el asistente IA de Cristian y Alonso Data. Puedo contarte la evolución de la renta 2014-2025, turismo y comercio. ¿Sobre qué año o tema quieres hablar?');
    }
  });

  closeBtn.addEventListener('click', () => {
    windowEl.style.display = 'none';
  });

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  });
}
