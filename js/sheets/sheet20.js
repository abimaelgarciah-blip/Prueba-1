window.sheet20 = {
  id: 'portada-laboratorio',
  label: 'Portada Laboratorio',
  type: 'cover',
  section: 'laboratorio',
  render() { return renderSectionOmit(this.section, 'Laboratorio') + renderCoverPage('cover-20','Portada Laboratorio'); },
  restore() {}
};
