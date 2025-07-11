// visual_findings.js
// Definitions
const ptrList = ['PTR-1','PTR-2','PTR-3','PTR-4','PTR-5','PTR-6','PTR-7'];
const otherList = ['SSTR','33KV CT','33KV PT','33KV VCB','LA','Other'];

// Data for PTR forms
const oilLeakCols = [
  ['R Phase HV Bushing','Y Phase HV Bushing','B Phase HV Bushing','R Phase HV Bushing Turret','Y Phase HV Bushing Turret','B Phase HV Bushing Turret','R Phase LV Bushing','Y Phase LV Bushing','B Phase LV Bushing','Neutral Bushing','R Phase LV Bushing Turret','Y Phase LV Bushing Turret','B Phase LV Bushing Turret','Neutral Bushing Turret'],
  ['Top Filtration Valve','Bottom Drain Valve','Top Sampling Valve','Conservator Tank Drain Valve','Tap Changer','MOG','POG','Buchholz Relay','OSR','Valve between Buchholz Relay & Conservator Tank','Top Tank near HV R Ph','Top Tank near HV Y Ph','Top Tank near HV B Ph','Top Tank near LV R Ph','Top Tank near LV Y Ph','Top Tank near LV B Ph','Top Tank near Neutral'],
  ['Upper side radiator valve near HV R Phase','Upper side radiator valve near HV Y Phase','Upper side radiator valve near HV B Phase','Lower side radiator valve near HV R Phase','Lower side radiator valve near HV Y Phase','Lower side radiator valve near HV B Phase','Upper side radiator valve near LV R Phase','Upper side radiator valve near LV Y Phase','Upper side radiator valve near LV B Phase','Upper side radiator valve near Neutral','Lower side radiator valve near LV R Phase','Lower side radiator valve near LV Y Phase','Lower side radiator valve near LV B Phase','Lower side radiator valve near Neutral'],
  ['Upper side radiator Plug near HV R Phase','Upper side radiator Plug near HV Y Phase','Upper side radiator Plug near HV B Phase','Lower side radiator Plug near HV R Phase','Lower side radiator Plug near HV Y Phase','Lower side radiator Plug near HV B Phase','Upper side radiator Plug near LV R Phase','Upper side radiator Plug near LV Y Phase','Upper side radiator Plug near LV B Phase','Upper side radiator Plug near Neutral','Lower side radiator Plug near LV R Phase','Lower side radiator Plug near LV Y Phase','Lower side radiator Plug near LV B Phase','Lower side radiator Plug near Neutral']
];
const otherCols = [
  ['Air-Oil Mix','M.Tank Silica Gel','OLTC Silica Gel','M. Tank Oil Low','OLTC Oil Low','PTR Oil Check','Low Oil on M. Tank Breather Oil Pot','Low Oil on OLTC Breather Oil Pot','M. Tank Breather Oil Pot Empty','OLTC Breather Oil Pot Empty','Broken M. Tank Breather Oil Pot','Broken OLTC Breather Oil Pot','M. Tank Breather Oil Pot Missing','OLTC Breather Oil Pot Missing'],
  ['OTI >WTI','OTI=WTI','OTI Def.','WTI Def.','MOG Def.','MOG Conn. Open','POG not Visible','MK Box Glass Cover Missing','MK Box Glass Cover Broken'],
  ['MK Box Flat Earthing','OLTC Flat Earthing','Neutral Double Flat Earthing','PTR Body Rusted','PTR Radiator Rusted','PTR Con. Tank Rusted'],
  ['OLTC Count']
];

// Other Observations data
const otherObsMap = {
  '33KV CT': ['O/L from PTR-1 R Phase CT','O/L from PTR-1 Y Phase CT'],
  '33KV PT': ['O/L from R Phase PT-1','O/L from Y Phase PT-1'],
  'LA': ['PTR-1 R Phase LA Missing'],
  '33KV VCB': ['VCB to be replaced'],
  'Other': ['Rusted Iron Structure','Rusted Isolator Handle','Rusted CT JB','Rusted PT JB','Rusted CT Body','Rusted PT Body','Rusted Earth Riser','Aerial Rail Pole Earth Spike Req.']
};




// ─── SSTR Other Findings descriptions ──────────────────────────────────────────
const sstrOtherMap = {
  'Silica Gel':
    'Silica gel of the Conservator Tank breather must be replaced.',
  'Oil Level Low':
    'Low oil level has been found. Action must be taken to maintain desired oil level in the transformer.',
  'Oil Level Check':
    'Oil Level of the transformer could not be ascertained. Hence, the same is to be checked and if oil level is found low, then action must be taken to maintain desired oil level in the transformer.',
  'MOG def.':
    'MOG is found defective. Necessary action is to be taken.',
  'MOG Conn. Open':
    'MOG connections are found open. Necessary action is to be taken.',
  'Rusted Body':
    'Rust formation on the transformer body was observed. The same must be cleaned and painted with weather resisting non fading paint of Dark Admiralty Grey as per technical specification of WBSEDCL.',
  'Rusted Conv. Tank':
    'Rust formation on the conservator tank was observed. The same must be cleaned and painted with weather resisting non fading paint of Dark Admiralty Grey as per technical specification of WBSEDCL.',
  'Rusted Radiator':
    'Rust formation on the radiators were observed. The same must be cleaned and painted with weather resisting non fading paint of Dark Admiralty Grey as per technical specification of WBSEDCL.',
  'Dust & Spider web':
    'Dust and spider web deposited on the transformer must be cleaned.'
};






// Store entries
let liveData = JSON.parse(localStorage.getItem('visualFindings') || '[]');
let currentEquipment = '';

// Accumulate all SSTR Oil Leakage selections across clicks
let sstrOilLeaks = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('substationHeader').innerText = `Entering data for '${localStorage.getItem('selectedSubstation')||''}'`;

  const ptrToggle = document.getElementById('ptrToggle');
  const otherToggle = document.getElementById('otherToggle');
  ptrToggle.onclick = () => switchSection('ptr');
  otherToggle.onclick = () => switchSection('other');

  const ptrButtons = document.getElementById('ptrButtons');
  ptrList.forEach(name => {
    const btn = document.createElement('button'); btn.textContent = name;
    btn.onclick = () => selectPTR(name);
    ptrButtons.appendChild(btn);
  });

  const otherButtons = document.getElementById('otherButtons');
  otherList.forEach(name => {
    const btn = document.createElement('button'); btn.textContent = name;
    btn.onclick = () => selectOther(name);
    otherButtons.appendChild(btn);
  });

  switchSection('ptr');
  selectPTR(ptrList[0]);
  renderLive();

  // Export + Save + Back
  document.getElementById('exportExcel').onclick = exportExcel;
  document.getElementById('exportDoc').onclick = exportDoc;
  document.getElementById('exportPdf').onclick = exportPdf;

  document.getElementById('saveBtn').onclick = () => {
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
    alert('Visual findings saved');
  };

  document.getElementById('backBtn').onclick = () => {
    window.location.href = 'switchyard.html';
  };

});


// ── RESET BUTTON HANDLER ──
;(function(){
  const btn = document.getElementById('resetBtn');
  if (!btn) {
    console.warn('Reset button not found in DOM');
    return;
  }
  btn.addEventListener('click', () => {
    if (confirm("Are you sure you want to start a NEW inspection? All current data will be cleared.")) {
      localStorage.removeItem('visualFindings');
      location.reload();
    }
  });
})();



// Global persistent sets for 33KV CT
const ctOilLeakSet = new Set();
const ctMissingSet = new Set();
const ctOutSet = new Set();

// Global persistent sets for 33KV PT
const ptOilLeakSet = new Set();
const ptMissingSet = new Set();
const ptOutSet = new Set();

// Global persistent sets for Lightning Arrestor
const laMissingSet = new Set();
const laOutSet     = new Set();

// Global persistent set for Rusted Structures (Other → Rusted Structure)
const rustedSet = new Set();





function switchSection(sec) {
  document.getElementById('ptrSection').classList.toggle('active', sec==='ptr');
  document.getElementById('otherSection').classList.toggle('active', sec==='other');
  document.getElementById('ptrToggle').classList.toggle('active', sec==='ptr');
  document.getElementById('otherToggle').classList.toggle('active', sec==='other');
}

// PTR Handling
function selectPTR(name) {
  currentEquipment = name;
  // Highlight only the clicked PTR button
  document.querySelectorAll('#ptrButtons button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === name);
  });
  buildPTRForm(name);
}




function buildPTRForm(equip) {
  const c = document.getElementById('ptrFormContainer'); c.innerHTML='';
  const div = document.createElement('div'); div.className='form-container';
  // Oil Leakages
  // Oil Leakages Accordion
  const osec = document.createElement('div');
  osec.className = 'form-section';
  osec.innerHTML = `<h2>${equip} Observations</h2><h3>Oil Leakages</h3>`;
  // define groups
  const groups = {
    'Bushing O/L': [
      'R Phase HV Bushing','Y Phase HV Bushing','B Phase HV Bushing',
      'R Phase HV Bushing Turret','Y Phase HV Bushing Turret','B Phase HV Bushing Turret',
      'R Phase LV Bushing','Y Phase LV Bushing','B Phase LV Bushing','Neutral Bushing',
      'R Phase LV Bushing Turret','Y Phase LV Bushing Turret','B Phase LV Bushing Turret','Neutral Bushing Turret'
    ],
    'Top Tank O/L': [
      'Top Tank','Top Tank near HV R Ph','Top Tank near HV Y Ph','Top Tank near HV B Ph',
      'Top Tank near LV R Ph','Top Tank near LV Y Ph','Top Tank near LV B Ph',
      'Top Tank near Neutral','Top Tank above MK Box','Top Tank above OLTC'
    ],

'Radiator Valve O/L': 'custom_radiator_valve',


'Radiator Plug O/L': 'custom_radiator_plug',


    'Other O/L': [
      'Top Filtration Valve','Bottom Drain Valve','Top Sampling Valve','Conservator Tank Drain Valve',
      'Tap Changer','MOG','POG','Buchholz Relay','OSR','Valve between Buchholz Relay & Conservator Tank'
    ]
  };

  Object.entries(groups).forEach(([title, items]) => {
    // header button
    const btn = document.createElement('button');
    btn.className = 'accordion-btn';
    btn.textContent = title;
    osec.appendChild(btn);

    // grid
if (items === 'custom_radiator_valve') {
  const grid = document.createElement('div');
  grid.classList.add('grid');
  grid.style.display = 'none';

grid.innerHTML = `
  <table style="width:100%; grid-column: 1 / -1; border-collapse: collapse; font-size:12px; border: 1px solid #00f2ff;">

    <tr>
      <th colspan="2" style="border: 1px solid #00f2ff; background-color: #0f870f;">Upper Side Radiator Valve</th>
      <th colspan="2" style="border: 1px solid #00f2ff; background-color: #0f870f;">Lower Side Radiator Valve</th>
    </tr>
    <tr>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e; color: black;">HV Side</th>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e; color: black;">LV Side</th>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e; color: black;">HV Side</th>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e; color: black;">LV Side</th>
    </tr>
    <tr>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Upper side radiator valve near HV R Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Upper side radiator valve near LV R Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Lower side radiator valve near HV R Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Lower side radiator valve near LV R Phase')}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Upper side radiator valve near HV Y Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Upper side radiator valve near LV Y Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Lower side radiator valve near HV Y Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Lower side radiator valve near LV Y Phase')}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Upper side radiator valve near HV B Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Upper side radiator valve near LV B Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Lower side radiator valve near HV B Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Lower side radiator valve near LV B Phase')}</td>
    </tr>
<tr>
  <td rowspan="2" style="border: 1px solid #00f2ff; background-color: #cce5ff; text-align: center; vertical-align: middle; color: black;">  </td>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda; text-align: center; vertical-align: middle; color: black;">
    ${checkbox('Upper side radiator valve near Neutral')}
  </td>
  <td rowspan="2" style="border: 1px solid #00f2ff; background-color: #cce5ff; text-align: center; vertical-align: middle; color: black;">  </td>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda; text-align: center; vertical-align: middle; color: black;">
    ${checkbox('Lower side radiator valve near Neutral')}
  </td>
</tr>
<tr>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda;"></td>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda;"></td>
</tr>

  </table>
`;

  osec.appendChild(grid);
['click','touchstart'].forEach(evt => {
  btn.addEventListener(evt, e => {
    e.preventDefault();
    // hide all panels with !important
    osec
      .querySelectorAll('.grid')
      .forEach(g => g.style.setProperty('display','none','important'));
    // reset all buttons
    osec
      .querySelectorAll('.accordion-btn')
      .forEach(b => b.classList.remove('active'));

    // show just this one
    btn.classList.add('active');
    grid.style.setProperty(
      'display',
      grid.classList.contains('grid') ? 'grid' : 'block',
      'important'
    );
  });
});




} else if (items === 'custom_radiator_plug') {
  const grid = document.createElement('div');
  grid.classList.add('grid');
  grid.style.display = 'none';
  grid.innerHTML = `
  <table style="width:100%; grid-column: 1 / -1; border-collapse: collapse; font-size:12px; border: 1px solid #00f2ff;">

    <tr>
      <th colspan="2" style="border: 1px solid #00f2ff;">Upper Side Radiator Plug</th>
      <th colspan="2" style="border: 1px solid #00f2ff;">Lower Side Radiator Plug</th>
    </tr>
    <tr>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e;">HV Side</th>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e;">LV Side</th>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e;">HV Side</th>
      <th style="border: 1px solid #00f2ff; background-color: #e5411e;">LV Side</th>
    </tr>
    <tr>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Upper side radiator Plug near HV R Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Upper side radiator Plug near LV R Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Lower side radiator Plug near HV R Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Lower side radiator Plug near LV R Phase')}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Upper side radiator Plug near HV Y Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Upper side radiator Plug near LV Y Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Lower side radiator Plug near HV Y Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Lower side radiator Plug near LV Y Phase')}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Upper side radiator Plug near HV B Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Upper side radiator Plug near LV B Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #cce5ff; color: black;">${checkbox('Lower side radiator Plug near HV B Phase')}</td>
      <td style="border: 1px solid #00f2ff; text-align: center; vertical-align: middle; background-color: #d4edda; color: black;">${checkbox('Lower side radiator Plug near LV B Phase')}</td>
    </tr>
<tr>
  <td rowspan="2" style="border: 1px solid #00f2ff; background-color: #cce5ff; text-align: center; vertical-align: middle; color: black;">  </td>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda; text-align: center; vertical-align: middle; color: black;">
    ${checkbox('Upper side radiator valve near Neutral')}
  </td>
  <td rowspan="2" style="border: 1px solid #00f2ff; background-color: #cce5ff; text-align: center; vertical-align: middle; color: black;">  </td>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda; text-align: center; vertical-align: middle; color: black;">
    ${checkbox('Lower side radiator valve near Neutral')}
  </td>
</tr>
<tr>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda;"></td>
  <td style="border: 1px solid #00f2ff; background-color: #d4edda;"></td>
</tr>
  </table>
`;

  osec.appendChild(grid);
['click','touchstart'].forEach(evt => {
  btn.addEventListener(evt, e => {
    e.preventDefault();
    // hide all panels with !important
    osec
      .querySelectorAll('.grid')
      .forEach(g => g.style.setProperty('display','none','important'));
    // reset all buttons
    osec
      .querySelectorAll('.accordion-btn')
      .forEach(b => b.classList.remove('active'));

    // show just this one
    btn.classList.add('active');
    grid.style.setProperty(
      'display',
      grid.classList.contains('grid') ? 'grid' : 'block',
      'important'
    );
  });
});







} else {
  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.classList.add('grid');
  grid.style.display = 'none';
  items.forEach(val=>{
    const lbl = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = val;
    cb.checked = liveData.some(r => r.equipment === equip && r.tags?.includes(cb.value));
    cb.onchange = () => savePTR(equip);
    lbl.appendChild(cb);
    lbl.append(val);
    grid.appendChild(lbl);
  });
  osec.appendChild(grid);

['click','touchstart'].forEach(evt => {
  btn.addEventListener(evt, e => {
    e.preventDefault();
    // hide all panels with !important
    osec
      .querySelectorAll('.grid')
      .forEach(g => g.style.setProperty('display','none','important'));
    // reset all buttons
    osec
      .querySelectorAll('.accordion-btn')
      .forEach(b => b.classList.remove('active'));

    // show just this one
    btn.classList.add('active');
    grid.style.setProperty(
      'display',
      grid.classList.contains('grid') ? 'grid' : 'block',
      'important'
    );
  });
});



}

  });

  // activate first group by default
  const firstBtn = osec.querySelector('.accordion-btn');
  const firstGrid = osec.querySelector('.grid');
  firstBtn.classList.add('active');
  firstGrid.style.display = 'grid';

// Add manual Oil Leakage entry
const customOilDiv = document.createElement('div');
customOilDiv.className = 'custom-input';
customOilDiv.innerHTML = `
  <input id="customOilInput" placeholder="Other leakage..." type="text"/>
  <button onclick="addCustomOil()">Add</button>`;
osec.appendChild(customOilDiv);
  


div.appendChild(osec);

  // Other Findings
  const fsec=document.createElement('div'); fsec.className='form-section';
  fsec.innerHTML=`<h3>Other Findings</h3>`;
  otherCols.forEach((col,i)=>{
    const colDiv=document.createElement('div'); colDiv.className='grid';
    col.forEach(val=>{
if(val === 'OLTC Count') {
  const lbl = document.createElement('label');
  lbl.textContent = val;
  const inp = document.createElement('input');
  inp.type = 'number';
  const existing = liveData.find(r => r.equipment === equip && r.action.includes('OLTC counter'));
  if (existing) {
    const match = existing.action.match(/\d+/);
    if (match) inp.value = match[0];
  }
  inp.oninput = () => savePTR(equip);
  lbl.appendChild(inp);
  colDiv.appendChild(lbl);
}

      else {
        const lbl=document.createElement('label'); const cb=document.createElement('input'); cb.type='checkbox'; cb.value=val;
        cb.checked = liveData.some(r => 
  r.equipment === equip && 
  (r.tags?.includes(cb.value) || r.action === otherDesc(cb.value))
);

      cb.onchange = () => savePTR(equip);
        lbl.appendChild(cb); lbl.append(val); colDiv.appendChild(lbl);
      }
    }); fsec.appendChild(colDiv);
  });
  div.appendChild(fsec);

  // — Add manual “Other finding…” entry field —
  const customOtherDiv = document.createElement('div');
  customOtherDiv.className = 'other-entry';
  customOtherDiv.innerHTML = `
    <input id="customOtherInput" placeholder="Other finding..." type="text"/>
    <button onclick="addCustomOther()">Add</button>
  `;
  div.appendChild(customOtherDiv);


  c.appendChild(div);
  savePTR(equip);
}


function checkbox(val) {
  const checked = liveData.some(r => r.equipment === currentEquipment && r.tags?.includes(val)) ? 'checked' : '';
  return `<label><input type="checkbox" value="${val}" ${checked} onchange="savePTR(currentEquipment)"> ${val.replace(/^.*near /, '')}</label>`;
}







// ─── Other Observations Handler ──────────────────────────────────────────────
function selectOther(name) {
  currentEquipment = name;
  document.querySelectorAll('#otherButtons button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === name);
  });
  buildOtherForm(name);
}

function buildOtherForm(equip) {
  const c = document.getElementById('otherFormContainer');
  c.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'form-container';

  if (equip === 'SSTR') {
    // Oil Leakages
    const oilSec = document.createElement('div');
    oilSec.className = 'form-section';
    oilSec.innerHTML = '<h2>SSTR Observations</h2><h3>Oil Leakages</h3>';
    const dd = document.createElement('div');
    dd.style.display = 'flex'; dd.style.gap = '8px';
    const selHVLV = document.createElement('select');
    selHVLV.className = 'custom-select';
    selHVLV.add(new Option('-- Select HV/LV --', '', true, true));
    ['HV','LV'].forEach(o => selHVLV.add(new Option(o,o)));
    const selPhase = document.createElement('select');
    selPhase.className = 'custom-select';
    selPhase.add(new Option('-- Select Phase --', '', true, true));
    ['R-Phase','Y-Phase','B-Phase','Neutral'].forEach(o => selPhase.add(new Option(o,o)));
    const selLoc = document.createElement('select');
    selLoc.className = 'custom-select';
    selLoc.add(new Option('-- Select Location --', '', true, true));
    ['Bushing','Bushing Turret'].forEach(o => selLoc.add(new Option(o,o)));

    dd.appendChild(labelEl('HV/LV', selHVLV));
    dd.appendChild(labelEl('Phase', selPhase));
    dd.appendChild(labelEl('Location', selLoc));
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';

    // when clicked, gather dropdown + checkboxes + manual, push one row
   addBtn.onclick = () => {
  // 1) Only preserve dropdown combos
  const combo = `${selHVLV.value} ${selPhase.value} ${selLoc.value}`;
  if (!sstrOilLeaks.has(combo)) {
    sstrOilLeaks.add(combo);
  }

  // 2) Get ALL currently checked checkboxes and manually entered value
  const checkboxVals = Array.from(
    grid.querySelectorAll('input[type="checkbox"]:checked')
  ).map(cb => cb.value);

  const manualInput = oilSec.querySelector('input[type="text"]');
  const manualVal = manualInput.value.trim();
  if (manualVal) {
    checkboxVals.push(manualVal);
    manualInput.value = '';
  }

  // 3) Remove all previous checkbox/manual entries from sstrOilLeaks
  const checkboxOptions = Array.from(
    grid.querySelectorAll('input[type="checkbox"]')
  ).map(cb => cb.value);

  // Remove all existing checkbox-related entries
  checkboxOptions.forEach(val => sstrOilLeaks.delete(val));

  // Add back only currently checked/manual entries
  checkboxVals.forEach(val => sstrOilLeaks.add(val));

  // 4) Remove old Oil Leakage rows
  liveData = liveData.filter(r =>
    !(r.equipment === 'SSTR' && r.action.startsWith('Oil Leakage'))
  );

  // 5) Add new sentence if anything present
  if (sstrOilLeaks.size) {
    const arr = Array.from(sstrOilLeaks);
    const multi = arr.length > 1;
    const last = arr.pop();
    const prefix = arr.join(', ') + (multi ? ' & ' : '');
    const listText = prefix + last;
    const text = multi
      ? `Oil Leakages were found from ${listText}--- These oil leakages must be arrested.`
      : `Oil Leakage was found from ${listText} --- This oil leakage must be arrested.`;
    liveData.push({ equipment: 'SSTR', action: text, manual: false });
  }

  renderLive();
  localStorage.setItem('visualFindings', JSON.stringify(liveData));
};




    dd.appendChild(addBtn);
    oilSec.appendChild(dd);


    // ─── grouped checkboxes for Oil Leakages (selection only) ────────────────
    const items = [
      'All LV Bushings','Tap Changer','Top Cover near HV Side','Top Cover near LV Side',
      'Top Cover above MK Box','Top Cover above Tap Changer','Buchholz Relay','POG',
      'Drain Valve','Sampling Valve'
    ];
    const grid = document.createElement('div');
    grid.className = 'grid';
    items.forEach(val => {
      const lbl = document.createElement('label');
      const cb  = document.createElement('input');
      cb.type  = 'checkbox';
      cb.value = val;
      lbl.appendChild(cb);
      lbl.append(val);
      grid.appendChild(lbl);
    });
    oilSec.appendChild(grid);

    // ─── auto-update on any change ───────────────────────────────────────────────
    
    grid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.checked = sstrOilLeaks.has(cb.value);
  cb.onchange = () => {
    const val = cb.value;
    if (cb.checked) {
      sstrOilLeaks.add(val);
    } else {
      sstrOilLeaks.delete(val);
    }
    updateSSTRLiveTable();
  };
});


    // manual entry
   const customOil = document.createElement('div');
   customOil.innerHTML = `
   <input placeholder="Other leakage..." type="text"/>
   <button>Add</button>
   `;
   oilSec.appendChild(customOil);
   customOil.querySelector('button').onclick = () => {
  const input = customOil.querySelector('input');
  const val = input.value.trim();
  if (val) {
    sstrOilLeaks.add(val);
    input.value = '';
    updateSSTRLiveTable();
  }
};
    // ─── make the Oil Leakages section actually appear ────────────────────────
    div.appendChild(oilSec);



    // Other findings
    const otherSec = document.createElement('div');
    otherSec.className = 'form-section';
    otherSec.innerHTML = '<h3>Other findings</h3>';
    const ofItems = [
      'Silica Gel','Oil Level Low','Oil Level Check','MOG def.','MOG Conn. Open',
      'Rusted Body','Rusted Conv. Tank','Rusted Radiator','Dust & Spider web'
    ];
    const ofGrid = document.createElement('div'); ofGrid.className = 'grid';
    ofItems.forEach(val => {
      const lbl = document.createElement('label');
      const cb = document.createElement('input'); cb.type='checkbox'; cb.value=val;
    // add onchange to push liveData row
cb.onchange = () => {
  if (cb.checked) {
    liveData.push({ equipment: 'SSTR', action: sstrOtherMap[val], manual: false });
  } else {
    liveData = liveData.filter(r =>
      !(r.equipment === 'SSTR' && r.action === sstrOtherMap[val])
    );
  }
  renderLive();
  localStorage.setItem('visualFindings', JSON.stringify(liveData));
};

  lbl.appendChild(cb);
  lbl.append(val);
  ofGrid.appendChild(lbl);
});
    otherSec.appendChild(ofGrid);
    const customOther = document.createElement('div');
    customOther.innerHTML =
      '<input placeholder="Other finding..." type="text"/><button>Add</button>';
    otherSec.appendChild(customOther);
const otherInput = customOther.querySelector('input');
const otherAddBtn = customOther.querySelector('button');

otherAddBtn.onclick = () => {
  const val = otherInput.value.trim();
  if (!val) return;

  // Push to liveData with manual: true
  liveData.push({ equipment: 'SSTR', action: val, manual: true });

  renderLive();
  localStorage.setItem('visualFindings', JSON.stringify(liveData));  // Refresh table
  otherInput.value = ''; // Clear field
};

    div.appendChild(otherSec);
  }

else if (equip === '33KV CT') {
  const sectionData = {
    'Oil Leakages': {
      entries: ctOilLeakSet,
      textSingle: v => `Oil Leakage has been observed from ${v} --- This oil leakage must be arrested.`,
      textMulti: vs => `Oil Leakages have been observed from ${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} --- These oil leakages must be arrested.`,
      order: 1
    },
    'CT Missing': {
      entries: ctMissingSet,
      textSingle: v => `${v} was found to be missing. Necessary action is to be taken.`,
      textMulti: vs => `${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} were found to be missing. Necessary action is to be taken.`,
      order: 2
    },
    'CT Out of Ckt.': {
      entries: ctOutSet,
      textSingle: v => `${v} was found to be out of circuit. Necessary action is to be taken.`,
      textMulti: vs => `${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} were found to be out of circuit. Necessary action is to be taken.`,
      order: 3
    }
  };

  const c = document.getElementById('otherFormContainer');
  c.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'form-container';

  Object.entries(sectionData).forEach(([title, config]) => {
    const sec = document.createElement('div');
    sec.className = 'form-section';
    sec.innerHTML = `<h3>${title}</h3>`;
    const dd2 = document.createElement('div');
    dd2.style.display = 'flex';
    dd2.style.gap = '8px';

    const selLoc = document.createElement('select');
    selLoc.className = 'custom-select';
    selLoc.add(new Option('-- Select Location --', '', true, true));
    ['PTR-1','PTR-2','PTR-3','PTR-4','PTR-5','PTR-6','PTR-7','Other']
      .forEach(o => selLoc.add(new Option(o, o)));

    const selPhase = document.createElement('select');
    selPhase.className = 'custom-select';
    selPhase.add(new Option('-- Select Phase --', '', true, true));
    ['R-Phase','Y-Phase','B-Phase'].forEach(o => selPhase.add(new Option(o, o)));

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';

    addBtn.onclick = () => {
      const loc = selLoc.value, phase = selPhase.value;
      if (!loc || !phase) return;
      const entry = `${loc} ${phase} CT`;
      config.entries.add(entry);

      // Replace only same-tag row for 33KV CT
      liveData = liveData.filter(r => !(r.equipment === '33KV CT' && r.tag === title));

      const arr = Array.from(config.entries);
      const text = arr.length > 1 ? config.textMulti(arr) : config.textSingle(arr[0]);
      liveData.push({ equipment: '33KV CT', action: text, manual: false, tag: title, order: config.order });

      // Sort 33KV CT rows by order: Oil Leakages > CT Missing > CT Out
      const ctEntries = liveData.filter(r => r.equipment === '33KV CT');
      const rest = liveData.filter(r => r.equipment !== '33KV CT');
      ctEntries.sort((a, b) => a.order - b.order);
      liveData = [...rest, ...ctEntries];

      renderLive();
      localStorage.setItem('visualFindings', JSON.stringify(liveData));
    };

    dd2.appendChild(labelEl('Location', selLoc));
    dd2.appendChild(labelEl('Phase', selPhase));
    dd2.appendChild(addBtn);
    sec.appendChild(dd2);
    div.appendChild(sec);
  });

  c.appendChild(div);
}


    else if (equip === '33KV PT') {
      // ─── Configure the three PT sections ───────────────────────────────
      const sectionData = {
        'Oil Leakages': {
          entries: ptOilLeakSet,
          textSingle: v => `Oil Leakage has been observed from ${v} --- This oil leakage must be arrested.`,
          textMulti:  vs => `Oil Leakages have been observed from ${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} --- These oil leakages must be arrested.`,
          order: 1
        },
        'PT Missing': {
          entries: ptMissingSet,
          textSingle: v => `${v} was found to be missing. Necessary action is to be taken.`,
          textMulti:  vs => `${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} were found to be missing. Necessary action is to be taken.`,
          order: 2
        },
        'PT Out of Ckt.': {
          entries: ptOutSet,
          textSingle: v => `${v} was found to be out of circuit. Necessary action is to be taken.`,
          textMulti:  vs => `${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} were found to be out of circuit. Necessary action is to be taken.`,
          order: 3
        }
      };

      // Clear & rebuild the form
      const c = document.getElementById('otherFormContainer');
      c.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'form-container';

      // 1. Build each dropdown-Add section
      Object.entries(sectionData).forEach(([title, cfg]) => {
        const sec = document.createElement('div');
        sec.className = 'form-section';
        sec.innerHTML = `<h3>${title}</h3>`;
        const dd = document.createElement('div');
        dd.style.display = 'flex';
        dd.style.gap     = '8px';

        // Location dropdown
        const selLoc = document.createElement('select');
        selLoc.className = 'custom-select';
        selLoc.add(new Option('-- Select Location --','',true,true));
        ['PT-1','PT-2','PT-3','Bus PT-1','Bus PT-2','Bus PT-3','Other']
          .forEach(o => selLoc.add(new Option(o,o)));
        selLoc.onchange = e => { if (e.target.value==='Other') dd.appendChild(createManualEntry()); };

        // Phase dropdown
        const selPhase = document.createElement('select');
        selPhase.className = 'custom-select';
        selPhase.add(new Option('-- Select Phase --','',true,true));
        ['R-Phase','Y-Phase','B-Phase']
          .forEach(o => selPhase.add(new Option(o,o)));

        // Add button behavior
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.onclick = () => {
          const loc   = selLoc.value,
                phase = selPhase.value;
          if (!loc || !phase) return;
          const entry = `${loc} ${phase}`;
          cfg.entries.add(entry);

          // Remove old rows for this title
          liveData = liveData.filter(r =>
            !(r.equipment==='33KV PT' && r.tag===title)
          );

          // Push new combined sentence
          const arr  = Array.from(cfg.entries);
          const text = arr.length>1
            ? cfg.textMulti(arr)
            : cfg.textSingle(arr[0]);
          liveData.push({
            equipment: '33KV PT',
            action:     text,
            manual:    false,
            tag:        title,
            order:      cfg.order
          });

          // Re-sort only the 33KV PT group by order
          const ptGroup = liveData.filter(r => r.equipment==='33KV PT');
          const rest    = liveData.filter(r => r.equipment!=='33KV PT');
          ptGroup.sort((a,b)=> a.order - b.order);
          liveData = [...rest, ...ptGroup];

          renderLive();
          localStorage.setItem('visualFindings', JSON.stringify(liveData));
        };

        dd.appendChild(labelEl('Location', selLoc));
        dd.appendChild(labelEl('Phase',    selPhase));
        dd.appendChild(addBtn);
        sec.appendChild(dd);
        wrapper.appendChild(sec);
      });

      // 2. “All cleaned” checkbox (4th row)
      const secAll = document.createElement('div');
      secAll.className = 'form-section';
      secAll.innerHTML = '<h3>Other</h3>';
      const gridAll = document.createElement('div');
      gridAll.className = 'grid';
      const lblAll  = document.createElement('label');
      const cbAll   = document.createElement('input');
      cbAll.type    = 'checkbox';
      cbAll.onchange = e => {
        // remove any previous “AllClean” row
        liveData = liveData.filter(r =>
          !(r.equipment==='33KV PT' && r.tag==='AllClean')
        );
        if (cbAll.checked) {
          liveData.push({
            equipment:'33KV PT',
            action:   'All 33KV PTs are to be cleaned',
            manual:   false,
            tag:      'AllClean',
            order:    4
          });
          // re-sort PT group
          const ptG = liveData.filter(r=>r.equipment==='33KV PT');
          const rt  = liveData.filter(r=>r.equipment!=='33KV PT');
          ptG.sort((a,b)=>a.order-b.order);
          liveData = [...rt, ...ptG];
        }
        renderLive();
        localStorage.setItem('visualFindings', JSON.stringify(liveData));
      };
      lblAll.appendChild(cbAll);
      lblAll.append('All 33KV PTs are to be cleaned');
      gridAll.appendChild(lblAll);
      secAll.appendChild(gridAll);

      // 3️. Manual “Other detail…” entry (always appear last)
      const manualDiv = createManualEntry('Other detail…');
      manualDiv.querySelector('button').onclick = () => {
        const val = manualDiv.querySelector('input').value.trim();
        if (!val) return;
        liveData.push({
          equipment:'33KV PT',
          action:    val,
          manual:    true
        });
        renderLive();
        localStorage.setItem('visualFindings', JSON.stringify(liveData));
        manualDiv.querySelector('input').value = '';
      };
      secAll.appendChild(manualDiv);

      wrapper.appendChild(secAll);
      c.appendChild(wrapper);
    }

    

  // ─── 33KV VCB tab ───────────────────────────────────────────────────
else if (equip === '33KV VCB') {
  const container = document.getElementById('otherFormContainer');
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'form-container';

  // ─── “All VCB IR” checkbox ───────────────────────────────────────────────
  const secIR = document.createElement('div');
  secIR.className = 'form-section';

  const lblIR = document.createElement('label');
  const cbIR  = document.createElement('input');
  // Restore checked-state if an “AllIR” row already exists
  cbIR.checked = liveData.some(r =>
    r.equipment === '33KV VCB' && r.tag === 'AllIR'
  );
  cbIR.type = 'checkbox';
  cbIR.onchange = () => {
    // remove any existing AllIR row
    liveData = liveData.filter(r =>
      !(r.equipment === '33KV VCB' && r.tag === 'AllIR')
    );
    if (cbIR.checked) {
      liveData.push({
        equipment: '33KV VCB',
        action:    'IR to be measured between upper pad and lower pad of the all VCBs for checking of VI insulation and lower pad to earth for tie rod insulation. Meggering should be executed through 5 KV megger.',
        manual:    false,
        tag:       'AllIR',
        order:     1
      });
      // re-sort only the VCB group
      const vcb  = liveData.filter(r => r.equipment === '33KV VCB');
      const rest = liveData.filter(r => r.equipment !== '33KV VCB');
      vcb.sort((a, b) => a.order - b.order);
      liveData = [...rest, ...vcb];
    }
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
  };

  lblIR.appendChild(cbIR);
  lblIR.append(' All VCB IR');
  secIR.appendChild(lblIR);
  wrapper.appendChild(secIR);

  // ─── “All VCB Cleaning” checkbox ────────────────────────────────────────
  const secClean = document.createElement('div');
  secClean.className = 'form-section';

  const lblClean = document.createElement('label');
  const cbClean  = document.createElement('input');
  // Restore checked-state if an “AllClean” row already exists
  cbClean.checked = liveData.some(r =>
    r.equipment === '33KV VCB' && r.tag === 'AllClean'
  );
  cbClean.type = 'checkbox';
  cbClean.onchange = () => {
    liveData = liveData.filter(r =>
      !(r.equipment === '33KV VCB' && r.tag === 'AllClean')
    );
    if (cbClean.checked) {
      liveData.push({
        equipment: '33KV VCB',
        action:    'All 33KV VCBs are to be cleaned.',
        manual:    false,
        tag:       'AllClean',
        order:     2
      });
      const vcb  = liveData.filter(r => r.equipment === '33KV VCB');
      const rest = liveData.filter(r => r.equipment !== '33KV VCB');
      vcb.sort((a, b) => a.order - b.order);
      liveData = [...rest, ...vcb];
    }
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
  };

  lblClean.appendChild(cbClean);
  lblClean.append(' All VCB Cleaning');
  secClean.appendChild(lblClean);
  wrapper.appendChild(secClean);

  // ─── Manual “Other detail…” entry ───────────────────────────────────────
  const manualDiv = createManualEntry('Other detail…');
  manualDiv.querySelector('button').onclick = () => {
    const txt = manualDiv.querySelector('input').value.trim();
    if (!txt) return;
    liveData.push({
      equipment: '33KV VCB',
      action:    txt,
      manual:    true
    });
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
    manualDiv.querySelector('input').value = '';
  };
  wrapper.appendChild(manualDiv);

  container.appendChild(wrapper);
}



else if (equip === 'LA') {
  // configure missing / out-of-circuit sections
  const sectionData = {
    'LA Missing': {
      entries:  laMissingSet,
      textSingle: v => `${v} was found to be missing. Necessary action is to be taken.`,
      textMulti:  vs => `${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} were found to be missing. Necessary action is to be taken.`,
      order: 1
    },
    'LA Out of Ckt.': {
      entries:  laOutSet,
      textSingle: v => `${v} was found to be out of circuit. Necessary action is to be taken.`,
      textMulti:  vs => `${vs.join(', ').replace(/, ([^,]*)$/, ' & $1')} were found to be out of circuit. Necessary action is to be taken.`,
      order: 2
    }
  };

  const c = document.getElementById('otherFormContainer');
  c.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'form-container';

  // build the two dropdown+Add sections
  Object.entries(sectionData).forEach(([title, cfg]) => {
    const sec = document.createElement('div');
    sec.className = 'form-section';
    sec.innerHTML = `<h3>${title}</h3>`;
    const dd = document.createElement('div');
    dd.style.display = 'flex'; dd.style.gap = '8px';

    // Location dropdown
    const selLoc = document.createElement('select');
    selLoc.className = 'custom-select';
    selLoc.add(new Option('-- Select Location --','',true,true));
    ['PTR-1','PTR-2','PTR-3','PTR-4','PTR-5','PTR-6','PTR-7','Other']
      .forEach(o => selLoc.add(new Option(o,o)));

    // Phase dropdown
    const selPhase = document.createElement('select');
    selPhase.className = 'custom-select';
    selPhase.add(new Option('-- Select Phase --','',true,true));
    ['R-Phase','Y-Phase','B-Phase'].forEach(o => selPhase.add(new Option(o,o)));

    // HV/LV dropdown
    const selHVLV = document.createElement('select');
    selHVLV.className = 'custom-select';
    selHVLV.add(new Option('-- Select HV/LV --','',true,true));
    ['HV LA','LV LA'].forEach(o => selHVLV.add(new Option(o,o)));

    dd.appendChild(labelEl('Location', selLoc));
    dd.appendChild(labelEl('Phase',    selPhase));
    dd.appendChild(labelEl('HV/LV',     selHVLV));

    // Add button logic
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.onclick = () => {
      const loc  = selLoc.value, phase = selPhase.value, hvlv   = selHVLV.value;
      if (!loc || !phase || !hvlv) return;
      const entry = `${loc} ${phase} ${hvlv}`;
      cfg.entries.add(entry);
      // remove previous rows for this section
      liveData = liveData.filter(r => !(r.equipment==='LA' && r.tag===title));
      const arr  = Array.from(cfg.entries);
      const txt  = arr.length>1 ? cfg.textMulti(arr) : cfg.textSingle(arr[0]);
      liveData.push({
        equipment: 'LA',
        action:    txt,
        manual:    false,
        tag:       title,
        order:     cfg.order
      });
      // re-sort only the LA group
      const laGrp = liveData.filter(r => r.equipment==='LA');
      const rest  = liveData.filter(r => r.equipment!=='LA');
      laGrp.sort((a,b)=> a.order - b.order);
      liveData = [...rest, ...laGrp];
      renderLive();
      localStorage.setItem('visualFindings', JSON.stringify(liveData));
    };
    dd.appendChild(addBtn);
    sec.appendChild(dd);
    wrapper.appendChild(sec);
  });

  // build the Other checkboxes (cleaning + earthing)
  const secO = document.createElement('div');
  secO.className = 'form-section';
  secO.innerHTML = '<h3>Other</h3>';
  const items = [
    'All LAs are to be cleaned',
    'All 33KV Earthing check',
    'All 11KV Feeder Isolator Earthing Check',
    'PTR-1 LV LA Earthing Check','PTR-2 LV LA Earthing Check','PTR-3 LV LA Earthing Check',
    'PTR-4 LV LA Earthing Check','PTR-5 LV LA Earthing Check','PTR-6 LV LA Earthing Check',
    'PTR-7 LV LA Earthing Check'
  ];
  const gridO = document.createElement('div');
  gridO.className = 'grid';

  items.forEach((val, idx) => {
    const lbl = document.createElement('label');
    const cb  = document.createElement('input');
    cb.type  = 'checkbox';
    const tag = val;

    // restore previous state
    cb.checked = liveData.some(r => r.equipment==='LA' && r.tag===tag);

    cb.onchange = () => {
      // remove any existing row for this tag
      liveData = liveData.filter(r => !(r.equipment==='LA' && r.tag===tag));
      if (cb.checked) {
        let action = '';
        switch (val) {
          case 'All LAs are to be cleaned':
            action = 'All LAs are to be cleaned.';
            break;
          case 'All 33KV Earthing check':
            action = 'Earthing of all 33KV LAs are to be checked.';
            break;
          case 'All 11KV Feeder Isolator Earthing Check':
            action = 'Earthing of all 11KV Feeder Isolators\' LAs are to be checked.';
            break;
          default:
            // for PTR-x LV LA Earthing Check
            action = `Earthing of ${val.replace(' Earthing Check','')} is to be checked.`;
        }
        liveData.push({
          equipment: 'LA',
          action:    action,
          manual:    false,
          tag:       tag,
          order:     idx + 3  // picks up after the two dropdown sections
        });
        // re-sort LA group
        const laGrp = liveData.filter(r=>r.equipment==='LA');
        const rest  = liveData.filter(r=>r.equipment!=='LA');
        laGrp.sort((a,b)=> a.order - b.order);
        liveData = [...rest, ...laGrp];
      }
      renderLive();
      localStorage.setItem('visualFindings', JSON.stringify(liveData));
    };

    lbl.appendChild(cb);
    lbl.append(val);
    gridO.appendChild(lbl);
  });

  secO.appendChild(gridO);

  // manual Other-detail… entry
  const manualDiv = createManualEntry('Other detail…');
  manualDiv.querySelector('button').onclick = () => {
    const v = manualDiv.querySelector('input').value.trim();
    if (!v) return;
    liveData.push({ equipment:'LA', action:v, manual:true });
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
    manualDiv.querySelector('input').value = '';
  };
  secO.appendChild(manualDiv);

  wrapper.appendChild(secO);
  c.appendChild(wrapper);
}

  





else if (equip === 'Other') {
  const c = document.getElementById('otherFormContainer');
  c.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'form-container';

  // ─── Rusted Structure section ───────────────────────────────────────────
  const secRust = document.createElement('div');
  secRust.className = 'form-section';
  secRust.innerHTML = '<h3>Rusted Structure</h3>';
  const gridRust = document.createElement('div');
  gridRust.className = 'grid';
  ['Iron Structures','Isolator Handles','CT Body','PT Body','CT JB','PT JB','Earth Riser']
    .forEach(val => {
      const lbl = document.createElement('label');
      const cb  = document.createElement('input');
      cb.type  = 'checkbox';
      cb.value = val;
      cb.checked = rustedSet.has(val);
      cb.onchange = () => {
        if (cb.checked) rustedSet.add(val);
        else rustedSet.delete(val);
        // rebuild single “Rusted Structures” row
        liveData = liveData.filter(r =>
          !(r.equipment==='Rusted Structures' && r.tag==='Rusted Structure')
        );
        if (rustedSet.size) {
          const arr   = Array.from(rustedSet);
          const multi = arr.length > 1;
          const last  = arr.pop();
          const prefix= multi ? arr.join(', ') + ' & ' : '';
          const list  = prefix + last;
          const text  = multi
            ? `Rust formations on ${list} at switchyard were observed. The same must be cleaned and painted with red lead and Zinc.`
            : `Rust formation on ${list} at switchyard was observed. The same must be cleaned and painted with red lead and Zinc.`;
          liveData.push({
            equipment: 'Rusted Structures',
            action:     text,
            manual:     false,
            tag:        'Rusted Structure',
            order:      1
          });
        }
        renderLive();
        localStorage.setItem('visualFindings', JSON.stringify(liveData));
      };
      lbl.appendChild(cb);
      lbl.append(val);
      gridRust.appendChild(lbl);
    });
  secRust.appendChild(gridRust);

  // manual Rusted Structure entry
  const manualRust = createManualEntry('Other detail…');
  manualRust.querySelector('button').onclick = () => {
    const inp = manualRust.querySelector('input');
    const v   = inp.value.trim();
    if (!v) return;
    rustedSet.add(v);
    inp.value = '';
    // reuse same rebuild logic
    liveData = liveData.filter(r =>
      !(r.equipment==='Rusted Structures' && r.tag==='Rusted Structure')
    );
    const arr   = Array.from(rustedSet);
    const multi = arr.length > 1;
    const last  = arr.pop();
    const prefix= multi ? arr.join(', ') + ' & ' : '';
    const list  = prefix + last;
    const text  = multi
      ? `Rust formations on ${list} at switchyard were observed. The same must be cleaned and painted with red lead and Zinc.`
      : `Rust formation on ${list} at switchyard was observed. The same must be cleaned and painted with red lead and Zinc.`;
    liveData.push({
      equipment: 'Rusted Structures',
      action:     text,
      manual:     false,
      tag:        'Rusted Structure',
      order:      1
    });
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
  };
  secRust.appendChild(manualRust);
  wrapper.appendChild(secRust);

  // ─── Other section (Aerial Earth Spike + free-text “Other”) ──────────────
  const secOther = document.createElement('div');
  secOther.className = 'form-section';
  secOther.innerHTML = '<h3>Other</h3>';
  const gridOther = document.createElement('div');
  gridOther.className = 'grid';

  // 3) Aerial Earth Spike
  const lblAES = document.createElement('label');
  const cbAES  = document.createElement('input');
  cbAES.type   = 'checkbox';
  cbAES.checked = liveData.some(r => r.equipment==='Aerial Earth Spike');
  cbAES.onchange = () => {
    // remove old AES row
    liveData = liveData.filter(r => r.equipment!=='Aerial Earth Spike');
    if (cbAES.checked) {
      liveData.push({
        equipment: 'Aerial Earth Spike',
        action:    'Earth spikes should be installed at the aerial rail pole of the switchyard.',
        manual:    false,
        order:     2
      });
    }
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
  };
  lblAES.appendChild(cbAES);
  lblAES.append('Aerial Earth Spike');
  gridOther.appendChild(lblAES);
  secOther.appendChild(gridOther);

  // 4) Free-text “Other” entry
  const manualOther = createManualEntry('Other detail…');
  manualOther.querySelector('button').onclick = () => {
    const inp = manualOther.querySelector('input');
    const v   = inp.value.trim();
    if (!v) return;
     // Use the equip variable ('Other') so renderLive() will include it

    liveData.push({
    equipment: equip,
      action:    v,
      manual:    true,
      order:     3
    });
    renderLive();
    localStorage.setItem('visualFindings', JSON.stringify(liveData));
    inp.value = '';
  };
  secOther.appendChild(manualOther);

  wrapper.appendChild(secOther);
  c.appendChild(wrapper);
}



  c.appendChild(div);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function labelEl(text, el) {
  const wrap = document.createElement('div');
  const lbl  = document.createElement('label');
  lbl.textContent = text + ': ';
  wrap.appendChild(lbl); wrap.appendChild(el);
  return wrap;
}

function createManualEntry(placeholder = 'Other…') {
  const d = document.createElement('div');
  d.innerHTML = `<input placeholder="${placeholder}" type="text"/><button>Add</button>`;
  return d;
}





function savePTR(equip) {
  // clear existing for this equip
  // Remove only the auto-generated rows, but keep manual ones
liveData = liveData.filter(r => !(r.equipment === equip && !r.manual));
  // Oil
  // Oil (only from the first form-section)
  const oil = Array.from(
    document.querySelectorAll(
      '#ptrFormContainer .form-section:nth-of-type(1) input[type="checkbox"]:checked'
    )
  ).map(cb => cb.value);


if (oil.length) {
  // build a comma-separated list with " & " before the last item
  let listText;
  if (oil.length > 1) {
    const allButLast = oil.slice(0, -1).join(', ');
    const lastItem   = oil[oil.length - 1];
    listText = `${allButLast} & ${lastItem}`;
  } else {
    listText = oil[0];
  }

  const txt = oil.length > 1
    ? `Oil leakages were found from ${listText} --- These oil leakages must be arrested.`
    : `Oil leakage was found from ${listText} --- This oil leakage must be arrested.`;

  liveData.push({ equipment: equip, action: txt, tags: oil });
}

  // Other
  document.querySelectorAll('#ptrFormContainer .form-section:nth-child(2) input').forEach(inp=>{
    if(inp.type==='checkbox'&&inp.checked){
      liveData.push({equipment:equip,action:otherDesc(inp.value), tags: [inp.value]});
    } else if(inp.tagName==='INPUT'&&inp.type==='number'&&inp.value){
      liveData.push({equipment:equip,action:`OLTC counter was been found ${inp.value}. BDV of the oil of OLTC chamber to be checked. If BDV found low appropriate action to be taken.`});
    }
  });
  renderLive();
  localStorage.setItem('visualFindings', JSON.stringify(liveData));
}

function oilDesc(v){ return true; }
function otherDesc(val){
  const map = {
    'Air-Oil Mix':'It has been observed in POG that air is present in the conservator tank. The bellow of the PTR is not properly filled with air. Appropriate action to be taken to rectify the problem.',
    'M.Tank Silica Gel':'Silica gel of the PTR Conservator Tank breather must be replaced.',
    'OLTC Silica Gel':'Silica gel of the OLTC Conservator Tank breather must be replaced.',
    'M. Tank Oil Low':'Low oil level has been found. Action must be taken to maintain desired oil level in the transformer as per oil filling procedure of manufacturer.',
    'OLTC Oil Low':'Low oil level has been found on OLTC. Action must be taken to maintain desired oil level in the transformer as per oil filling procedure of manufacturer.',
    'PTR Oil Check':'Oil Level is to be checked. If found low, necessary action towards oil filling as per oil filling procedure of manufacturer is to be done.',
    'Low Oil on M. Tank Breather Oil Pot':'Low Oil level was found on the Oil pot of main tank breather. Appropriate action to be taken.',
    'Low Oil on OLTC Breather Oil Pot':'Low Oil level was found on the Oil pot of OLTC conservator tank breather. Appropriate action to be taken.',
    'M. Tank Breather Oil Pot Empty':'Oil pot of main tank breather was found empty. Appropriate action to be taken.',
    'OLTC Breather Oil Pot Empty':'Oil pot of OLTC conservator tank breather was found empty. Appropriate action to be taken.',
    'Broken M. Tank Breather Oil Pot':'Oil pot of the main tank breather was found broken. Appropriate action to be taken.',
    'Broken OLTC Breather Oil Pot':'Oil pot of the OLTC conservator tank breather was found broken. Appropriate action to be taken.',
    'M. Tank Breather Oil Pot Missing':'Oil pot of the Main Tank conservator tank breather was found missing. Appropriate action to be taken.',
    'OLTC Breather Oil Pot Missing':'Oil pot of the OLTC conservator tank breather was found missing. Appropriate action to be taken.',
    'OTI >WTI':'OTI temperature has found higher than WTI temperature. So, proper checking of thermal image sensor against their respective pocket is to be done. If found ok, then cleaning of OTI/WTI thermal image sensor is to be done and also, WTI & OTI pockets to be filled with transformer oil. Calibration test of OTI & WTI may also be done.',
    'OTI=WTI':'OTI temperature has been found same as WTI temperature. So, cleaning of OTI/WTI thermal image sensor is to be done and also, WTI & OTI pockets to be filled with transformer oil. Calibration test of OTI & WTI may also be done.',
    'OTI Def.':'OTI was found to be defective. Appropriate action to be taken.',
    'WTI Def.':'WTI was found to be defective. Appropriate action to be taken.',
    'M. Tank Breather S. Gel.':'Silica gel of the PTR Conservator Tank breather must be replaced.',
    'OLTC Breather S. Gel.':'Silica gel of the OLTC Conservator Tank breather must be replaced.',
    'MOG Def.':'MOG was found to be defective. Necessary action is to be taken.',
    'MOG Conn. Open':'MOG connections were found to be open. Necessary action is to be taken.',
    'POG not Visible':'POG was found to be hazy and not properly visible. The same is to be checked.',
    'MK Box Glass Cover Missing':'Glass Cover of the Marshalling Kiosk was found missing. Appropriate action must be taken.',
    'MK Box Glass Cover Broken':'MK Box Glass Cover was found broken. Appropriate action to be taken to rectify the problem.',
    'MK Box Flat Earthing':'MK box is to be earthed though flat and is to be connected with PTR Body earthing.',
    'OLTC Flat Earthing':'OLTC Chamber is to be earthed though flat and is to be connected with PTR Body earthing.',
    'Neutral Double Flat Earthing':'PTR Neutral is to be earth though Double Flat and is to be connected with the PTR body earthing.',
    'PTR Body Rusted':'Rust formation on PTR body was observed. The same must be cleaned and painted with weather resisting non fading paint of Dark Admiralty Grey as per technical specification of WBSEDCL.',
    'PTR Radiator Rusted':'Rust formation on PTR Radiator was observed. The same must be cleaned and painted with weather resisting non fading paint of Dark Admiralty Grey as per technical specification of WBSEDCL.',
    'PTR Con. Tank Rusted':'Rust formation on PTR Conservator Tank was observed. The same must be cleaned and painted with weather resisting non fading paint of Dark Admiralty Grey as per technical specification of WBSEDCL.'
  };
  return map[val] || '';
}

// Render live table
function renderLive() {
  const tbody = document.querySelector('#liveTable tbody');
 const priorities = [
   ...ptrList,
   // all “otherList” except the generic ‘Other’
   ...otherList.filter(e => e!=='Other'),
   'Rusted Structures',
   'Aerial Earth Spike',
   'Other'
 ]; // ensure “Other” last
  let html = '';
  let sl = 1;

  // Build rows in priority order, merging equipment cells
  priorities.forEach(equip => {
  



// sort SSTR so that Oil Leakages come first, manuals last
let group = liveData.filter(r => r.equipment === equip);
if (equip === 'SSTR') {
  group = group.sort((a, b) => {
    const ma = a.manual ? 1 : 0, mb = b.manual ? 1 : 0;
    if (ma !== mb) return ma - mb;
    const oa = a.action.startsWith('Oil Leakage'), ob = b.action.startsWith('Oil Leakage');
    if (oa !== ob) return oa ? -1 : 1;
    return 0;
  });
} else {
  group = group.sort((a, b) => (a.manual ? 1 : 0) - (b.manual ? 1 : 0));
}


    if (!group.length) return;
    group.forEach((row, idx) => {
      if (idx === 0) {
        html += `
          <tr>
            <td>${sl}</td>
            <td rowspan="${group.length}">
            ${equip === 'SSTR' ? 'Station Service Transformer' : equip}
            </td>
            <td>${row.action}</td>
          </tr>`;
      } else {
        html += `
          <tr>
            <td>${sl}</td>
            <td>${row.action}</td>
          </tr>`;
      }
      sl++;
    });
  });

  // Fallback
  tbody.innerHTML = html || '<tr><td colspan="3">No data yet.</td></tr>';
// ─── make Equipment & Action columns editable ───────────────────────────
// ─── allow editing on every non-serial cell ───────────────────────────────
const rows = document.querySelectorAll('#liveTable tbody tr');
rows.forEach(tr => {
  const cells = tr.querySelectorAll('td');
  cells.forEach((td, idx) => {
    // skip Sl. no. column (idx 0)
    if (idx > 0) {
      td.contentEditable = 'true';
      td.addEventListener('blur', () => {
        const updated = [];
        document.querySelectorAll('#liveTable tbody tr').forEach(r => {
          const tds = r.querySelectorAll('td');
          if (tds.length === 3) {
            // first row of a merged group
            updated.push({
              equipment: tds[1].textContent.trim(),
              action:    tds[2].textContent.trim()
            });
          } else if (tds.length === 2) {
            // continuation row — reuse last equipment
            const lastEquip = updated.length
              ? updated[updated.length - 1].equipment
              : '';
            updated.push({
              equipment: lastEquip,
              action:    tds[1].textContent.trim()
            });
          }
        });
        liveData = updated;
        localStorage.setItem('visualFindings', JSON.stringify(liveData));
      });
    }
  });
});


}



function updateSSTRLiveTable() {
  liveData = liveData.filter(r =>
    !(r.equipment === 'SSTR' && r.action.startsWith('Oil Leakage'))
  );

  if (sstrOilLeaks.size) {
    const arr = Array.from(sstrOilLeaks);
    const multi = arr.length > 1;
    const last = arr.pop();
    const prefix = arr.join(', ') + (multi ? ' & ' : '');
    const listText = prefix + last;
    const text = multi
      ? `Oil Leakages were found from ${listText}--- These oil leakages must be arrested.`
      : `Oil Leakage was found from ${listText} --- This oil leakage must be arrested.`;
    liveData.push({ equipment: 'SSTR', action: text, manual: false });
  }

  renderLive();
  localStorage.setItem('visualFindings', JSON.stringify(liveData));
}


/**
 * Apply all export‐only inline styles to the given table element,
 * without touching the on‐screen live table.
 */
function styleTableForExport(table) {
  // 1) collapse borders
  table.style.borderCollapse = 'collapse';

  // 2) prepare color palette
  const colors = ['#f2dbdb','#c6d9f1','#fdeada','#ebf1de','#fff2cc'];
  const equipColorMap = {};
  let colorIndex = 0;
  let lastEquip = '';

  // 3) walk rows
  Array.from(table.rows).forEach((tr, rowIndex) => {
    const cells = Array.from(tr.cells);

    if (rowIndex === 0) {
      // — HEADER row: Cambria 14pt, bold, normal case, grey bg, black border
      cells.forEach(td => {
        td.style.fontFamily    = 'Cambria';
        td.style.fontSize      = '14pt';
        td.style.fontWeight    = 'bold';
        td.style.textTransform = 'none';
        td.style.color         = 'black';
        td.style.backgroundColor = '#bfbfbf';
        td.style.border        = '1px solid black';
      });
    } else {
      // — Sl. No. cell
      cells[0].style.fontFamily = 'Cambria';
      cells[0].style.fontSize   = '11pt';
      cells[0].style.color      = 'black';
      cells[0].style.border     = '1px solid black';

      // — Equipment/Material cell (first of a group)
      let equipment;
      if (cells.length === 3) {
        equipment = cells[1].textContent.trim();
        cells[1].style.fontFamily    = 'Cambria';
        cells[1].style.fontSize      = '16pt';
        cells[1].style.fontWeight    = 'bold';
        cells[1].style.textTransform = 'none';
        cells[1].style.color         = 'black';
        cells[1].style.border        = '1px solid black';
      } else {
        equipment = lastEquip;
      }

      // — Action cell
      const actionCell = cells[cells.length - 1];
      actionCell.style.fontFamily = 'Cambria';
      actionCell.style.fontSize   = '11pt';
      actionCell.style.color      = 'black';
      actionCell.style.border     = '1px solid black';

      // — Group‐color background
      if (!equipColorMap[equipment]) {
        equipColorMap[equipment] = colors[colorIndex++ % colors.length];
      }
      tr.style.backgroundColor = equipColorMap[equipment];
      lastEquip = equipment;
    }
  });
}


// Get the selected substation and format today’s date as DD.MM.YYYY
const subName = localStorage.getItem('selectedSubstation') || '';
function getFormattedDate() {
  const now = new Date();
  const dd  = String(now.getDate()).padStart(2,'0');
  const mm  = String(now.getMonth() + 1).padStart(2,'0');
  const yy  = now.getFullYear();
  return `${dd}.${mm}.${yy}`;
}









// Export functions (using libraries loaded on page)
function exportExcel() {
  // Converts the live table to a workbook and downloads as .xlsx
  const wb = XLSX.utils.table_to_book(
    document.getElementById('liveTable'),
    { sheet: 'Findings' }
  );
  // inside exportExcel()
const dateStr = getFormattedDate();
XLSX.writeFile(wb,`Visualfindings_${subName}_${dateStr}.xlsx`
);

}

function exportDoc() {
  // 1) clone + style
  const live  = document.getElementById('liveTable');
  const clone = live.cloneNode(true);
  styleTableForExport(clone);

  // 2) build a Word-compatible HTML with a Landscape section
  const html = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8"/>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      <!-- Force A4 landscape -->
      <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
    </w:WordDocument>
  </xml>
  <![endif]-->
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;

  // 3) convert & download
  const blob = window.htmlDocx.asBlob(html);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);

  // inside exportDoc()
const dateStr = getFormattedDate();
link.download = `Visualfindings_${subName}_${dateStr}.docx`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}




function exportPdf() {
  // 1) Clone & style the table (for doc consistency)
  const live  = document.getElementById('liveTable');
  const clone = live.cloneNode(true);
  styleTableForExport(clone);

  // 2) Build an array mapping each body-row to its equipment group
  const trs = Array.from(clone.querySelectorAll('tbody tr'));
  const equipForRow = [];
  let lastEquip = '';
  trs.forEach(tr => {
    const tds = Array.from(tr.cells);
    if (tds.length === 3) {
      // first row of a merged group
      lastEquip = tds[1].textContent.trim();
    }
    equipForRow.push(lastEquip);
  });

  // 3) Assign each unique equipment its color in RGB
  const hexToRgb = hex => hex.match(/[0-9A-F]{2}/gi)
    .map(c => parseInt(c,16));
  const palette = ['#f2dbdb','#c6d9f1','#fdeada','#ebf1de','#fff2cc'];
  const uniqueEquips = Array.from(new Set(equipForRow));
  const equipColorMap = {};
  uniqueEquips.forEach((eq, i) => {
    equipColorMap[eq] = hexToRgb(palette[i % palette.length]);
  });

  // 4) Temporarily attach clone off-screen so AutoTable can read its rowspans
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.appendChild(clone);
  document.body.appendChild(container);

  // 5) Let AutoTable pull directly from the HTML
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.autoTable({
    html: clone,
    startY: 20,
    margin: { left: 10, right: 10 },
    styles: {
      font: 'Cambria',
      fontSize: 11,
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: hexToRgb('#bfbfbf'),
      textColor: 0,
      fontStyle: 'bold',
      fontSize: 14,
      halign: 'center'
    },
    didParseCell: data => {
      if (data.section === 'body') {
        const eq = equipForRow[data.row.index];
        data.cell.styles.fillColor = equipColorMap[eq];
        // Bold + larger for Equipment/Material column
        if (data.column.index === 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize  = 16;
        }
      }
    }
  });

  // 6) Cleanup & save
  document.body.removeChild(container);
  // inside exportPdf()
const dateStr = getFormattedDate();
doc.save(`Visualfindings_${subName}_${dateStr}.pdf`
);

}





// Helpers for manual entries
function addCustomOil() {
  const v = document.getElementById('customOilInput').value.trim();
  if (!v) return;
  const activeGrid = document.querySelector(
    '#ptrFormContainer .form-section:nth-of-type(1) .grid[style*="display: grid"]'
  );
  const lbl = document.createElement('label');
  const cb  = document.createElement('input');
  cb.type = 'checkbox'; cb.value = v; cb.onchange = () => savePTR(currentEquipment);
  lbl.appendChild(cb); lbl.append(v);
  activeGrid.appendChild(lbl);
  document.getElementById('customOilInput').value = '';
  savePTR(currentEquipment);
}

function addCustomOther() {
  const v = document.getElementById('customOtherInput').value.trim();
  if (!v) return;
  liveData.push({ equipment: currentEquipment, action: v, manual: true });
  renderLive();
  localStorage.setItem('visualFindings', JSON.stringify(liveData));
  document.getElementById('customOtherInput').value = '';
}

