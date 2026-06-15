window.sheet20 = {
  id: 'portada-laboratorio',
  label: 'Portada Laboratorio',
  type: 'cover',
  section: 'laboratorio',
  render() { return renderCoverPage('cover-20','Portada Laboratorio') + renderSectionOmit(this.section, 'Laboratorio'); },
  restore() {}
};
