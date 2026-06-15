window.sheet25 = {
  id: 'portada-dental',
  label: 'Portada Evaluación Dental',
  type: 'cover',
  section: 'dental',
  render() { return renderSectionOmit(this.section, 'Evaluación Dental') + renderCoverPage('cover-25','Portada Evaluación Dental'); },
  restore() {}
};
