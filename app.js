(function(){
  const D=window.VISTELO_DATA; if(!D) return;
  const $=s=>document.querySelector(s);
  const pct=(n,d)=>d?Math.round(n/d*100):0;
  const top=(arr,n=6)=>arr.slice(0,n);
  function val(obj,key){return Object.entries(obj).sort((a,b)=>b[1]-a[1]);}
  function setText(id,t){const e=document.getElementById(id); if(e)e.textContent=t;}
  setText('kpiResponses',D.summary.responses.toLocaleString());
  setText('kpiFirst',pct(D.summary.firstVisit['Yes']||0,D.summary.responses)+'%');
  setText('kpiCrowd',pct(D.summary.crowd['Yes']||0,D.summary.responses)+'%');
  setText('kpiIndian',pct(D.summary.tourist['Indian']||0,D.summary.responses)+'%');

  const baseOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e211d',padding:10,titleFont:{family:'DM Sans'},bodyFont:{family:'DM Sans'}}},scales:{x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:10},color:'#706e66'}},y:{grid:{color:'#ddd5c8'},ticks:{font:{family:'DM Sans',size:10},color:'#706e66'}}}};
  const makeBar=(id,arr,horiz=false)=>{const el=document.getElementById(id);if(!el)return; new Chart(el,{type:'bar',data:{labels:arr.map(x=>x[0]),datasets:[{data:arr.map(x=>x[1]),backgroundColor:'#9d4f3d',borderRadius:0,barThickness:12}]},options:{...baseOpts,indexAxis:horiz?'y':'x'}})};
  makeBar('ageChart',val(D.summary.age,6));
  makeBar('reasonChart',top(val(D.summary.reason,6),6),true);
  makeBar('attractionChart',top(D.summary.attractions,6),true);
  makeBar('issuesChart',top(D.summary.issues,8),true);
  makeBar('experienceChart',top(D.summary.experience,6),true);
  const crowd=document.getElementById('crowdChart'); if(crowd)new Chart(crowd,{type:'doughnut',data:{labels:Object.keys(D.summary.crowd),datasets:[{data:Object.values(D.summary.crowd),backgroundColor:['#9d4f3d','#6d7762'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'70%',plugins:{legend:{display:false}}}});
  const legend=$('#crowdLegend'); if(legend) legend.innerHTML=Object.entries(D.summary.crowd).map(([k,v])=>`<span>${k}: <b>${v}</b></span>`).join('');

  const state={groupType:'Family',purpose:'Tourism',interest:'Historical artifacts',duration:'1–2 hours',visitType:'First-time tourist experience',crowdPref:'Moderate',nearby:'Gateway of India'};
  document.querySelectorAll('.option-grid').forEach(group=>{group.querySelectorAll('button').forEach(btn=>{btn.addEventListener('click',()=>{group.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');state[group.dataset.name]=btn.dataset.value;});});});
  // initial selection
  document.querySelectorAll('.option-grid').forEach(g=>{const first=g.querySelector('button');if(first)first.classList.add('selected')});
  const form=$('#plannerForm');
  form.addEventListener('submit',e=>{e.preventDefault();
    const p=state.purpose, d=state.duration, cp=state.crowdPref, vt=state.visitType;
    let focus='Museum highlights'; if(p.includes('Education'))focus='Educational highlights'; else if(p.includes('Research'))focus='Collection-focused exploration'; else if(p.includes('history')||p.includes('History'))focus='Historical & cultural highlights';
    const routes={"<1 hour":['Entrance & signature highlights','Central gallery / key objects','Quick architectural stop'],"1–2 hours":['Museum highlights','Historical & art collections','Garden / exterior pause'],"2–3 hours":['Museum highlights','Historical & art collections','Cultural experience','Short break'],"3+ hours":['Museum highlights','Historical & art collections','Cultural experience','Nearby South Mumbai stop']};
    let crowdText=cp==='Less crowded'?'Prefer a lower-demand time slot based on survey patterns':cp==="Crowd doesn't matter"?'Crowd is not a primary constraint':'Aim for a moderate-demand time slot';
    const nearby=state.nearby||'Gateway of India';
    const result=$('#plannerResult'); result.innerHTML=`<div class="result-top"><span class="mini-label">YOUR PLAN</span><span class="result-status">Survey-informed</span></div><div class="plan-output"><h3>A ${state.visitType.toLowerCase().replace('visit — see the highlights','')} CSMVS day.</h3><p class="plan-sub">${state.groupType} · ${p} · ${d}</p><div class="plan-meta"><div class="meta-box"><span>Focus</span><strong>${focus}</strong></div><div class="meta-box"><span>Crowd preference</span><strong>${crowdText}</strong></div></div><div class="plan-list">${routes[d].map((x,i)=>`<div class="plan-item"><b>0${i+1}</b><span>${x}</span></div>`).join('')}<div class="plan-item"><b>04</b><span>Extend the day with ${nearby}</span></div></div><p class="plan-note">${D.summary.responses} visitor responses inform this prototype. Recommendations are not live crowd forecasts and should be treated as planning guidance.</p></div>`;
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  document.querySelectorAll('.place-card').forEach(b=>b.addEventListener('click',()=>{state.nearby=b.dataset.place; location.hash='planner'; toast(b.dataset.place+' added to your visit plan.')}));
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
})();
