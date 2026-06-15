window.sheet18 = {
  id: 'portada-oftalmologia',
  label: 'Portada Oftalmología',
  type: 'cover',
  section: 'oftalmologia',
  render() { return renderCoverPage('cover-18','Portada Oftalmología') + renderSectionOmit(this.section, 'Oftalmología'); },
  restore() {}
};
