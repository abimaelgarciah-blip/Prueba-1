window.sheet12 = {
  id: 'portada-esfuerzo',
  label: 'Portada Prueba Esfuerzo y ECG',
  type: 'cover',
  section: 'cardio',
  render() { return renderCoverPage('cover-12','Portada Prueba de Esfuerzo y ECG') + renderSectionOmit(this.section, 'Cardio'); },
  restore() {}
};
