(async()=>{
  const C=window.PORTAL_CONFIG,sb=window.supabase.createClient(C.workforceUrl,C.workforceKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const {data:{session}}=await sb.auth.getSession();if(!session){location.replace('/login.html');return}
  const id=new URLSearchParams(location.search).get('id')||'';
  const r=await fetch(`${C.workforceUrl}/functions/v1/dot-session-context`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`,'apikey':C.workforceKey},body:JSON.stringify({requested_portal_code:C.portalCode,membership_id:id,surface:C.surface,portal_code:C.portalCode})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok){document.body.classList.remove('loading');document.getElementById('msg').textContent=d.error||d.reason||'Unable to load workspace.';return}
  if(d.requires_workspace_selection){
    document.body.classList.remove('loading');
    document.getElementById('choices').innerHTML=(d.workspaces||[]).map(w=>`<a class="card" style="display:block;margin:8px 0" href="/workspace.html?id=${encodeURIComponent(w.membership_id)}"><strong>${w.plan_name||'Subscription'}</strong></a>`).join('');
    return;
  }
  if(d.membership?.id)localStorage.setItem(`s4u_${C.portalCode}_membership`,d.membership.id);
  location.replace('/dashboard.html');
})();
