window.sheet23 = {
  id: 'portada-audiometria',
  label: 'Portada Audiometría',
  type: 'cover',
  section: 'audiometria',
  render() { return renderSectionOmit(this.section, 'Audiometría') + renderCoverPage('cover-23','Portada Audiometría'); },
  restore() {}
};
