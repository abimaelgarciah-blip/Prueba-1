window.sheet19 = {
  id: 'sheet19',
  label: 'Hoja 19: Datos y Firma del Doctor',
  signaturePad: null,
  render() {
    return `
    <div class="sheet" id="sheet-19">
      <div class="sheet-header">
        <h1>Datos y Firma del Doctor</h1>
        <span class="sheet-number">Hoja 19</span>
      </div>
      <div class="sheet-body">

        <div class="section-card">
          <h3>Datos de Identificación del Médico</h3>
          <div class="grid-2">
            <div class="form-group">
              <label>Nombre del Doctor</label>
              <input type="text" id="s19-nombre" placeholder="Dr. Nombre Apellido" oninput="saveFieldState('s19-nombre')" />
            </div>
            <div class="form-group">
              <label>Cédula Profesional</label>
              <input type="text" id="s19-cedula" placeholder="Número de cédula" oninput="saveFieldState('s19-cedula')" />
            </div>
            <div class="form-group">
              <label>Especialidad</label>
              <input type="text" id="s19-especialidad" placeholder="Ej. Medicina Interna" oninput="saveFieldState('s19-especialidad')" />
            </div>
            <div class="form-group">
              <label>Institución / Clínica</label>
              <input type="text" id="s19-clinica" placeholder="Nombre de la institución" oninput="saveFieldState('s19-clinica')" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="text" id="s19-telefono" placeholder="Ej. +52 55 1234 5678" oninput="saveFieldState('s19-telefono')" />
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="text" id="s19-email" placeholder="doctor@clinica.com" oninput="saveFieldState('s19-email')" />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input type="text" id="s19-direccion" placeholder="Dirección del consultorio" oninput="saveFieldState('s19-direccion')" />
            </div>
            <div class="form-group">
              <label>Ciudad</label>
              <input type="text" id="s19-ciudad" placeholder="Ciudad, Estado" oninput="saveFieldState('s19-ciudad')" />
            </div>
          </div>
        </div>

        <div class="section-card">
          <h3>Firma Digital</h3>
          <p style="font-size:0.82rem;color:#888;margin-bottom:10px;">
            Dibuje su firma con el mouse o dedo. La firma se guarda automáticamente.
          </p>
          <div class="signature-box">
            <canvas id="signature-canvas" width="800" height="200"></canvas>
            <div class="signature-actions">
              <button class="btn-secondary" onclick="sheet19.clearSignature()">Limpiar</button>
              <button class="btn-primary" onclick="sheet19.saveSignature()">Guardar firma</button>
              <button class="btn-secondary" onclick="sheet19.loadSignature()">Cargar firma guardada</button>
            </div>
          </div>

          <div style="margin-top:12px;">
            <label style="font-weight:600;font-size:0.85rem;color:#34495e;text-transform:uppercase;">
              Imagen de firma (alternativa)
            </label>
            <p style="font-size:0.8rem;color:#888;margin:4px 0 8px;">
              O sube una imagen de tu firma si ya la tienes escaneada.
            </p>
            <button class="btn-secondary" onclick="document.getElementById('s19-sig-img-input').click()">
              📎 Subir imagen de firma
            </button>
            <input type="file" id="s19-sig-img-input" accept="image/*" style="display:none" onchange="sheet19.onSigImageChange(event)" />
            <div id="s19-sig-img-preview" style="margin-top:10px;display:none;">
              <img id="s19-sig-img" src="" alt="Firma" style="max-height:100px;border:1px solid #dce3ec;border-radius:6px;padding:4px;" />
              <button class="btn-remove" style="margin-left:8px;" onclick="sheet19.removeSigImage()">✕ Quitar</button>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h3>Firmas Guardadas</h3>
          <p style="font-size:0.82rem;color:#888;margin-bottom:12px;">
            Guarda el perfil del doctor para reutilizarlo en futuros estudios.
          </p>
          <div id="s19-saved-doctors"></div>
          <button class="btn-primary" onclick="sheet19.saveDoctorProfile()">💾 Guardar perfil del doctor</button>
        </div>

        <div class="section-card" style="margin-top:24px;text-align:center;background:#f8fafb;">
          <div style="border-top:2px solid #1e4d8c;width:280px;margin:40px auto 8px;"></div>
          <p id="s19-firma-nombre" style="font-weight:700;color:#1e4d8c;font-size:1rem;">
            ${(()=>'')()}
          </p>
          <p id="s19-firma-cedula" style="color:#555;font-size:0.85rem;"></p>
          <p id="s19-firma-especialidad" style="color:#555;font-size:0.85rem;"></p>
        </div>
      </div>
    </div>`;
  },
  initSignaturePad() {
    const canvas = document.getElementById('signature-canvas');
    if (!canvas || this.signaturePad) return;
    this.signaturePad = new SignaturePad(canvas, { backgroundColor:'rgba(255,255,255,0)', penColor:'#1a2740' });
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      this.signaturePad.clear();
      if (appState.signatureData) this.signaturePad.fromDataURL(appState.signatureData);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    this.signaturePad.addEventListener('endStroke', () => {
      appState.signatureData = this.signaturePad.toDataURL();
      saveToStorage();
      this.updateSignatureFooter();
    });
    if (appState.signatureData) this.signaturePad.fromDataURL(appState.signatureData);
  },
  clearSignature() {
    if (this.signaturePad) { this.signaturePad.clear(); appState.signatureData = null; saveToStorage(); }
  },
  saveSignature() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      appState.signatureData = this.signaturePad.toDataURL();
      saveToStorage();
      alert('Firma guardada correctamente.');
    } else { alert('Por favor dibuje su firma primero.'); }
  },
  loadSignature() {
    if (appState.signatureData && this.signaturePad) {
      this.signaturePad.fromDataURL(appState.signatureData);
    } else { alert('No hay firma guardada.'); }
  },
  onSigImageChange(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('s19-sig-img').src = ev.target.result;
      document.getElementById('s19-sig-img-preview').style.display = 'block';
      appState.signatureImage = ev.target.result;
      saveToStorage();
    };
    reader.readAsDataURL(file);
  },
  removeSigImage() {
    document.getElementById('s19-sig-img').src = '';
    document.getElementById('s19-sig-img-preview').style.display = 'none';
    appState.signatureImage = null;
    saveToStorage();
  },
  saveDoctorProfile() {
    const profile = {
      nombre: document.getElementById('s19-nombre')?.value || '',
      cedula: document.getElementById('s19-cedula')?.value || '',
      especialidad: document.getElementById('s19-especialidad')?.value || '',
      clinica: document.getElementById('s19-clinica')?.value || '',
      telefono: document.getElementById('s19-telefono')?.value || '',
      email: document.getElementById('s19-email')?.value || '',
      direccion: document.getElementById('s19-direccion')?.value || '',
      ciudad: document.getElementById('s19-ciudad')?.value || '',
      signatureData: appState.signatureData || null,
      signatureImage: appState.signatureImage || null,
      id: Date.now()
    };
    if (!profile.nombre) { alert('Por favor ingrese el nombre del doctor.'); return; }
    const saved = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    saved.push(profile);
    localStorage.setItem('doctorProfiles', JSON.stringify(saved));
    this.renderSavedDoctors();
    alert(`Perfil del Dr. ${profile.nombre} guardado.`);
  },
  renderSavedDoctors() {
    const container = document.getElementById('s19-saved-doctors');
    if (!container) return;
    const saved = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    if (!saved.length) { container.innerHTML = '<p style="color:#888;font-size:0.85rem;">No hay perfiles guardados.</p>'; return; }
    container.innerHTML = saved.map(p => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;border:1px solid #dce3ec;border-radius:7px;margin-bottom:8px;background:#fafbfc;">
        <div style="flex:1;">
          <strong style="font-size:0.9rem">${p.nombre}</strong>
          <span style="color:#666;font-size:0.8rem;display:block">${p.especialidad} — Cédula: ${p.cedula}</span>
        </div>
        <button class="btn-secondary" style="font-size:0.78rem;padding:5px 10px"
          onclick="sheet19.loadDoctorProfile(${p.id})">Cargar</button>
        <button class="btn-remove" style="font-size:0.78rem"
          onclick="sheet19.deleteDoctorProfile(${p.id})">✕</button>
      </div>`).join('');
  },
  loadDoctorProfile(id) {
    const saved = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    const p = saved.find(x=>x.id===id); if (!p) return;
    ['nombre','cedula','especialidad','clinica','telefono','email','direccion','ciudad'].forEach(k => {
      const el = document.getElementById(`s19-${k}`);
      if (el) { el.value = p[k]||''; saveFieldState(`s19-${k}`); }
    });
    if (p.signatureData) { appState.signatureData = p.signatureData; if (this.signaturePad) this.signaturePad.fromDataURL(p.signatureData); saveToStorage(); }
    if (p.signatureImage) {
      appState.signatureImage = p.signatureImage;
      document.getElementById('s19-sig-img').src = p.signatureImage;
      document.getElementById('s19-sig-img-preview').style.display = 'block';
      saveToStorage();
    }
    this.updateSignatureFooter();
  },
  deleteDoctorProfile(id) {
    let saved = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    saved = saved.filter(x=>x.id!==id);
    localStorage.setItem('doctorProfiles', JSON.stringify(saved));
    this.renderSavedDoctors();
  },
  updateSignatureFooter() {
    const n = document.getElementById('s19-nombre')?.value || '';
    const c = document.getElementById('s19-cedula')?.value || '';
    const e = document.getElementById('s19-especialidad')?.value || '';
    const fn = document.getElementById('s19-firma-nombre');
    const fc = document.getElementById('s19-firma-cedula');
    const fe = document.getElementById('s19-firma-especialidad');
    if (fn) fn.textContent = n ? `Dr. ${n}` : '';
    if (fc) fc.textContent = c ? `Cédula Profesional: ${c}` : '';
    if (fe) fe.textContent = e || '';
  },
  restore() {
    restoreFields(['s19-nombre','s19-cedula','s19-especialidad','s19-clinica','s19-telefono','s19-email','s19-direccion','s19-ciudad']);
    if (appState.signatureImage) {
      document.getElementById('s19-sig-img').src = appState.signatureImage;
      document.getElementById('s19-sig-img-preview').style.display = 'block';
    }
    this.signaturePad = null;
    this.initSignaturePad();
    this.renderSavedDoctors();
    this.updateSignatureFooter();
    ['s19-nombre','s19-cedula','s19-especialidad'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.updateSignatureFooter());
    });
  }
};
