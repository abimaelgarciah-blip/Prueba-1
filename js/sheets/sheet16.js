window.sheet16 = {
  id: 'portada-gabinete',
  label: 'Portada Estudios de Gabinete',
  type: 'cover',
  section: 'gabinete',
  render() { return renderCoverPage('cover-16','Portada Estudios de Gabinete') + renderSectionOmit(this.section, 'Estudios de Gabinete'); },
  restore() {}
};
