// === Configuration ===
const equipmentOptions = [
  '33KV CT','33KV PT','33KV VCB','Bushing','Cable',
  'Lightning Arrestor','33KV Pin Insulator','11KV Pin Insulator',
  'Post Insulator','Conductor','Other'
];
const locationOptions = [
  'PTR-1','PTR-2','PTR-3','PTR-4','PTR-5','PTR-6','PTR-7',
  'Bus PT','PT-1','PT-2','PT-3','Station Service Transformer','Other'
];
const sideOptions = [
  'Both Sides','PTR Side','Bus Side','CT Side','VCB Side','LA Side','Line Side',
  'Incoming Side','Cable Side','Station Transformer Side','Other'
];
const classifications = [
  'Corona','Destructive Corona','Mild Tracking','Tracking',
  'Corona with Mild Tracking','Corona with Tracking',
  'Destructive Corona with Tracking','Severe Tracking',
  'Corona with Severe Tracking','Arcing'
];

// priority list: highest (0) to lowest (9); any other => 10
const priorityList = [
  '33KV CT','33KV PT','33KV VCB','Bushing','Cable',
  'Lightning Arrestor','33KV Pin Insulator','11KV Pin Insulator',
  'Post Insulator','Conductor'
];

const prompt2Maps = {
  preciseMap: {
    'Bushing':            ['HV Bushing','LV Bushing','HV Bushing Connector','LV Bushing Connector','Other'],
    'Cable':              ['33KV Cable Head','33KV Cable Lead','11KV Cable Head','11KV Cable Lead','33KV Cable Socket Nut-Bolt','11KV Cable Socket Nut-Bolt','Other'],
    '33KV Pin Insulator': ['1st Isolator 33KV Pin','1st DP 33KV Pin','Isolator before CT 33KV Pin','Isolator after VCB 33KV Pin','Isolator before VCB 33KV Pin','Isolator 33KV Pin','Other'],
    '11KV Pin Insulator': ['11KV Pin','11KV Feeder Isolator 11KV Pin','Other'],
    'Conductor':          ['HV Conductor','LV Conductor','LV Bushing to Cable Conductor','Other'],
    'Lightning Arrestor':  ['HV LA','LV LA','Other']
  },
  actionTemplates: {
    '33KV CT': {
      'Corona':                      'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said CT.',
      'Destructive Corona':          'Oil checking as well as necessary cleaning and maintenance of this CT should be done. Necessary checking of tightness of the said CT secondary wires is also required.',
      'Mild Tracking':               'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said CT.',
      'Tracking':                    'Necessary cleaning and maintenance are required. Insulation resistance in between CT primary to earth and primary to secondary by 5 kV megger and CT secondary to earth by 500 V megger are to be measured and if low, appropriate action taken.',
      'Corona with Mild Tracking':   'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said CT.',
      'Corona with Tracking':        'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said CT. Also, Insulation resistance in between CT primary to earth and Primary to secondary by 5KV megger and CT secondary to earth by 500Volt megger are to be measured and if found low then appropriate action is to be taken.',
      'Destructive Corona with Tracking': 'Oil checking as well as necessary cleaning and maintenance of this CT should be done. Necessary checking of tightness of the said CT secondary wires is also required. Also perform IR checks as above and take action if low.Insulation resistance in between CT primary to earth and Primary to secondary by 5KV megger and CT secondary to earth by 500Volt megger are to be measured and if found low then appropriate action is to be taken.',
      'Severe Tracking':             'Necessary cleaning and maintenance are required. Insulation resistance in between CT primary to earth and Primary to secondary by 5KV megger and CT secondary to earth by 500Volt megger are to be measured and if found low then the CT is to be replaced.',
      'Corona with Severe Tracking': 'Necessary cleaning, maintenance and oil checking of the said CT. Insulation resistance in between CT primary to earth and Primary to secondary by 5KV megger and CT secondary to earth by 500Volt megger are to be measured and if found low then the CT is to be replaced.',
      'Arcing':                      'Necessary action to be taken care of towards replacement of the CT with a healthy one.'
    },
    '33KV PT': {
      /* same as CT but “PT” */
      'Corona':                      'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said PT.',
      'Destructive Corona':          'Oil checking as well as necessary cleaning and maintenance of this PT should be done. Necessary checking of tightness of the said PT secondary wires is also required.',
      'Mild Tracking':               'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said PT.',
      'Tracking':                    'Necessary cleaning and maintenance are required. Insulation resistance in between PT primary to earth and primary to secondary by 5 kV megger and PT secondary to earth by 500 V megger are to be measured and if low, appropriate action taken.',
      'Corona with Mild Tracking':   'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said PT.',
      'Corona with Tracking':        'Necessary action to be taken care of towards cleaning, maintenance and oil checking of the said PT. Insulation resistance in between PT primary to earth and primary to secondary by 5 kV megger and PT secondary to earth by 500 V megger are to be measured and if low, appropriate action taken.',
      'Destructive Corona with Tracking': 'Oil checking as well as necessary cleaning and maintenance of this PT should be done. Insulation resistance in between PT primary to earth and primary to secondary by 5 kV megger and PT secondary to earth by 500 V megger are to be measured and if low, appropriate action taken.',
      'Severe Tracking':             'Necessary cleaning and maintenance are required. Insulation resistance in between PT primary to earth and Primary to secondary by 5KV megger and PT secondary to earth by 500Volt megger are to be measured and if found low then the PT is to be replaced.',
      'Corona with Severe Tracking': 'Necessary cleaning, maintenance and oil checking of the said PT. Insulation resistance in between PT primary to earth and Primary to secondary by 5KV megger and PT secondary to earth by 500Volt megger are to be measured and if found low then the PT is to be replaced.',
      'Arcing':                      'Necessary action to be taken care of towards replacement of the PT with a healthy one.'
    },
    '33KV VCB': {
      default: 'IR to be measured between upper pad and lower pad of the all VCBs for checking of VI insulation and lower pad to earth for tie rod insulation. Meggering should be executed through 5 KV megger. '
    },
    'Bushing': {
      default: 'Thorough maintenance, cleaning and release of tapped air (if any) from the said bushing should be carried out.'
    },
    '33KV Pin Insulator': {
      default: 'Binding of the pin insulators should be done properly. IR measurement of these pin insulators is to be done. If the IR value is found low then these pin insulators may be replaced.'
    },
    '11KV Pin Insulator': {
      default: 'Binding of the pin insulators should be done properly. IR measurement … if low then they may be replaced.'
    },
    'Post Insulator': {
      default: 'Binding of the post insulators should be done properly. IR measurement of these post insulators is to be done. If the IR value is found low then these post insulators may be replaced.'
    },
    'Conductor': {
      default: 'This conductor has to be replaced with a new and healthy one.'
    },
    'Lightning Arrestor': {
      default: 'Earthing of the LA to be checked and necessary action to be taken if the earthing of LA found open.Also, IR of the said LA also needs to be checked and to be replaced if the value found low.'
    },
    'Cable': {
      default: 'Cleaning, treatment of cable termination joint and subsequent application of amalgamated tape of HV insulation grade must be carried out.',
      'X-Cbl': 'If possible, avoid the cable crossing by rearrange the cable at both side and increase the electrical clearance between the phases of cable crossing.',
      'C-Dep': 'Also, carbon deposition has been observed on 33 kV cable terminations.',
      'Trck Mrk': 'Also, tracking mark has been observed on 33 kV cable terminations.'
    }
  }
};

// === Helpers ===
function createDropdown(opts, onChange) {
  const sel = document.createElement('select');
  sel.innerHTML = '<option value=""></option>' + opts.map(o => `<option>${o}</option>`).join('');
  if (onChange) sel.addEventListener('change', () => onChange.call(sel));
  return sel;
}

function createPhaseField() {
  const wrap = document.createElement('div');
  const num  = Object.assign(document.createElement('input'), { type:'number', placeholder:'dB' });
  const cls  = createDropdown(classifications, null);
  const cbw  = document.createElement('div'); cbw.className='checkbox-container';
['Rep','IR','Audible','X-Cbl','C-Dep','Trck Mrk'].forEach(l=>{
  const lab = document.createElement('label');
  const cb  = document.createElement('input'); cb.type='checkbox'; cb.value=l;

  // Add a special class to Cable-specific checkboxes
  if (['X-Cbl','C-Dep','Trck Mrk'].includes(l)) {
    cb.classList.add('cable-only');
    lab.style.display = 'none';  // initially hidden
  }

  lab.append(cb, document.createTextNode(' ' + l));
  cbw.append(lab);
});

  const rec = Object.assign(document.createElement('input'), { type:'number', placeholder:'Recording No.' });
  wrap.append(num, cls, cbw, rec);
  return wrap;
}

// === Main Functions ===

function addRow() {
  const tbody = document.querySelector('#ultrasoundTable tbody');
  const tr    = document.createElement('tr');

  // Equipment
  const tdEq = document.createElement('td');

const selEq = createDropdown(equipmentOptions, function(){
  const value = this.value;

  // Auto-fill or editable precise location
  if (['33KV CT','33KV PT','33KV VCB','Post Insulator'].includes(value)) {
    tdPrec.innerHTML = '';
    const inp = document.createElement('input');
    inp.type='text'; inp.value=value; inp.readOnly=true;
    tdPrec.append(inp);
  } else {
    updatePrecise(this, tdPrec);
  }

  // Disable side dropdown for specific Equipment
  const disableSideFor = ['33KV CT','33KV PT','33KV VCB','Bushing','Lightning Arrestor'];
  const sideInput = tdSide.querySelector('select,input');
  if (sideInput && sideInput.tagName === 'SELECT') {
    sideInput.disabled = disableSideFor.includes(value);
  }

  // Show/Hide Cable-specific checkboxes
  const row = this.closest('tr');
  row.querySelectorAll('.checkbox-container label').forEach(lab => {
    const cb = lab.querySelector('input[type="checkbox"]');
    if (cb && cb.classList.contains('cable-only')) {
      lab.style.display = (value === 'Cable') ? 'inline-flex' : 'none';
    }
  });

  // “Other” option
if (value === 'Other') {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Enter Equipment Details';
  // ← attach live-update
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}


  renderLive();
});
tdEq.append(selEq); tr.append(tdEq);


  // Location
  const tdLoc = document.createElement('td');
  const selLoc = createDropdown(locationOptions, function(){
if (this.value === 'Other') {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Enter location';
  // ← attach live-update
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}
renderLive();

  });
  tdLoc.append(selLoc); tr.append(tdLoc);

  // Precise
  const tdPrec = document.createElement('td');
  tdPrec.append(createDropdown([],null)); tr.append(tdPrec);

  // Side
  const tdSide = document.createElement('td');
  const selSide = createDropdown(sideOptions, function(){
if (this.value === 'Other') {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Enter side';
  // ← attach live-update
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}
renderLive();

  });
  tdSide.append(selSide); tr.append(tdSide);

  // R/Y/B/Neutral
  for(let i=0; i<4; i++){
    const td = document.createElement('td');
    const fld = createPhaseField();
    fld.querySelectorAll('input,select').forEach(e=>e.addEventListener('input',renderLive));
    td.append(fld); tr.append(td);
  }

  // Remarks
  const tdRem = document.createElement('td');
  const inpRem = document.createElement('input');
  inpRem.type='text'; inpRem.placeholder='Remarks';
  inpRem.addEventListener('input',renderLive);
  tdRem.append(inpRem); tr.append(tdRem);

  // Delete
  const tdDel = document.createElement('td');
  const btnDel = document.createElement('button');
  btnDel.className='remove-btn'; btnDel.textContent='Delete';
  btnDel.onclick=()=>{ tr.remove(); renderLive(); };
  tdDel.append(btnDel); tr.append(tdDel);

  tbody.append(tr);
  renderLive();
}

function updatePrecise(sel, cell) {
  cell.innerHTML = '';
  const opts = prompt2Maps.preciseMap[sel.value]||[];
  if (opts.length) {
    const dd = createDropdown(opts, function(){
if (this.value === 'Other') {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Enter precise';
  // ← attach live-update
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}
renderLive();

    });
    cell.append(dd);
  } else {
    const inp=document.createElement('input');
    inp.type='text'; inp.placeholder='Enter precise location';
    inp.addEventListener('input',renderLive);
    cell.append(inp);
  }
}

function renderLive(){
  const lb = document.querySelector('#liveTable tbody');
  lb.innerHTML = '';
  const rows = Array.from(document.querySelectorAll('#ultrasoundTable tbody tr'));
  const groups = {};
  rows.forEach(r=>{
    const eq = r.cells[0].querySelector('select,input').value;
    (groups[eq]=groups[eq]||[]).push(r);
  });

  // sort equipment keys by priorityList
  const eqKeys = Object.keys(groups).sort((a,b)=>{
    const iA = priorityList.indexOf(a), iB = priorityList.indexOf(b);
    const pA = iA<0? priorityList.length : iA;
    const pB = iB<0? priorityList.length : iB;
    return pA - pB;
  });

  let idx=1;
  eqKeys.forEach(eq=>{
    const grp = groups[eq];
    const isBus = eq==='Bushing', isPin = eq==='33KV Pin Insulator';

    grp.forEach((r,i)=>{
      const tr=document.createElement('tr');
      // Sl. No.
      const td0=document.createElement('td'); td0.textContent=idx++; tr.append(td0);
      // Equipment (once)
      if(i===0){
        const td1=document.createElement('td');
        td1.textContent=eq;
        td1.rowSpan=grp.length;
        tr.append(td1);
      }
      // Location+Precise+Side+Remarks
      const loc=r.cells[1].querySelector('select,input').value;
      const pr =r.cells[2].querySelector('select,input').value;
      const sd =r.cells[3].querySelector('select,input').value;
      const rm =r.cells[8].querySelector('input').value;
      let text=loc+(pr?' '+pr:'');
      if(sd) text+=` (${sd})`;
      if(rm) text+=' – '+rm;
      const td2=document.createElement('td');
      td2.textContent=text;
      tr.append(td2);

      // Phases
      ['R Phase','Y Phase','B Phase','Neutral'].forEach((ph,j)=>{
        const f=r.cells[4+j].firstChild;
        const v=f.querySelector('input[type=number]').value;
        const cls=f.querySelector('select').value;
        const cbs={};
        f.querySelectorAll('input[type=checkbox]').forEach(cb=>cbs[cb.value]=cb.checked);
        const td=document.createElement('td');
const rec = f.querySelector('input[placeholder="Recording No."]').value;
if(v && cls){
  let out = `${v} dB (${cls})`;
  if(cbs['Audible']) out += '<br/><strong>Audible</strong>';
  if(rec) out += `<br/><strong>Recording No- ${rec}</strong>`;
  td.innerHTML = out;
} else if (rec) {
  td.innerHTML = `<strong>Recording No- ${rec}</strong>`;
} else {
  td.textContent = '---';
}


        tr.append(td);
      });

      // Action (editable)
      if(isBus||isPin){
        if(i===0){
          const tdA=document.createElement('td');
          tdA.textContent = isBus
            ? prompt2Maps.actionTemplates['Bushing'].default
            : prompt2Maps.actionTemplates['33KV Pin Insulator'].default;
          tdA.rowSpan=grp.length;
          tdA.contentEditable = true;
          tr.append(tdA);
        }
      } else {
        const tdA=document.createElement('td');
        tdA.contentEditable = true;
        const acts=[];
        ['R Phase','Y Phase','B Phase','Neutral'].forEach((ph,j)=>{
          const f=r.cells[4+j].firstChild;
          const v=f.querySelector('input[type=number]').value;
          const cls=f.querySelector('select').value;
          const cbs={};
          f.querySelectorAll('input[type=checkbox]').forEach(cb=>cbs[cb.value]=cb.checked);
          if(!v||!cls) return;
          const arr=[];
          if(cbs['Rep']){
            arr.push('The same is to be replaced with a healthy one.');
          } else {
            const tmpl=prompt2Maps.actionTemplates[eq]||{};
            if(tmpl[cls]) arr.push(tmpl[cls]);
            else if(tmpl['default']) arr.push(tmpl['default']);
            if(cbs['IR']) arr.push('Insulation resistance in between primary to earth and Primary to secondary by 5KV megger and secondary to earth by 500Volt megger are to be measured and if found low then appropriate action is to be taken.');
            if(eq==='Cable'){
              ['X-Cbl','C-Dep','Trck Mrk'].forEach(fl=>{
                if(cbs[fl]&&tmpl[fl]) arr.push(tmpl[fl]);
              });
            }
          }
          if(arr.length){
            acts.push(`<u><strong>${ph}:</strong></u><br/>${arr.join('<br/>')}`);
          }
        });
        tdA.innerHTML = acts.join('<br/>');

        tr.append(tdA);
      }

      lb.append(tr);
    });
  });

  // after rebuilding the live table, re-apply editability
  makeLiveTableEditable();
}

function saveFormData(){
  const data=[];
  document.querySelectorAll('#ultrasoundTable tbody tr').forEach(r=>{
    const e={
      equipment:r.cells[0].querySelector('select,input').value,
      location: r.cells[1].querySelector('select,input').value,
      precise:  r.cells[2].querySelector('select,input').value,
      side:     r.cells[3].querySelector('select,input').value,
      remarks:  r.cells[8].querySelector('input').value
    };
    ['R','Y','B','N'].forEach((k,i)=>{
      const f=r.cells[4+i].firstChild;
e[k]={
  value: f.querySelector('input[placeholder="dB"]').value,
  class: f.querySelector('select').value,
  rep:   f.querySelector('input[value="Rep"]').checked,
  ir:    f.querySelector('input[value="IR"]').checked,
  aud:   f.querySelector('input[value="Audible"]').checked,
  rec:   f.querySelector('input[placeholder="Recording No."]').value
};
    });
    data.push(e);
  });
  localStorage.setItem('ultrasoundData',JSON.stringify(data));
  alert('Data saved.');
}

function loadFormData(){
  const s=localStorage.getItem('ultrasoundData');
  if(!s) return;
  JSON.parse(s).forEach(e=>{
    addRow();
    const r=document.querySelector('#ultrasoundTable tbody tr:last-child');
// 1) Equipment Details: use dropdown if known, else text input
const eqCell = r.cells[0];
const eqVal  = e.equipment;
const eqSel  = eqCell.querySelector('select');
if (equipmentOptions.includes(eqVal)) {
  eqSel.value = eqVal;
} else {
  const inp = document.createElement('input');
  inp.type  = 'text';
  inp.value = eqVal;
  inp.placeholder = 'Enter Equipment Details';
  inp.addEventListener('input', renderLive);
  eqSel.replaceWith(inp);
}

// 2) Location: same logic
const locCell = r.cells[1];
const locVal  = e.location;
const locSel  = locCell.querySelector('select');
if (locationOptions.includes(locVal)) {
  locSel.value = locVal;
} else {
  const inp = document.createElement('input');
  inp.type  = 'text';
  inp.value = locVal;
  inp.placeholder = 'Enter location';
  inp.addEventListener('input', renderLive);
  locSel.replaceWith(inp);
}

// 3) Precise Location: regenerate dropdown based on equipment, then apply custom
updatePrecise(r.cells[0].querySelector('select,input'), r.cells[2]);
const precCell = r.cells[2];
const precVal  = e.precise;
const precSel  = precCell.querySelector('select');
if (precSel) {
  const found = Array.from(precSel.options).some(o => o.value === precVal);
  if (found) {
    precSel.value = precVal;
  } else if (precVal) {
    const inp = document.createElement('input');
    inp.type  = 'text';
    inp.value = precVal;
    inp.placeholder = 'Enter precise location';
    inp.addEventListener('input', renderLive);
    precSel.replaceWith(inp);
  }
} else {
  const inp = precCell.querySelector('input');
  if (inp) inp.value = precVal;
}

  // 4) Side: dropdown when standard, else text input; also reapply disable logic
  const sideCell = r.cells[3];
  const sideVal  = e.side;
  const sideSel  = sideCell.querySelector('select');
  const disableSideFor = ['33KV CT','33KV PT','33KV VCB','Bushing','Lightning Arrestor'];
  if (sideSel && sideOptions.includes(sideVal)) {
    sideSel.value = sideVal;
    // ← immediately re-disable here too
    sideSel.disabled = disableSideFor.includes(e.equipment);
  } else if (sideSel && sideVal) {
    const inp = document.createElement('input');
    inp.type  = 'text';
    inp.value = sideVal;
    inp.placeholder = 'Enter side';
    inp.addEventListener('input', renderLive);
    sideSel.replaceWith(inp);
  }





    ['R','Y','B','N'].forEach((k,i)=>{
      const f=r.cells[4+i].firstChild;
      f.querySelector('input[placeholder="dB"]').value             = e[k].value;
      f.querySelector('input[placeholder="Recording No."]').value  = e[k].rec || '';
      f.querySelector('select').value                   = e[k].class;
      f.querySelector('input[value="Rep"]').checked     = e[k].rep;
      f.querySelector('input[value="IR"]').checked      = e[k].ir;
      f.querySelector('input[value="Audible"]').checked = e[k].aud;
    });
    r.cells[8].querySelector('input').value = e.remarks;
  });

  renderLive();
}

// ———————— global download handlers ————————
// wire up Download buttons
document.getElementById('downloadExcelBtn').addEventListener('click', downloadExcel);
document.getElementById('downloadDocBtn').addEventListener('click', downloadDoc);
document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);

function downloadExcel() {
  // 1) grab your live table HTML
  const tableHTML = document.getElementById('liveTable').outerHTML;

  // 2) wrap it in a full Excel-HTML document
  const preamble =
    '\uFEFF' + // UTF-8 BOM
    '<html xmlns:x="urn:schemas-microsoft-com:office:excel">' +
    '<head><meta charset="UTF-8"></head><body>';
  const closing = '</body></html>';
  const excelHTML = preamble + tableHTML + closing;

  // 3) build a Blob with the old Excel MIME
  const blob = new Blob([excelHTML], {
    type: 'application/vnd.ms-excel'
  });

  // 4) create/download as .xls
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sub   = localStorage.getItem('selectedSubstation') || 'Unknown';
  const now   = new Date();
  const yyyy  = now.getFullYear();
  const mm    = String(now.getMonth()+1).padStart(2,'0');
  const dd    = String(now.getDate()).padStart(2,'0');
  a.href        = url;
  a.download    = `Ultrasound_${sub}_${dd}-${mm}-${yyyy}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}


// generate a Word .doc file from the live table HTML
function downloadDoc() {
  // 1) clone the live table so we can style it without touching the on-screen version
  const original = document.getElementById('liveTable');
  const clone    = original.cloneNode(true);

// ——— Enforce No Spacing & single black borders ———
clone.style.borderCollapse = 'collapse';
clone.querySelectorAll('th, td').forEach(cell => {
  cell.style.border  = '1px solid black';
  cell.style.margin  = '0';    // removes extra spacing
  cell.style.padding = '0';    // tightens cell padding
  cell.style.color   = 'black';
});




  // 2) header row styling
  const headerRow = clone.querySelector('thead tr');
  headerRow.style.backgroundColor = '#a7abb7';
  headerRow.querySelectorAll('th').forEach(th => {
    th.style.fontFamily = 'Cambria';
    th.style.fontSize   = '11pt';
    th.style.color      = 'black';         // <— force header text black
    th.style.border     = '1px solid black'; // <— ensure header borders too
  });

  // 3) row-group colouring & uniform Action-font sizing
  const rows     = Array.from(clone.querySelectorAll('tbody tr'));
  const colors   = [
    '#f0f8ff','#fafad2','#e6e6fa','#fff0f5',
    '#f0fff0','#f5f5f5','#fffaf0','#f5fffa',
    '#f5f5dc','#f0ffff'
  ];
  let currentEq  = null;
  let colorIndex = -1;
  let lastEq     = null;

  rows.forEach(tr => {
    // if this row has the merged Equipment cell, pick up its text
    const eqCell = tr.querySelector('td[rowspan]');
    if (eqCell) {
      lastEq    = eqCell.textContent;
      currentEq = null;    // reset so we pick a new colour for this group
    }
    // when equipment changes, advance to next colour
    if (lastEq !== currentEq) {
      currentEq  = lastEq;
      colorIndex = (colorIndex + 1) % colors.length;
    }
    // apply to every cell in the row
    Array.from(tr.cells).forEach((td, colIdx, all) => {
      td.style.backgroundColor = colors[colorIndex];
      td.style.fontFamily      = 'Cambria';
      // Action-column is always the last cell in each row
      const isAction = (colIdx === all.length - 1);
      td.style.fontSize        = isAction ? '9pt' : '11pt';
    });
  });


  // 4) wrap in Word HTML with landscape and font defaults
const preamble =
  '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' 
         'xmlns:w="urn:schemas-microsoft-com:office:word" ' 
         'xmlns="http://www.w3.org/TR/REC-html40">' 
  '<head><meta charset="utf-8">' 
  '<style>' 
    '@page { size: landscape; } ' 
    'body { font-family: Cambria; font-size: 11pt; margin: 0; } ' 
    'table { border-collapse: collapse; } ' 
    'th, td { border: 1px solid black; margin: 0; padding: 0; } ' 
    'p { margin: 0; } '       // ensures “No Spacing” on any paragraph
  '</style></head><body>';



  const closing = '</body></html>';

  const html = preamble + clone.outerHTML + closing;
localStorage.setItem('ultrasoundDocHTML', html);
  const blob = new Blob(
    ['\ufeff', html],
    { type: 'application/msword' }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href    = url;
  
  // build filename as Ultrasound_<Substation>_<YYYY-MM-DD>.doc
  const sub   = localStorage.getItem('selectedSubstation') || 'Unknown';
  const now   = new Date();
const day   = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0');
const year  = now.getFullYear();
const date  = `${day}-${month}-${year}`;
  a.download = `Ultrasound_${sub}_${date}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}










function downloadPdf() {
renderLive(); // ensure live table is up-to-date

  const substation = localStorage.getItem('selectedSubstation') || 'Unknown';
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const formattedDate = `${dd}.${mm}.${yyyy}`;

  // Create a deep clone of the full live table content
  const liveTable = document.getElementById('liveTable');
  const tableClone = liveTable.cloneNode(true);
// ── Flatten any rowSpan on Equipment cells so each row stands alone ──
const bodyRows = tableClone.querySelectorAll('tbody tr');
bodyRows.forEach((tr, idx) => {
  const spanned = tr.querySelector('td[rowspan]');
  if (spanned) {
    const spanCount = parseInt(spanned.getAttribute('rowspan'), 10);
    const text = spanned.textContent.trim();
    // reset this cell to span only itself
    spanned.removeAttribute('rowspan');
    // duplicate into each following row in the group
    for (let k = 1; k < spanCount; k++) {
      const target = bodyRows[idx + k];
      if (target) {
       // clone the original cell (with classes & inline styles)
       const dup = spanned.cloneNode(true);
       dup.removeAttribute('rowspan');
        // styling (borders, fonts) will be reapplied later
        target.insertBefore(dup, target.children[1]);
      }
    }
  }
});


  const heading = document.createElement('h2');
  heading.textContent = `Ultrasound Findings at ${substation}`;
  heading.style.textAlign = 'center';
  heading.style.fontFamily = 'Cambria';
  heading.style.fontSize = '16pt';
  heading.style.margin = '10px 0';
  heading.style.color = 'black';

  // Apply styling
  tableClone.style.borderCollapse = 'collapse';
  tableClone.style.width = '100%';
tableClone.style.maxWidth = '100%';
tableClone.style.overflowX = 'auto';
tableClone.style.wordBreak = 'break-word';


// Get the exact text of the Action column header
const actionHeader = "Action to be taken";
let actionColIndex = -1;
const ths = tableClone.querySelectorAll("thead tr th");
ths.forEach((th, idx) => {
  if (th.textContent.trim().toLowerCase() === actionHeader.toLowerCase()) {
    actionColIndex = idx;
  }
});

tableClone.querySelectorAll("tr").forEach((row, rowIndex) => {
  const cells = Array.from(row.children);

  // Avoid splitting table rows across pages
  row.style.breakInside = "avoid";
  row.style.pageBreakInside = "avoid";
  row.style.pageBreakAfter = "auto";

  cells.forEach((cell, cellIndex) => {
    cell.style.border = "1px solid black";
    cell.style.padding = "4px";
    cell.style.color = "black";
    cell.style.fontFamily = "Cambria";

    const isHeader = cell.tagName.toLowerCase() === "th";
    const isActionCol = cellIndex === actionColIndex;

    if (isHeader) {
      cell.style.fontSize = "11pt";
      cell.style.backgroundColor = "#d3d3d3";
      cell.style.textAlign = "center";
      cell.style.whiteSpace = "normal";
      cell.style.wordBreak = "break-word";
      cell.style.minWidth = "80px";
    } else {
      cell.style.fontSize = isActionCol ? "9pt" : "10pt";
      cell.style.textAlign = isActionCol ? "left" : "center";
    }
  });
});






  // Add background coloring group-wise like DOC
// Add background coloring group-wise like DOC
const groupColors = [
  '#f0f8ff', '#fafad2', '#e6e6fa', '#fff0f5',
  '#f0fff0', '#f5f5f5', '#fffaf0', '#f5fffa',
  '#f5f5dc', '#f0ffff'
];
let currentEq = '';
let colorIndex = -1;
const pdfRows = tableClone.querySelectorAll('tbody tr');
pdfRows.forEach(row => {
  // equipment name is always in cell 1 once rowSpan is flattened
  const eqText = row.cells[1].textContent.trim();
  if (eqText !== currentEq) {
    currentEq = eqText;
    colorIndex = (colorIndex + 1) % groupColors.length;
  }
  Array.from(row.cells).forEach(cell => {
    cell.style.backgroundColor = groupColors[colorIndex];
  });
});


  const wrapper = document.createElement('div');
  wrapper.style.backgroundColor = 'white';
  wrapper.style.padding = '20px';
  wrapper.appendChild(heading);
  wrapper.appendChild(tableClone);

  const options = {
    margin:       0.5,
    filename:     `Ultrasound_${substation}_${formattedDate}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },

    jsPDF:        { unit: 'in', format: 'legal', orientation: 'landscape' }
  };

  // Trigger download
document.body.appendChild(wrapper); // force render

// Add Note below the table
const note = document.createElement('div');
note.innerHTML = `<p style="
  font-family: Cambria;
  font-size: 11pt;
  margin-top: 20px;
  text-align: left;
  color: black;">
  <strong>Note:</strong> This is a draft copy of the ultrasound findings which has been given to the concerned person instantly after the Condition Monitoring. However, the final report shall be sent through e-mail.
</p>`;
wrapper.appendChild(note);


// Add Watermark - full screen diagonal overlay
const watermark = document.createElement('div');
watermark.textContent = 'Draft Copy';
Object.assign(watermark.style, {
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-15deg)',
  fontSize: '120px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontFamily: 'Cambria',
  zIndex: 0,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  width: '100%',
  textAlign: 'center',
});
wrapper.style.position = 'relative'; // <-- ensure wrapper can anchor absolute elements
wrapper.appendChild(watermark);




document.body.appendChild(wrapper); // force render

html2pdf().set(options).from(wrapper).save().then(() => {
  document.body.removeChild(wrapper);    // cleanup
  document.body.removeChild(watermark);  // cleanup watermark after download
});


}




// ——— Enable editing & persistence for live-table cells ———
function makeLiveTableEditable() {
  document.querySelectorAll('#liveTable tbody td').forEach(cell => {
    cell.contentEditable = true;
    cell.addEventListener('input', () => {
      localStorage.setItem(
        'ultrasoundLiveTable',
        document.querySelector('#liveTable tbody').innerHTML
      );
    });
  });
}


// ———————— RESET HANDLER ————————
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all ultrasound entries and live data?')) return;

  // 1. Clear local storage
  localStorage.removeItem('ultrasoundData');
  // also clear any saved live-table edits
  localStorage.removeItem('ultrasoundLiveTable');

  // 2. Clear form and live table
  document.querySelector('#ultrasoundTable tbody').innerHTML = '';
  document.querySelector('#liveTable tbody').innerHTML = '';

  // 3. Add one blank row
  addRow();
});


// — Persist 'Side' dropdown disabled state after page reload —
window.addEventListener('load', () => {
  const disableSideFor = [
    '33KV CT',
    '33KV PT',
    '33KV VCB',
    'Bushing',
    'Lightning Arrestor'
  ];
  document
    .querySelectorAll('#ultrasoundTable tbody tr')
    .forEach(row => {
      const eqVal = row.cells[0]
        .querySelector('select,input')
        .value;
      const sideSel = row.cells[3]
        .querySelector('select,input');
      if (sideSel && sideSel.tagName === 'SELECT') {
        sideSel.disabled = disableSideFor.includes(eqVal);
      }
    });
});


