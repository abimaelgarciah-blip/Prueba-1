window.sheet17 = {
  id: 'sheet17',
  label: 'Hoja 17: Portada de Sugerencias',
  render() {
    return `
    <div class="sheet" id="sheet-17">
      <div class="sheet-header">
        <h1>Sugerencias</h1>
        <span class="sheet-number">Hoja 17</span>
      </div>
      <div class="sheet-body">
        <div class="cover-sheet">
          <div class="cover-image-area" onclick="document.getElementById('s17-cover-input').click()">
            <img id="s17-cover-preview" src="" alt="" style="display:none;width:100%;height:100%;object-fit:contain;" />
            <div id="s17-cover-placeholder" class="cover-image-placeholder">
              <svg width="48" height="48" fill="none" stroke="#b0bec5" stroke-width="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p style="margin-top:8px;">Imagen de portada<br>de sugerencias</p>
            </div>
          </div>
          <input type="file" id="s17-cover-input" accept="image/*" style="display:none" onchange="sheet17.onImageChange(event)" />
          <h2 style="color:#1e4d8c;font-size:1.8rem;font-weight:700;margin-top:16px;">Sugerencias Médicas</h2>
          <p style="color:#666;max-width:400px;">Recomendaciones del médico al paciente</p>
        </div>
      </div>
    </div>`;
  },
  onImageChange(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById('s17-cover-preview');
      img.src = ev.target.result; img.style.display = 'block';
      document.getElementById('s17-cover-placeholder').style.display = 'none';
      appState.s17CoverImage = ev.target.result; saveToStorage();
    };
    reader.readAsDataURL(file);
  },
  restore() {
    if (appState.s17CoverImage) {
      const img = document.getElementById('s17-cover-preview');
      if (img) { img.src = appState.s17CoverImage; img.style.display = 'block'; }
      const ph = document.getElementById('s17-cover-placeholder');
      if (ph) ph.style.display = 'none';
    }
  }
};
