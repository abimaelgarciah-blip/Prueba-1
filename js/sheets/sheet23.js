window.sheet23 = {
  id: 'portada-audiometria',
  label: 'Portada Audiometría',
  type: 'cover',
  section: 'audiometria',
  render() { return renderCoverPage('cover-23','Portada Audiometría') + renderSectionOmit(this.section, 'Audiometría'); },
  restore() {}
};
