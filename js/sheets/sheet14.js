window.sheet14 = {
  id: 'portada-espirometria',
  label: 'Portada Espirometría',
  type: 'cover',
  section: 'espirometria',
  render() { return renderCoverPage('cover-14','Portada Espirometría') + renderSectionOmit(this.section, 'Espirometría'); },
  restore() {}
};
