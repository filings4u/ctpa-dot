window.PORTAL_CONFIG=Object.freeze({"domain":"ctpa-dot.screenings4u.com","portalCode":"ctpa_dot","label":"screenings4u DOT C/TPA","kind":"ctpa","surface":"dot","agency":null,"workforceUrl":"https://elpbnytpciqnbexiaebp.supabase.co","workforceKey":"sb_publishable_xVI6Mjkk1bNVMGHZCPuK6w_8FSHKdkC","mainUrl":"https://elpbnytpciqnbexiaebp.supabase.co","mainKey":"sb_publishable_xVI6Mjkk1bNVMGHZCPuK6w_8FSHKdkC"});
;(()=>{
  const C=window.PORTAL_CONFIG||window.S4U||{};
  window.S4UGetSupabaseClient=window.S4UGetSupabaseClient||function(){
    if(window.__S4U_SUPABASE_CLIENT__)return window.__S4U_SUPABASE_CLIENT__;
    if(!window.supabase?.createClient)throw new Error('Supabase client library is not loaded.');
    const url=C.workforceUrl||C.supabaseUrl||C.url;
    const key=C.workforceKey||C.supabaseAnonKey||C.key;
    window.__S4U_SUPABASE_CLIENT__=window.supabase.createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return window.__S4U_SUPABASE_CLIENT__;
  };
  window.S4UWithPortal=window.S4UWithPortal||function(body){
    const out={...(body||{})};
    const code=C.portalCode||C.portal_code;
    if(code){if(!out.portal_code)out.portal_code=code;if(!out.requested_portal_code)out.requested_portal_code=code}
    try{const sid=localStorage.getItem('s4u_'+code+'_subscription')||'',mid=localStorage.getItem('s4u_'+code+'_membership')||'';if(sid&&!out.subscription_id)out.subscription_id=sid;if(mid&&!out.membership_id)out.membership_id=mid}catch{}
    return out;
  };
  if(!window.__S4U_FETCH_PATCHED__){
    window.__S4U_FETCH_PATCHED__=true;
    const nativeFetch=window.fetch.bind(window);
    window.fetch=function(input,init){
      try{const u=typeof input==='string'?input:(input?.url||''),i=init?{...init}:{};if(u.includes('/functions/v1/')&&i.body&&typeof i.body==='string'){const ct=String(i.headers?.['Content-Type']||i.headers?.['content-type']||'');if(ct.includes('application/json')||i.body.trim().startsWith('{')){i.body=JSON.stringify(window.S4UWithPortal(JSON.parse(i.body)));return nativeFetch(input,i)}}}catch{}
      return nativeFetch(input,init);
    };
  }
})();


;(()=>{
  const R=window.PORTAL_RUNTIME=Object.freeze({"session":"ctpa-dot-session","actions":"ctpa-dot-actions","distribution":"ctpa-dot-distribution"});
  const C=window.PORTAL_CONFIG||window.S4U||{};
  C.runtimeFunctions=R;
  if(window.__S4U_ISOLATED_FETCH_PATCHED__)return;
  window.__S4U_ISOLATED_FETCH_PATCHED__=true;
  const baseFetch=window.fetch.bind(window);
  const knownSession=new Set(['dot-session-context']);
  const knownDistribution=new Set(['dot-distribution-runtime']);
  const knownCatalog=new Set(['portal-order-catalog']);
  window.fetch=function(input,init){
    try{
      let raw=typeof input==='string'?input:(input?.url||'');
      if(!raw||!raw.includes('/functions/v1/'))return baseFetch(input,init);
      const u=new URL(raw,location.href),parts=u.pathname.split('/'),idx=parts.indexOf('v1');
      if(idx<0||!parts[idx+1])return baseFetch(input,init);
      const original=parts[idx+1]; let target=original,routeToActions=false;
      if(knownSession.has(original))target=R.session;
      else if(knownDistribution.has(original))target=R.distribution;
      else if(knownCatalog.has(original)){target=R.actions;routeToActions=true;}
      else if(original.startsWith('workforce-')||original==='dot-portal-actions'){target=R.actions;routeToActions=true;}
      if(target===original)return baseFetch(input,init);
      parts[idx+1]=target;u.pathname=parts.join('/');
      const i=init?{...init}:{};
      if(i.body&&typeof i.body==='string'){try{const b=JSON.parse(i.body);b.portal_code="ctpa_dot";b.requested_portal_code="ctpa_dot";if(routeToActions&&!b.legacy_endpoint)b.legacy_endpoint=original;i.body=JSON.stringify(b)}catch{}}
      return baseFetch(u.toString(),i);
    }catch(e){return baseFetch(input,init)}
  };
})();
