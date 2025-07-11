// hotspot.js

console.log('hotspot.js Loaded');
window.ambientCell = null;

document.addEventListener('DOMContentLoaded', () => {
  const sub = localStorage.getItem('selectedSubstation') || '[Substation Not Set]';
  document.getElementById('substationHeader').textContent = `Entering data for '${sub}'`;

  // wire up downloads first (so they work even if init fails)
  document.getElementById('downloadExcelBtn')?.addEventListener('click', downloadExcel);
  document.getElementById('downloadDocBtn')?.addEventListener('click', downloadDoc);
  document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPdf);

  // now initialize rows safely
  try {
  // try to pull saved rows out of localStorage …
  const hadSaved = loadHotspotData();

  // … if nothing was there, add one empty row for the user to start with
  if (!hadSaved) {
    addRow();
  }

  // finally build or restore the live table
  const savedLive = localStorage.getItem('hotspotLiveTableBody');
  if (savedLive) {
    // restore any prior edits
    document.querySelector('#hotspotLiveTable tbody').innerHTML = savedLive;
    attachLiveBodyListeners();
  } else {
    // first-time build
    renderLive();
  }

  } catch (e) {
    console.error('Hotspot init failed:', e);
  }
});

// --- Options ---
const location1Opts = ['PTR-1','PTR-2','PTR-3','PTR-4','PTR-5','PTR-6','PTR-7','Station Service Transformer','Other'];
const location2Opts = [
  'HV Bushing Connector','LV Bushing Connector','HV Bushing Stud','LV Bushing Stud','CT Connector',
  'VCB Upper Pad Connector','VCB Lower Pad Connector','VCB Upper & Lower Pad Connector','VCB Upper Pad','VCB Lower Pad',
  '1st Isolator','1st DP','Isolator before CT','Isolator after VCB','Isolator before VCB',
  'HV LA Internal Hotspot','LV LA Internal Hotspot','11KV Feeder Isolator','Cable Socket Nut-Bolt','Other'
];
const condMap = {
  isolator: ['Pad Connector','Female Contact','Pad Connector & Female Contact','Other'],
  feeder: ['Female Dropper Connector','Male-Female Contact','Flexible Cord Upper Side Connector',
           'Flexible Cord Lower Side Connector','Flexible Cord Lower Side Binding',
           'Flexible Cord Lower side to Pin Binding','Flexible Cord Lower side to Pin Binding & Conductor','Other']
};
const sideOpts = ['Both Sides','PTR Side','Bus Side','CT Side','VCB Side','Line Side','Incomer Side','Isolator Side','Cable Side','LA Side','Station Service Transformer Side','Other'];

// ── full-form lookup for feeder-isolator checkboxes ──
const feederFullMap = {
  'FDC':  'Female Dropper Connector',
  'FCUSC':'Flexible Cord Upper Side Connector',
  'FCLSC':'Flexible Cord Lower Side Connector',
  'FC':   'Flexible Cord',
  'MF Cont.':'Male-Female Contact',
  'C-S Nut Bolt':'Cable-Socket Nut-Bolt'
};



// --- Helpers ---
function createSelect(opts) {
  const sel = document.createElement('select');
  sel.innerHTML = '<option value=""></option>' + opts.map(o => `<option>${o}</option>`).join('');
  return sel;
}

// --- New helper: get whatever the user chose/typed in a phase cell ---
function getPhaseValue(cell) {
  // 1) If there's still a <select>, use its value
  const sel = cell.querySelector('select');
  if (sel) return sel.value;

  // 2) Otherwise, if it's a feeder-isolator cell, collect checked boxes + other-input
  const cbs = Array.from(cell.querySelectorAll('.feeder-cb-container input:checked'))
                    .map(cb => cb.value);
  const other = cell.querySelector('.feeder-other-input')?.value.trim();
  if (other) cbs.push(other);
  if (cbs.length) return cbs.join('; ');

  // 3) Finally, fall back on any text <input> (manual “Other” for normal side menu)
  const txt = cell.querySelector('input[type="text"]');
  return txt ? txt.value.trim() : '';
}





// --- Add Row ---
function addRow() {
  const tbody = document.querySelector('#hotspotTable tbody');
  const tr = document.createElement('tr');

  // Serial No.
  tr.insertCell().textContent = tbody.rows.length + 1;

  // Hotspot Location 3-tier
  const tdLoc = tr.insertCell();
  const sel1 = createSelect(location1Opts);
  sel1.addEventListener('change', function() {
  if (this.value === 'Other') {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Enter other…';
    inp.addEventListener('input', renderLive);
    this.replaceWith(inp);
  }
  renderLive();
});
  const sel2 = createSelect(location2Opts);
  sel2.addEventListener('change', function() {
  const row = this.closest('tr');
  const v = this.value;

if (v === 'Other') {
  // replace the second dropdown with a free-text input
  const inp2 = document.createElement('input');
  inp2.type = 'text';
  inp2.placeholder = 'Enter other…';
  inp2.addEventListener('input', renderLive);
  this.replaceWith(inp2);

  // if you’d previously added a third control (sel3), remove it
  if (sel3) {
    sel3.remove();
    sel3 = null;
  }
}

  else if (v === '11KV Feeder Isolator') {
    applyFeederIsolator(row);
  }
  else {
    // normal 3-tier logic (isolators etc)
    onLoc2Change.call(this);
    // ensure phase cells go back to side-dropdowns
    resetPhaseCells(row);
  }

  renderLive();
});


  let sel3 = null;


// special case: transform the four phase cells when 11KV Feeder Isolator is picked
function applyFeederIsolator(row) {
  // 1) drop the location-tier-3 if it exists
  if (sel3) { sel3.remove(); sel3 = null; }

  // 2) for each phase cell: remove the side dropdown, inject checkboxes + text
  row.querySelectorAll('.phase-cell').forEach(td => {
    // remove old side-selector
    const oldSel = td.querySelector('.phase-side-select');
    if (oldSel) oldSel.remove();

    // clear any existing feeder widgets (in case of reselection)
    td.querySelectorAll('.feeder-cb-container, .feeder-other-input').forEach(el => el.remove());

    // checkbox container
    const cbContainer = document.createElement('div');
    cbContainer.className = 'feeder-cb-container';

    ['FDC','MF Cont.','FCUSC','FCLSC','FC','C-S Nut Bolt'].forEach(opt => {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = opt;
      cb.addEventListener('change', renderLive);

      const lbl = document.createElement('label');
      lbl.textContent = opt;
      lbl.prepend(cb);

      cbContainer.appendChild(lbl);
    });

    // manual entry
    const otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.placeholder = 'Enter other…';
    otherInput.className = 'feeder-other-input';
    otherInput.addEventListener('input', renderLive);

    td.append(cbContainer, otherInput);
  });
}

// reset phase cells back to normal dropdowns
function resetPhaseCells(row) {
  // remove any feeder checkboxes / text
  row.querySelectorAll('.feeder-cb-container, .feeder-other-input').forEach(el => el.remove());

  // re-attach a side-dropdown to any phase cell that's missing it
  row.querySelectorAll('.phase-cell').forEach(td => {
    if (!td.querySelector('.phase-side-select')) {
      const sideSel = createSelect(sideOpts);
      sideSel.classList.add('phase-side-select');
      sideSel.addEventListener('change', renderLive);
      td.append(sideSel);
    }
  });
}




  function onLoc2Change() {
    // 1) drop old third control
    if (sel3) { sel3.remove(); sel3 = null; }

    // 2) choose new third control
    const v = sel2.value;
    if (['1st Isolator','1st DP','Isolator before CT','Isolator after VCB','Isolator before VCB'].includes(v)) {
      sel3 = createSelect(condMap.isolator);
    } 



else if (v === 'Other') {
      sel3 = document.createElement('input');
      sel3.type = 'text';
      sel3.placeholder = 'Enter other…';
    }

    // 3) if it’s a select, bind its own “Other” swap
    if (sel3 && sel3.tagName === 'SELECT') {
      sel3.addEventListener('change', function() {
        if (this.value === 'Other') {
          const inp3 = document.createElement('input');
          inp3.type = 'text';
          inp3.placeholder = 'Enter other…';
          inp3.addEventListener('input', renderLive);
          this.replaceWith(inp3);
        }
        renderLive();
      });
    }
    // 4) always bind render on input
    if (sel3 && sel3.tagName !== 'SELECT') {
      sel3.addEventListener('input', renderLive);
    }

    // 5) append only the third control (never re-append sel1/sel2!)
    if (sel3) tdLoc.append(sel3);
    renderLive();
  }

  tdLoc.append(sel1, sel2);

// Ambient Temp (static cell with dynamic rowSpan)
  if (!window.ambientCell) {
    const tdAmb = tr.insertCell();
    const ambInput = document.createElement('input');
    ambInput.id = 'ambientInput';
    ambInput.type = 'number';
    ambInput.placeholder = '°C';
    ambInput.addEventListener('input', renderLive);
    tdAmb.append(ambInput);
    tdAmb.rowSpan = 1;
    window.ambientCell = tdAmb;
  } else {
    // only increase span—do not insert an extra cell
    window.ambientCell.rowSpan++;
  }

  // Phases R/Y/B/Neutral

for (let i = 0; i < 4; i++) {
  const td = tr.insertCell();
  td.classList.add('phase-cell');                // <— mark it

  const num = document.createElement('input');
  num.type = 'number';
  num.placeholder = '°C';
  num.addEventListener('input', renderLive);

  const sideSel = createSelect(sideOpts);
  sideSel.classList.add('phase-side-select');     // <— mark the dropdown
    sideSel.addEventListener('change', function() {
    if (this.value === 'Other') {
      // create the manual entry input
      const otherInput = document.createElement('input');
      otherInput.type = 'text';
      otherInput.placeholder = 'Enter other…';
      otherInput.addEventListener('input', renderLive);
      // replace the <select> with the <input>
      this.replaceWith(otherInput);
    }
    renderLive();
  });


  td.append(num, sideSel);
}


  // Image Code
  const tdImg = tr.insertCell();
  const imgInput = document.createElement('input'); imgInput.type='text'; imgInput.placeholder='Code'; imgInput.addEventListener('input', renderLive);
  tdImg.append(imgInput);

  // Remarks
  const tdRem = tr.insertCell();
  const remInput = document.createElement('input'); remInput.type='text'; remInput.placeholder='Remarks'; remInput.addEventListener('input', renderLive);
  tdRem.append(remInput);

  // Action
  const tdAct = tr.insertCell();
  const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.className='remove-btn'; 
 delBtn.onclick = () => {
  const tbody = document.querySelector('#hotspotTable tbody');
  // 1) Remove this row from the DOM
  tr.remove();

  // 2) If the ambient-cell exists, re–position it and update its span
  if (window.ambientCell) {
    const rows = tbody.rows;
    const rowCount = rows.length;
    if (rowCount > 0) {
      // a) adjust the span to cover all remaining rows
      window.ambientCell.rowSpan = rowCount;
      // b) if it was in the removed row, move it into the new first row
      const firstRow = rows[0];
      if (window.ambientCell.parentElement !== firstRow) {
        // remove from old parent (if any) and insert at column index 2
        window.ambientCell.parentElement?.removeChild(window.ambientCell);
        firstRow.insertBefore(window.ambientCell, firstRow.cells[2]);
      }
    } else {
      // no rows left → clean up entirely
      window.ambientCell.remove();
      window.ambientCell = null;
    }
  }

  // 3) Renumber the Sl. No. column so it stays sequential
  Array.from(tbody.rows).forEach((row, i) => {
    row.cells[0].textContent = i + 1;
  });

  // 4) Rebuild the live table view
  renderLive();
};

  tdAct.append(delBtn);

  tbody.append(tr);
  renderLive();
}

// --- Save/Load ---
function saveHotspotData() {
  const data = [];
  document.querySelectorAll('#hotspotTable tbody tr').forEach((tr, idx) => {
    const locEls = tr.cells[1].querySelectorAll('select,input');
    const ambient = document.getElementById('ambientInput').value;
    const base = idx === 0 ? 3 : 2;

    data.push({
      loc1:    locEls[0]?.value  || '',
      loc2:    locEls[1]?.value  || '',
      loc3:    locEls[2]?.value  || '',
      ambient,
      r:       tr.cells[base + 0].querySelector('input').value,
      rSide:   getPhaseValue(tr.cells[base + 0]),
      y:       tr.cells[base + 1].querySelector('input').value,
      ySide:   getPhaseValue(tr.cells[base + 1]),
      b:       tr.cells[base + 2].querySelector('input').value,
      bSide:   getPhaseValue(tr.cells[base + 2]),
      n:       tr.cells[base + 3].querySelector('input').value,
      nSide:   getPhaseValue(tr.cells[base + 3]),
      img:     tr.cells[base + 4].querySelector('input').value,
      remarks: tr.cells[base + 5].querySelector('input').value
    });
  });

  // **store** it in localStorage, which survives refresh & browser-close
  localStorage.setItem('hotspotData', JSON.stringify(data));
  alert('Hotspot data saved.');
}



function loadHotspotData() {
  const saved = JSON.parse(localStorage.getItem('hotspotData') || '[]');
  if (!saved.length) {
    return false;
  }

  // Reset ambientCell so addRow() will recreate it with correct rowspan
  window.ambientCell = null;

  const tbody = document.querySelector('#hotspotTable tbody');
  tbody.innerHTML = '';

  // Loop with (rec, idx) so we know which row we're restoring
  saved.forEach((rec, idx) => {
    addRow();

    // Grab the exact <tr> we just added
    const tr = tbody.rows[idx];

    // 1) Restore your 3-tier location selects/inputs
    const locEls = tr.cells[1].querySelectorAll('select,input');
    if (locEls[0]) locEls[0].value = rec.loc1;


// — Restore Tier-2 (and force Tier-3 to rebuild) —
const locControls = tr.cells[1].querySelectorAll('select,input');
const ctrl2 = locControls[1];
if (ctrl2) {
  if (ctrl2.tagName === 'SELECT') {
    // re-select the saved Tier-2 option
    ctrl2.value = rec.loc2;
    // trigger its change handler so onLoc2Change() fires
    ctrl2.dispatchEvent(new Event('change'));
  } else {
    // it was an “Other” text input
    ctrl2.value = rec.loc2;
  }
}

// — Now the Tier-3 control is back in the DOM, restore its value or swap to text for “Other” —
const controls = tr.cells[1].querySelectorAll('select,input');
const ctrl3 = controls[2];
if (ctrl3) {
  if (ctrl3.tagName === 'SELECT') {
    // gather its option-values
    const opts = Array.from(ctrl3.options).map(o => o.value);
    if (rec.loc3 && !opts.includes(rec.loc3)) {
      // saved value wasn’t in the dropdown → replace with a text input
      const inp3 = document.createElement('input');
      inp3.type = 'text';
      inp3.value = rec.loc3;
      inp3.placeholder = 'Enter other…';
      inp3.addEventListener('input', renderLive);
      ctrl3.replaceWith(inp3);
    } else {
      // normal case: just reselect the matching option
      ctrl3.value = rec.loc3;
    }
  } else {
    // it’s already an <input> (manual entry)
    ctrl3.value = rec.loc3;
  }
}





// ——— Handle manual “Other…” for Location-Tier-1 ———
const locCell = tr.cells[1];
const selects = locCell.querySelectorAll('select');
const sel1 = selects[0];
if (sel1 && rec.loc1 && !location1Opts.includes(rec.loc1)) {
  const inp1 = document.createElement('input');
  inp1.type = 'text';
  inp1.value = rec.loc1;
  inp1.placeholder = 'Enter other…';
  inp1.addEventListener('input', renderLive);
  sel1.replaceWith(inp1);
}

    

// ——— Handle manual “Other…” for Location-Tier-2 ———
const sel2 = selects[1];
if (sel2
    && rec.loc2
    && !location2Opts.includes(rec.loc2)
    && rec.loc2 !== '11KV Feeder Isolator') {
  const inp2 = document.createElement('input');
  inp2.type = 'text';
  inp2.value = rec.loc2;
  inp2.placeholder = 'Enter other…';
  inp2.addEventListener('input', renderLive);
  sel2.replaceWith(inp2);
}


// If this row was a feeder-isolator, fire its change-event so checkboxes appear
const feederSel = tr.cells[1].querySelector('select');
if (feederSel && rec.loc2 === '11KV Feeder Isolator') {
  feederSel.value = rec.loc2;
  feederSel.dispatchEvent(new Event('change'));
  // now restore each phase’s checkboxes & other-text
  ['r','y','b','n'].forEach((c,j) => {
    const cell = tr.cells[(idx===0?3:2) + j];
    const saved = rec[c + 'Side'] || '';
    saved.split(';').map(s=>s.trim()).filter(Boolean).forEach(val => {
      const cb = Array.from(cell.querySelectorAll('.feeder-cb-container input'))
                      .find(x => x.value === val);
      if (cb) cb.checked = true;
      else {
        const oth = cell.querySelector('.feeder-other-input');
        if (oth) oth.value = val;
      }
    });
  });
}


   

    // 2) Put the ambient temp back only on the very first row
    if (idx === 0) {
      const amb = document.getElementById('ambientInput');
      if (amb) amb.value = rec.ambient;
    }

    // 3) Match the same “base” offset you used when saving
    const base = idx === 0 ? 3 : 2;

// 4) Restore R/Y/B/Neutral temperatures + side-dropdown or manual-other
['r','y','b','n'].forEach((c, j) => {
  const cell = tr.cells[base + j];
  // restore the numeric reading
  const numIn = cell.querySelector('input[type="number"]');
  if (numIn) numIn.value = rec[c] || '';

  // now handle the side/dropdown vs. manual-other
  const savedSide = rec[c + 'Side'] || '';
  const sel = cell.querySelector('select');
  if (sel) {
    // if the saved value matches one of the <option>s, use the dropdown
    if ([...sel.options].some(o => o.value === savedSide)) {
      sel.value = savedSide;
    } 
    // otherwise, swap in a free-text <input>
    else if (savedSide) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = savedSide;
      inp.addEventListener('input', renderLive);
      sel.replaceWith(inp);
    }
  }
});


    // 5) Restore image code & remarks
    const imgIn = tr.cells[base + 4].querySelector('input');
    const remIn = tr.cells[base + 5].querySelector('input');
    if (imgIn) imgIn.value = rec.img || '';
    if (remIn) remIn.value = rec.remarks || '';
  });


// tell the initializer we did load saved rows
return true;


}


// --- Render Live Table ---
function renderLive() {
  const lt = document.querySelector('#hotspotLiveTable tbody'); lt.innerHTML = '';
  const rows = document.querySelectorAll('#hotspotTable tbody tr');
  const n = rows.length;

// figure out which rows are LA hotspots
// figure out which rows are LA hotspots
const laStatuses = Array.from(rows).map(tr => {
  const locEls = tr.cells[1].querySelectorAll('select,input');
  const loc2 = locEls[1]?.value;
  return loc2 === 'HV LA Internal Hotspot'
      || loc2 === 'LV LA Internal Hotspot';
});

// compute contiguous non-LA blocks so we only merge adjacent rows
const rowSpanMap = {};
let segStart = null;
laStatuses.forEach((isLA, idx) => {
  if (!isLA) {
    if (segStart === null) segStart = idx;
  } else if (segStart !== null) {
    rowSpanMap[segStart] = idx - segStart;
    segStart = null;
  }
});
if (segStart !== null) {
  rowSpanMap[segStart] = rows.length - segStart;
}



  rows.forEach((tr,i) => {
    const rrow = lt.insertRow();
    rrow.insertCell().textContent = i+1;


// ── Location text with special feeder-isolator formatting ──
const locEls = tr.cells[1].querySelectorAll('select,input');
const loc1 = locEls[0]?.value || '';
const loc2 = locEls[1]?.value || '';
let text;

if (loc2 === '11KV Feeder Isolator') {
  // base: e.g. "Ckt-1 11KV Feeder Isolator"
  text = [loc1, loc2].filter(v => v).join(' ');

  // collect per-phase selections
  const phaseNames = ['R','Y','B','Neutral'];
  const phaseGroups = [];

  phaseNames.forEach((ph, idx) => {
    // original table cell index for this phase
    const offset = (i === 0) ? 3 : 2;
    const phaseCell = tr.cells[offset + idx];

    // 1) checkboxes
    const checked = Array.from(
      phaseCell.querySelectorAll('.feeder-cb-container input:checked')
    ).map(cb => cb.value);

    // 2) manual-other text
    const other = phaseCell.querySelector('.feeder-other-input')?.value.trim();
    if (other) checked.push(other);

    if (checked.length) {
      // map to full forms and join
      const parts = checked.map(opt => feederFullMap[opt] || opt);
      phaseGroups.push(`${parts.join(' & ')} (${ph} Phase)`);
    }
  });

  if (phaseGroups.length) {
    text += ' ' + phaseGroups.join('; ');
  }
} else {
  // ── fallback to your original dropdown-side logic ──
  text = Array.from(locEls).map(e => e.value).filter(v => v).join(' ');

  let sideText = '';
['R','Y','B','Neutral'].forEach((ph, idx) => {
  const offset = (i === 0) ? 3 : 2;
  const cell = tr.cells[offset + idx];

  // first try any <select>
  let val = cell.querySelector('select')?.value || '';
  // if no select-value, fall back to your manual “Other” <input>
  if (!val) {
    const txt = cell.querySelector('input[type="text"]');
    if (txt) val = txt.value.trim();
  }

  if (val) sideText += `${ph} Phase: ${val}, `;
});

if (sideText) {
  sideText = sideText.slice(0, -2);           // drop trailing comma+space
  text += ` (${sideText})`;                   // wrap in brackets
}

}

rrow.insertCell().textContent = text || '---';



    // Ambient
    if (i === 0) {const c = rrow.insertCell(); const ambEl = document.getElementById('ambientInput'); c.textContent = (ambEl ? ambEl.value : '') || '---'; c.rowSpan = n;}

    // R/Y/B/N
const offset = (i === 0) ? 3 : 2;
['r','y','b','n'].forEach((c, idx) => {
  const cell = tr.cells[offset + idx];
  const v = cell.querySelector('input').value || '---';
  rrow.insertCell().textContent = v;
});



    // Image Code
    rrow.insertCell().textContent = tr.cells[7].querySelector('input').value || '---';
    // Remarks
// Action to be Taken
if (laStatuses[i]) {
  // per-row Lightning Arrestor replacement
  const c = rrow.insertCell();
  c.textContent = 
    'The Lightning Arrestor is to be replaced with a healthy one';
  c.contentEditable = true;
}
else if (rowSpanMap[i]) {
  // start of a contiguous “other” block → merge exactly that many rows
  const span = rowSpanMap[i];
  const c = rrow.insertCell();
  c.textContent =
    'All the hotspots detected at switchyard must be rectified to avoid unplanned outage of supply and emergency shutdown. The IR Images are attached for ready reference.';
  c.contentEditable = true;
  c.rowSpan = span;
}
// for other non-LA rows in a block we do nothing (they’re covered by the above rowspan)

// (for the other non-LA rows covered by rowSpan, we skip inserting a cell)

  });

   // re-wire edit listeners on every rebuild
   attachLiveBodyListeners();


}

// helper to get "Hotspot_<Substation>_<DD.MM.YYYY>"
function makeFilename(ext) {
  const sub = localStorage.getItem('selectedSubstation') || 'Substation';
  const now = new Date();
  const dd  = String(now.getDate()).padStart(2, '0');
  const mm  = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `Hotspot_${sub}_${dd}.${mm}.${yyyy}.${ext}`;
}



// --- Download Excel/Doc/PDF ---
function downloadExcel() {
  const tbl=document.getElementById('hotspotLiveTable').cloneNode(true);
  tbl.querySelectorAll('thead th').forEach(th=>{ th.style.fontFamily='Cambria'; th.style.fontSize='12pt'; th.style.fontWeight='bold'; th.style.backgroundColor='#d9d9d9'; th.style.color='#000'; });
  tbl.querySelectorAll('tbody tr').forEach(tr=>tr.querySelectorAll('td').forEach(td=>{ td.style.fontFamily='Cambria'; td.style.fontSize='12pt'; td.style.backgroundColor='#dce6f2'; td.style.color='#000'; }));
  const html='<html><head><meta charset="utf-8"></head><body>'+tbl.outerHTML+'</body></html>';
  const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download = makeFilename('xls');

  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function downloadDoc() {
  const tbl=document.getElementById('hotspotLiveTable').cloneNode(true);
// ── SAFELY CENTER COLUMNS 3–8 VIA INLINE STYLE ──
Array.from(tbl.querySelectorAll('tbody tr')).forEach(tr => {
  [0, 2, 3, 4, 5, 6, 7].forEach(idx => {
    const cell = tr.cells[idx];
    if (cell) cell.style.textAlign = 'center';
  });
});



 const pre = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
   'table{border-collapse:collapse;width:100%;}@page{size:landscape;}' +
   'thead th{font-family:Cambria;font-size:11pt;font-weight:bold;background:#d9d9d9;color:#000;}' +
   'tbody td{font-family:Cambria;font-size:11pt;background:#dce6f2;color:#000;}' +
   /* center only columns 3–8 with higher specificity and !important */
   '#hotspotLiveTable td:nth-child(3),' +
   '#hotspotLiveTable td:nth-child(4),' +
   '#hotspotLiveTable td:nth-child(5),' +
   '#hotspotLiveTable td:nth-child(6),' +
   '#hotspotLiveTable td:nth-child(7),' +
   '#hotspotLiveTable td:nth-child(8){' +
     'text-align:center!important;' +
   '}' +
   'th,td{border:1px solid #000;}' +
 '</style></head><body>';
  const html=pre+tbl.outerHTML+'</body></html>';
  const blob=window.htmlDocx.asBlob(html,{orientation:'landscape',margins:{top:720,right:720,bottom:720,left:720}});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download = makeFilename('docx');

  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function downloadPdf() {
  const original=document.getElementById('hotspotLiveTable');
  const clone=original.cloneNode(true);
  // inline black text + backgrounds
  clone.querySelectorAll('th').forEach(th=>{ th.style.color='#000'; th.style.backgroundColor='#d9d9d9'; th.style.fontFamily='Cambria'; th.style.fontSize='12pt'; th.style.fontWeight='bold'; });
  clone.querySelectorAll('td').forEach(td=>{ td.style.color='#000'; td.style.backgroundColor='#dce6f2'; td.style.fontFamily='Cambria'; td.style.fontSize='12pt'; });
  const wrapper=document.createElement('div'); wrapper.style.position='absolute'; wrapper.style.left='-9999px'; wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  html2pdf().set({margin:10,filename:makeFilename('pdf'),jsPDF:{unit:'pt',format:'a4',orientation:'landscape'},html2canvas:{scale:2}}).from(clone).save().finally(()=>wrapper.remove());
}

// ── LIVE-TABLE PERSISTENCE ──

// 1) Save the current `<tbody>` HTML to localStorage
function saveLiveBody() {
  const html = document.querySelector('#hotspotLiveTable tbody').innerHTML;
  localStorage.setItem('hotspotLiveTableBody', html);
}

// 2) After rendering or restoring, re-attach “input” handlers to every cell
function attachLiveBodyListeners() {
  document
    .querySelectorAll('#hotspotLiveTable tbody td')
    .forEach(td => td.addEventListener('input', saveLiveBody));
}

// 3) Also catch page unloads (reload/close) to persist last edits
window.addEventListener('beforeunload', saveLiveBody);


// ── RESET HANDLER ──
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all hotspot entries and live data?')) return;

  // 1) Remove saved data
  localStorage.removeItem('hotspotData');
  localStorage.removeItem('hotspotLiveTableBody');

  // 2) Clear both tables’ <tbody>
  document.querySelector('#hotspotTable tbody').innerHTML      = '';
  document.querySelector('#hotspotLiveTable tbody').innerHTML  = '';

  // 3) Reset the ambient-cell tracker so addRow() will recreate it
  window.ambientCell = null;

  // 4) (Optional) Add a fresh blank row for the user
  addRow();
});




