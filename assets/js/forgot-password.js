(()=>{'use strict';
const sb=window.S4UGetSupabaseClient(),form=document.getElementById('forgotForm'),status=document.getElementById('status'),submit=document.getElementById('forgotSubmit'),SITE_KEY='0x4AAAAAAE4-F43E-viFsKat',RESET_URL='https://ctpa-dot.screenings4u.com/reset-password.html';
let widget=null,token='';
const set=(m,b=false)=>{status.textContent=m||'';status.style.color=b?'#a72d2d':'#17764a'};
const sync=()=>{submit.disabled=!token};
function mount(){if(!window.turnstile)return setTimeout(mount,80);if(widget!==null)return;widget=window.turnstile.render('#turnstileForgot',{sitekey:SITE_KEY,action:'ctpa_password_reset',theme:'auto',size:'flexible',callback:t=>{token=String(t||'');sync()},'expired-callback':()=>{token='';sync()},'timeout-callback':()=>{token='';sync()},'error-callback':()=>{token='';sync();set('Security verification could not load. Please retry.',true);return true}})}
form.onsubmit=async e=>{e.preventDefault();if(!token)return set('Complete the security check to continue.',true);submit.disabled=true;set('Sending password reset…');const email=String(new FormData(form).get('email')||'').trim();const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:RESET_URL,captchaToken:token});if(error){set(error.message,true);submit.disabled=false;token='';try{window.turnstile.reset(widget)}catch{};sync();return}set('If an account exists for that email, a password reset email has been sent.');form.reset();token='';try{window.turnstile.reset(widget)}catch{};sync()};
mount();sync();
})();
