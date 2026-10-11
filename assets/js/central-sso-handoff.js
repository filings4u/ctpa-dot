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
 const next=new URL(payload.next_path||'',location.origin);
 if(next.origin!==location.origin||next.pathname!=='/workspace.html')throw Error('Invalid destination.');
 const ctpaId=next.searchParams.get('ctpa_id'),subscriptionId=next.searchParams.get('subscription_id');
 if(!ctpaId||!subscriptionId||!["ctpa_id","subscription_id"].every(k=>/^[0-9a-f-]{36}$/i.test(next.searchParams.get(k)||'')))throw Error('Select a C/TPA subscription from the central portal.');
 status.textContent='Verifying your selected C/TPA subscription…';
 const check=await fetch(C.workforceUrl+'/functions/v1/ctpa-dot/session?forceFunctionRegion=ca-central-1',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+data.session.access_token,'apikey':C.workforceKey},body:JSON.stringify({ctpa_id:ctpaId,subscription_id:subscriptionId})});
 const d=await check.json();
 if(!check.ok||!d.ok||!d.ctpa?.id||!d.subscription?.id)throw Error(d.error||'Selected account is not authorized.');
 const saved=window.S4UCTPAWorkspace.set({user_id:data.session.user.id,ctpa_id:d.ctpa.id,organization_id:d.organization?.id,membership_id:d.membership?.id,subscription_id:d.subscription.id,plan_code:d.plan?.code,plan_name:d.plan?.name,organization_name:d.organization?.dba_name||d.organization?.legal_name});
 try{sessionStorage.setItem('s4u_ctpa_dot_verified_ctx_v2',JSON.stringify({saved_at:Date.now(),user_id:data.session.user.id,ctpa_id:saved.ctpa_id,subscription_id:saved.subscription_id,ctx:d}))}catch{}
 try{localStorage.setItem('s4u_ctpa_dot_idle_last',String(Date.now()))}catch{}\n location.replace('/dashboard.html');
}catch(e){fail(e?.message||'The secure sign-in could not be completed.')}
})();