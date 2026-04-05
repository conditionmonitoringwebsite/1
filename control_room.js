// control_room.js

// 1. Populate the substation name from localStorage (or a default)
  document.addEventListener('DOMContentLoaded', () => {

// Persist manual "Other" actions across live-table rebuilds
 const otherActionsStore = {
   '11':  {},
   '33':  {},
   'Battery & Battery Charger': []
 };


// ── Restore Other-tab actions if any ──
const storedOther = JSON.parse(localStorage.getItem('otherActionsStore') || 'null');
if (storedOther) {
  Object.assign(otherActionsStore, storedOther);
}


// Store manual “Other” entries so they persist across recalcBatActions
const manualBatEntries = [];


// Map generic 11 kV checkbox labels to their action-text
const FINDING_MAP_11 = {
  'Cleaning':
    'Battery Cell Terminals (corresponding to 11KV Panels) are to be cleaned.',
  'Water Top-up':
    'Water top up is required at some of the Battery Cells (Corresponding to 11KV panels).',
  'Sludge Formation':
    'Sludge formations have been observed in some of the battery cell (corresponding to 11KV Panels). Necessary action is to be taken.',
  'Top Cover Broken':
    'Some of battery cells’ top cover found to be broken (corresponding to 11KV panels). Appropriate action is to be taken to prevent deposition of dust and dirt to acid water which can deteriorate the cells.',
  'Rating Mismatch':
    'In 11KV panel Battery set, some batteries are of rating 100AH and others 75AH. Immediately make all batteries of same rating as rating mismatch can lead to uneven charging/discharging, reduced battery performance, and damaging the batteries.',
  'Exhaust Fan':
    'Exhaust Fan in the Battery Room was found to be missing. Exhaust fan is to be installed in the Battery room and the fan is to be kept in ON condition continuously.',
  'Sulphur Deposition':
    'Sulphur deposition has been found on the battery Cells (corresponding to 11KV Panels). Cleaning and greasing of battery cells are required lead to avoid sulphur deposition.',
  'Top Cover Open':
    'Some of battery cells’ top cover found to be open (corresponding to 11KV panels). Appropriate action is to be taken to prevent deposition of dust and dirt to acid water which can deteriorate the cells.',
  'Earth Fault':
    'Earth fault is showing at Battery Charger for 11KV panels. Earth short occurred at either 11KV panel side or charger side. Locate & rectify.',
  'Manual Mode':
    'Battery Charger corresponding to 11KV Panels is running in manual mode. Problems of the chargers to be rectified so that the chargers can run in auto mode.',
  'Charger Rating Mismatch':
    '100AH battery cells (corresponding to 11KV panels) are being charged with 16A battery charger. Appropriate action is to be taken to replace the charger with 35A battery charger for healthy life of cells.'
};





  // ↓ Group all your table-body refs here ↓
  const table11Body = document.querySelector('#table11 tbody');
  const table33Body = document.querySelector('#table33 tbody');
  const temp11Body  = document.querySelector('#tableTemp11 tbody');
  const temp33Body  = document.querySelector('#tableTemp33 tbody');

  // … then the rest of your code (populateLiveTable, event hooks, etc.) …


  const header = document.getElementById('substationHeader');
  const sub = localStorage.getItem('selectedSubstation') || '[Substation Not Set]';
  header.textContent = `Entering data for '${sub}'`;

// 2. Attach click handlers only to main-nav buttons
document.querySelectorAll('.section-btn[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1) Glow this button, dim the others
    document.querySelectorAll('.section-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2) Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

    // 3) Show the targeted section
    const target = btn.dataset.target;
    document.getElementById(target).classList.add('active');

   

  });
});


 // 3. wire up nested “11KV/33KV” sub-tabs under #panelLoad
 const panelLoad = document.getElementById('panelLoad');
 panelLoad.querySelectorAll('.sub-tab-btn').forEach(btn => {
   btn.addEventListener('click', () => {
     // 1) Glow this button, dim the others
     panelLoad.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
     btn.classList.add('active');

     // 2) Hide all sub-sections, then show the selected one
     panelLoad.querySelectorAll('.sub-section').forEach(sec => sec.classList.remove('active'));
     panelLoad.querySelector('#' + btn.dataset.sub).classList.add('active');
   });
 });





// if the table ever empties out, we still have a row to clone
const row11Template = table11Body.rows[0].cloneNode(true);
document.getElementById('addRow11').addEventListener('click', () => {
  // if we still have rows, clone the live first row; otherwise use our template
  const baseRow = table11Body.rows.length > 0
    ? table11Body.rows[0]
    : row11Template;

  const newRow = baseRow.cloneNode(true);
  newRow.cells[0].textContent = table11Body.rows.length + 1;
  newRow.querySelectorAll('input, select').forEach(el => el.value = '');
  table11Body.appendChild(newRow);
});

table11Body.addEventListener('click', e => {
  if (e.target.classList.contains('delete-row-btn')) {
    e.target.closest('tr').remove();
    [...table11Body.rows].forEach((r,i) => r.cells[0].textContent = i+1);
    populateLiveTable();  // 🔥 ADD THIS LINE to refresh live table
  }
});

  document.getElementById('save11').addEventListener('click', () => {
    const data11 = [...table11Body.rows].map(r => ({
      panelName: r.cells[1].querySelector('input').value,
      vcbState:  r.cells[2].querySelector('select').value,
      load:      r.cells[3].querySelector('input').value
    }));
    localStorage.setItem('pan11Data', JSON.stringify(data11));
    alert('11KV Panels data saved');
  });



// template for when all 33 kV rows get deleted
const row33Template = table33Body.rows[0].cloneNode(true);

document.getElementById('addRow33').addEventListener('click', () => {
  const baseRow = table33Body.rows.length > 0
    ? table33Body.rows[0]
    : row33Template;

  const newRow = baseRow.cloneNode(true);
  newRow.cells[0].textContent = table33Body.rows.length + 1;
  newRow.querySelectorAll('input, select').forEach(el => el.value = '');
  table33Body.appendChild(newRow);
});

table33Body.addEventListener('click', e => {
  if (e.target.classList.contains('delete-row-btn')) {
    e.target.closest('tr').remove();
    [...table33Body.rows].forEach((r,i) => r.cells[0].textContent = i+1);
    populateLiveTable();  // 🔥 ADD THIS LINE to refresh live table
  }
});

  document.getElementById('save33').addEventListener('click', () => {
    const data33 = [...table33Body.rows].map(r => ({
      panelName: r.cells[1].querySelector('input').value,
      vcbState:  r.cells[2].querySelector('select').value,
      load:      r.cells[3].querySelector('input').value
    }));
    localStorage.setItem('pan33Data', JSON.stringify(data33));
    alert('33KV Panels data saved');
  });

// NEW: populate *only* on the first click, so inputs then persist forever
const tempSection = document.getElementById('temp');
const tempInit = { temp11: true, temp33: true };

tempSection.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1) Highlight the clicked button
    tempSection.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // 2) Show its corresponding pane
    tempSection.querySelectorAll('.sub-section').forEach(sec => sec.classList.remove('active'));
    tempSection.querySelector('#' + btn.dataset.sub).classList.add('active');

    // 3) Populate the table only the very first time
    if (tempInit[btn.dataset.sub]) {
      if (btn.dataset.sub === 'temp11') populateTemp11();
      if (btn.dataset.sub === 'temp33') populateTemp33();
      tempInit[btn.dataset.sub] = false;
    }
  });
});


function populateTemp11() {
  const tbody = document.querySelector('#tableTemp11 tbody');


// ─── PRESERVE existing readings (F1, B1, B2, S1/S2 & PT) by name AND by index ───
const oldTempByName  = {};
const oldTempByIndex = [];
tbody.querySelectorAll('tr').forEach((row, idx) => {
  const entry = { values: [], checks: [] };
  // capture columns 4→8 (F1, B1, B2, S1/S2, PT)
  for (let j = 4; j <= 8; j++) {
    const inp = row.cells[j].querySelector('input');
    const cb  = row.cells[j].querySelector('input[type="checkbox"]');
    entry.values.push( inp  ? inp.value       : '' );
    entry.checks.push( cb    ? cb.checked      : false );
  }
  const name = row.cells[1].textContent.trim();
  oldTempByName[name] = entry;
  oldTempByIndex[idx] = entry;
});





  tbody.innerHTML = '';
  // table11Body was declared up above as document.querySelector('#table11 tbody')
  table11Body.querySelectorAll('tr').forEach((r, i) => {
    const tr = document.createElement('tr');
// determine whether this is an 11KV or 33KV row
const tableId = r.closest('table').id;  // "table11" or "table33"

    // Sl. No.
    const td0 = document.createElement('td');
    td0.textContent = i + 1;
    tr.appendChild(td0);
    // 11KV Panel Name
    const td1 = document.createElement('td');
    td1.textContent = r.cells[1].querySelector('input').value;
    tr.appendChild(td1);
    // VCB State
    const td2 = document.createElement('td');
    td2.textContent = r.cells[2].querySelector('select').value;
    tr.appendChild(td2);
    // Load (in A)
    const td3 = document.createElement('td');
    td3.textContent = r.cells[3].querySelector('input').value;
    tr.appendChild(td3);

const panelName = td1.textContent;



// F1, B1, B2 → single wrapper div inside each cell
for (let j = 0; j < 3; j++) {
  const td = document.createElement('td');
  // inner div stays flex—td remains a table‐cell
  const wrapper = document.createElement('div');
  wrapper.style.display        = 'flex';
  wrapper.style.alignItems     = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.gap            = '0.25rem';
  wrapper.style.whiteSpace     = 'nowrap';

  const inp = document.createElement('input');
  inp.type        = 'number';
  inp.placeholder = '°C';
  inp.style.width    = '76px';
  inp.style.fontSize = '0.75rem';
  inp.style.padding  = '2px 4px';
  wrapper.appendChild(inp);

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.name = `h${j+1}`;
  wrapper.appendChild(cb);

  const lbl = document.createElement('span');
  lbl.textContent    = 'H';
  lbl.style.fontSize = '0.75rem';
  wrapper.appendChild(lbl);



const prev = oldTempByName[panelName] || oldTempByIndex[i];
if (prev) {
  inp.value   = prev.values[j]  || '';
  cb.checked  = prev.checks[j]  || false;
}






  td.appendChild(wrapper);
  tr.appendChild(td);
}

  // S1/S2 and PT → same pattern as F1/B1/B2
  for (let j = 3; j < 5; j++) {
    const td = document.createElement('td');
    const wrapper = document.createElement('div');
    wrapper.style.display        = 'flex';
    wrapper.style.alignItems     = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.gap            = '0.25rem';
    wrapper.style.whiteSpace     = 'nowrap';

    const inp = document.createElement('input');
    inp.type        = 'number';
    inp.placeholder = '°C';
    inp.style.width    = '76px';
    inp.style.fontSize = '0.75rem';
    inp.style.padding  = '2px 4px';
    wrapper.appendChild(inp);

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.name = `h${j+1}`;  // j=3→h4, j=4→h5
    wrapper.appendChild(cb);

    const lbl = document.createElement('span');
    lbl.textContent    = 'H';
    lbl.style.fontSize = '0.75rem';
    wrapper.appendChild(lbl);

    // restore old values if any
    const prev = oldTempByName[panelName] || oldTempByIndex[i];
    if (prev) {
      inp.value  = prev.values[j]  || '';
      cb.checked = prev.checks[j]  || false;
    }

    td.appendChild(wrapper);
    tr.appendChild(td);
  }



    tbody.appendChild(tr);
  });
}


document.getElementById('saveTemp11').addEventListener('click', () => {
  const rows = document.querySelectorAll('#tableTemp11 tbody tr');
  const tempData11 = [...rows].map(r => ({
    panelName: r.cells[1].textContent,
    vcbState:  r.cells[2].textContent,
    load:      r.cells[3].textContent,
    f1:        r.cells[4].querySelector('input').value,
    f1H:       r.cells[4].querySelector('input[type="checkbox"]').checked,
    b1:        r.cells[5].querySelector('input').value,
    b1H:       r.cells[5].querySelector('input[type="checkbox"]').checked,
    b2:        r.cells[6].querySelector('input').value,
    b2H:       r.cells[6].querySelector('input[type="checkbox"]').checked,	
    s1s2:      r.cells[7].querySelector('input').value,
    s1s2H:     r.cells[7].querySelector('input[type="checkbox"]').checked,
    pt:        r.cells[8].querySelector('input').value,
    ptH:       r.cells[8].querySelector('input[type="checkbox"]').checked
  }));
  localStorage.setItem('temp11Data', JSON.stringify(tempData11));
  alert('11KV Temp data saved');
});

function populateTemp33() {
  const tbody = document.querySelector('#tableTemp33 tbody');
// ─── PRESERVE existing readings (F1, B1, B2, S1/S2 & PT) by name AND by index ───
const oldTempByName  = {};
const oldTempByIndex = [];
tbody.querySelectorAll('tr').forEach((row, idx) => {
  const entry = { values: [], checks: [] };
  // capture columns 4→8 (F1, B1, B2, S1/S2, PT)
  for (let j = 4; j <= 8; j++) {
    const inp = row.cells[j].querySelector('input');
    const cb  = row.cells[j].querySelector('input[type="checkbox"]');
    entry.values.push( inp  ? inp.value       : '' );
    entry.checks.push( cb    ? cb.checked      : false );
  }
  const name = row.cells[1].textContent.trim();
  oldTempByName[name] = entry;
  oldTempByIndex[idx] = entry;
});






  tbody.innerHTML = '';
  table33Body.querySelectorAll('tr').forEach((r, i) => {
    const tr = document.createElement('tr');
    // Sl. No.
    const td0 = document.createElement('td');
    td0.textContent = i + 1;
    tr.appendChild(td0);
    // 33KV Panel Name
    const td1 = document.createElement('td');
    td1.textContent = r.cells[1].querySelector('input').value;
    tr.appendChild(td1);
    // VCB State
    const td2 = document.createElement('td');
    td2.textContent = r.cells[2].querySelector('select').value;
    tr.appendChild(td2);
    // Load (in A)
    const td3 = document.createElement('td');
    td3.textContent = r.cells[3].querySelector('input').value;
    tr.appendChild(td3);


const panelName = td1.textContent;



// F1, B1, B2 → single wrapper div inside each cell
for (let j = 0; j < 3; j++) {
  const td = document.createElement('td');
  // inner div stays flex—td remains a table‐cell
  const wrapper = document.createElement('div');
  wrapper.style.display        = 'flex';
  wrapper.style.alignItems     = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.gap            = '0.25rem';
  wrapper.style.whiteSpace     = 'nowrap';

  const inp = document.createElement('input');
  inp.type        = 'number';
  inp.placeholder = '°C';
  inp.style.width    = '76px';
  inp.style.fontSize = '0.75rem';
  inp.style.padding  = '2px 4px';
  wrapper.appendChild(inp);

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.name = `h${j+1}`;
  wrapper.appendChild(cb);

  const lbl = document.createElement('span');
  lbl.textContent    = 'H';
  lbl.style.fontSize = '0.75rem';
  wrapper.appendChild(lbl);


const prev = oldTempByName[panelName] || oldTempByIndex[i];
if (prev) {
  inp.value   = prev.values[j]  || '';
  cb.checked  = prev.checks[j]  || false;
}




  td.appendChild(wrapper);
  tr.appendChild(td);
}

  // S1/S2 and PT → same pattern as F1/B1/B2
  for (let j = 3; j < 5; j++) {
    const td = document.createElement('td');
    const wrapper = document.createElement('div');
    wrapper.style.display        = 'flex';
    wrapper.style.alignItems     = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.gap            = '0.25rem';
    wrapper.style.whiteSpace     = 'nowrap';

    const inp = document.createElement('input');
    inp.type        = 'number';
    inp.placeholder = '°C';
    inp.style.width    = '76px';
    inp.style.fontSize = '0.75rem';
    inp.style.padding  = '2px 4px';
    wrapper.appendChild(inp);

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.name = `h${j+1}`;  // j=3→h4, j=4→h5
    wrapper.appendChild(cb);

    const lbl = document.createElement('span');
    lbl.textContent    = 'H';
    lbl.style.fontSize = '0.75rem';
    wrapper.appendChild(lbl);

    // restore old values if any
    const prev = oldTempByName[panelName] || oldTempByIndex[i];
    if (prev) {
      inp.value  = prev.values[j]  || '';
      cb.checked = prev.checks[j]  || false;
    }

    td.appendChild(wrapper);
    tr.appendChild(td);
  }



    tbody.appendChild(tr);
  });
}

document.getElementById('saveTemp33').addEventListener('click', () => {
  const rows = document.querySelectorAll('#tableTemp33 tbody tr');
  const tempData33 = [...rows].map(r => ({
    panelName: r.cells[1].textContent,
    vcbState:  r.cells[2].textContent,
    load:      r.cells[3].textContent,
    f1:        r.cells[4].querySelector('input').value,
    f1H:       r.cells[4].querySelector('input[type="checkbox"]').checked,
    b1:        r.cells[5].querySelector('input').value,
    b1H:       r.cells[5].querySelector('input[type="checkbox"]').checked,
    b2:        r.cells[6].querySelector('input').value,
    b2H:       r.cells[6].querySelector('input[type="checkbox"]').checked,
    s1s2:      r.cells[7].querySelector('input').value,
    s1s2H:     r.cells[7].querySelector('input[type="checkbox"]').checked,
    pt:        r.cells[8].querySelector('input').value,
    ptH:       r.cells[8].querySelector('input[type="checkbox"]').checked
  }));
  localStorage.setItem('temp33Data', JSON.stringify(tempData33));
  alert('33KV Temp data saved');
});


// live-sync Temp tables whenever Panel-Load inputs change
table11Body.addEventListener('input',  populateTemp11);
table11Body.addEventListener('change', populateTemp11);
table33Body.addEventListener('input',  populateTemp33);
table33Body.addEventListener('change', populateTemp33);


// ==== wire up nested sub-tabs under #ultrasound with first-click guard ====
const ultrasoundSection = document.getElementById('ultrasound');
const usInit             = { us11: true, us33: true };

ultrasoundSection.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    ultrasoundSection.querySelectorAll('.sub-tab-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    ultrasoundSection.querySelectorAll('.sub-section')
      .forEach(sec => sec.classList.remove('active'));
    ultrasoundSection.querySelector('#' + btn.dataset.sub)
      .classList.add('active');

    if (usInit[btn.dataset.sub]) {
      if (btn.dataset.sub === 'us11') populateUS11();
      else if (btn.dataset.sub === 'us33') populateUS33();
      usInit[btn.dataset.sub] = false;
    }
  });
});


const classifications = [
  'Corona','Destructive Corona','Mild Tracking','Tracking',
  'Corona with Mild Tracking','Corona with Tracking',
  'Destructive Corona with Tracking','Severe Tracking',
  'Corona with Severe Tracking','Arcing'
];

function populateUS11() {
  const tbody = document.querySelector('#tableUltrasound11 tbody');



// ─── PRESERVE existing US readings by name AND by index ───
const oldUSByName  = {};
const oldUSByIndex = [];
tbody.querySelectorAll('tr').forEach((row, idx) => {
  const arr = Array.from({ length: 6 }, (_, j) => ({
    val: row.cells[j + 4].querySelector('input').value,
    sel: row.cells[j + 4].querySelector('select').value
  }));
  const name = row.cells[1].textContent.trim();
  oldUSByName[name]   = arr;
  oldUSByIndex[idx]   = arr;
});


  tbody.innerHTML = '';




  tbody.innerHTML = '';
  // table11Body was declared earlier: document.querySelector('#table11 tbody')
  table11Body.querySelectorAll('tr').forEach((r, i) => {
    const tr = document.createElement('tr');
    // Sl. No.
    const td0 = document.createElement('td');
    td0.textContent = i + 1;
    tr.appendChild(td0);
    // Panel Name, VCB State, Load
    ['input','select','input'].forEach((tag, idx) => {
      const cell = r.cells[1 + idx].querySelector(tag);
      const td = document.createElement('td');
      td.textContent = cell.value;
      tr.appendChild(td);
    });

  const panelName = tr.cells[1].textContent;



    // F1, B1, B2, PT, S1, S2 → input + dropdown
    for (let j = 0; j < 6; j++) {
      const td = document.createElement('td');
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.placeholder = 'dB';
      td.appendChild(inp);
      const sel = document.createElement('select');
      // add a hidden default
      const def = document.createElement('option');
      def.disabled = def.hidden = def.selected = true;
      sel.appendChild(def);
      classifications.forEach(text => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = text;
        sel.appendChild(opt);

const arr  = oldUSByName[panelName] || oldUSByIndex[i] || [];
const prev = arr[j];
if (prev) {
  inp.value = prev.val || '';
  sel.value = prev.sel || '';
}





      });
      td.appendChild(sel);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}

function populateUS33() {
  const tbody = document.querySelector('#tableUltrasound33 tbody');


// ─── PRESERVE existing US readings by name AND by index ───
const oldUSByName  = {};
const oldUSByIndex = [];
tbody.querySelectorAll('tr').forEach((row, idx) => {
  const arr = Array.from({ length: 6 }, (_, j) => ({
    val: row.cells[j + 4].querySelector('input').value,
    sel: row.cells[j + 4].querySelector('select').value
  }));
  const name = row.cells[1].textContent.trim();
  oldUSByName[name]   = arr;
  oldUSByIndex[idx]   = arr;
});


  tbody.innerHTML = '';




  tbody.innerHTML = '';
  table33Body.querySelectorAll('tr').forEach((r, i) => {
    const tr = document.createElement('tr');
    const td0 = document.createElement('td');
    td0.textContent = i + 1;
    tr.appendChild(td0);
    ['input','select','input'].forEach((tag, idx) => {
      const cell = r.cells[1 + idx].querySelector(tag);
      const td = document.createElement('td');
      td.textContent = cell.value;
      tr.appendChild(td);
    });

  const panelName = tr.cells[1].textContent;



    for (let j = 0; j < 6; j++) {
      const td = document.createElement('td');
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.placeholder = 'dB';
      td.appendChild(inp);
      const sel = document.createElement('select');
      const def = document.createElement('option');
      def.disabled = def.hidden = def.selected = true;
      sel.appendChild(def);
      classifications.forEach(text => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = text;
        sel.appendChild(opt);


const arr  = oldUSByName[panelName] || oldUSByIndex[i] || [];
const prev = arr[j];
if (prev) {
  inp.value = prev.val || '';
  sel.value = prev.sel || '';
}




      });
      td.appendChild(sel);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}

// ── Save 11KV Ultrasound ──
document.getElementById('saveUS11').addEventListener('click', () => {
  const rows = document.querySelectorAll('#tableUltrasound11 tbody tr');
  const data = [...rows].map(r => ({
    panelName: r.cells[1].textContent,
    vcbState:  r.cells[2].textContent,
    load:      r.cells[3].textContent,
    readings: Array.from({ length: 6 }, (_, j) => ({
      val: r.cells[j + 4].querySelector('input').value,
      sel: r.cells[j + 4].querySelector('select').value
    }))
  }));
  localStorage.setItem('us11Data', JSON.stringify(data));
  alert('11KV Ultrasound data saved');
});

// ── Save 33KV Ultrasound ──
document.getElementById('saveUS33').addEventListener('click', () => {
  const rows = document.querySelectorAll('#tableUltrasound33 tbody tr');
  const data = [...rows].map(r => ({
    panelName: r.cells[1].textContent,
    vcbState:  r.cells[2].textContent,
    load:      r.cells[3].textContent,
    readings: Array.from({ length: 6 }, (_, j) => ({
      val: r.cells[j + 4].querySelector('input').value,
      sel: r.cells[j + 4].querySelector('select').value
    }))
  }));
  localStorage.setItem('us33Data', JSON.stringify(data));
  alert('33KV Ultrasound data saved');
});



// ==== wire up nested sub-tabs under #tev with first-click guard ====
const tevSection = document.getElementById('tev');
const tevInit    = { tev11: true, tev33: true };

tevSection.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    tevSection.querySelectorAll('.sub-tab-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tevSection.querySelectorAll('.sub-section')
      .forEach(sec => sec.classList.remove('active'));
    document.getElementById(btn.dataset.sub)
      .classList.add('active');

    if (tevInit[btn.dataset.sub]) {
      if (btn.dataset.sub === 'tev11') populateTEV11();
      else if (btn.dataset.sub === 'tev33') populateTEV33();
      tevInit[btn.dataset.sub] = false;
    }
  });
});

  function populateTEV11() {
    const tbody = document.querySelector('#tableTEV11 tbody');


// ─── PRESERVE existing TEV readings by name AND by index ───
const oldTEVByName  = {};
const oldTEVByIndex = [];
tbody.querySelectorAll('tr').forEach((row, idx) => {
  const arr = Array.from({ length: 6 }, (_, j) =>
    row.cells[j + 4].querySelector('input').value
  );
  const name = row.cells[1].textContent.trim();
  oldTEVByName[name]   = arr;
  oldTEVByIndex[idx]   = arr;
});


  tbody.innerHTML = '';




    tbody.innerHTML = '';
    table11Body.querySelectorAll('tr').forEach((r, i) => {
      const tr = document.createElement('tr');
      // Sl. No., Panel Name, VCB State, Load
      [i + 1,
       r.cells[1].querySelector('input').value,
       r.cells[2].querySelector('select').value,
       r.cells[3].querySelector('input').value
      ].forEach((txt, idx) => {
        const td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });

  const panelName = tr.cells[1].textContent;




      // TF1, TB1, TB2, TPT, TS1, TS2 → centered numeric inputs
      for (let j = 0; j < 6; j++) {
        const td = document.createElement('td');
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.placeholder = 'dB';
        inp.style.textAlign = 'center';


const prevArr = oldTEVByName[panelName] || oldTEVByIndex[i];
if (prevArr) {
  inp.value = prevArr[j] || '';
}




        td.appendChild(inp);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
  }

  function populateTEV33() {
    const tbody = document.querySelector('#tableTEV33 tbody');


// ─── PRESERVE existing TEV readings by name AND by index ───
const oldTEVByName  = {};
const oldTEVByIndex = [];
tbody.querySelectorAll('tr').forEach((row, idx) => {
  const arr = Array.from({ length: 6 }, (_, j) =>
    row.cells[j + 4].querySelector('input').value
  );
  const name = row.cells[1].textContent.trim();
  oldTEVByName[name]   = arr;
  oldTEVByIndex[idx]   = arr;
});


  tbody.innerHTML = '';




    tbody.innerHTML = '';
    table33Body.querySelectorAll('tr').forEach((r, i) => {
      const tr = document.createElement('tr');
      [i + 1,
       r.cells[1].querySelector('input').value,
       r.cells[2].querySelector('select').value,
       r.cells[3].querySelector('input').value
      ].forEach(txt => {
        const td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });

  const panelName = tr.cells[1].textContent;


      for (let j = 0; j < 6; j++) {
        const td = document.createElement('td');
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.placeholder = 'dB';
        inp.style.textAlign = 'center';

const prevArr = oldTEVByName[panelName] || oldTEVByIndex[i];
if (prevArr) {
  inp.value = prevArr[j] || '';
}



        td.appendChild(inp);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
  }

  // Save handlers
  document.getElementById('saveTEV11').addEventListener('click', () => {
    const data = Array.from(document.querySelectorAll('#tableTEV11 tbody tr'))
      .map(r => ({
        panelName: r.cells[1].textContent,
        vcbState:  r.cells[2].textContent,
        load:      r.cells[3].textContent,
        tf1:       r.cells[4].querySelector('input').value,
        tb1:       r.cells[5].querySelector('input').value,
        tb2:       r.cells[6].querySelector('input').value,
        tpt:       r.cells[7].querySelector('input').value,
        ts1:       r.cells[8].querySelector('input').value,
        ts2:       r.cells[9].querySelector('input').value
      }));
    localStorage.setItem('tev11Data', JSON.stringify(data));
    alert('11KV TEV data saved');
  });

  document.getElementById('saveTEV33').addEventListener('click', () => {
    const data = Array.from(document.querySelectorAll('#tableTEV33 tbody tr'))
      .map(r => ({
        panelName: r.cells[1].textContent,
        vcbState:  r.cells[2].textContent,
        load:      r.cells[3].textContent,
        tf1:       r.cells[4].querySelector('input').value,
        tb1:       r.cells[5].querySelector('input').value,
        tb2:       r.cells[6].querySelector('input').value,
        tpt:       r.cells[7].querySelector('input').value,
        ts1:       r.cells[8].querySelector('input').value,
        ts2:       r.cells[9].querySelector('input').value
      }));
    localStorage.setItem('tev33Data', JSON.stringify(data));
    alert('33KV TEV data saved');
  });

// live-sync TEV tables whenever Panel-Load inputs change
table11Body.addEventListener('input',  populateTEV11);
table11Body.addEventListener('change', populateTEV11);
table33Body.addEventListener('input',  populateTEV33);
table33Body.addEventListener('change', populateTEV33);



// live-sync Ultrasound tables on any Panel-Load input *or* select‐change
table11Body.addEventListener('input',  populateUS11);
table11Body.addEventListener('change', populateUS11);
table33Body.addEventListener('input',  populateUS33);
table33Body.addEventListener('change', populateUS33);


// ==== wire up nested sub-tabs under #battery ====
const batterySection = document.getElementById('battery');
batterySection.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Highlight the clicked button
    batterySection.querySelectorAll('.sub-tab-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show its corresponding sub-section
    batterySection.querySelectorAll('.sub-section')
      .forEach(sec => sec.classList.remove('active'));
    batterySection.querySelector('#' + btn.dataset.sub)
      .classList.add('active');

    // ▼ Optional: call your populate functions if/when you build them
    // if (btn.dataset.sub === 'bat11') populateBat11();
    // if (btn.dataset.sub === 'bat33') populateBat33();
  });
});

  // --- Save logic for 11KV Battery & Battery Charger ---
  document.getElementById('saveBat11').addEventListener('click', () => {
    const bat11Data = {
    voltage: {
    acOn:       document.getElementById('bat11VoltageOn').value,
    acOff:      document.getElementById('bat11VoltageOff').value,
    problemOn:  document.getElementById('bat11VoltageOnProblem').checked,
    problemOff: document.getElementById('bat11VoltageOffProblem').checked
    },

     cellVoltage: document.getElementById('bat11CellVoltage').value,

      generalFindings: Array.from(
        document.querySelectorAll('#bat11 input[name="bat11GenFindings"]:checked')
      ).map(cb => cb.value),
      otherRemarks: document.getElementById('bat11GenFindingsOther').value
    };
    localStorage.setItem('bat11Data', JSON.stringify(bat11Data));
    alert('11KV Battery & Battery Charger data saved');

  // Recalculate & redraw all Battery actions (this clears previous entries)
  recalcBatActions();
  populateLiveTable();

  });

  // --- Save logic for 33KV Battery & Battery Charger ---
  document.getElementById('saveBat33').addEventListener('click', () => {
    const bat33Data = {
    voltage: {
    acOn:       document.getElementById('bat33VoltageOn').value,
    acOff:      document.getElementById('bat33VoltageOff').value,
    problemOn:  document.getElementById('bat33VoltageOnProblem').checked,
    problemOff: document.getElementById('bat33VoltageOffProblem').checked
    },

      
     cellVoltage: document.getElementById('bat33CellVoltage').value,


      generalFindings: Array.from(
        document.querySelectorAll('#bat33 input[name="bat33GenFindings"]:checked')
      ).map(cb => cb.value),
      otherRemarks: document.getElementById('bat33GenFindingsOther').value
    };
    localStorage.setItem('bat33Data', JSON.stringify(bat33Data));
    alert('33KV Battery & Battery Charger data saved');

  // Recalculate & redraw Battery actions after saving 33KV
  recalcBatActions();
  populateLiveTable();

   });


// ── Auto-sync Battery & Battery Charger actions on any field change ──
function recalcBatActions() {
  // clear previous
  otherActionsStore['Battery & Battery Charger'] = [];
  const bat = otherActionsStore['Battery & Battery Charger'];

  // 11 kV logic
  const acOn11   = document.getElementById('bat11VoltageOn').value;
  const acOff11  = document.getElementById('bat11VoltageOff').value;
  const pOn11    = document.getElementById('bat11VoltageOnProblem').checked;
  const pOff11   = document.getElementById('bat11VoltageOffProblem').checked;


if (pOn11 && !pOff11) {
  bat.push(
    `11KV Panel voltage drops to ${acOn11}V when charger AC input is ON. Charger is unable to send req. voltage to panels. Charger output voltage to be increased. Check cross section of the cables (From charger to panels) and increase if necessary.`
  );
}



  const cellV11  = document.getElementById('bat11CellVoltage').value;
  const find11   = Array.from(
    document.querySelectorAll('#bat11 input[name="bat11GenFindings"]:checked')
  ).map(cb => cb.value);

  if (pOff11 && !pOn11) {
    bat.push(
      `11KV Panel voltage drops to ${acOff11}V when charger AC input is OFF. Charger is unable to send req. voltage to panels. Charger output voltage to be increased. Check cross section of the cables (From charger to panels) and increase if necessary.`
    );
  }
  if (pOn11 && pOff11) {
    bat.push(
      `11KV panel volt drops to ${acOn11}V when charger AC input is ON and ${acOff11}V when AC input is OFF. Charger is unable to send req. volt to panels. Increase charger output volt. Check cross section of the cables (From charger to panels) and increase if necessary.`
    );
  }
  if (find11.includes('Some Batteries Defective')) {
    bat.push(
      `Battery Cell voltage corresponding to 11KV Panels found to be ${cellV11}V. Defective cells were identified. Replace them with the healthy one of the same rating.`
    );
  }
  find11.forEach(f => {
    if (FINDING_MAP_11[f]) bat.push(FINDING_MAP_11[f]);
  });

  // 33 kV logic – same as above but swap “11KV” → “33KV”
  const acOn33   = document.getElementById('bat33VoltageOn').value;
  const acOff33  = document.getElementById('bat33VoltageOff').value;
  const pOn33    = document.getElementById('bat33VoltageOnProblem').checked;
  const pOff33   = document.getElementById('bat33VoltageOffProblem').checked;


// ONLY AC-ON problem (new)
if (pOn33 && !pOff33) {
  bat.push(
    `33KV Panel voltage drops to ${acOn33}V when charger AC input is ON. Charger is unable to send req. voltage to panels. Charger output voltage to be increased. Check cross section of the cables (From charger to panels) and increase if necessary.`
  );
}



  const cellV33  = document.getElementById('bat33CellVoltage').value;
  const find33   = Array.from(
    document.querySelectorAll('#bat33 input[name="bat33GenFindings"]:checked')
  ).map(cb => cb.value);

  if (pOff33 && !pOn33) {
    bat.push(
      `33KV Panel voltage drops to ${acOff33}V when charger AC input is OFF. Charger is unable to send req. voltage to panels. Charger output voltage to be increased. Check cross section of the cables (From charger to panels) and increase if necessary.`
    );
  }
  if (pOn33 && pOff33) {
    bat.push(
      `33KV panel volt drops to ${acOn33}V when charger AC input is ON and ${acOff33}V when AC input is OFF. Charger is unable to send req. volt to panels. Increase charger output volt. Check cross section of the cables (From charger to panels) and increase if necessary.`
    );
  }
  if (find33.includes('Some Batteries Defective')) {
    bat.push(
      `Battery Cell voltage corresponding to 33KV Panels found to be ${cellV33}V. Defective cells were identified. Replace them with the healthy one of the same rating.`
    );
  }
  find33.forEach(f => {
    if (FINDING_MAP_11[f]) bat.push(FINDING_MAP_11[f].replace(/11KV/g, '33KV'));
  });
  // ── Re-append any manual “Other” entries from both tabs
  manualBatEntries.forEach(txt => bat.push(txt));

}

// Wire it to live-sync on any change in the two sub-tables:
['input','change'].forEach(evt => {
  document.getElementById('bat11').addEventListener(evt, () => {
    recalcBatActions();
    populateLiveTable();
    localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
  });
  document.getElementById('bat33').addEventListener(evt, () => {
    recalcBatActions();
    populateLiveTable();
    localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
  });
});

// ── NEW: Manual “Other” entries for Battery & Battery Charger ──
document.getElementById('addBat11Other').addEventListener('click', () => {
  const fld = document.getElementById('bat11GenFindingsOther');
  const txt = fld.value.trim();
  if (!txt) return alert('Enter observation');
  // save in manualBatEntries and clear
  manualBatEntries.push(txt);
  fld.value = '';
  // rebuild & refresh
  recalcBatActions();
  populateLiveTable();
  localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
});

document.getElementById('addBat33Other').addEventListener('click', () => {
  const fld = document.getElementById('bat33GenFindingsOther');
  const txt = fld.value.trim();
  if (!txt) return alert('Enter observation');
  manualBatEntries.push(txt);
  fld.value = '';
  recalcBatActions();
  populateLiveTable();
  localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
});



// Ambient-Temp storage & “Add” button for Temp11
const ambient11List = JSON.parse(localStorage.getItem('ambientTemp11Data') || '[]');
document.getElementById('addAmbientTemp11').addEventListener('click', () => {
  const v = document.getElementById('ambientTemp11').value;
  if (v === '') return alert('Enter Ambient Temp.');
  ambient11List.push(v);
  localStorage.setItem('ambientTemp11Data', JSON.stringify(ambient11List));
  // → update the info row immediately
  const ambTd = document.getElementById('infoAmbientTemp');
  if (ambTd) ambTd.textContent = `${v}℃`;
  alert('11KV Ambient Temp added');
  document.getElementById('ambientTemp11').value = '';
});


  // Ambient-Temp storage & “Add” button for Temp33
  const ambient33List = JSON.parse(localStorage.getItem('ambientTemp33Data') || '[]');
  document.getElementById('addAmbientTemp33').addEventListener('click', () => {
    const v = document.getElementById('ambientTemp33').value;
    if (v === '') return alert('Enter Ambient Temp.');
    ambient33List.push(v);
    localStorage.setItem('ambientTemp33Data', JSON.stringify(ambient33List));
    alert('33KV Ambient Temp added');
    document.getElementById('ambientTemp33').value = '';
  });



// Build rows for “Other → 11KV Panels”
function populateOther11() {
  const tbody = document.querySelector('#tableOther11 tbody');
  tbody.innerHTML = '';
  table11Body.querySelectorAll('tr').forEach((r, i) => {
    const tr = document.createElement('tr');

    // Sl. No.
    const td0 = document.createElement('td');
    td0.textContent = i + 1;
    tr.appendChild(td0);

    // 11KV Panel Name
    const td1 = document.createElement('td');
    td1.textContent = r.cells[1].querySelector('input').value;
    tr.appendChild(td1);

    // Observations column
    const td2 = document.createElement('td');

    const categorySelect = document.createElement('select');
    const itemSelect = document.createElement('select');


const categories = {
      'Heater': [
        'No Heater found', 'Heater is to be checked', 'Heater Defective',
        'Breaker Chamber Heater Defective', 'Cable Chamber Heater Defective',
        '1 no. Heater Defective', '2 nos. Heater Defective', 'All Heaters defective',
        'Heater Ckt. Short-Ckt.', 'Heater Ammeter Defective', 'Heater Toggle Switch Defective',
        'Thermostat Problem'
      ],
      
      'Phase Ammeter': [
        'R-Ph Ammeter Defective', 'Y-Ph Ammeter Defective', 'B-Ph Ammeter Defective',
        'All Ammeters Defective', 'R-Ph Ammeter Display Problem',
        'Y-Ph Ammeter Display Problem', 'B-Ph Ammeter Display Problem',
        'All Ammeters Display Problem'
      ],

      'Voltmeter': ['Voltmeter Defective', 'Voltmeter Display Problem'],

      'PT': ['PT Out of Circuit', 'PT Missing'],

      'Relay': ['Relay Healthy LED not glowing', 'Trip Ckt. Unhealthy Indication on relay', 'Relay Display Out',
        'Replay Display Problem', 'HMI Key Defective', 'Clear button of relay defective',
        'O/C E/F Relay Missing'
      ],

      'Annunciator': ['Annunciator Defective', 'Trip Ckt. Unhealthy Showing', 'Hooter not working'],

      'Panel': [ 'Front Door not closing properly', 'Rear Cover not closing properly', 'TNC Switch Broken', 'TNC Switch Defective',
        'Breaker ON indication not glowing' 
      ],

      'Sunlight': ['Sunlight on Breaker Chamber', 'Sunlight on rear Bus Chamber', 'Sunlight on CT/Cable Chamber', 'Sunlight on rear Bus & CT/Cable Chamber']

    };


   // Default options
    categorySelect.innerHTML = `<option value="" disabled selected hidden></option>`;
    Object.keys(categories).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = cat;
      categorySelect.appendChild(opt);
    });

    itemSelect.innerHTML = `<option value="" disabled selected hidden></option>`;

    categorySelect.addEventListener('change', () => {
      const selected = categorySelect.value;
      itemSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      categories[selected].forEach(val => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = val;
        itemSelect.appendChild(opt);
      });
    });

const btn = document.createElement('button');
btn.textContent = 'Add';
btn.className = 'section-btn';
btn.style.fontSize = '0.7rem';
btn.style.padding = '4px 6px';
btn.style.marginLeft = '0.5rem';
btn.style.flex = 'none';


btn.addEventListener('click', () => {
  const item = itemSelect.value;
  const panelName = r.cells[1].querySelector('input').value.trim();
  if (!panelName) return alert('Enter Panel Name first');

  const actionsMap = {
    'No Heater found': 'No heater found. Install new heater.',
    'Heater is to be checked': 'Check Heaters.',
    'Heater Defective': 'Heater def. Check & rectify.',
    'Breaker Chamber Heater Defective': 'VCB Chamber heater def. Check & rectify.',
    'Cable Chamber Heater Defective': 'Cable/CT Chamber heater def. Check & rectify.',
    '1 no. Heater Defective': '01 heater def. Check & rectify.',
    '2 nos. Heater Defective': '02 heaters def. Check & rectify.',
    'All Heaters defective': 'All heaters def. Check & rectify.',
    'Heater Ckt. Short-Ckt.': 'Heater circuits found short circuited. Rectify.',
    'Heater Ammeter Defective': 'Heater Ammeter def. Rectify.',
    'Heater Toggle Switch Defective': 'Heater Toggle Switch def. Rectify.',
    'Thermostat Problem': 'Problem in thermostat. Rectify & set b/w 40’C to 45’C.',
    'R-Ph Ammeter Defective': 'R-Ph Ammeter def. Rectify.',
    'Y-Ph Ammeter Defective': 'Y-Ph Ammeter def. Rectify.',
    'B-Ph Ammeter Defective': 'B-Ph Ammeter def. Rectify.',
    'All Ammeters Defective': 'All Ph Ammeters Def. Rectify.',
    'R-Ph Ammeter Display Problem': 'R-Phase Ammeter display def. Rectify.',
    'Y-Ph Ammeter Display Problem': 'Y-Phase Ammeter display def. Rectify.',
    'B-Ph Ammeter Display Problem': 'B-Phase Ammeter display def. Rectify.',
    'All Ammeters Display Problem': 'All Phase Ammeter display def. Rectify.',
   'Voltmeter Defective': 'Voltmeter def. Rectify.',
   'Voltmeter Display Problem': 'Voltmeter display def. Rectify.',
   'PT Out of Circuit': 'PT out of ckt. Rectify.',
   'PT Missing': 'PT missing. Rectify.',
   'Relay Healthy LED not glowing': '"Relay Healthy" LED not glowing on O/C E/F Relay. Immediately rectify.',
   'Trip Ckt. Unhealthy Indication on relay': '"TCS Unhealthy" on Relay. Immediately rectify.',
   'Relay Display Out': 'Relay display out. Rectify.',
   'Replay Display Problem': 'O/C E/F Relay display def. Rectify.',
   'HMI Key Defective': 'O/C E/F Relay HMI Key def. Rectify.',
   'Clear button of relay defective': 'O/C E/F Relay Clear button def. Rectify.',
   'O/C E/F Relay Missing': 'O/C E/F Relay missing. Immediately install.',
   'Annunciator Defective': 'Annunciator def. Rectify.',
   'Trip Ckt. Unhealthy Showing': '"Trip Ckt. Unhealthy" showing on Annunciator. Immediately rectify.',
   'Hooter not working':'Hooter def. Rectify.',
   'Front Door not closing properly': 'Panel Front door not closing properly. Rectify.',
   'Rear Cover not closing properly': 'Panel rear cover not closing properly. Rectify.',
   'TNC Switch Broken': 'TNC Switch broken. Immediately rectify.',
   'TNC Switch Defective': 'TNC Switch def. Immediately rectify.',
   'Breaker ON indication not glowing': 'Breaker ON indication not glowing. Immediately rectify.',
   'Sunlight on Breaker Chamber': '<b>Note:</b>sunlight on VCB.',
   'Sunlight on rear Bus Chamber': '<b>Note:</b>sunlight on rear bus.',
   'Sunlight on CT/Cable Chamber': '<b>Note:</b>sunlight on CT/Cable chamber.',
   'Sunlight on rear Bus & CT/Cable Chamber': '<b>Note:</b>sunlight on rear Bus & CT/Cable chamber.'


  };

  const actionText = actionsMap[item];
  if (!actionText) return;

  const liveRows = [...document.querySelectorAll('#liveTable tbody tr')];
  const row = liveRows.find(row =>
  row.getAttribute('data-kv') === '11' &&
  row.cells[1]?.textContent?.trim() === panelName
);


  if (!row) return alert('Panel not found in Live Table');

  const td = row.querySelector('td:last-child');

// Store the new manual action, then rebuild the live table so it appears
otherActionsStore['11'][panelName] = otherActionsStore['11'][panelName] || [];
if (otherActionsStore['11'][panelName].includes(actionText)) {
  return alert('This action has already been added for this panel.');
}
otherActionsStore['11'][panelName].push(actionText);
populateLiveTable();
localStorage.setItem(
  'otherActionsStore',
  JSON.stringify(otherActionsStore)
);

});



    // Manual-entry field
    const manualInput = document.createElement('input');
    manualInput.type = 'text';
    manualInput.placeholder = 'Other';
    manualInput.style.marginTop = '0.5rem';
    manualInput.style.width = '70%';


    // “Add” button for manual entry
    const btn2 = document.createElement('button');
    btn2.textContent = 'Add';
    btn2.className = 'section-btn';
    btn2.style.marginLeft = '0.5rem';
    btn2.style.fontSize = '0.7rem';
    btn2.style.padding = '4px 6px';


    // ── NEW: when user clicks “Add”, store & refresh live table ──
    btn2.addEventListener('click', () => {
      const text      = manualInput.value.trim();
      const panelName = r.cells[1].querySelector('input').value.trim();
      if (!panelName) return alert('Enter Panel Name first');
      if (!text)      return alert('Enter observation');
      otherActionsStore['11'][panelName] = otherActionsStore['11'][panelName] || [];
      if (otherActionsStore['11'][panelName].includes(text)) {
        return alert('This action has already been added for this panel.');
      }
      otherActionsStore['11'][panelName].push(text);
      manualInput.value = '';
      populateLiveTable();
localStorage.setItem(
  'otherActionsStore',
  JSON.stringify(otherActionsStore)
);
    });





const dropdownWrapper = document.createElement('div');
dropdownWrapper.style.display = 'flex';
dropdownWrapper.style.flexWrap = 'nowrap';
dropdownWrapper.style.gap = '0.5rem';
dropdownWrapper.style.alignItems = 'center';
dropdownWrapper.style.marginBottom = '0.5rem';

[categorySelect, itemSelect].forEach(el => {
  el.style.fontSize = '0.7rem';
  el.style.padding = '4px 6px';
  el.style.flex = '1';
});


dropdownWrapper.appendChild(categorySelect);
dropdownWrapper.appendChild(itemSelect);
dropdownWrapper.appendChild(btn);

td2.appendChild(dropdownWrapper);

    td2.appendChild(manualInput);
    td2.appendChild(btn2);

    tr.appendChild(td2);
    tbody.appendChild(tr);
  });
}


// Build rows for “Other → 33KV Panels” (identical logic)
function populateOther33() {
  const tbody = document.querySelector('#tableOther33 tbody');
  tbody.innerHTML = '';
  table33Body.querySelectorAll('tr').forEach((r, i) => {
    const tr = document.createElement('tr');

    // Sl. No.
    const td0 = document.createElement('td');
    td0.textContent = i + 1;
    tr.appendChild(td0);

    // 33KV Panel Name
    const td1 = document.createElement('td');
    td1.textContent = r.cells[1].querySelector('input').value;
    tr.appendChild(td1);

    // Observations column
    const td2 = document.createElement('td');

    const categorySelect = document.createElement('select');
    const itemSelect = document.createElement('select');

    const categories = {
      'Heater': [
        'No Heater found', 'Heater is to be checked', 'Heater Defective',
        'Breaker Chamber Heater Defective', 'Cable Chamber Heater Defective',
        '1 no. Heater Defective', '2 nos. Heater Defective', 'All Heaters defective',
        'Heater Ckt. Short-Ckt.', 'Heater Ammeter Defective', 'Heater Toggle Switch Defective',
        'Thermostat Problem'
      ],
      'Phase Ammeter': [
        'R-Ph Ammeter Defective', 'Y-Ph Ammeter Defective', 'B-Ph Ammeter Defective',
        'All Ammeters Defective', 'R-Ph Ammeter Display Problem',
        'Y-Ph Ammeter Display Problem', 'B-Ph Ammeter Display Problem',
        'All Ammeters Display Problem'
      ],
      'Voltmeter': ['Voltmeter Defective', 'Voltmeter Display Problem'],
      'PT': ['PT Out of Circuit', 'PT Missing'],
      'Relay': [
        'Differential Relay Healthy LED not glowing', 'O/C E/F Relay Healthy LED not glowing','Trip Ckt. Unhealthy Indication on relay', 'Relay Display Out',
        'Replay Display Problem', 'HMI Key Defective', 'Clear button of relay defective',
        'O/C E/F Relay Missing', 'Differential Relay Missing'
      ],
      'Annunciator': ['Annunciator Defective', 'Trip Ckt. Unhealthy Showing', 'Hooter not working'],
      'Panel': [
        'Front Door not closing properly', 'Rear Cover not closing properly', 'TNC Switch Broken', 'TNC Switch Defective',
        'Breaker ON indication not glowing' 
      ],

      'Sunlight': ['Sunlight on Breaker Chamber', 'Sunlight on rear Bus Chamber', 'Sunlight on CT/Cable Chamber', 'Sunlight on rear Bus & CT/Cable Chamber']
    };

    categorySelect.innerHTML = `<option value="" disabled selected hidden></option>`;
    Object.keys(categories).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = cat;
      categorySelect.appendChild(opt);
    });

    itemSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
    categorySelect.addEventListener('change', () => {
      const selected = categorySelect.value;
      itemSelect.innerHTML = `<option value="" disabled selected hidden></option>`;
      categories[selected].forEach(val => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = val;
        itemSelect.appendChild(opt);
      });
    });

    const btn = document.createElement('button');
    btn.textContent = 'Add';
    btn.className = 'section-btn';
    btn.style.fontSize = '0.7rem';
    btn.style.padding = '4px 6px';
    btn.style.marginLeft = '0.5rem';
    btn.style.flex = 'none';

    
btn.addEventListener('click', () => {
  const item = itemSelect.value;
  const panelName = r.cells[1].querySelector('input').value.trim();
  if (!panelName) return alert('Enter Panel Name first');

  const actionsMap = {
    'No Heater found': 'No heater found. Install new heater.',    
    'Heater is to be checked': 'Check Heaters.',
    'Heater Defective': 'Heater def. Check & rectify.',
    'Breaker Chamber Heater Defective': 'VCB Chamber heater def. Check & rectify.',
    'Cable Chamber Heater Defective': 'Cable/CT Chamber heater def. Check & rectify.',
    '1 no. Heater Defective': '01 heater def. Check & rectify.',
    '2 nos. Heater Defective': '02 heaters def. Check & rectify.',
    'All Heaters defective': 'All heaters def. Check & rectify.',
    'Heater Ckt. Short-Ckt.': 'Heater circuits found short circuited. Rectify.',
    'Heater Ammeter Defective': 'Heater Ammeter def. Rectify.',
    'Heater Toggle Switch Defective': 'Heater Toggle Switch def. Rectify.',
    'Thermostat Problem': 'Problem in thermostat. Rectify & set b/w 40’C to 45’C.',
    'R-Ph Ammeter Defective': 'R-Ph Ammeter def. Rectify.',
    'Y-Ph Ammeter Defective': 'Y-Ph Ammeter def. Rectify.',
    'B-Ph Ammeter Defective': 'B-Ph Ammeter def. Rectify.',
    'All Ammeters Defective': 'All Ph Ammeters Def. Rectify.',
    'R-Ph Ammeter Display Problem': 'R-Phase Ammeter display def. Rectify.',
    'Y-Ph Ammeter Display Problem': 'Y-Phase Ammeter display def. Rectify.',
    'B-Ph Ammeter Display Problem': 'B-Phase Ammeter display def. Rectify.',
    'All Ammeters Display Problem': 'All Phase Ammeter display def. Rectify.',
    'Voltmeter Defective': 'Voltmeter def. Rectify.',
    'Voltmeter Display Problem': 'Voltmeter display def. Rectify.',
    'PT Out of Circuit': 'PT out of ckt. Rectify.',
    'PT Missing': 'PT missing. Rectify.',
    'Differential Relay Healthy LED not glowing': '"Relay Healthy" LED not glowing on O/C E/F Relay. Immediately rectify.',
    'O/C E/F Relay Healthy LED not glowing': '"Relay Healthy" LED was not glowing on the O/C E/F Relay. Immediate necessary action is to be taken.',
    'Trip Ckt. Unhealthy Indication on relay': '"TCS Unhealthy" on Relay. Immediately rectify.',
    'Relay Display Out': 'Relay display out. Rectify.',
    'Replay Display Problem': 'O/C E/F Relay display def. Rectify.',
    'HMI Key Defective': 'O/C E/F Relay HMI Key def. Rectify.',
    'Clear button of relay defective': 'O/C E/F Relay Clear button def. Rectify.',
    'Differential Relay Missing': 'Differential Relay missing. Immediately install.',
    'O/C E/F Relay Missing': 'O/C E/F Relay missing. Immediately install.',
    'Annunciator Defective': 'Annunciator def. Rectify.',
    'Trip Ckt. Unhealthy Showing': '"Trip Ckt. Unhealthy" showing on Annunciator. Immediately rectify.',
    'Hooter not working':'Hooter def. Rectify.',
    'Front Door not closing properly': 'Panel Front door not closing properly. Rectify.',
    'Rear Cover not closing properly': 'Panel rear cover not closing properly. Rectify.',
    'TNC Switch Broken': 'TNC Switch broken. Immediately rectify.',
    'TNC Switch Defective': 'TNC Switch def. Immediately rectify.',
    'Breaker ON indication not glowing': 'Breaker ON indication not glowing. Immediately rectify.',
    'Sunlight on Breaker Chamber': '<b>Note:</b>sunlight on VCB.',
    'Sunlight on rear Bus Chamber': '<b>Note:</b>sunlight on rear bus.',
    'Sunlight on CT/Cable Chamber': '<b>Note:</b>sunlight on CT/Cable chamber.',
    'Sunlight on rear Bus & CT/Cable Chamber': '<b>Note:</b>sunlight on rear Bus & CT/Cable chamber.'


  };

  const actionText = actionsMap[item];
  if (!actionText) return;

  const liveRows = [...document.querySelectorAll('#liveTable tbody tr')];
  const row = liveRows.find(row =>
  row.getAttribute('data-kv') === '33' &&
  row.cells[1]?.textContent?.trim() === panelName
);


  if (!row) return alert('Panel not found in Live Table');

  const td = row.querySelector('td:last-child');

// Store the new manual action, then rebuild the live table so it appears
otherActionsStore['33'][panelName] = otherActionsStore['33'][panelName] || [];
if (otherActionsStore['33'][panelName].includes(actionText)) {
  return alert('This action has already been added for this panel.');
}
otherActionsStore['33'][panelName].push(actionText);
populateLiveTable();

localStorage.setItem(
  'otherActionsStore',
  JSON.stringify(otherActionsStore)
);



});



    // Manual-entry field
    const manualInput = document.createElement('input');
    manualInput.type = 'text';
    manualInput.placeholder = 'Other';
    manualInput.style.marginTop = '0.5rem';
    manualInput.style.width = '70%';


    // “Add” button for manual entry
    const btn2 = document.createElement('button');
    btn2.textContent = 'Add';
    btn2.className = 'section-btn';
    btn2.style.marginLeft = '0.5rem';
    btn2.style.fontSize = '0.7rem';
    btn2.style.padding = '4px 6px';


    // ── NEW: handle manual “Add” for 33 kV panels ──
    btn2.addEventListener('click', () => {
      const text      = manualInput.value.trim();
      const panelName = r.cells[1].querySelector('input').value.trim();
      if (!panelName) return alert('Enter Panel Name first');
      if (!text)      return alert('Enter observation');
      otherActionsStore['33'][panelName] = otherActionsStore['33'][panelName] || [];
      if (otherActionsStore['33'][panelName].includes(text)) {
        return alert('This action has already been added for this panel.');
      }
      otherActionsStore['33'][panelName].push(text);
      manualInput.value = '';
      populateLiveTable();

localStorage.setItem(
  'otherActionsStore',
  JSON.stringify(otherActionsStore)
);

    });





    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.style.display = 'flex';
    dropdownWrapper.style.flexWrap = 'nowrap';
    dropdownWrapper.style.gap = '0.5rem';
    dropdownWrapper.style.alignItems = 'center';
    dropdownWrapper.style.marginBottom = '0.5rem';

    [categorySelect, itemSelect].forEach(el => {
      el.style.fontSize = '0.7rem';
      el.style.padding = '4px 6px';
      el.style.flex = '1';
    });

    dropdownWrapper.appendChild(categorySelect);
    dropdownWrapper.appendChild(itemSelect);
    dropdownWrapper.appendChild(btn);

    td2.appendChild(dropdownWrapper);
    td2.appendChild(manualInput);
    td2.appendChild(btn2);

    tr.appendChild(td2);
    tbody.appendChild(tr);
  });
}



// 11KV live-sync
table11Body.addEventListener('input', () => {
  if (
    document.getElementById('other').classList.contains('active') &&
    document.querySelector('#other .sub-tab-btn.active[data-sub="oth11"]')
  ) populateOther11();
});
table11Body.addEventListener('change', () => {
  if (
    document.getElementById('other').classList.contains('active') &&
    document.querySelector('#other .sub-tab-btn.active[data-sub="oth11"]')
  ) populateOther11();
});
// 33KV live-sync
table33Body.addEventListener('input', () => {
  if (
    document.getElementById('other').classList.contains('active') &&
    document.querySelector('#other .sub-tab-btn.active[data-sub="oth33"]')
  ) populateOther33();
});
table33Body.addEventListener('change', () => {
  if (
    document.getElementById('other').classList.contains('active') &&
    document.querySelector('#other .sub-tab-btn.active[data-sub="oth33"]')
  ) populateOther33();
});

// ==== wire up nested sub-tabs under #other with first-click guard ====
const otherSection = document.getElementById('other');
const otherInit    = { oth11: true, oth33: true };

otherSection.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // highlight the clicked sub-tab
    otherSection.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // show only its pane
    otherSection.querySelectorAll('.sub-section').forEach(sec => sec.classList.remove('active'));
    otherSection.querySelector('#' + btn.dataset.sub).classList.add('active');

    // populate only on first click
    if (btn.dataset.sub === 'oth11' && otherInit.oth11) {
      populateOther11();
      otherInit.oth11 = false;
    } else if (btn.dataset.sub === 'oth33' && otherInit.oth33) {
      populateOther33();
      otherInit.oth33 = false;
    }
  });
});



  // ─────────── LIVE-TABLE SYNC ───────────
  const liveTbody = document.querySelector('#liveTable tbody');

 function populateLiveTable() {
  liveTbody.innerHTML = '';  
  const COL_COUNT = 22;

  function buildPanelRow(r, is11KV) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-kv', is11KV ? '11' : '33');
    // mark panel rows for Word CSS
    tr.classList.add(is11KV ? 'kv-11' : 'kv-33');

const values = [
  r.index + 1,
  r.cells[1].querySelector('input').value,
  r.cells[2].querySelector('select').value
];
values.forEach(txt => {
  const td = document.createElement('td');
  td.textContent = txt;
  tr.appendChild(td);
});

    const tableId = is11KV ? '11' : '33';

    const tevRows = document.querySelectorAll(`#tableTEV${tableId} tbody tr`);
    const tevRow = tevRows[r.index] || null;
[4, 5, 6, 7, 8, 9].forEach(colIdx => {
  const td = document.createElement('td');
  if (tevRow) {
    const val = tevRow.cells[colIdx].querySelector('input')?.value;
    td.textContent = val ? val : '---';
  } else {
    td.textContent = '---';


// ── make all live-table cells editable ──
document.querySelectorAll('#liveTable tbody td').forEach(td => {
  td.setAttribute('contenteditable', 'true');
});




  }

  tr.appendChild(td);
});



const loadTd = document.createElement('td');
loadTd.textContent = r.cells[3].querySelector('input').value || '---';
tr.appendChild(loadTd);





    const tempRows = document.querySelectorAll(`#tableTemp${tableId} tbody tr`);
    const tempRow  = tempRows[r.index] || null;
    [4,5,6,7,8].forEach(colIdx => {
      const td = document.createElement('td');
      if (tempRow) {
        // grab the numeric input and its “H” checkbox
        const inp   = tempRow.cells[colIdx].querySelector('input[type="number"]');
        const check = tempRow.cells[colIdx].querySelector('input[type="checkbox"]');
        const val   = inp.value ? inp.value : '---';
        // always set the text
        td.textContent = val;
        // if “H” is checked AND there’s a value, make it bold
        if (check && check.checked && inp.value) {
          td.style.fontWeight = 'bold';
        }
      } else {
        td.textContent = '---';
      }
      tr.appendChild(td);
    });


    const usRows = document.querySelectorAll(`#tableUltrasound${tableId} tbody tr`);
    const usRow = usRows[r.index] || null;
for (let colIdx = 4; colIdx <= 9; colIdx++) {
  const td = document.createElement('td');
  if (usRow) {
    const val = usRow.cells[colIdx].querySelector('input')?.value;
    const cls = usRow.cells[colIdx].querySelector('select')?.value;
    if (val) {
      td.textContent = `${val} dB${cls ? ` (${cls})` : ''}`;
    } else {
      td.textContent = '---';
    }
  } else {
    td.textContent = '---';
  }
  tr.appendChild(td);
}


// Action to be Taken logic inside populateLiveTable() :

const actionTd = document.createElement('td');
let actions = [];

if (tempRow) {
  const f1H = tempRow.cells[4].querySelector('input[type="checkbox"]').checked;
  const b1H = tempRow.cells[5].querySelector('input[type="checkbox"]').checked;
  const b2H = tempRow.cells[6].querySelector('input[type="checkbox"]').checked;
  const b2Val = tempRow.cells[6].querySelector('input[type="number"]').value;

  if (f1H) {
    actions.push("HS at VCB. Check M-F contact. Tighten brkr. spouts, other junctions. Check IR of VI.");
  }
  if (b1H && !b2Val) {
    actions.push("HS at rear Bus Sec/CT/Cable chamber. Check/tighten bus cont. point, bus spout, bus support insulators, CT/Cable cont. points & nutbolts. Do cleaning & maintenance.");
  }
  if (b1H && b2Val) {
    actions.push("HS at rear bus sec. Check/tighten bus contacts, spouts & support inslrs.");
  }
  if (b2H) {
    actions.push("HS at CT/Cable chamber. Tighten CT/Cable contact points & nutbolts. Do cleaning & maintenance.");
  }
// ── Add S1/S2 and PT “H” logic ──
const s12H = tempRow.cells[7]
                 .querySelector('input[type="checkbox"]')
                 .checked;
if (s12H) {
  actions.push(
    "HS at side bus sec. Check bus chambers, bus spouts & bus support insulators. Do Bus Cleaning & maintenance. Check M-F contacts b/w Bus & VCB of the adjacent panel. "
  );
}

const ptH = tempRow.cells[8]
               .querySelector('input[type=\"checkbox\"]')
               .checked;
if (ptH) {
  actions.push(
    "HS at PT. Do PT maintenance. Check all PT terminals, lugs & busbar connections."
  );
}

}

// NEW: Ultrasound-based Action logic
if (usRow) {
  const f1Val = usRow.cells[4].querySelector('input')?.value;
  const b1Val = usRow.cells[5].querySelector('input')?.value;
  const b2Val = usRow.cells[6].querySelector('input')?.value;
  const ptVal = usRow.cells[7].querySelector('input')?.value;
  const s1Val = usRow.cells[8].querySelector('input')?.value;
  const s2Val = usRow.cells[9].querySelector('input')?.value;

  const tempB2Val = tempRow?.cells[6].querySelector('input[type="number"]')?.value;

  if (f1Val) {
    actions.push("PD at VCB. Do cleaning & maintenance. Check breaker alignment. Check IR of VI.");
  }

  if (b1Val && b2Val) {
    actions.push("PD at rear Bus Sec. Check bus chambers, bus spouts & bus support insulators. Do Cleaning & maintenance.");
    actions.push("PD at CT/Cable Chamber. Do CT/Cable chamber maintenance. Check Bus & CT spouts. Check cable lead clearance b/w ph and ph-earth.");
  } 

  else if (b1Val && !tempB2Val) {
    actions.push("PD at rear side of Bus Sec/CT/Cable Chamber. Do Cleaning & maintenance of Bus, CT/Cable Chamber.  Check Bus & CT spouts. Check cable lead clearance b/w ph and ph-earth.");
  }  

  else if (b1Val && tempB2Val && !b2Val) {
    actions.push("PD at rear Bus Section. Check bus chambers, bus spouts & bus support insulators. Do Cleaning & maintenance.");
  }  
  
  else if (!b1Val && b2Val) {
    actions.push("PD at CT/Cable Chamber. Do CT/Cable chamber maintenance. Check Bus & CT spouts. Check cable lead clearance b/w ph and ph-earth.");
  }

  if (ptVal) {
    actions.push("PD at PT. Do PT maintenance. Check PT alignment.");
  }

  if (s1Val || s2Val) {
    actions.push("PD at Side Bus Section. Do Side Bus Section maintenance.");
  }


}


// Roman numeral generator
const toRoman = (num) => {
  const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  return romans[num - 1] || num;
};

// Merge automated (TEV/Temp/US) + manual (Other) actions
const kv        = is11KV ? '11' : '33';
const panelName = r.cells[1].querySelector('input').value.trim();

const manual = otherActionsStore[kv][panelName] || [];

let allActions = [...actions, ...manual];

// Keep any "Note: The higher temp...." lines always at the bottom
const isNoteLine = (txt) => {
  const raw = (txt || '').trim();
  const plain = raw.replace(/<[^>]*>/g, '').trim(); // remove HTML tags like <b>...</b>
  return /^Note:\s*The higher temp\./i.test(plain);
};

const notes = allActions.filter(t => isNoteLine(t));
allActions = allActions.filter(t => !isNoteLine(t)).concat(notes);

if (allActions.length > 0) {
  let serial = 0;
  actionTd.innerHTML = allActions.map((txt) => {
    const isNote = isNoteLine(txt);
    if (!isNote) serial++;

    return `<div style="font-size:0.6rem; text-align:left;">` +
           (isNote ? `${txt}` : `<b>${toRoman(serial)}.</b> ${txt}`) +
           `</div>`;
  }).join('');
} else {
  actionTd.textContent = '';
}




tr.appendChild(actionTd);



    return tr;
  }

  const header11 = document.createElement('tr');
  header11.classList.add('kv-header'); 
  const td11 = document.createElement('td');
  td11.colSpan = COL_COUNT;
  td11.textContent = '11KV Panels';
  td11.style.fontWeight = 'bold';
  td11.style.textAlign = 'center';
  header11.appendChild(td11);
  liveTbody.appendChild(header11);

  table11Body.querySelectorAll('tr').forEach((r, i) => {
    r.index = i;
    liveTbody.appendChild(buildPanelRow(r, true));
  });

  const rows33 = table33Body.querySelectorAll('tr');
  if (rows33.length) {
    const header33 = document.createElement('tr');
    header33.classList.add('kv-header');  
    const td33 = document.createElement('td');
    td33.colSpan = COL_COUNT;
    td33.textContent = '33KV Panels';
    td33.style.fontWeight = 'bold';
    td33.style.textAlign = 'center';
    header33.appendChild(td33);
    liveTbody.appendChild(header33);

    rows33.forEach((r, i) => {
      r.index = i;
      liveTbody.appendChild(buildPanelRow(r, false));
    });
  }



const infoTable = document.querySelector('#infoTable');
if (infoTable) {
  // Get values from localStorage
  const zone = localStorage.getItem("selectedZone") || '';
  const region = localStorage.getItem("selectedRegion") || '';
  const division = localStorage.getItem("selectedDivision") || '';
  const substation = localStorage.getItem("selectedSubstation") || '';
  const date = localStorage.getItem("inspectionDate") || '';
  // Use latest saved ambient temp (prefer 11KV, fallback to 33KV, then old key)
const amb11 = JSON.parse(localStorage.getItem('ambientTemp11Data') || '[]');
const amb33 = JSON.parse(localStorage.getItem('ambientTemp33Data') || '[]');

let ambient = '';
if (amb11.length) ambient = amb11[amb11.length - 1];
else if (amb33.length) ambient = amb33[amb33.length - 1];
else ambient = localStorage.getItem("ambientTemp") || '';

if (ambient !== '' && !String(ambient).includes('℃')) ambient = `${ambient}℃`;


  // Fill the cells using IDs
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };
  setText("infoZone", zone);
  setText("infoRegion", region);
  setText("infoDivision", division);
  setText("infoSubstation", substation);
  setText("infoInspectionDate", date);
  setText("infoAmbientTemp", ambient);

  // Save updated table to localStorage
  localStorage.setItem('infoTableHTML', infoTable.outerHTML);
}



}


  // fire on any change in your Panel-Load tables:
  ['input','change'].forEach(evt => {
    table11Body.addEventListener(evt, populateLiveTable);
    table33Body.addEventListener(evt, populateLiveTable);
  });



// fire on any change in your Temperature tables:
document.querySelector('#tableTemp11 tbody').addEventListener('input', populateLiveTable);
document.querySelector('#tableTemp11 tbody').addEventListener('change', populateLiveTable);

document.querySelector('#tableTemp33 tbody').addEventListener('input', populateLiveTable);
document.querySelector('#tableTemp33 tbody').addEventListener('change', populateLiveTable);

// fire on any change in your Ultrasound tables:
document.querySelector('#tableUltrasound11 tbody').addEventListener('input', populateLiveTable);
document.querySelector('#tableUltrasound11 tbody').addEventListener('change', populateLiveTable);

document.querySelector('#tableUltrasound33 tbody').addEventListener('input', populateLiveTable);
document.querySelector('#tableUltrasound33 tbody').addEventListener('change', populateLiveTable);

// fire on any change in your TEV tables:
document.querySelector('#tableTEV11 tbody').addEventListener('input', populateLiveTable);
document.querySelector('#tableTEV11 tbody').addEventListener('change', populateLiveTable);

document.querySelector('#tableTEV33 tbody').addEventListener('input', populateLiveTable);
document.querySelector('#tableTEV33 tbody').addEventListener('change', populateLiveTable);





  // ── Load saved Panel Name & Load data ──
  (function loadPanelData() {
    const saved11 = JSON.parse(localStorage.getItem('pan11Data') || '[]');
    if (saved11.length) {
      table11Body.innerHTML = '';
      saved11.forEach((item, idx) => {
        const tr = row11Template.cloneNode(true);
        tr.cells[0].textContent = idx + 1;
        tr.cells[1].querySelector('input').value = item.panelName;
        tr.cells[2].querySelector('select').value = item.vcbState;
        tr.cells[3].querySelector('input').value = item.load;
        table11Body.appendChild(tr);
      });
    }
    const saved33 = JSON.parse(localStorage.getItem('pan33Data') || '[]');
    if (saved33.length) {
      table33Body.innerHTML = '';
      saved33.forEach((item, idx) => {
        const tr = row33Template.cloneNode(true);
        tr.cells[0].textContent = idx + 1;
        tr.cells[1].querySelector('input').value = item.panelName;
        tr.cells[2].querySelector('select').value = item.vcbState;
        tr.cells[3].querySelector('input').value = item.load;
        table33Body.appendChild(tr);
      });
    }
  })();










  // initial render
  // hydrate TEV & Temp tables once on load
populateTEV11();
populateTEV33();
populateTemp11();
populateTemp33();
populateUS11();
populateUS33();


// ─── TEV-REFERENCES UPDATE FUNCTIONS ───

// Helper: show/hide + populate the 11KV TEV-refs section
function updateTEVRefs11() {
  // grab the “extra” TEV inputs
  const airRow   = document.querySelector('#tableTEV11Extra tbody tr:nth-child(1)');
  const metalRow = document.querySelector('#tableTEV11Extra tbody tr:nth-child(2)');

  const vals = {
    'air-pfsl':  airRow.querySelector('td:nth-child(2) input').value,
    'air-pfsr':  airRow.querySelector('td:nth-child(3) input').value,
    'air-pbsl':  airRow.querySelector('td:nth-child(4) input').value,
    'air-pbsr':  airRow.querySelector('td:nth-child(5) input').value,
    'metal-pfsl': metalRow.querySelector('td:nth-child(2) input').value,
    'metal-pfsr': metalRow.querySelector('td:nth-child(3) input').value,
    'metal-pbsl': metalRow.querySelector('td:nth-child(4) input').value,
    'metal-pbsr': metalRow.querySelector('td:nth-child(5) input').value
  };

  // check if any value is non-empty
  const any = Object.values(vals).some(v => v !== '');

  const section = document.getElementById('tevRefs11Section');
  if (!any) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  // fill each cell (add “ dB” if there's a number)
  Object.entries(vals).forEach(([key, v]) => {
    const el = document.getElementById(`tev11-${key}`);
    el.textContent = v ? `${v} dB` : '---';
  });
}

// ...and exactly the same for 33KV:
function updateTEVRefs33() {
  const airRow   = document.querySelector('#tableTEV33Extra tbody tr:nth-child(1)');
  const metalRow = document.querySelector('#tableTEV33Extra tbody tr:nth-child(2)');

  const vals = {
    'air-pfsl':  airRow.querySelector('td:nth-child(2) input').value,
    'air-pfsr':  airRow.querySelector('td:nth-child(3) input').value,
    'air-pbsl':  airRow.querySelector('td:nth-child(4) input').value,
    'air-pbsr':  airRow.querySelector('td:nth-child(5) input').value,
    'metal-pfsl': metalRow.querySelector('td:nth-child(2) input').value,
    'metal-pfsr': metalRow.querySelector('td:nth-child(3) input').value,
    'metal-pbsl': metalRow.querySelector('td:nth-child(4) input').value,
    'metal-pbsr': metalRow.querySelector('td:nth-child(5) input').value
  };

  const any = Object.values(vals).some(v => v !== '');
  const section = document.getElementById('tevRefs33Section');
  if (!any) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  Object.entries(vals).forEach(([key, v]) => {
    const el = document.getElementById(`tev33-${key}`);
    el.textContent = v ? `${v} dB` : '---';
  });
}

// Wire these up to fire any time the “extra” TEV inputs change
['input','change'].forEach(evt => {
  document.getElementById('tableTEV11Extra').addEventListener(evt, updateTEVRefs11);
  document.getElementById('tableTEV33Extra').addEventListener(evt, updateTEVRefs33);
});

// And do an initial render on page-load
updateTEVRefs11();
updateTEVRefs33();

// ── Persist extra‐TEV inputs to localStorage ──
['input','change'].forEach(evt => {
  document.getElementById('tableTEV11Extra').addEventListener(evt, () => {
    const data11 = [...document.querySelectorAll('#tableTEV11Extra tbody tr')]
      .map(row => [...row.querySelectorAll('input')].map(i => i.value));
    localStorage.setItem('tev11ExtraData', JSON.stringify(data11));
    updateTEVRefs11();
  });
  document.getElementById('tableTEV33Extra').addEventListener(evt, () => {
    const data33 = [...document.querySelectorAll('#tableTEV33Extra tbody tr')]
      .map(row => [...row.querySelectorAll('input')].map(i => i.value));
    localStorage.setItem('tev33ExtraData', JSON.stringify(data33));
    updateTEVRefs33();
  });
});








  // ── Load saved TEV data ──
  (function loadTEVData() {
    const rows11 = document.querySelectorAll('#tableTEV11 tbody tr');
    JSON.parse(localStorage.getItem('tev11Data') || '[]')
      .forEach((item, i) => {
        const r = rows11[i];
        if (!r) return;
        r.cells[4].querySelector('input').value = item.tf1;
        r.cells[5].querySelector('input').value = item.tb1;
        r.cells[6].querySelector('input').value = item.tb2;
        r.cells[7].querySelector('input').value = item.tpt;
        r.cells[8].querySelector('input').value = item.ts1;
        r.cells[9].querySelector('input').value = item.ts2;
      });

    const rows33 = document.querySelectorAll('#tableTEV33 tbody tr');
    JSON.parse(localStorage.getItem('tev33Data') || '[]')
      .forEach((item, i) => {
        const r = rows33[i];
        if (!r) return;
        r.cells[4].querySelector('input').value = item.tf1;
        r.cells[5].querySelector('input').value = item.tb1;
        r.cells[6].querySelector('input').value = item.tb2;
        r.cells[7].querySelector('input').value = item.tpt;
        r.cells[8].querySelector('input').value = item.ts1;
        r.cells[9].querySelector('input').value = item.ts2;
      });
  })();

// ── Load persisted extra‐TEV inputs and re-render references ──
(function loadExtraTEVData() {
  const saved11 = JSON.parse(localStorage.getItem('tev11ExtraData') || 'null');
  if (saved11) {
    document.querySelectorAll('#tableTEV11Extra tbody tr').forEach((row, i) => {
      saved11[i]?.forEach((val, j) => {
        const inp = row.cells[j+1].querySelector('input');
        if (inp) inp.value = val;
      });
    });
  }
  const saved33 = JSON.parse(localStorage.getItem('tev33ExtraData') || 'null');
  if (saved33) {
    document.querySelectorAll('#tableTEV33Extra tbody tr').forEach((row, i) => {
      saved33[i]?.forEach((val, j) => {
        const inp = row.cells[j+1].querySelector('input');
        if (inp) inp.value = val;
      });
    });
  }
  // now update the visible TEV‐Refs sections
  updateTEVRefs11();
  updateTEVRefs33();
})();


  // ── Load saved Temperature data ──
  (function loadTempData() {
    const t11 = document.querySelectorAll('#tableTemp11 tbody tr');
    JSON.parse(localStorage.getItem('temp11Data') || '[]')
      .forEach((item, i) => {
        const r = t11[i];
        if (!r) return;
        r.cells[4].querySelector('input').value = item.f1;
        r.cells[4].querySelector('input[type="checkbox"]').checked = !!item.f1H;
        r.cells[5].querySelector('input').value = item.b1;
        r.cells[5].querySelector('input[type="checkbox"]').checked = !!item.b1H;
        r.cells[6].querySelector('input').value = item.b2;
        r.cells[6].querySelector('input[type="checkbox"]').checked = !!item.b2H;
        r.cells[7].querySelector('input').value                    = item.s1s2;
        r.cells[7].querySelector('input[type="checkbox"]').checked = !!item.s1s2H;
        r.cells[8].querySelector('input').value                    = item.pt;
        r.cells[8].querySelector('input[type="checkbox"]').checked = !!item.ptH;
      });

    const t33 = document.querySelectorAll('#tableTemp33 tbody tr');
    JSON.parse(localStorage.getItem('temp33Data') || '[]')
      .forEach((item, i) => {
        const r = t33[i];
        if (!r) return;
      r.cells[4].querySelector('input').value = item.f1;
      r.cells[4].querySelector('input[type="checkbox"]').checked = !!item.f1H;
      r.cells[5].querySelector('input').value = item.b1;
      r.cells[5].querySelector('input[type="checkbox"]').checked = !!item.b1H;
      r.cells[6].querySelector('input').value = item.b2;
      r.cells[6].querySelector('input[type="checkbox"]').checked = !!item.b2H;
      r.cells[7].querySelector('input').value                    = item.s1s2;
      r.cells[7].querySelector('input[type="checkbox"]').checked = !!item.s1s2H;
      r.cells[8].querySelector('input').value                    = item.pt;
      r.cells[8].querySelector('input[type="checkbox"]').checked = !!item.ptH;
      });
  })();




// ── Load saved Ultrasound data ──
(function loadUSData() {
  const saved11 = JSON.parse(localStorage.getItem('us11Data') || '[]');
  document.querySelectorAll('#tableUltrasound11 tbody tr').forEach((r,i) => {
    const item = saved11[i];
    if (!item) return;
    item.readings.forEach((rd,j) => {
      r.cells[j+4].querySelector('input').value  = rd.val;
      r.cells[j+4].querySelector('select').value = rd.sel;
    });
  });
  const saved33 = JSON.parse(localStorage.getItem('us33Data') || '[]');
  document.querySelectorAll('#tableUltrasound33 tbody tr').forEach((r,i) => {
    const item = saved33[i];
    if (!item) return;
    item.readings.forEach((rd,j) => {
      r.cells[j+4].querySelector('input').value  = rd.val;
      r.cells[j+4].querySelector('select').value = rd.sel;
    });
  });
})();


// ── Load saved Battery & Battery Charger data ──
(function loadBatData() {
  const savedBat11 = JSON.parse(localStorage.getItem('bat11Data') || 'null');
  if (savedBat11) {
    // voltage
    document.getElementById('bat11VoltageOn').value = savedBat11.voltage.acOn;
    document.getElementById('bat11VoltageOff').value = savedBat11.voltage.acOff;
    document.getElementById('bat11VoltageOnProblem').checked  = savedBat11.voltage.problemOn;
    document.getElementById('bat11VoltageOffProblem').checked = savedBat11.voltage.problemOff;
    // cell voltage
    document.getElementById('bat11CellVoltage').value = savedBat11.cellVoltage;
    // general-findings checkboxes
    document.querySelectorAll('#bat11 input[name="bat11GenFindings"]').forEach(cb => {
      cb.checked = savedBat11.generalFindings.includes(cb.value);
    });
    // “Other” remark
    document.getElementById('bat11GenFindingsOther').value = savedBat11.otherRemarks;
  }

  const savedBat33 = JSON.parse(localStorage.getItem('bat33Data') || 'null');
  if (savedBat33) {
    document.getElementById('bat33VoltageOn').value = savedBat33.voltage.acOn;
    document.getElementById('bat33VoltageOff').value = savedBat33.voltage.acOff;
    document.getElementById('bat33VoltageOnProblem').checked  = savedBat33.voltage.problemOn;
    document.getElementById('bat33VoltageOffProblem').checked = savedBat33.voltage.problemOff;
    document.getElementById('bat33CellVoltage').value = savedBat33.cellVoltage;
    document.querySelectorAll('#bat33 input[name="bat33GenFindings"]').forEach(cb => {
      cb.checked = savedBat33.generalFindings.includes(cb.value);
    });
    document.getElementById('bat33GenFindingsOther').value = savedBat33.otherRemarks;
  }

  // rebuild actions & live table now that our inputs are back
  recalcBatActions();
  populateLiveTable();
  localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
})();






// ── 33KV CRP Observations UI wiring ──
const crpPTRSelect       = document.getElementById('crpPTRSelect');
const crpPTROther        = document.getElementById('crpPTROther');
const crpDeviceTypeSelect= document.getElementById('crpDeviceTypeSelect');
const crpIssueSelect     = document.getElementById('crpIssueSelect');

// Show/hide the "Other PTR" field
crpPTRSelect.addEventListener('change', () => {
  if (crpPTRSelect.value === 'Other') {
    crpPTROther.style.display = 'block';
  } else {
    crpPTROther.style.display = 'none';
    crpPTROther.value = '';
  }
});

// Build the issue-list based on device type
const crpIssueOptions = {
  'Phase Ammeter': [
    'R-Ph Ammeter Defective', 'Y-Ph Ammeter Defective',
    'B-Ph Ammeter Defective','All Ammeters Defective',
    'R-Ph Ammeter Display Problem','Y-Ph Ammeter Display Problem',
    'B-Ph Ammeter Display Problem','All Ammeters Display Problem'
  ],
  'Voltmeter': ['Voltmeter Defective','Voltmeter Display Problem'],
  'Relay': [
    'Differential Relay Healthy LED not glowing','O/C E/F Relay Healthy LED not glowing',
    'Trip Ckt. Unhealthy Indication on relay',
    'Differential Relay Display Out', 'O/C E/F Relay Display Out', 'Differential Relay Display Problem', 'O/C E/F Relay Display Problem',
    'Differential Relay HMI Key Defective','O/C E/F Relay HMI Key Defective','Clear button of Differential Relay defective','Clear button of O/C E/F Relay defective',
    'Differential Relay Missing', 'O/C E/F Relay Missing'
  ],
  'Annunciator': ['Annunciator Defective','Trip Ckt. Unhealthy Showing','Hooter not working'],
  'Panel': ['TNC Switch Broken','TNC Switch Defective','Breaker ON indication not glowing']
};

crpDeviceTypeSelect.addEventListener('change', () => {
  crpIssueSelect.innerHTML = '<option value="" disabled selected hidden></option>';
  (crpIssueOptions[crpDeviceTypeSelect.value]||[])
    .forEach(text => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = text;
      crpIssueSelect.appendChild(opt);
    });
});

// ── 33KV CRP Observations UI wiring ──
// Show/hide the "Other PTR" field (unchanged)
crpPTRSelect.addEventListener('change', () => {
  if (crpPTRSelect.value === 'Other') {
    crpPTROther.style.display = 'block';
  } else {
    crpPTROther.style.display = 'none';
    crpPTROther.value = '';
  }
});

// Handler for the CRP “Add” button: map each issue to the exact action text
document.getElementById('addCRPBtn').addEventListener('click', () => {
  const ptr   = crpPTRSelect.value === 'Other'
                ? crpPTROther.value.trim()
                : crpPTRSelect.value;
  const issue = crpIssueSelect.value;
  if (!ptr)   return alert('Select or enter PTR');
  if (!issue) return alert('Select issue');

  let actionText = '';
  switch (issue) {
// Ammeter    
    case 'R-Ph Ammeter Defective':
      actionText = `R-Ph Ammeter was found to be defective of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'Y-Ph Ammeter Defective':
      actionText = `Y-Ph Ammeter was found to be defective of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'B-Ph Ammeter Defective':
      actionText = `B-Ph Ammeter was found to be defective of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'All Ammeters Defective':
      actionText = `All Ammeters were found to be defective of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'R-Ph Ammeter Display Problem':
      actionText = `Display Problem was noticed on the R-Ph Ammeter of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'Y-Ph Ammeter Display Problem':
      actionText = `Display Problem was noticed on the Y-Ph Ammeter of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'B-Ph Ammeter Display Problem':
      actionText = `Display Problem was noticed on the B-Ph Ammeter of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
    case 'All Ammeters Display Problem':
      actionText = `Display Problem was noticed on all the ammeters of the ${ptr} CRP. Necessary action is to be taken.`;
      break;
// Voltmeter
  case 'Voltmeter Defective':
    actionText = `Voltmeter was found to be defective of the ${ptr} CRP. Necessary action is to be taken.`;
    break;
  case 'Voltmeter Display Problem':
    actionText = `Display Problem was noticed on the Voltmeter of the ${ptr} CRP. Necessary action is to be taken.`;
    break;

  // Relay 
  case 'Differential Relay Healthy LED not glowing':
    actionText = `"Relay Healthy" LED of the Differential Relay is not glowing on the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'O/C E/F Relay Healthy LED not glowing':
    actionText = `"Relay Healthy" LED of the O/C E/F Relay is not glowing on the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'Trip Ckt. Unhealthy Indication on relay':
    actionText = `"Trip Ckt. Unhealthy" indication was glowing on the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'Differential Relay Display Out':
    actionText = `No display was visible on the Differential Relay of the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'O/C E/F Relay Display Out':
    actionText = `No display was visible on the O/C E/F Relay of the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'Differential Relay Display Problem':
    actionText = `Problem in the display of Differential Relay of the ${ptr} CRP was observed. Immediate necessary action is to be taken.`;
    break;
  case 'O/C E/F Relay Display Problem':
    actionText = `Problem in the display of O/C E/F Relay of the ${ptr} CRP was observed. Immediate necessary action is to be taken.`;
    break;

  // HMI Keys & Clear buttons
  case 'Differential Relay HMI Key Defective':
    actionText = `Problem in the HMI Keys of Differential Relay of the ${ptr} CRP was observed. Immediate necessary action is to be taken.`;
    break;
  case 'O/C E/F Relay HMI Key Defective':
    actionText = `Problem in the HMI Keys of O/C E/F Relay of the ${ptr} CRP was observed. Immediate necessary action is to be taken.`;
    break;
  case 'Clear button of Differential Relay defective':
    actionText = `Problem in the Clear Button of Differential Relay of the ${ptr} CRP was observed. Immediate necessary action is to be taken.`;
    break;
  case 'Clear button of O/C E/F Relay defective':
    actionText = `Problem in the Clear Button of O/C E/F Relay of the ${ptr} CRP was observed. Immediate necessary action is to be taken.`;
    break;

  // Missing relay
  case 'Differential Relay Missing':
    actionText = `Differential Relay was found to be missing on the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'O/C E/F Relay Missing':
    actionText = `O/C E/F Relay was found to be missing on the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;

// Annunciator
  case 'Annunciator Defective':
    actionText = `Annunciator was found to be defective of the ${ptr} CRP. Necessary action is to be taken.`;
    break;
  case 'Trip Ckt. Unhealthy Showing':
    actionText = `"Trip Ckt. Unhealthy" was showing on Annunciator of the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;
  case 'Hooter not working':
    actionText = `Hooter of the ${ptr} CRP was not working. Immediate necessary action is to be taken.`;
    break;

// Panel
  case 'TNC Switch Broken':
    actionText = `TNC Switch of the ${ptr} CRP was found to be broken. Immediate necessary action is to be taken.`;
    break;
  case 'TNC Switch Defective':
    actionText = `TNC Switch of the ${ptr} CRP was found to be defective. Immediate necessary action is to be taken.`;
    break;
  case 'Breaker ON indication not glowing':
    actionText = `"Breaker ON indication was not glowing of the ${ptr} CRP. Immediate necessary action is to be taken.`;
    break;

    default:
      return alert('Unsupported CRP issue selected.');
  }

  // store and refresh
  otherActionsStore['CRP'] = otherActionsStore['CRP'] || [];
  if (otherActionsStore['CRP'].includes(actionText)) {
    return alert('This observation has already been added.');
  }
  otherActionsStore['CRP'].push(actionText);
  populateLiveTable();
  localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));

});


// Handler for manual-entry “Add” button under CRP
document.getElementById('addCRPManualBtn').addEventListener('click', () => {
  const text = document.getElementById('crpManualInput').value.trim();
  if (!text) return alert('Enter observation');
  otherActionsStore['CRP'] = otherActionsStore['CRP'] || [];
  if (otherActionsStore['CRP'].includes(text)) {
    return alert('This observation has already been added.');
  }
  otherActionsStore['CRP'].push(text);
  document.getElementById('crpManualInput').value = '';
  populateLiveTable();
  localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));

});


// ── Panel Room Observations UI wiring ──
const panelRoomMap = {
  '11KV Panel Gap': 'Back cover gap have been found for some of the 11KV panels. Necessary action to be taken towards closing the gaps properly to avoid unwanted interruptions and flashovers due to foreign particles, rats and lizards etc.',
  '33KV Panel Gap': 'Back cover gap have been found for some of the 33KV panels. Necessary action to be taken towards closing the gaps properly to avoid unwanted interruptions and flashovers due to foreign particles, rats and lizards etc.',
  '11KV Panel Hole': 'Necessary action to be taken towards closing the 11KV Panel holes properly to avoid unwanted interruptions and flashovers due to foreign particles, rats and lizards etc.',
  '33KV Panel Hole': 'Necessary action to be taken towards closing the 33KV Panel holes properly to avoid unwanted interruptions and flashovers due to foreign particles, rats and lizards etc.',
  '11KV Panels Dust & Spider': 'Dust and spider web deposited on 11KV panel surface must be cleaned thoroughly to prevent entry of dust inside panel through openings as this may increase leakage current & thereby affecting insulation.',
  '33KV Panels Dust & Spider': 'Dust and spider web deposited on 33KV panel surface must be cleaned thoroughly to prevent entry of dust inside panel through openings as this may increase leakage current & thereby affecting insulation.',
  '11KV Panels Huge Dust & Spider': '<b>Huge Dust and spider web</b> deposited on 11KV panel surface must be cleaned thoroughly to prevent entry of dust inside panel through openings as this may increase leakage current & thereby affecting insulation.',
  '33KV Panels Huge Dust & Spider': '<b>Huge Dust and spider web</b> deposited on 33KV panel surface must be cleaned thoroughly to prevent entry of dust inside panel through openings as this may increase leakage current & thereby affecting insulation.',
  'Safety Mat near 11KV Panel Missing': 'Safety Mat near 11KV Panels was found missing. Immediate necessary action is to be taken for safety concern.',
  'Safety Mat near 33KV Panel Missing': 'Safety Mat near 33KV Panels was found missing. Immediate necessary action is to be taken for safety concern.',
  'Cable Trench Cover Missing': 'Cable Trench Cover was found missing in some of the places. Immediate necessary action is to be taken.'
};

// Listen for checkbox changes under the “Panel Room” tab
document.querySelectorAll('#othRoom input[type="checkbox"][name="panelRoomObs"]')
  .forEach(cb => {
    cb.addEventListener('change', () => {
      const action = panelRoomMap[cb.value];
      otherActionsStore['Panel Room'] = otherActionsStore['Panel Room'] || [];
      if (cb.checked) {
        if (!otherActionsStore['Panel Room'].includes(action)) {
          otherActionsStore['Panel Room'].push(action);
        }
      } else {
        otherActionsStore['Panel Room'] =
          otherActionsStore['Panel Room'].filter(a => a !== action);
      }
      populateLiveTable();
      localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
    });
  });

// Handle manual “Other” entries in Panel Room
document.getElementById('addRoomManualBtn').addEventListener('click', () => {
  const text = document.getElementById('roomManualInput').value.trim();
  if (!text) return alert('Enter observation');
  otherActionsStore['Panel Room'] = otherActionsStore['Panel Room'] || [];
  if (!otherActionsStore['Panel Room'].includes(text)) {
    otherActionsStore['Panel Room'].push(text);
    document.getElementById('roomManualInput').value = '';
    populateLiveTable();
    localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
  } else {
    alert('This observation has already been added.');
  }
});






 // ── Inject all “Other” sections under one unified Observations header ──
 const _origPopulate = populateLiveTable;
 populateLiveTable = function() {
   _origPopulate();
   const COL_COUNT = 22;
   const liveTbody = document.querySelector('#liveTable tbody');

   // gather all four lists
   const batObs   = otherActionsStore['Battery & Battery Charger'] || [];
   const crpObs   = otherActionsStore['CRP'] || [];
   const rtccObs  = otherActionsStore['RTCC'] || [];
   const panelObs = otherActionsStore['Panel Room'] || [];


 // ── Always read current battery voltages & cell voltages from inputs ──
const bat11VoltageOn    = document.getElementById('bat11VoltageOn')?.value    || '---';
const bat11VoltageOff   = document.getElementById('bat11VoltageOff')?.value   || '---';
const bat11CellVoltage  = document.getElementById('bat11CellVoltage')?.value  || '---';
const bat33VoltageOn    = document.getElementById('bat33VoltageOn')?.value    || '---';
const bat33VoltageOff   = document.getElementById('bat33VoltageOff')?.value   || '---';
const bat33CellVoltage  = document.getElementById('bat33CellVoltage')?.value  || '---';

const summaryArr = [
  `<strong>11KV Panel Voltage (AC ON):</strong> ${bat11VoltageOn}` +
    `&nbsp;&nbsp;<strong>11KV Panel Voltage (AC OFF):</strong> ${bat11VoltageOff}`,
  `<strong>33KV Panel Voltage (AC ON):</strong> ${bat33VoltageOn}` +
    `&nbsp;&nbsp;<strong>33KV Panel Voltage (AC OFF):</strong> ${bat33VoltageOff}`,
  `<strong>Battery Cell Voltage (11KV Panels):</strong> ${bat11CellVoltage}` +
    `&nbsp;&nbsp;<strong>Battery Cell Voltage (33KV Panels):</strong> ${bat33CellVoltage}`
];

  // combine the “always-through” summary rows with any manual battery actions
  const combinedBat = [...summaryArr, ...batObs];
  // only proceed if there is *either* a battery summary OR any of the other Observations lists
  if (combinedBat.length || crpObs.length || rtccObs.length || panelObs.length) {
    // Observations header row
    const hdr = document.createElement('tr');
    hdr.classList.add('obs-header');
     const tdh = document.createElement('td');
     tdh.colSpan     = COL_COUNT;
     tdh.textContent = 'Observations of Battery & Battery Charger/33KV CRP/RTCC Panels/Other General Observations';
     tdh.style.fontWeight = 'bold';
     tdh.style.textAlign  = 'center';
     hdr.appendChild(tdh);
     liveTbody.appendChild(hdr);

     let counter = 1;


// ── Battery & Battery Charger SUMMARY ROWS ──
// ── Always read current battery voltages & cell voltages from inputs ──
const bat11VoltageOn    = document.getElementById('bat11VoltageOn')?.value    || '---';
const bat11VoltageOff   = document.getElementById('bat11VoltageOff')?.value   || '---';
const bat11CellVoltage  = document.getElementById('bat11CellVoltage')?.value  || '---';
const bat33VoltageOn    = document.getElementById('bat33VoltageOn')?.value    || '---';
const bat33VoltageOff   = document.getElementById('bat33VoltageOff')?.value   || '---';
const bat33CellVoltage  = document.getElementById('bat33CellVoltage')?.value  || '---';

const summaryArr = [
  `<strong>11KV Panel Voltage (AC ON):</strong> ${bat11VoltageOn}V` +
    `&nbsp;&nbsp;<strong>11KV Panel Voltage (AC OFF):</strong> ${bat11VoltageOff}V`,
  `<strong>33KV Panel Voltage (AC ON):</strong> ${bat33VoltageOn}V` +
    `&nbsp;&nbsp;<strong>33KV Panel Voltage (AC OFF):</strong> ${bat33VoltageOff}V`,
  `<strong>Battery Cell Voltage (11KV Panels):</strong> ${bat11CellVoltage}V` +
    `&nbsp;&nbsp;<strong>Battery Cell Voltage (33KV Panels):</strong> ${bat33CellVoltage}V`
];


// now render these three as one merged‐location block

      // helper to render a block with merged location column
      function renderBlock(arr, locText, sectionKey) {
        if (arr.length === 0) return;
        let firstRow = true;
        arr.forEach(txt => {
          const tr = document.createElement('tr');
          // tag this block’s rows so we can colour-code them
          tr.classList.add(sectionKey);
          // 1) Serial number
          const td0 = document.createElement('td');
          td0.textContent = counter++;
          tr.appendChild(td0);
          // 2) Location (merged only once)
          if (firstRow) {
            const td1 = document.createElement('td');
            td1.textContent = locText;
            td1.rowSpan = arr.length;
            td1.style.fontWeight = 'bold';
            td1.style.textAlign    = 'center';
            tr.appendChild(td1);
            firstRow = false;
          }
          // 3) Action cell spanning all right-hand columns
          const tdA = document.createElement('td');
          tdA.colSpan = COL_COUNT - 2; // span everything except Sl.No. + Location
          tdA.innerHTML = `<div style="font-size:0.6rem; text-align:left;">${txt}</div>`;
          tr.appendChild(tdA);
          liveTbody.appendChild(tr);
        });



// ── SAVE HEADERS & TEV REFERENCES to localStorage for report export ──
const headingEl = document.getElementById('companyHeading');
const infoTableEl = document.getElementById('infoTable');
const tev11El = document.getElementById('tevRefs11Section');
const tev33El = document.getElementById('tevRefs33Section');

localStorage.setItem('companyHeading', headingEl?.outerHTML || '');
localStorage.setItem('infoTableHTML', infoTableEl?.outerHTML || '');
localStorage.setItem('tevRefs11HTML', tev11El?.outerHTML || '');
localStorage.setItem('tevRefs33HTML', tev33El?.outerHTML || '');




      }

     // render in desired order
      const combinedBat = [...summaryArr, ...batObs];
      renderBlock(combinedBat, 'Battery & Battery Charger', 'bat');
      renderBlock(crpObs,   '33KV CRP',                'crp');
      renderBlock(rtccObs,  'RTCC Panels',             'rtcc');
      renderBlock(panelObs, 'Panels & Panel Room',     'proom');

   }

  // ── make all live-table cells editable ──
  document.querySelectorAll('#liveTable td').forEach(td => {
    td.setAttribute('contenteditable', 'true');
  });
};




// ── RTCC Panels UI wiring ──
const rtccSelect       = document.getElementById('rtccSelect');
const rtccOtherInput   = document.getElementById('rtccOtherInput');
const rtccIssueSelect  = document.getElementById('rtccIssueSelect');
const addRTCCBtn       = document.getElementById('addRTCCBtn');
const addRTCCManualBtn = document.getElementById('addRTCCManualBtn');

// Show/hide “Other” text for first dropdown
rtccSelect.addEventListener('change', () => {
  if (rtccSelect.value === 'Other') {
    rtccOtherInput.style.display = 'block';
  } else {
    rtccOtherInput.style.display = 'none';
    rtccOtherInput.value = '';
  }
});

// Handler for dropdown-based Add
 addRTCCBtn.addEventListener('click', () => {
   const rtcc = rtccSelect.value === 'Other'
              ? rtccOtherInput.value.trim()
              : rtccSelect.value;
   const issue = rtccIssueSelect.value;
   if (!rtcc)   return alert('Select or enter RTCC');
   if (!issue)  return alert('Select issue');

   let actionText = '';
   switch (issue) {
     case 'Tap Changing Indicator Defective':
       actionText = `Tap changing indicator of the ${rtcc} was found to be defective. Necessary action is to be taken.`;
       break;
     case 'ROTI Open':
       actionText = `ROTI of the ${rtcc} was found to be OPEN. Necessary action is to be taken.`;
       break;
     case 'RWTI Open':
       actionText = `RWTI of the ${rtcc} was found to be OPEN. Necessary action is to be taken.`;
       break;
     case 'ROTI Defective':
       actionText = `ROTI of the ${rtcc} was found to be defective. Necessary action is to be taken.`;
       break;
     case 'RWTI Defective':
       actionText = `RWTI of the ${rtcc} was found to be defective. Necessary action is to be taken.`;
       break;
     case 'ROTI Display Defective':
       actionText = `Display of ROTI of the ${rtcc} was found to be defective. Necessary action is to be taken.`;
       break;
     case 'RWTI Display Defective':
       actionText = `Display of RWTI of the ${rtcc} was found to be defective. Necessary action is to be taken.`;
       break;
     case 'RTCC Disconnected':
       actionText = `${rtcc} was found to be disconnected. Necessary action is to be taken.`;
       break;
     default:
       // fallback (should not happen)
       actionText = `${rtcc}: ${issue}.`;
   }

   otherActionsStore['RTCC'] = otherActionsStore['RTCC'] || [];
   if (otherActionsStore['RTCC'].includes(actionText)) {
     return alert('This observation has already been added.');
   }
   otherActionsStore['RTCC'].push(actionText);
   populateLiveTable();
   localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
 });


// Handler for manual-entry Add
addRTCCManualBtn.addEventListener('click', () => {
  const text = document.getElementById('rtccManualInput').value.trim();
  if (!text) return alert('Enter observation');
  otherActionsStore['RTCC'] = otherActionsStore['RTCC'] || [];
  if (otherActionsStore['RTCC'].includes(text)) {
    return alert('This observation has already been added.');
  }
  otherActionsStore['RTCC'].push(text);
  document.getElementById('rtccManualInput').value = '';
  populateLiveTable();
  localStorage.setItem('otherActionsStore', JSON.stringify(otherActionsStore));
});

// Inject RTCC lines into the live table
const _basePopulate = populateLiveTable;
populateLiveTable = function() {
  _basePopulate();
  const COL_COUNT = 20;
  const liveTbody  = document.querySelector('#liveTable tbody');
  const rtccObs    = otherActionsStore['RTCC'] || [];


  // Persist updated live-table HTML snapshot for download_report.html
  localStorage.setItem(
    'controlRoomDocHTML',
    document.getElementById('liveTableContainer').innerHTML
  );


  
};





// now build the live table
populateLiveTable();

// ── Re-bind all live-sync events to the wrapped populateLiveTable ──
[
  '#table11 tbody',
  '#table33 tbody',
  '#tableTemp11 tbody',
  '#tableTemp33 tbody',
  '#tableUltrasound11 tbody',
  '#tableUltrasound33 tbody',
  '#tableTEV11 tbody',
  '#tableTEV33 tbody'
].forEach(selector => {
  const el = document.querySelector(selector);
  ['input','change'].forEach(evt => {
    el.addEventListener(evt, populateLiveTable);
  });
});

  // ── Download Live Table as .docx ──
document.getElementById('downloadDocBtn').addEventListener('click', () => {


  // grab the substation info & main heading (unchanged)
  const infoTableHTML   = document.getElementById('infoTableContainer').outerHTML;
  const headingHTML     = document.getElementById('docHeading').outerHTML;

  // NEW: grab your two TEV-References sections
let tevRefs11HTML = '';
let tevRefs33HTML = '';

const tev11Section = document.getElementById('tevRefs11Section');
const tev33Section = document.getElementById('tevRefs33Section');

// Include 11KV TEV section only if it's visible
if (tev11Section && tev11Section.style.display !== 'none') {
  tevRefs11HTML = tev11Section.outerHTML;
}

// Include 33KV TEV section only if it's visible
if (tev33Section && tev33Section.style.display !== 'none') {
  tevRefs33HTML = tev33Section.outerHTML;
}


  // then the live table itself
  const liveHTML        = document.getElementById('liveTableContainer').innerHTML;



  // ── NEW: company + zone headings ──
  const zoneName       = localStorage.getItem('selectedZone') || '';
  const companyHeading = `<h1 style="
                             font-family: Cambria;
                             font-size: 20pt;
                             font-weight: bold;
                             text-align: center;
                             margin: 0;
                           ">
                             West Bengal State Electricity Distribution Company Limited
                           </h1>`;
// Grab only the first word of the zone name
const fullZone = localStorage.getItem('selectedZone') || '';
const firstZone = fullZone.split(/\s+/)[0] || '';
const zoneHeading = `<h2 style="
    font-family: Cambria;
    font-size: 12pt;
    font-weight: bold;
    text-align: center;
    margin: 0;
  ">
    ${firstZone} Zonal Testing
  </h2>`;




  // build export in the order you want:
  //  1) Substation info
  //  2) Main heading
  //  3) TEV Refs for 11KV
  //  4) TEV Refs for 33KV
  //  5) Live consolidated table
  // NEW: stitch everything—company, zone, info table, TEV refs, main heading, live table
  const mainHeading = `<h2 id="docHeading" style="
                          font-family: Cambria;
                          font-size: 18pt;
                          font-weight: bold;
                          text-align: center;
                          margin: 1em 0;
                        ">
                          Measurement of Partial Discharge, Temperature Recorded &amp; Other Findings of the Indoor Panels
                        </h2>`;

  const content = companyHeading
                + zoneHeading
+ `<table style="width:100%; border-collapse:collapse;"><tr><td style="height:20px; border:none;"></td></tr></table>`
                + infoTableHTML
                + tevRefs11HTML
                + tevRefs33HTML
                + mainHeading
                + liveHTML;




  localStorage.setItem('controlRoomDocHTML', content);

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
       <style>

  /* ── Override for the info table in the Word export ── */
  #infoTableContainer table {
    color: #000 !important;
    border: none !important;
  }
  #infoTableContainer th,
  #infoTableContainer td {
    text-align: center !important;
    border: none !important;
  }

  /* ── Force the heading to print black ── */
  #docHeading {
    color: #000 !important;
  }

  #tevRefs11Section h2,
  #tevRefs33Section h2 {
    color: #000 !important;
  }


       /* Legal Landscape, 1 cm margins */
       @page { size: legal landscape; margin: 1cm; }
      /* “No Spacing” style for all table text (including divs) */
        body, p, th, td, div {
           margin: 0;
           padding: 0;
           font-family: Cambria;
           line-height: 1;
           mso-style-name: "No Spacing";
          }
   table {
     width: 100%;
     border-collapse: collapse;
   }

   th, td {
     border: 1px solid #000;
     padding: 5px;
   }

   /* Column headers */
   th {
     background-color: #d9d9d9;
     font-size: 11pt;
   }

   /* All other cells */
   td {
     font-size: 11pt;
   }

   /* “Action to be Taken” is last column */
  /* widen the “Action to be Taken” column */
  th[rowspan="2"],
  td:last-child {
    /* choose a width that suits your content */
    width: 200px !important;
  }
  td:last-child {
    font-family: Cambria;
    font-size: 9pt;
  }
       /* 11KV & 33KV panels data rows */
       tr.kv-11 td,
       tr.kv-33 td {
       background-color: #dbe5f1 !important;
       }

   /* Group‐header rows for 11KV/33KV Panels */
   tr.kv-header td {
     background-color: #dbe5f1;
   }

   /* Observations header row */
   tr.obs-header td {
     background-color: #d9d9d9;
   }

   /* Observation-block rows */
   tr.bat   td { background-color: #f2dcdc !important; }
   tr.crp   td { background-color: #ebf1de !important; }
   tr.rtcc  td { background-color: #fdeada !important; }
   tr.proom td { background-color: #fff2cc !important; }
 </style>
      </head>
      <body>${content}</body>
    </html>`;
  const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    // Dynamically name as SubstationName_DD.MM.YYYY.doc
    const sub = localStorage.getItem('selectedSubstation') || 'Substation';
    const now = new Date();
    const dd  = String(now.getDate()).padStart(2,'0');
    const mm  = String(now.getMonth()+1).padStart(2,'0');
    const yyyy= now.getFullYear();
    saveAs(blob, `${sub}_${dd}.${mm}.${yyyy}.doc`);
   });

// ── Download Live Table as .pdf ──
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  const container = document.getElementById('liveTableContainer');

  // 1) Force all text to black so it prints clearly
  container.classList.add('pdf-black');

  // 2) Inject only your border/background PDF-styles (no width overrides)
  const pdfStyle = document.createElement('style');
  pdfStyle.id = 'pdf-export-style';
  pdfStyle.textContent = `
    @page { size: legal landscape; margin: 1cm; }
    body, p, th, td, div { margin:0; padding:0; font-family:Cambria; }
    th, td {
      border:1px solid #000 !important;
      padding:5px !important;
      font-size:11pt !important;
      color:#000 !important;
    }
    th { background-color:#d9d9d9 !important; }
    tr.kv-11 td,
    tr.kv-33 td,
    tr.kv-header td { background-color:#dbe5f1 !important; }
    tr.obs-header td { background-color:#d9d9d9 !important; }
    tr.bat   td { background-color:#f2dcdc !important; }
    tr.crp   td { background-color:#ebf1de !important; }
    tr.rtcc  td { background-color:#fdeada !important; }
    tr.proom td { background-color:#fff2cc !important; }
  `;
  document.head.appendChild(pdfStyle);

  // 3) Compute a CSS scale so the table fits into (14" – 2×0.5") of printable width
  const DPI = 95;
  const LEGAL_WIDTH_IN = 17.5;           // legal in landscape
  const MARGIN_IN = 0.5;               // ½" left & right
  const availablePx = (LEGAL_WIDTH_IN - MARGIN_IN * 2) * DPI;
  const tablePx     = container.getBoundingClientRect().width;
  const scaleFactor = Math.min(1, availablePx / tablePx);

  container.style.transformOrigin = 'top left';
  container.style.transform       = `scale(${scaleFactor})`;

  // 4) Build your filename
  const sub      = localStorage.getItem('selectedSubstation') || 'Substation';
  const now      = new Date();
  const dd       = String(now.getDate()).padStart(2,'0');
  const mm       = String(now.getMonth()+1).padStart(2,'0');
  const yyyy     = now.getFullYear();
  const filename = `${sub}_${dd}.${mm}.${yyyy}.pdf`;

  // 5) Fire html2pdf
  html2pdf().set({
    margin:       [0.5,0.5,0.5,0.5],   // ½" all around
    filename,
    html2canvas:  { scale: 2 },
    jsPDF:        {
      unit:        'in',
      format:      'legal',
      orientation: 'landscape'
    }
  })
  .from(container)
  .save()
  .finally(() => {
    // 6) Clean up styles/transforms
    container.style.transform = '';
    container.classList.remove('pdf-black');
    document.head.removeChild(pdfStyle);
  });
});
// ── DOWNLOAD EXCEL FUNCTION FOR LIVE TABLE ──
document.getElementById('downloadExcelBtn').addEventListener('click', function () {
  const table = document.getElementById('liveTable');
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);

const range = XLSX.utils.decode_range(ws['!ref']);
for (let R = range.s.r; R <= range.e.r; ++R) {
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
    const cell = ws[cellRef];
    if (cell && typeof cell.v === 'string' && cell.v.trim() === '---') {
      cell.v = '';
      cell.w = '';
    }
  }
}


const oldLastCol = range.e.c;
const actionCol = oldLastCol;


function splitActionIntoColumns(text) {
  const limits = [250, 250, 1000];
  const parts = ['', '', ''];

  const bullets = text.includes('•')
    ? text.split(/(?=•\s)/).map(s => s.trim()).filter(Boolean)
    : [text];

  let col = 0;

  bullets.forEach(bullet => {
    if (col > 2) {
      parts[2] += (parts[2] ? ' ' : '') + bullet;
      return;
    }

    if (!parts[col]) {
      parts[col] = bullet;
      return;
    }

    if ((parts[col] + ' ' + bullet).length <= limits[col]) {
      parts[col] += ' ' + bullet;
      return;
    }

    col++;

    if (col > 2) {
      parts[2] += (parts[2] ? ' ' : '') + bullet;
    } else {
      parts[col] = bullet;
    }
  });

  return parts;
}


// Split Action to be Taken into 3 columns, max 250 chars each, no new lines
for (let R = range.s.r; R <= range.e.r; ++R) {
  const actionRef = XLSX.utils.encode_cell({ r: R, c: actionCol });
  const actionCell = ws[actionRef];

  let text = actionCell && actionCell.v != null ? String(actionCell.v) : '';
  text = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();


text = text
  .replace(/(^|\s+|\.)(?:i{1,3}|iv|v|vi{0,3}|ix|x|\d+)\.\s*/g, '$1• ')
  .replace(/\.•/g, '. •')
  .replace(/\s*•\s*/g, ' • ')
  .replace(/^ • /, '• ')
  .trim();



  let part1 = '';
  let part2 = '';
  let part3 = '';

  // First header row
  if (R === range.s.r) {
    part1 = 'Action to be Taken 1';
    part2 = 'Action to be Taken 2';
    part3 = 'Action to be Taken 3';
  }
  // Second header row under merged header should remain blank
  else if (R === range.s.r + 1) {
    part1 = '';
    part2 = '';
    part3 = '';
  }
  // Data rows
  else if (text) {
    part1 = text.slice(0, 250);
    part2 = text.slice(250, 500);
    part3 = text.slice(500, 1500);

const smartParts = splitActionIntoColumns(text);
part1 = smartParts[0];
part2 = smartParts[1];
part3 = smartParts[2];


  }

  ws[actionRef] = { t: 's', v: part1 };

  ws[XLSX.utils.encode_cell({ r: R, c: actionCol + 1 })] = { t: 's', v: part2 };
  ws[XLSX.utils.encode_cell({ r: R, c: actionCol + 2 })] = { t: 's', v: part3 };
}

// Extend only full-width horizontal merges up to the new last column
if (ws['!merges']) {
  ws['!merges'].forEach(m => {
    if (m.s.c < m.e.c && m.e.c === oldLastCol) {
      m.e.c = oldLastCol + 2;
    }
  });
}

range.e.c = oldLastCol + 2;
ws['!ref'] = XLSX.utils.encode_range(range);


const allRows = XLSX.utils.sheet_to_json(ws, {
  header: 1,
  raw: false,
  defval: ''
});

const normalize = (v) => String(v || '').replace(/\s+/g, ' ').trim();

const headerRows = allRows.slice(0, 2);
const idx11 = allRows.findIndex(r => normalize(r[0]) === '11KV Panels');
const idx33 = allRows.findIndex(r => normalize(r[0]) === '33KV Panels');
const idxObs = allRows.findIndex(
  r => normalize(r[0]) === 'Observations of Battery & Battery Charger/33KV CRP/RTCC Panels/Other General Observations'
);

function buildSectionSheet(startIdx, endIdx) {
  const rows = headerRows.map(r => [...r]);

  if (startIdx !== -1) {
    for (let i = startIdx; i < endIdx; i++) {
      rows.push([...(allRows[i] || [])]);
    }
  }

  return XLSX.utils.aoa_to_sheet(rows);
}

const end11 = idx33 !== -1 ? idx33 : (idxObs !== -1 ? idxObs : allRows.length);
const end33 = idxObs !== -1 ? idxObs : allRows.length;

const ws11 = buildSectionSheet(idx11, end11);
const ws33 = buildSectionSheet(idx33, end33);
const wsObs = buildSectionSheet(idxObs, allRows.length);


function removeTopRows(ws, count) {
  const data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    raw: false,
    defval: ''
  });

  const cleaned = data.slice(count);

  const newWs = XLSX.utils.aoa_to_sheet(cleaned.length ? cleaned : [[]]);

  Object.keys(ws).forEach(key => delete ws[key]);
  Object.assign(ws, newWs);
}

// Remove all header rows from each sheet
removeTopRows(ws11, 3);
removeTopRows(ws33, 3);
removeTopRows(wsObs, 3);


function removeFirstColumn(ws) {
  const data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    raw: false,
    defval: ''
  });

  const cleaned = data.map(row => row.slice(1));
  const newWs = XLSX.utils.aoa_to_sheet(cleaned.length ? cleaned : [[]]);

  Object.keys(ws).forEach(key => delete ws[key]);
  Object.assign(ws, newWs);
}

removeFirstColumn(ws11);
removeFirstColumn(ws33);
removeFirstColumn(wsObs);



function applySingleBorder(ws) {
  if (!ws['!ref']) return;

  const range = XLSX.utils.decode_range(ws['!ref']);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });

      if (!ws[cellRef]) {
        ws[cellRef] = { t: 's', v: '' };
      }

      ws[cellRef].s = ws[cellRef].s || {};
      ws[cellRef].s.border = {
        top:    { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left:   { style: 'thin', color: { rgb: '000000' } },
        right:  { style: 'thin', color: { rgb: '000000' } }
      };
    }
  }
}

applySingleBorder(ws11);
applySingleBorder(ws33);
applySingleBorder(wsObs);


function formatPanelSheet(ws) {
  if (!ws['!ref']) return;

  const range = XLSX.utils.decode_range(ws['!ref']);

  // After removing Sl. No. column, Action columns become:
  // 20 = Action to be Taken 1
  // 21 = Action to be Taken 2
  // 22 = Action to be Taken 3
  const actionCols = [20, 21, 22];

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });

      if (!ws[cellRef]) {
        ws[cellRef] = { t: 's', v: '' };
      }

      ws[cellRef].s = ws[cellRef].s || {};

      // Center align every cell
      ws[cellRef].s.alignment = {
        horizontal: 'center',
        vertical: 'center'
      };

      // Action columns: wrap text + font size 6
      if (actionCols.includes(C)) {
        ws[cellRef].s.alignment = {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true
        };
        ws[cellRef].s.font = {
          sz: 6
        };
      }
    }
  }
}

formatPanelSheet(ws11);
formatPanelSheet(ws33);

function applyRowFillColor(ws, color) {
  if (!ws['!ref']) return;

  const range = XLSX.utils.decode_range(ws['!ref']);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });

      if (!ws[cellRef]) {
        ws[cellRef] = { t: 's', v: '' };
      }

      ws[cellRef].s = ws[cellRef].s || {};
      ws[cellRef].s.fill = {
        patternType: 'solid',
        fgColor: { rgb: 'DCE6F2' }
      };
    }
  }
}

applyRowFillColor(ws11, 'DCE6F2');
applyRowFillColor(ws33, 'DCE6F2');
applyRowFillColor(wsObs, 'DCE6F2');




function highlightLongAction3(ws) {
  if (!ws['!ref']) return;

  const range = XLSX.utils.decode_range(ws['!ref']);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    const cellRef = XLSX.utils.encode_cell({ r: R, c: 22 }); // 3rd Action column
    const cell = ws[cellRef];

    if (cell && typeof cell.v === 'string' && cell.v.length > 250) {
      cell.s = cell.s || {};
      cell.s.fill = {
        patternType: 'solid',
        fgColor: { rgb: 'FF0000' }
      };
    }
  }
}

highlightLongAction3(ws11);
highlightLongAction3(ws33);


function keepOnlySecondColumn(ws) {
  const data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    raw: false,
    defval: ''
  });

  const cleaned = data.map(row => [row[1] || '']);
  const newWs = XLSX.utils.aoa_to_sheet(cleaned.length ? cleaned : [[]]);

  Object.keys(ws).forEach(key => delete ws[key]);
  Object.assign(ws, newWs);
}

keepOnlySecondColumn(wsObs);

// Re-apply border and fill after rebuilding the sheet
applySingleBorder(wsObs);
applyRowFillColor(wsObs, 'DCE6F2');




XLSX.utils.book_append_sheet(wb, ws11, '11KV Panels');
XLSX.utils.book_append_sheet(wb, ws33, '33KV Panels');
XLSX.utils.book_append_sheet(wb, wsObs, 'Battery Batt Charger RTCC Other');



  XLSX.utils.book_append_sheet(wb, ws, 'Control Room');


delete wb.Sheets['Control Room'];
wb.SheetNames = wb.SheetNames.filter(name => name !== 'Control Room');

  const substation = localStorage.getItem('selectedSubstation') || 'Substation';
  const date = localStorage.getItem('inspectionDate') || new Date().toISOString().split('T')[0];
  const fileName = `${substation}_${date}.xlsx`;

  XLSX.writeFile(wb, fileName, { cellStyles: true });
});





  // ── Reset button logic ──
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('This will clear ALL entries and reset the form. Proceed?')) return;
    // 1) Remove every saved data key
    [
      'pan11Data','pan33Data',
      'tev11Data','tev33Data',
      'temp11Data','temp33Data',
      'tev11ExtraData', 'tev33ExtraData',
      'us11Data','us33Data',
      'ambientTemp11Data','ambientTemp33Data',
      'bat11Data','bat33Data', 'otherActionsStore'
    ].forEach(key => localStorage.removeItem(key));
    // 2) Reload the page to wipe all in‐memory stores and reset the UI
    window.location.reload();
  });

  const infoMap = {
    infoSubstation: localStorage.getItem('selectedSubstation') || '',
    infoDivision:   localStorage.getItem('selectedDivision')   || '',
    infoRegion:     localStorage.getItem('selectedRegion')     || '',
    infoZone:       localStorage.getItem('selectedZone')       || ''
  };
  Object.entries(infoMap).forEach(([id, value]) => {
    const td = document.getElementById(id);
    if (td) td.textContent = value;
  });


// ── Populate Inspection Date in DD-MM-YYYY format ──
const insp = localStorage.getItem('inspectionDate') || '';
const inspTd = document.getElementById('infoInspectionDate');
if (inspTd) {
  if (insp) {
    // parse the stored string into a Date, then format
    const d = new Date(insp);
    const dd   = String(d.getDate()).padStart(2, '0');
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    inspTd.textContent = `${dd}-${mm}-${yyyy}`;
  } else {
    inspTd.textContent = '';
  }
}


  // ── Populate latest 11KV Ambient Temp (in °C) ──
  const ambArr = JSON.parse(localStorage.getItem('ambientTemp11Data') || '[]');
  const latestAmb = ambArr.length ? ambArr[ambArr.length - 1] : '';
  const ambTd = document.getElementById('infoAmbientTemp');
  if (ambTd && latestAmb !== '') {
    ambTd.textContent = latestAmb + '℃';
  }


});


