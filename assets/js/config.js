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
  const API='ctpa-dot';
  window.PORTAL_RUNTIME=Object.freeze({api:API,session:API,actions:API,distribution:API});
  const C=window.PORTAL_CONFIG||window.S4U||{};
  C.runtimeFunctions=window.PORTAL_RUNTIME;
  if(window.__S4U_CTPA_API_FETCH_PATCHED__)return;
  window.__S4U_CTPA_API_FETCH_PATCHED__=true;
  const baseFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    try{
      const raw=typeof input==='string'?input:(input?.url||'');
      if(!raw||!raw.includes('/functions/v1/'))return baseFetch(input,init);
      const u=new URL(raw,location.href),parts=u.pathname.split('/'),idx=parts.indexOf('v1');
      if(idx<0||!parts[idx+1])return baseFetch(input,init);
      const original=parts[idx+1];
      let targetPath=null,legacyEndpoint=null;
      if(original==='ctpa-dot')return baseFetch(input,init);
      if(original==='ctpa-dot-session'||original==='dot-session-context')targetPath='ctpa-dot/session';
      else if(original==='ctpa-dot-distribution'||original==='dot-distribution-runtime')targetPath='ctpa-dot/distribution';
      else if(original==='ctpa-dot-actions'||original==='dot-portal-actions'||original==='portal-order-catalog'||original.startsWith('workforce-')){targetPath='ctpa-dot';legacyEndpoint=original;}
      else return baseFetch(input,init);
      const before=parts.slice(0,idx+1).join('/');
      u.pathname=before+'/'+targetPath;
      const i=init?{...init}:{};
      if(i.body&&typeof i.body==='string'){
        try{
          const b=JSON.parse(i.body);
          b.portal_code='ctpa_dot';
          b.requested_portal_code='ctpa_dot';
          if(legacyEndpoint&&!b.legacy_endpoint)b.legacy_endpoint=legacyEndpoint;
          i.body=JSON.stringify(b);
        }catch{}
      }
      return baseFetch(u.toString(),i);
    }catch{return baseFetch(input,init)}
  };
})();
