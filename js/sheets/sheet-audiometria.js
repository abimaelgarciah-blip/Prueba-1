/* ===== SECCIÓN: AUDIOMETRÍA (portada + contenido) ===== */
window.sheetAudiometriaPortada = {
  id: 'portada-audiometria',
  label: 'Portada Audiometría',
  type: 'cover',
  render() { return renderCoverPage('cover-audiometria', 'Portada Audiometría'); },
  restore() {}
};

window.sheetAudiometriaContenido = {
  id: 'contenido-audiometria',
  label: 'Contenido Audiometría',
  type: 'content',
  membreteKey: 'mb-audiometria',

  render() {
    const inner = `
      ${h1('AUDIOMETRÍA')}
      ${p(`<strong class="ctt-sub-line">Fecha de estudio:</strong> ${input('aud-fecha','dd/mm/aaaa','sm')}`)}
      ${p('Resultados:')}
      ${renderDynamicBlock('aud-resultados','+ Agregar resultado')}
      ${p(`<strong class="ctt-sub-line">Observaciones:</strong> ${textarea('aud-obs','...')}`)}
      ${renderAttachment('aud-img','Adjuntar imagen del estudio')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['aud-fecha','aud-obs'];
    restoreFields(ids);
    restoreAutoGrow(ids);
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
  }
};
