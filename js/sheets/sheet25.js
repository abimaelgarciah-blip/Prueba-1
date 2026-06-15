window.sheet25 = {
  id: 'portada-dental',
  label: 'Portada Evaluación Dental',
  type: 'cover',
  section: 'dental',
  render() { return renderCoverPage('cover-25','Portada Evaluación Dental') + renderSectionOmit(this.section, 'Evaluación Dental'); },
  restore() {}
};
