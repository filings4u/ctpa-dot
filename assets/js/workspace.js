(async()=>{
  const C=window.PORTAL_CONFIG||window.S4U||{},sb=window.S4UGetSupabaseClient();
  const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const msg=(t,bad=false)=>{const e=$('msg');if(!e)return;e.textContent=t;e.className='workspace-msg '+(bad?'error':'ok')};
  const keyM=`s4u_${C.portalCode}_membership`,keyS=`s4u_${C.portalCode}_subscription`;
  try{localStorage.removeItem(keyM);localStorage.removeItem(keyS)}catch{}
  const {data:{session},error}=await sb.auth.getSession();
  if(error||!session){location.replace('/login.html?reason=session');return}
  $('signOutAll')?.addEventListener('click',async()=>{try{await sb.auth.signOut()}catch{};location.replace('/login.html')});
  async function sessionCall(body={}){
    const r=await fetch(`${C.workforceUrl}/functions/v1/ctpa-dot/session`,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`,'apikey':C.workforceKey},
      body:JSON.stringify(window.S4UWithPortal({surface:C.surface,page:'workspace',...body}))
    });
    const d=await r.json().catch(()=>({}));return {r,d};
  }
  function card(w,i){
    const org=w.organization_name||'C/TPA Account',plan=w.plan_name||w.plan_code||'DOT Subscription',role=String(w.role_code||'account user').replaceAll('_',' '),source=String(w.subscription_source||'subscription').replaceAll('_',' '),short=(org.match(/\b\w/g)||['C','T']).slice(0,2).join('').toUpperCase();
    return `<article class="workspace-card">
      <div class="workspace-card-top"><div class="workspace-mark">${esc(short)}</div><div><h2>${esc(org)}</h2><div class="workspace-plan">${esc(plan)}</div></div></div>
      <div class="workspace-meta"><div><span>Role</span><strong>${esc(role)}</strong></div><div><span>Access</span><strong>${esc(source)}</strong></div><div><span>Plan code</span><strong>${esc(w.plan_code||'DOT')}</strong></div><div><span>Portal</span><strong>C/TPA DOT</strong></div></div>
      <button class="workspace-enter" type="button" data-i="${i}">Enter C/TPA Portal</button>
    </article>`;
  }
  async function choose(w,btn){
    btn.disabled=true;btn.textContent='Opening portal…';msg('Verifying this workspace…');
    const {r,d}=await sessionCall({membership_id:w.membership_id||undefined,subscription_id:w.subscription_id||undefined});
    if(d.checkout_required&&d.checkout_url){location.replace(d.checkout_url);return}
    if(!r.ok||d.error||d.has_access===false){btn.disabled=false;btn.textContent='Enter C/TPA Portal';msg(d.error||d.reason||'This workspace is not available.',true);return}
    const mid=d.membership?.id||w.membership_id,sid=d.subscription?.id||w.subscription_id;
    try{if(mid)localStorage.setItem(keyM,mid);if(sid)localStorage.setItem(keyS,sid)}catch{}
    location.replace('/dashboard.html');
  }
  try{
    const {r,d}=await sessionCall();
    document.body.classList.remove('loading');document.documentElement.classList.remove('s4u-auth-pending');
    if(d.checkout_required&&d.checkout_url){location.replace(d.checkout_url);return}
    if(!r.ok||d.error){$('choices').innerHTML='<div class="workspace-empty">No C/TPA portal workspace could be loaded for this login.</div>';msg(d.error||d.reason||'Unable to load your C/TPA portals.',true);return}
    if(d.requires_workspace_selection){
      const rows=Array.isArray(d.workspaces)?d.workspaces:[];
      if(!rows.length){$('choices').innerHTML='<div class="workspace-empty">No active C/TPA portal workspaces are assigned to this login.</div>';msg('No active C/TPA portal workspaces were found.',true);return}
      msg(rows.length===1?'One C/TPA portal is available.':'Choose the C/TPA portal you want to enter.');
      $('choices').innerHTML=rows.map(card).join('');
      document.querySelectorAll('.workspace-enter').forEach(b=>b.addEventListener('click',()=>choose(rows[Number(b.dataset.i)],b)));
      return;
    }
    const w={membership_id:d.membership?.id,subscription_id:d.subscription?.id,organization_name:d.organization?.dba_name||d.organization?.legal_name||'C/TPA Account',plan_name:d.plan?.name||d.plan?.code||'DOT Subscription',plan_code:d.plan?.code,role_code:d.membership?.membership_role,subscription_source:d.subscription_source||d.access_mode||'subscription'};
    msg('Your C/TPA portal is ready.');$('choices').innerHTML=card(w,0);document.querySelector('.workspace-enter')?.addEventListener('click',e=>choose(w,e.currentTarget));
  }catch(e){document.body.classList.remove('loading');document.documentElement.classList.remove('s4u-auth-pending');$('choices').innerHTML='<div class="workspace-empty">Unable to load portal workspaces.</div>';msg(e.message||'Unable to load your C/TPA portals.',true)}
})();
