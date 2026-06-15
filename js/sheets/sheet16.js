window.sheet16 = {
  id: 'portada-gabinete',
  label: 'Portada Estudios de Gabinete',
  type: 'cover',
  section: 'gabinete',
  render() { return renderSectionOmit(this.section, 'Estudios de Gabinete') + renderCoverPage('cover-16','Portada Estudios de Gabinete'); },
  restore() {}
};
