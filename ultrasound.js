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
  'PTR Side','Bus Side','CT Side','VCB Side','LA Side','Line Side',
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

// — persist custom live-table actions —
let manualActions = JSON.parse(localStorage.getItem('ultrasoundActions') || '{}');

// — persist entire live-table HTML —
function saveLiveTableHTML() {
  const html = document.querySelector('#liveTable tbody').innerHTML;
  localStorage.setItem('ultrasoundLiveTableHTML', html);
}

function loadLiveTableHTML() {
  const html = localStorage.getItem('ultrasoundLiveTableHTML');
  if (html) {
    document.querySelector('#liveTable tbody').innerHTML = html;
  }
}


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
    lab.append(cb, document.createTextNode(' '+l));
    cbw.append(lab);
  });
  const rec = Object.assign(document.createElement('input'), { type:'number', placeholder:'Recording No.' });
  rec.className = 'recNo';   
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
    // if CT/PT/VCB: auto-precise
    if (['33KV CT','33KV PT','33KV VCB','Post Insulator'].includes(this.value)) {
      tdPrec.innerHTML = '';
      const inp = document.createElement('input');
      inp.type='text'; inp.value=this.value; inp.readOnly=true;
      tdPrec.append(inp);
    } else {
      updatePrecise(this, tdPrec);
    }
    // if “Other”: manual
if (this.value==='Other') {
  const inp = document.createElement('input');
  inp.type        = 'text';
  inp.placeholder = 'Enter Equipment Details';
  // immediately re-run Precise-location logic whenever you finish typing
  inp.addEventListener('change', () => updatePrecise(inp, tdPrec));
  // immediately refresh the live table as you type
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}


  // — new: disable Side dropdown when appropriate —
  const disableFor = ['33KV CT','33KV PT','33KV VCB','Bushing','Lightning Arrestor'];
  if (disableFor.includes(this.value)) {
    selSide.disabled = true;
    selSide.value = '';
  } else {
    selSide.disabled = false;
  }



    renderLive();
  });
  tdEq.append(selEq); tr.append(tdEq);

  // Location
  const tdLoc = document.createElement('td');
  const selLoc = createDropdown(locationOptions, function(){
if (this.value==='Other') {
  const inp = document.createElement('input');
  inp.type        = 'text';
  inp.placeholder = 'Enter location';
  // refresh live table on every keystroke
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
if (this.value==='Other') {
  const inp = document.createElement('input');
  inp.type        = 'text';
  inp.placeholder = 'Enter side';
  // keep live table in sync
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}

    renderLive();
  });
  tdSide.append(selSide); tr.append(tdSide);


// ── disable Side dropdown for certain equipment ──
selEq.addEventListener('change', function() {
  const disableFor = ['33KV CT','33KV PT','33KV VCB','Bushing','Lightning Arrestor'];
  if (disableFor.includes(this.value)) {
    selSide.disabled = true;
    selSide.value = '';        // clear any previous choice
  } else {
    selSide.disabled = false;
  }
});




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
if (this.value==='Other') {
  const inp = document.createElement('input');
  inp.type        = 'text';
  inp.placeholder = 'Enter precise';
  // ← here’s the missing piece:
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
['R Phase','Y Phase','B Phase','Neutral'].forEach((ph,j) => {
  const f = r.cells[4+j].firstChild;
  // core inputs
  const inputs = Array.from(f.querySelectorAll('input[type=number]'));
  const v     = inputs[0].value;           // the dB value
  const recNo = inputs[1].value;           // the Recording No.
  const cls   = f.querySelector('select').value;
  const cbs   = {};
  f.querySelectorAll('input[type=checkbox]')
   .forEach(cb => cbs[cb.value] = cb.checked);

  const td = document.createElement('td');

  // build output if either measurement or recording exists
  if ((v && cls) || recNo) {
    let out = '';
    if (v && cls) {
      out = `${v} dB (${cls})`;
      if (cbs['Audible']) out += '<br/><strong>Audible</strong>';
    }
    if (recNo) {
      // place below Audible (if any)
      out += (out ? '<br/>' : '') + `<strong>Recording No- ${recNo}</strong>`;
    }
    td.innerHTML = out;
  } else {
    td.textContent = '---';
  }
  tr.append(td);
});

      // Action (editable)
if (isBus || isPin) {
  if (i === 0) {
    const tdA = document.createElement('td');
    // use your saved text if it exists, otherwise fall back to the template
    if (manualActions[eq]) {
      tdA.innerHTML = manualActions[eq];
    } else {
      tdA.textContent = isBus
        ? prompt2Maps.actionTemplates['Bushing'].default
        : prompt2Maps.actionTemplates['33KV Pin Insulator'].default;
    }
    tdA.rowSpan = grp.length;
    tdA.contentEditable = true;
    tr.append(tdA);
  }
}



        else {
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
        tdA.innerHTML = acts.join('<hr style="border-top:1px dashed #888;margin:4px 0;"/>');
        tr.append(tdA);
      }

      lb.append(tr);
    });
  });
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
        value:f.querySelector('input[type=number]').value,
        class:f.querySelector('select').value,
        rep:  f.querySelector('input[value="Rep"]').checked,
        ir:   f.querySelector('input[value="IR"]').checked,
        aud:  f.querySelector('input[value="Audible"]').checked,
        xcb:   f.querySelector('input[value="X-Cbl"]').checked,
       cdep:  f.querySelector('input[value="C-Dep"]').checked,
       trck:  f.querySelector('input[value="Trck Mrk"]').checked,
        rec:   f.querySelector('.recNo').value 
      };
    });
    data.push(e);
  });
  localStorage.setItem('ultrasoundData',JSON.stringify(data));

// — save any custom live-table edits —
const actionsToSave = {};
document.querySelectorAll('#liveTable tbody tr').forEach(row => {
  const eqCell = row.querySelector('td[rowspan]');
  if (!eqCell) return;                    // skip non-group rows
  const actionCell = row.querySelector('td[contenteditable]');
  if (actionCell) {
    actionsToSave[ eqCell.textContent ] = actionCell.innerHTML;
  }
});
localStorage.setItem('ultrasoundActions', JSON.stringify(actionsToSave));

saveLiveTableHTML(); 


  alert('Data saved.');
}

// auto-save both form data and live-table HTML on page unload
window.addEventListener('beforeunload', () => {
  // 1) persist the form data exactly as Save button would
  saveFormData();
  // 2) persist the live-table HTML
  saveLiveTableHTML();
});





function loadFormData(){
  const s=localStorage.getItem('ultrasoundData');
  if(!s) return;

  // load any previously saved live-table edits
  manualActions = JSON.parse(localStorage.getItem('ultrasoundActions') || '{}');



  JSON.parse(s).forEach(e=>{
    addRow();
    const r=document.querySelector('#ultrasoundTable tbody tr:last-child');
        // ── Equipment Details: rebuild select vs. manual input ──
    const eqCell = r.cells[0];
    eqCell.innerHTML = '';  // clear whatever default <select> is there

    // If it’s one of your predefined options, rebuild the <select>
    if (equipmentOptions.includes(e.equipment)) {
      const selEq = createDropdown(equipmentOptions, function(){
        // your exact onChange from addRow():
        if (['33KV CT','33KV PT','33KV VCB','Post Insulator'].includes(this.value)) {
          // auto‐precise for CT/PT/VCB
          r.cells[2].innerHTML = '';
          const inp = document.createElement('input');
          inp.type = 'text'; inp.value = this.value; inp.readOnly = true;
          r.cells[2].append(inp);
        } else {
          updatePrecise(this, r.cells[2]);
        }
        // “Other” → switch to manual <input>
        if (this.value === 'Other') {
          const inp = document.createElement('input');
          inp.type = 'text'; inp.placeholder = 'Enter Equipment Details';
          this.replaceWith(inp);
        }
        renderLive();
      });
      selEq.value = e.equipment;       // restore saved dropdown choice
      eqCell.appendChild(selEq);



// — re-attach Side-disable logic for this loaded row —
const selSide = r.cells[3].querySelector('select');  // the “Side” dropdown in this row
selEq.addEventListener('change', function() {
  const disableFor = ['33KV CT','33KV PT','33KV VCB','Bushing','Lightning Arrestor'];
  if (disableFor.includes(this.value)) {
    selSide.disabled = true;
    selSide.value = '';
  } else {
    selSide.disabled = false;
  }
});
// fire once on load so existing rows start in the correct state
selEq.dispatchEvent(new Event('change'));


    } else {
      // It was a user‐typed “Other” value: create an <input>
      const inpEq = document.createElement('input');
      inpEq.type        = 'text';
      inpEq.placeholder = 'Enter Equipment Details';
      inpEq.value       = e.equipment; // restore custom text
      // re‐wire precise-location lookup on change
      inpEq.addEventListener('change', () => updatePrecise(inpEq, r.cells[2]));
      inpEq.addEventListener('input', renderLive);
      eqCell.appendChild(inpEq);
    }

    // Finally, trigger the Precise logic on whichever element we built:
    const eqEl = eqCell.querySelector('select,input');
    updatePrecise(eqEl, r.cells[2]);
    // ── end Equipment Details rebuild ──

        // ── Location: rebuild select vs. manual input ──
    {
      const locCell = r.cells[1];
      locCell.innerHTML = '';
      if (locationOptions.includes(e.location)) {
        // a predefined choice
        const selLoc = createDropdown(locationOptions, function(){
          if (this.value === 'Other') {
            const inp = document.createElement('input');
            inp.type = 'text'; inp.placeholder = 'Enter location';
            this.replaceWith(inp);
          }
          renderLive();
        });
        selLoc.value = e.location;
        locCell.appendChild(selLoc);
      } else {
        // a user-typed “Other”
        const inpLoc = document.createElement('input');
        inpLoc.type = 'text';
        inpLoc.placeholder = 'Enter location';
        inpLoc.value = e.location;
        inpLoc.addEventListener('input', renderLive);
        locCell.appendChild(inpLoc);
      }
    }

    // ── Precise Location: rebuild select vs. manual input ──
    {
      const eqVal    = r.cells[0].querySelector('select,input').value;
      const opts     = prompt2Maps.preciseMap[eqVal] || [];
      const precCell = r.cells[2];
      precCell.innerHTML = '';

      if (opts.length && opts.includes(e.precise)) {
        // predefined precise choice
        const selPrec = createDropdown(opts, function(){
if (this.value==='Other') {
  const inp = document.createElement('input');
  inp.type        = 'text';
  inp.placeholder = 'Enter precise';
  // refresh live table as you type new precise text
  inp.addEventListener('input', renderLive);
  this.replaceWith(inp);
}

          renderLive();
        });
        selPrec.value = e.precise;
        precCell.appendChild(selPrec);

      } else if (opts.length) {
        // the user originally picked “Other” → show manual input
        const inpPrec = document.createElement('input');
        inpPrec.type = 'text';
        inpPrec.placeholder = 'Enter precise';
        inpPrec.value = e.precise;
        inpPrec.addEventListener('input', renderLive);
        precCell.appendChild(inpPrec);

      } else {
        // no predefined opts for this equipment → always text input
        const inpPrec = document.createElement('input');
        inpPrec.type = 'text';
        inpPrec.placeholder = 'Enter precise location';
        inpPrec.value = e.precise;
        inpPrec.addEventListener('input', renderLive);
        precCell.appendChild(inpPrec);
      }
    }

      // ── Side: rebuild select vs. manual input ──
  {
    const sideCell = r.cells[3];
    sideCell.innerHTML = '';

    if (sideOptions.includes(e.side)) {
      // predefined option → recreate dropdown
      const selSide = createDropdown(sideOptions, function(){
        if (this.value === 'Other') {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.placeholder = 'Enter side';
          this.replaceWith(inp);
        }
        renderLive();
      });
      selSide.value = e.side;
      sideCell.appendChild(selSide);

      // re-attach Equipment→Side disable logic
      const selEq = r.cells[0].querySelector('select,input');
      const disableFor = ['33KV CT','33KV PT','33KV VCB','Bushing','Lightning Arrestor'];
      selEq.addEventListener('change', function(){
        if (disableFor.includes(this.value)) {
          selSide.disabled = true;
          selSide.value = '';
        } else {
          selSide.disabled = false;
        }
      });
      // enforce its initial state
      selEq.dispatchEvent(new Event('change'));

    } else {
      // custom “Other” → plain text input
      const inpSide = document.createElement('input');
      inpSide.type        = 'text';
      inpSide.placeholder = 'Enter side';
      inpSide.value       = e.side;
      inpSide.addEventListener('input', renderLive);
      sideCell.appendChild(inpSide);
    }
  }

    ['R','Y','B','N'].forEach((k,i)=>{
      const f=r.cells[4+i].firstChild;
      f.querySelector('input[type=number]').value       = e[k].value;
      f.querySelector('select').value                   = e[k].class;
      f.querySelector('input[value="Rep"]').checked     = e[k].rep;
      f.querySelector('input[value="IR"]').checked      = e[k].ir;
      f.querySelector('input[value="Audible"]').checked = e[k].aud;
      f.querySelector('input[value="X-Cbl"]').checked    = e[k].xcb;
      f.querySelector('input[value="C-Dep"]').checked    = e[k].cdep;
      f.querySelector('input[value="Trck Mrk"]').checked = e[k].trck;
      f.querySelector('.recNo').value = e[k].rec || '';
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
  // 1) Clone the live table
  const original = document.getElementById('liveTable');
  const clone    = original.cloneNode(true);

  // 2) Strip off its id (and any classes) so no page CSS bleeds in
  clone.removeAttribute('id');
  clone.querySelectorAll('*').forEach(el => el.removeAttribute('class'));

  // 3) Table-level styling (no spacing, collapse all borders)
  clone.style.borderCollapse = 'collapse';
  clone.style.borderSpacing  = '0';
  clone.style.margin         = '0';
  clone.style.padding        = '0';

  // 4) Cell-level styling (exactly 1px solid black, no padding/margin, black text)
  clone.querySelectorAll('th, td').forEach(cell => {
    cell.style.border  = '1px solid black';
    cell.style.margin  = '0';
    cell.style.padding = '0';
    cell.style.color   = 'black';
  });

  // 5) Header-row override (must exactly match your DOC export)

const headerRow = clone.querySelector('thead tr');
headerRow.querySelectorAll('th').forEach(th => {
  th.style.backgroundColor = '#a7abb7';    // ← this hex code
  th.style.color          = 'black';
  th.style.border         = '1px solid black';
  th.style.fontFamily     = 'Cambria';
  th.style.fontSize       = '11pt';
});


  // 6) Row-group colouring & font sizing (same as downloadDoc)
  const rows   = Array.from(clone.querySelectorAll('tbody tr'));
  const colors = [
    '#f0f8ff','#fafad2','#e6e6fa','#fff0f5',
    '#f0fff0','#f5f5f5','#fffaf0','#f5fffa',
    '#f5f5dc','#f0ffff'
  ];
  let lastEq     = null;
  let currentEq  = null;
  let colorIndex = -1;

  rows.forEach(tr => {
    const eqCell = tr.querySelector('td[rowspan]');
    if (eqCell) {
      lastEq    = eqCell.textContent;
      currentEq = null;      // new group ⇒ advance colour
    }
    if (lastEq !== currentEq) {
      currentEq  = lastEq;
      colorIndex = (colorIndex + 1) % colors.length;
    }
    Array.from(tr.cells).forEach((td, colIdx, all) => {
      td.style.backgroundColor = colors[colorIndex];
      td.style.fontFamily      = 'Cambria';
      td.style.fontSize        = (colIdx === all.length - 1) ? '9pt' : '11pt';
    });
  });

  // 7) Build filename
  const sub   = localStorage.getItem('selectedSubstation') || 'Unknown';
  const now   = new Date();
  const dd    = String(now.getDate()).padStart(2, '0');
  const mm    = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy  = now.getFullYear();
  const filename = `Ultrasound_${sub}_${dd}-${mm}-${yyyy}.pdf`;

  // 8) Finally, hand off to html2pdf
  html2pdf()
    .set({
      margin:       [10,10,10,10],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'pt', format: 'a4', orientation: 'landscape' }
    })
    .from(clone)
    .save();
}


// whenever any cell in the live table is edited, save its HTML
document
  .querySelector('#liveTable tbody')
  .addEventListener('input', saveLiveTableHTML);





// ── RESET HANDLER ──
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all ultrasound entries and live data?')) return;

  // 1) Clear saved form data
  localStorage.removeItem('ultrasoundData');

  // 2) Empty both tables
  document.querySelector('#ultrasoundTable tbody').innerHTML = '';
  document.querySelector('#liveTable tbody').innerHTML       = '';
});


