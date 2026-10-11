(async()=>{'use strict';
const status=document.getElementById('handoff-status'),back=document.getElementById('handoff-return'),code=new URLSearchParams(location.search).get('code');
history.replaceState(null,'','/auth-handoff.html');
const fail=(message)=>{status.textContent=message;back.hidden=false};
if(!code||!/^[a-f0-9]{64}$/i.test(code)){fail('Invalid or missing sign-in handoff.');return}
try{
 const C=window.PORTAL_CONFIG;
 const response=await fetch(C.workforceUrl+'/functions/v1/portal-session-handoff',{method:'POST',headers:{'Content-Type':'application/json','apikey':C.workforceKey},body:JSON.stringify({action:'redeem',code})});
 const payload=await response.json();
 if(!response.ok||!payload.token_hash)throw Error(payload.error||'The sign-in link could not be verified.');
 if(payload.target_surface!=='dot'||payload.target_portal!=='ctpa_dot')throw Error('This handoff is not intended for the C/TPA DOT portal.');
 const client=window.S4UGetSupabaseClient();
 const {data,error}=await client.auth.verifyOtp({token_hash:payload.token_hash,type:'magiclink'});
 if(error||!data?.session)throw error||Error('Unable to establish the portal session.');
 const next=new URL(payload.next_path||'/workspace.html',location.origin);if(next.origin!==location.origin||next.pathname!=='/workspace.html')throw Error('Invalid destination.');location.replace(next.pathname+next.search);
}catch(e){fail(e?.message||'The secure sign-in could not be completed.')}
})();