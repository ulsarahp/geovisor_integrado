document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');
  const mapEl = document.getElementById('map');
  const mapDashboardEl = document.getElementById('map-dashboard');

  const defaultTheme = localStorage.getItem('geovisor-theme') || 'dark';
  root.setAttribute('data-theme', defaultTheme);
  updateThemeIcon(defaultTheme);

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', current);
    localStorage.setItem('geovisor-theme', current);
    updateThemeIcon(current);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  const map = L.map(mapEl, { zoomControl: true }).setView([23.5, -102], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const dashboardMap = L.map(mapDashboardEl, { zoomControl: true }).setView([23.5, -102], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(dashboardMap);

  map.on('mousemove', (e) => {
    const coords = document.getElementById('coords-value');
    if (coords) coords.textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
  });

  const panel = document.getElementById('panel');
  const panelOverlay = document.getElementById('panel-overlay');
  const btnPanelClose = document.getElementById('panel-close');

  btnPanelClose?.addEventListener('click', () => {
    panel.style.display = 'none';
    panelOverlay.style.display = 'block';
  });

  panelOverlay?.addEventListener('click', () => {
    panel.style.display = 'block';
    panelOverlay.style.display = 'none';
  });

  const dashboardContainer = document.getElementById('dashboard-container');
  const tabs = document.querySelectorAll('.tab');
  const headerBtn = document.getElementById('btn-tour-header');
  const faqBtn = document.getElementById('btn-faq-header');
  const dashboardClose = document.getElementById('dashboard-close-btn');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      const current = tab.dataset.tab;
      if (current === 'dashboard') {
        dashboardContainer.style.display = 'block';
      } else {
        dashboardContainer.style.display = 'none';
      }
    });
  });

  dashboardClose?.addEventListener('click', () => {
    dashboardContainer.style.display = 'none';
    document.querySelector('.tab[data-tab="general"]').classList.add('active');
    document.querySelector('.tab[data-tab="dashboard"]').classList.remove('active');
  });

  headerBtn?.addEventListener('click', () => {
    document.getElementById('status').textContent = 'Recorrido guiado iniciado';
  });

  faqBtn?.addEventListener('click', () => {
    document.getElementById('status').textContent = 'Sección de preguntas frecuentes abierta';
  });

  const btnBuscar = document.getElementById('btnBuscar');
  const inputBusqueda = document.getElementById('inputBusqueda');
  const resultados = document.getElementById('resultados-busqueda');

  const sampleAreas = [
    { name: 'Reserva de la Biosfera Selva El Ocote', lat: 16.6, lng: -93.0 },
    { name: 'Parque Nacional Cumbres de Monterrey', lat: 25.3, lng: -100.2 },
    { name: 'Isla Contoy', lat: 21.5, lng: -86.8 },
    { name: 'Sierra Gorda', lat: 21.7, lng: -99.4 }
  ];

  btnBuscar?.addEventListener('click', () => {
    const query = inputBusqueda.value.trim().toLowerCase();
    const match = sampleAreas.find((area) => area.name.toLowerCase().includes(query));
    if (match) {
      map.setView([match.lat, match.lng], 10);
      results.textContent = `Resultado: ${match.name}`;
      L.circleMarker([match.lat, match.lng], { radius: 10, color: '#1a5c4e' }).addTo(map);
    } else {
      resultados.textContent = 'No se encontraron resultados en la búsqueda actual.';
    }
  });

  const charts = {
    anpCount: null,
    anpArea: null,
    advc: null,
  };

  function buildCharts() {
    const countCtx = document.getElementById('chartAnpCount');
    const areaCtx = document.getElementById('chartAnpArea');
    const advcCtx = document.getElementById('chartAdvc');

    if (countCtx) {
      charts.anpCount = new Chart(countCtx, {
        type: 'bar',
        data: {
          labels: ['Protegida', 'Reserva', 'Parque', 'Biosfera'],
          datasets: [{
            label: 'ANP',
            data: [28, 15, 11, 9],
            backgroundColor: ['#1a5c4e', '#237660', '#3b82f6', '#8a57a8']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    if (areaCtx) {
      charts.anpArea = new Chart(areaCtx, {
        type: 'doughnut',
        data: {
          labels: ['Terrestre', 'Marina', 'Mixta'],
          datasets: [{
            data: [62, 22, 16],
            backgroundColor: ['#1a5c4e', '#2d9a87', '#6f4489']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    if (advcCtx) {
      charts.advc = new Chart(advcCtx, {
        type: 'pie',
        data: {
          labels: ['Ejidal', 'Comunal', 'Privado', 'Otro'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#c084fc', '#a78bfa', '#7dd3fc', '#fbbf24']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }
  }

  buildCharts();

  const dashboardLegend = document.getElementById('dashboard-legend');
  if (dashboardLegend) {
    dashboardLegend.innerHTML = `
      <div class="leyenda-item"><span class="leyenda-color" style="background:#1a5c4e"></span><span class="leyenda-label">ANP</span></div>
      <div class="leyenda-item"><span class="leyenda-color" style="background:#c084fc"></span><span class="leyenda-label">ADVC</span></div>
      <div class="leyenda-item"><span class="leyenda-color" style="background:#2d9a87"></span><span class="leyenda-label">Regiones</span></div>
    `;
  }

  const legend = document.getElementById('leyenda');
  if (legend) {
    legend.innerHTML = `
      <div class="leyenda-item"><span class="leyenda-color" style="background:#1a5c4e"></span><span class="leyenda-label">ANP</span></div>
      <div class="leyenda-item"><span class="leyenda-color" style="background:#c084fc"></span><span class="leyenda-label">ADVC</span></div>
      <div class="leyenda-item"><span class="leyenda-color" style="background:#fbbf24"></span><span class="leyenda-label">Capas contextuales</span></div>
    `;
    legend.style.display = 'block';
  }

  const systemStatusText = document.getElementById('system-status-text');
  if (systemStatusText) {
    systemStatusText.textContent = 'Conectado';
  }

  const btnApplyFilters = document.getElementById('btn-aplicar-filtros-casc');
  const filtersMenu = document.getElementById('filtros-cascade-menu');
  const btnFiltros = document.getElementById('btn-filtros-cascade');

  btnFiltros?.addEventListener('click', () => {
    const open = filtersMenu.style.display === 'block';
    filtersMenu.style.display = open ? 'none' : 'block';
  });

  btnApplyFilters?.addEventListener('click', () => {
    filtersMenu.style.display = 'none';
    document.getElementById('status').textContent = 'Filtros aplicados correctamente';
  });

  const tabla = document.getElementById('tabla-datos');
  if (tabla) {
    const thead = tabla.querySelector('thead tr');
    const tbody = tabla.querySelector('tbody');
    const columnas = ['Nombre', 'Estado', 'Categoría', 'Superficie (ha)'];
    thead.innerHTML = columnas.map((col) => `<th>${col}</th>`).join('');
    const rows = [
      ['Reserva de la Biosfera', 'Chiapas', 'Biosfera', '487,000'],
      ['Parque Nacional', 'Nuevo León', 'Parque', '120,000'],
      ['Isla Contoy', 'Quintana Roo', 'Flora y Fauna', '5,000'],
      ['Sierra Gorda', 'Querétaro', 'Reserva de la Biosfera', '383,000']
    ];
    tbody.innerHTML = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
  }

  const status = document.getElementById('status');
  const contAnp = document.getElementById('cont-anp');
  const contAdvc = document.getElementById('cont-advc');
  if (contAnp) contAnp.textContent = '24';
  if (contAdvc) contAdvc.textContent = '18';

  if (status) status.textContent = 'Conectado y listo para analizar';
});
