window.sheet9 = {
  id: 'contenido-conclusiones',
  label: 'Contenido Conclusiones',
  type: 'content',
  membreteKey: 'mb-9',

  systems: [
    { id:'resp',  label:'Sistema Respiratorio' },
    { id:'card',  label:'Sistema Cardiovascular' },
    { id:'gi',    label:'Sistema Gastrointestinal' },
    { id:'gu',    label:'Sistema Genito-Urinario' },
    { id:'nerv',  label:'Sistema Neurológico y Órganos de los Sentidos' },
    { id:'muscu', label:'Sistema Musculoesquelético' },
    { id:'hema',  label:'Sistema Hematopoyético y células en sangre' },
    { id:'endo',  label:'Sistema Endocrino metabólico' }
  ],

  render() {
    const inner = `
      ${h1('CONCLUSIONES')}
      ${p('Paciente que presenta las siguientes alteraciones:')}
      ${this.systems.map(s => p(`<strong class="ctt-sub-line">${s.label}:</strong> ${textarea('c9-'+s.id, '...')}`)).join('')}
      <div id="block-dental">
        ${renderOmitToggle('dental','Omitir odontológico')}
        ${p(`<strong class="ctt-sub-line">Odontológico:</strong> ${textarea('c9-dental','...')}`)}
      </div>
      ${renderDynamicBlock('c9-extra','+ Agregar otra conclusión')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = this.systems.map(s => 'c9-'+s.id);
    ids.push('c9-dental');
    restoreFields(ids);
    restoreAutoGrow(ids);

    const chk = document.getElementById('omit-chk-dental');
    if (chk && appState['omit-dental'] === 'true') {
      chk.checked = true;
      document.getElementById('block-dental')?.classList.add('ctt-omitted');
    }
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
  }
};
