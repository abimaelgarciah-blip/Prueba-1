window.sheet14 = {
  id: 'portada-espirometria',
  label: 'Portada Espirometría',
  type: 'cover',
  section: 'espirometria',
  render() { return renderSectionOmit(this.section, 'Espirometría') + renderCoverPage('cover-14','Portada Espirometría'); },
  restore() {}
};
