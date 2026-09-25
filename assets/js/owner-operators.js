(()=>{'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=v=>String(v??'—').replaceAll('_',' ').replace(/\b\w/g,x=>x.toUpperCase());
const $=(s,r=document)=>r.querySelector(s);
let data=null;
function metric(label,value,note){return `<div class="metric"><small>${esc(label)}</small><strong>${esc(value)}</strong><span>${esc(note)}</span></div>`}
function modal(title,body,onSubmit){
 const b=document.createElement('div');b.className='modal-backdrop';
 b.innerHTML=`<form class="modal"><h2>${esc(title)}</h2><div class="modal-grid">${body}</div><div class="modal-actions"><button class="btn ghost" type="button" data-cancel>Cancel</button><button class="btn primary" type="submit">Save</button></div></form>`;
 document.body.appendChild(b);$('[data-cancel]',b).onclick=()=>b.remove();
 $('form',b).onsubmit=async ev=>{ev.preventDefault();const btn=$('button[type=submit]',b);btn.disabled=true;try{await onSubmit(Object.fromEntries(new FormData(ev.currentTarget)));b.remove();await window.Portal.refresh()}catch(e){window.S4UDialog.alert(e.message||String(e));btn.disabled=false}};
}
function createOwner(){
 modal('Add Owner-Operator',`
  <div class="field full"><label>Legal name</label><input name="legal_name" required></div>
  <div class="field"><label>USDOT number</label><input name="dot_number" required></div>
  <div class="field"><label>MC number</label><input name="mc_number"></div>
  <div class="field"><label>Owner first name</label><input name="first_name" required></div>
  <div class="field"><label>Owner last name</label><input name="last_name" required></div>
  <div class="field"><label>Email</label><input name="email" type="email"></div>
  <div class="field"><label>Phone</label><input name="phone"></div>
  <div class="field"><label>State</label><input name="state" maxlength="2"></div>
  <div class="field"><label>CDL number</label><input name="cdl_number"></div>
  <div class="field"><label>CDL state</label><input name="cdl_state" maxlength="2"></div>`,
  v=>window.Portal.invoke('workforce-ctpa-owner-operators',{action:'create',owner:v})
 );
}
function assignOwner(){
 const opts=(data?.available||[]).map(x=>`<option value="${esc(x.id)}">${esc(x.legal_name||x.dba_name||'Owner-Operator')}${x.dot_number?` · USDOT ${esc(x.dot_number)}`:''}</option>`).join('');
 modal('Assign Existing Owner-Operator',`<div class="field full"><label>Owner-Operator</label><select name="owner_operator_id" required><option value="">Choose account</option>${opts}</select></div>`,
  v=>window.Portal.invoke('workforce-ctpa-owner-operators',{action:'assign',owner_operator_id:v.owner_operator_id})
 );
}
function render(d){
 data=d;const rows=(d.owner_operators||[]).map(x=>`<tr><td><strong>${esc(x.legal_name||x.dba_name||'Owner-Operator')}</strong><small>${x.dot_number?`USDOT ${esc(x.dot_number)}`:'No USDOT number'}</small></td><td>${esc(pretty(x.status))}</td><td>${esc(pretty(x.consortium_status))}</td><td>${esc(x.enrollment?.dot_agency||'FMCSA')}</td><td>${esc(x.email||x.employer?.primary_contact_email||'—')}</td><td>${esc(x.subscription?.plans?.name||'Sponsored access pending')}</td></tr>`).join('')||'<tr><td colspan="6"><div class="empty">No Owner-Operator customers are assigned yet.</div></td></tr>';
 return `<div class="metrics">${metric('Owner-Operators',(d.owner_operators||[]).length,'C/TPA customer accounts')}${metric('Available',(d.available||[]).length,'Unassigned accounts')}${metric('Management',d.can_manage?'Enabled':'Read Only','Based on C/TPA role')}</div><div class="section panel"><div class="panel-head"><div><h2>Sponsored Owner-Operators</h2><p>These accounts are customers of this C/TPA and use C/TPA-sponsored access.</p></div></div><div class="table-wrap"><table><thead><tr><th>Owner-Operator</th><th>Status</th><th>Consortium</th><th>Agency</th><th>Contact</th><th>Portal Access</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function bind(d){
 data=d;const a=$('#actions');if(!a)return;a.innerHTML='';
 if(d.can_manage){
   const assign=document.createElement('button');assign.className='btn secondary';assign.textContent='Assign Existing';assign.disabled=!(d.available||[]).length;assign.onclick=assignOwner;a.appendChild(assign);
   const add=document.createElement('button');add.className='btn primary';add.textContent='Add Owner-Operator';add.onclick=createOwner;a.appendChild(add);
 }
}
window.CtpaOwnerOperators={render,bind};
})();