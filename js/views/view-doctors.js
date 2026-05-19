/* ===== DOCTORS VIEW ===== */
let doctorSignaturePad = null;
let editingDoctorId    = null;

async function loadDoctorsView() {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;
  grid.innerHTML = '<p class="loading-msg">Cargando doctores...</p>';
  try {
    const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    renderDoctorsGrid(data || []);
  } catch(e) {
    // Fallback a localStorage si la tabla no existe aún
    const local = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    renderDoctorsGrid(local);
  }
}

function renderDoctorsGrid(doctors) {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;
  if (!doctors.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" fill="none" stroke="#b0bec5" stroke-width="1.3" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <p>No hay doctores registrados</p>
        <button class="btn-primary" onclick="showDoctorForm()">＋ Agregar primer doctor</button>
      </div>`;
    return;
  }
  grid.innerHTML = `<div class="doctors-grid-inner">${doctors.map(d => `
    <div class="doctor-card">
      <div class="doctor-card-avatar">
        ${d.signature_image
          ? `<img src="${d.signature_image}" alt="firma" style="max-height:48px;max-width:80px;object-fit:contain;" />`
          : `<svg width="36" height="36" fill="none" stroke="#7ec8e3" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>`}
      </div>
      <div class="doctor-card-info">
        <strong>Dr. ${d.nombre}</strong>
        <span>${d.especialidad || ''}</span>
        <span>${d.clinica || ''}</span>
        <span style="color:#888;font-size:0.78rem;">Cédula: ${d.cedula || '—'}</span>
      </div>
      <div class="doctor-card-actions">
        <button class="btn-secondary" style="font-size:0.78rem;padding:5px 10px"
          onclick="editDoctor(${JSON.stringify(d).replace(/"/g,'&quot;')})">Editar</button>
        <button class="btn-remove"
          onclick="deleteDoctor('${d.id}','${(d.nombre||'').replace(/'/g,"\\'")}')">✕</button>
      </div>
    </div>`).join('')}</div>`;
}

function showDoctorForm(doctor = null) {
  editingDoctorId = doctor?.id || null;
  document.getElementById('doctor-form-title').textContent = doctor ? 'Editar Doctor' : 'Nuevo Doctor';
  document.getElementById('df-nombre').value       = doctor?.nombre       || '';
  document.getElementById('df-cedula').value       = doctor?.cedula       || '';
  document.getElementById('df-especialidad').value = doctor?.especialidad || '';
  document.getElementById('df-clinica').value      = doctor?.clinica      || '';
  document.getElementById('df-telefono').value     = doctor?.telefono     || '';
  document.getElementById('df-email').value        = doctor?.email        || '';
  document.getElementById('df-direccion').value    = doctor?.direccion    || '';

  document.getElementById('doctor-form-panel').style.display = 'block';
  document.getElementById('doctors-grid').style.display = 'none';

  // Init signature pad
  setTimeout(() => {
    const canvas = document.getElementById('df-signature-canvas');
    if (!canvas) return;
    doctorSignaturePad = new SignaturePad(canvas, { penColor: '#1a2740' });
    const ratio = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    doctorSignaturePad.clear();
    if (doctor?.signature_data) doctorSignaturePad.fromDataURL(doctor.signature_data);
    if (doctor?.signature_image) {
      document.getElementById('df-sig-img-show').src = doctor.signature_image;
      document.getElementById('df-sig-img-preview').style.display = 'block';
    } else {
      document.getElementById('df-sig-img-preview').style.display = 'none';
    }
  }, 50);
}

function hideDoctorForm() {
  document.getElementById('doctor-form-panel').style.display = 'none';
  document.getElementById('doctors-grid').style.display = 'block';
  editingDoctorId = null;
  doctorSignaturePad = null;
}

function clearDoctorSignature() {
  doctorSignaturePad?.clear();
}

function loadDoctorSigImage(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('df-sig-img-show').src = ev.target.result;
    document.getElementById('df-sig-img-preview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeDoctorSigImage() {
  document.getElementById('df-sig-img-show').src = '';
  document.getElementById('df-sig-img-preview').style.display = 'none';
}

function editDoctor(d) { showDoctorForm(d); }

async function saveDoctor() {
  const nombre = document.getElementById('df-nombre').value.trim();
  if (!nombre) { alert('El nombre del doctor es obligatorio.'); return; }

  const sigData  = (doctorSignaturePad && !doctorSignaturePad.isEmpty())
    ? doctorSignaturePad.toDataURL() : null;
  const sigImg   = document.getElementById('df-sig-img-show')?.src || null;

  const doctor = {
    nombre,
    cedula:       document.getElementById('df-cedula').value,
    especialidad: document.getElementById('df-especialidad').value,
    clinica:      document.getElementById('df-clinica').value,
    telefono:     document.getElementById('df-telefono').value,
    email:        document.getElementById('df-email').value,
    direccion:    document.getElementById('df-direccion').value,
    signature_data:  sigData,
    signature_image: sigImg && sigImg !== window.location.href ? sigImg : null,
  };

  try {
    let result;
    if (editingDoctorId) {
      result = await supabase.from('doctors').update(doctor).eq('id', editingDoctorId).select().single();
    } else {
      result = await supabase.from('doctors').insert(doctor).select().single();
    }
    if (result.error) throw result.error;
    showToast(`Dr. ${nombre} guardado correctamente.`);
  } catch(e) {
    // Fallback a localStorage
    const saved = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    doctor.id = editingDoctorId || Date.now();
    const idx = saved.findIndex(x => x.id === editingDoctorId);
    if (idx >= 0) saved[idx] = doctor; else saved.push(doctor);
    localStorage.setItem('doctorProfiles', JSON.stringify(saved));
    showToast(`Dr. ${nombre} guardado localmente.`);
  }
  hideDoctorForm();
  loadDoctorsView();
}

async function deleteDoctor(id, nombre) {
  if (!confirm(`¿Eliminar al Dr. ${nombre}?`)) return;
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) throw error;
  } catch {
    let saved = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    saved = saved.filter(x => String(x.id) !== String(id));
    localStorage.setItem('doctorProfiles', JSON.stringify(saved));
  }
  showToast(`Dr. ${nombre} eliminado.`);
  loadDoctorsView();
}
