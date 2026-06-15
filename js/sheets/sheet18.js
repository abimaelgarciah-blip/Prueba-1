window.sheet18 = {
  id: 'portada-oftalmologia',
  label: 'Portada Oftalmología',
  type: 'cover',
  section: 'oftalmologia',
  render() { return renderSectionOmit(this.section, 'Oftalmología') + renderCoverPage('cover-18','Portada Oftalmología'); },
  restore() {}
};
