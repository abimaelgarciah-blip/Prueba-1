/* ===== DASHBOARD VIEW ===== */
let chartSistemas  = null;
let chartSexo      = null;
let chartTendencia = null;

async function loadDashboard() {
  const statsEl = document.getElementById('dashboard-stats');
  const tableEl = document.getElementById('dashboard-table');
  if (!statsEl) return;

  statsEl.innerHTML = '<p class="loading-msg">Cargando datos...</p>';

  try {
    const clinic = document.getElementById('dashboard-filter-empresa')?.value || '';
    let query = supabase.from('medical_records').select('*').order('updated_at', { ascending: false });
    if (clinic) query = query.eq('clinic', clinic);

    const { data, error } = await query;
    if (error) throw error;

    const records = data || [];
    renderStats(records);
    renderCharts(records);
    renderDashboardTable(records.slice(0, 10));
    populateClinicFilter(records);
  } catch(e) {
    statsEl.innerHTML = `<p class="error-msg">Error al cargar el dashboard: ${e.message}</p>`;
  }
}

function renderStats(records) {
  const total   = records.length;
  const masc    = records.filter(r => r.data?.['s1-sex'] === 'Masculino').length;
  const fem     = records.filter(r => r.data?.['s1-sex'] === 'Femenino').length;
  const clinics = [...new Set(records.map(r => r.clinic).filter(Boolean))].length;

  const hoy      = new Date();
  const mes      = records.filter(r => {
    if (!r.updated_at) return false;
    const d = new Date(r.updated_at);
    return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
  }).length;

  document.getElementById('dashboard-stats').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Total de pacientes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${mes}</div>
        <div class="stat-label">Este mes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${masc}</div>
        <div class="stat-label">Masculino</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${fem}</div>
        <div class="stat-label">Femenino</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${clinics}</div>
        <div class="stat-label">Clínicas</div>
      </div>
    </div>`;
}

function renderCharts(records) {
  // ── Chart 1: Hallazgos por sistema ──
  const sistemas = {
    'Respiratorio':   0, 'Cardiovascular': 0, 'Gastrointestinal': 0,
    'Genitourinario': 0, 'Endocrino':      0, 'Musculoesquelético': 0,
    'Hematopoyético': 0, 'Nervioso':        0
  };
  const resultFields = {
    'Respiratorio':       ['s7-rx-resultado','s7-espiro-resultado'],
    'Cardiovascular':     ['s8-pef-resultado','s8-ecg-resultado','s8-eco-resultado'],
    'Gastrointestinal':   ['s9-eco-resultado','s9-hepatico-resultado','s9-copro-resultado'],
    'Genitourinario':     ['s10-eco-rin-resultado','s10-mamo-resultado'],
    'Endocrino':          ['s12-glucosa-res','s12-col-total-res','s12-acido-urico-res'],
    'Musculoesquelético': ['s13-rx-col-resultado','s13-densi-resultado'],
    'Hematopoyético':     ['s14-hb-res','s14-leuco-res','s14-plaq-res'],
    'Nervioso':           ['s11-oftal-resultado','s11-audio-resultado']
  };
  records.forEach(r => {
    Object.entries(resultFields).forEach(([sys, fields]) => {
      const hasAnormal = fields.some(f => (r.data?.[f]||'').toLowerCase().includes('anormal'));
      if (hasAnormal) sistemas[sys]++;
    });
  });

  destroyChart('chartSistemas');
  const ctx1 = document.getElementById('chart-sistemas');
  if (ctx1) {
    chartSistemas = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: Object.keys(sistemas),
        datasets: [{ label: 'Pacientes con hallazgos anormales', data: Object.values(sistemas),
          backgroundColor: '#3b82f6', borderRadius: 6 }]
      },
      options: { responsive: true, plugins: { legend: { display: false },
        title: { display: true, text: 'Hallazgos Anormales por Sistema', font: { size: 14 } } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }

  // ── Chart 2: Distribución por sexo ──
  const masc = records.filter(r => r.data?.['s1-sex'] === 'Masculino').length;
  const fem  = records.filter(r => r.data?.['s1-sex'] === 'Femenino').length;
  const nosp = records.length - masc - fem;

  destroyChart('chartSexo');
  const ctx2 = document.getElementById('chart-sexo');
  if (ctx2) {
    chartSexo = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Masculino', 'Femenino', 'No especificado'],
        datasets: [{ data: [masc, fem, nosp],
          backgroundColor: ['#3b82f6','#ec4899','#94a3b8'], borderWidth: 2 }]
      },
      options: { responsive: true, plugins: {
        title: { display: true, text: 'Distribución por Sexo', font: { size: 14 } } } }
    });
  }

  // ── Chart 3: Tendencia mensual ──
  const meses = {};
  records.forEach(r => {
    if (!r.updated_at) return;
    const d = new Date(r.updated_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    meses[key] = (meses[key] || 0) + 1;
  });
  const sortedKeys = Object.keys(meses).sort().slice(-6);
  const labels6 = sortedKeys.map(k => {
    const [y, m] = k.split('-');
    return new Date(+y, +m-1, 1).toLocaleDateString('es-MX', { month:'short', year:'2-digit' });
  });

  destroyChart('chartTendencia');
  const ctx3 = document.getElementById('chart-tendencia');
  if (ctx3) {
    chartTendencia = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labels6,
        datasets: [{ label: 'Estudios realizados', data: sortedKeys.map(k => meses[k]),
          borderColor: '#1e4d8c', backgroundColor: 'rgba(30,77,140,0.1)',
          tension: 0.4, fill: true, pointRadius: 5 }]
      },
      options: { responsive: true, plugins: {
        title: { display: true, text: 'Tendencia Mensual (últimos 6 meses)', font: { size: 14 } } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }
}

function renderDashboardTable(records) {
  const el = document.getElementById('dashboard-table');
  if (!el) return;
  if (!records.length) { el.innerHTML = '<p style="color:#888">No hay datos.</p>'; return; }
  el.innerHTML = `
    <table class="dash-table">
      <thead>
        <tr>
          <th>Paciente</th><th>Sexo</th><th>Edad</th>
          <th>Clínica</th><th>Fecha estudio</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(r => {
          const date = r.study_date
            ? new Date(r.study_date+'T12:00:00').toLocaleDateString('es-MX')
            : '—';
          return `<tr>
            <td><strong>${r.patient_name||'—'}</strong></td>
            <td>${r.data?.['s1-sex']||'—'}</td>
            <td>${r.data?.['s1-age']||'—'}</td>
            <td>${r.clinic||'—'}</td>
            <td>${date}</td>
            <td><button class="btn-secondary" style="font-size:0.78rem;padding:4px 10px"
              onclick="openPatientRecord('${r.id}'); showView('patients')">Ver</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function populateClinicFilter(records) {
  const sel = document.getElementById('dashboard-filter-empresa');
  if (!sel) return;
  const current = sel.value;
  const clinics = [...new Set(records.map(r => r.clinic).filter(Boolean))].sort();
  sel.innerHTML = '<option value="">Todas las clínicas</option>' +
    clinics.map(c => `<option value="${c}" ${c===current?'selected':''}>${c}</option>`).join('');
}

function destroyChart(key) {
  if (window[key]) { window[key].destroy(); window[key] = null; }
}
