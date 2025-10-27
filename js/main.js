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

  const knowledgeBase = [
    {
      keywords: ['hola', 'buenas', 'saludo', 'hello'],
      response: '¡Hola! Soy el asistente IA de Cristian y Alonso Data. ¿Listo para explorar el comportamiento del alquiler en Barcelona?'
    },
    {
      keywords: ['renta', 'alquiler', 'precio'],
      response: 'Los precios de la renta han aumentado un 65% desde 2014, con picos asociados a la presión turística y la inversión inmobiliaria internacional.'
    },
    {
      keywords: ['turismo', 'visitantes'],
      response: 'La llegada de visitantes internacionales impulsa la demanda de alquiler turístico, generando tensiones en el mercado residencial y desplazamientos en Ciutat Vella y Eixample.'
    },
    {
      keywords: ['comercio', 'retail'],
      response: 'El comercio minorista ha crecido en paralelo a la renta, especialmente en ejes como Passeig de Gràcia. Esto aumenta la competitividad por locales y pisos bien ubicados.'
    },
    {
      keywords: ['correlacion', 'correlación'],
      response: 'Nuestros gráficos muestran correlaciones positivas entre renta, turismo y actividad comercial con coeficientes superiores a 0.7 en los principales distritos.'
    },
    {
      keywords: ['bigquery', 'proceso', 'etl'],
      response: 'El flujo en BigQuery incluye ingesta de datos municipales, normalización de direcciones, enriquecimiento con censos y publicación en Looker Studio para visualización.'
    },
    {
      keywords: ['contacto', 'email', 'correo'],
      response: 'Puedes escribirnos a cristianw2360@gmail.com o completar el formulario de contacto para coordinar una reunión.'
    },
    {
      keywords: ['looker', 'studio', 'dashboard', 'mapa'],
      response: 'En Looker Studio encontrarás mapas por distrito, métricas de inmigración y comparativas de rentas históricas listadas en la sección Búsqueda.'
    },
    {
      keywords: ['grafico', 'gráfico', 'visualizacion'],
      response: 'Los gráficos interactivos están impulsados por Chart.js y permiten inspeccionar datos año a año al pasar el cursor.'
    },
    {
      keywords: ['privacidad', 'cookies', 'datos'],
      response: 'Tratamos los datos conforme a la normativa europea y detallamos las políticas en la sección Política de Datos.'
    }
  ];

  const fallbackResponse = 'Puedo ayudarte con tendencias de renta, turismo, comercio y detalles del proyecto. ¿Podrías reformular tu pregunta?';

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
      addMessage('¡Hola! Soy el asistente IA de Cristian y Alonso Data. ¿En qué puedo ayudarte?');
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
