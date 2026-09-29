window.PORTAL_CONFIG=Object.freeze({
  domain:"ctpa-dot.screenings4u.com",
  portalCode:"ctpa_dot",
  label:"screenings4u DOT C/TPA",
  kind:"ctpa",
  surface:"dot",
  workforceUrl:"https://elpbnytpciqnbexiaebp.supabase.co",
  workforceKey:"sb_publishable_xVI6Mjkk1bNVMGHZCPuK6w_8FSHKdkC"
});
(()=>{'use strict';
 const C=window.PORTAL_CONFIG;
 window.S4UGetSupabaseClient=function(){
   if(window.__S4U_CTPA_CLIENT__)return window.__S4U_CTPA_CLIENT__;
   if(!window.supabase?.createClient)throw new Error('Supabase client library is not loaded.');
   window.__S4U_CTPA_CLIENT__=window.supabase.createClient(C.workforceUrl,C.workforceKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   return window.__S4U_CTPA_CLIENT__;
 };
 window.S4UCTPAPayload=function(body={}){
   const membership=localStorage.getItem('s4u_ctpa_dot_membership')||'';
   const subscription=localStorage.getItem('s4u_ctpa_dot_subscription')||'';
   return {...body,membership_id:body.membership_id||membership||undefined,subscription_id:body.subscription_id||subscription||undefined};
 };
})();
