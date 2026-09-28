(function () {
  const D = window.VISTELO_DATA; if (!D) return;
  const $ = s => document.querySelector(s);
  const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
  const top = (arr, n = 6) => arr.slice(0, n);
  function val(obj, key) { return Object.entries(obj).sort((a, b) => b[1] - a[1]); }
  function setText(id, t) { const e = document.getElementById(id); if (e) e.textContent = t; }
  setText('kpiResponses', D.summary.responses.toLocaleString());
  setText('kpiFirst', pct(D.summary.firstVisit['Yes'] || 0, D.summary.responses) + '%');
  setText('kpiCrowd', pct(D.summary.crowd['Yes'] || 0, D.summary.responses) + '%');
  setText('kpiIndian', pct(D.summary.tourist['Indian'] || 0, D.summary.responses) + '%');

  const baseOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e211d', padding: 10, titleFont: { family: 'DM Sans' }, bodyFont: { family: 'DM Sans' } } }, scales: { x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 10 }, color: '#706e66' } }, y: { grid: { color: '#ddd5c8' }, ticks: { font: { family: 'DM Sans', size: 10 }, color: '#706e66' } } } };
  const makeBar = (id, arr, horiz = false) => { const el = document.getElementById(id); if (!el) return; new Chart(el, { type: 'bar', data: { labels: arr.map(x => x[0]), datasets: [{ data: arr.map(x => x[1]), backgroundColor: '#9d4f3d', borderRadius: 0, barThickness: 12 }] }, options: { ...baseOpts, indexAxis: horiz ? 'y' : 'x' } }) };
  makeBar('ageChart', val(D.summary.age, 6));
  makeBar('reasonChart', top(val(D.summary.reason, 6), 6), true);
  makeBar('attractionChart', top(D.summary.attractions, 6), true);
  makeBar('issuesChart', top(D.summary.issues, 8), true);
  makeBar('experienceChart', top(D.summary.experience, 6), true);
  const crowd = document.getElementById('crowdChart'); if (crowd) new Chart(crowd, { type: 'doughnut', data: { labels: Object.keys(D.summary.crowd), datasets: [{ data: Object.values(D.summary.crowd), backgroundColor: ['#9d4f3d', '#6d7762'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } } });
  const legend = $('#crowdLegend'); if (legend) legend.innerHTML = Object.entries(D.summary.crowd).map(([k, v]) => `<span>${k}: <b>${v}</b></span>`).join('');

  const state = { groupType: 'Family', purpose: 'Tourism', interest: 'Historical artifacts', duration: '1–2 hours', visitType: 'First-time tourist experience', crowdPref: 'Moderate', nearby: 'Gateway of India' };
  document.querySelectorAll('.option-grid').forEach(group => { group.querySelectorAll('button').forEach(btn => { btn.addEventListener('click', () => { group.querySelectorAll('button').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); state[group.dataset.name] = btn.dataset.value; }); }); });
  // initial selection
  document.querySelectorAll('.option-grid').forEach(g => { const first = g.querySelector('button'); if (first) first.classList.add('selected') });
  const form = $('#plannerForm');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const group = state.groupType;
    const purpose = state.purpose;
    const interest = state.interest;
    const duration = state.duration;
    const visitType = state.visitType;
    const crowdPref = state.crowdPref;
    const nearby = state.nearby || 'Gateway of India';

    let focus = 'Museum highlights';

    if (interest === 'Historical artifacts') {
      focus = 'Historical collections';
    } else if (interest === 'Art collection') {
      focus = 'Art collections';
    } else if (interest === 'Cultural Experience') {
      focus = 'Cultural highlights';
    }

    const routes = {
      "<1 hour": [
        ['START', 'Arrive at CSMVS'],
        ['01', focus],
        ['02', 'Visit key museum highlights'],
        ['03', 'Quick architecture & exterior stop']
      ],

      "1–2 hours": [
        ['START', 'Arrive at CSMVS'],
        ['01', focus],
        ['02', 'Explore major museum highlights'],
        ['03', 'Pause at the museum exterior / garden'],
        ['04', `Continue to ${nearby}`]
      ],

      "2–3 hours": [
        ['START', 'Arrive at CSMVS'],
        ['01', focus],
        ['02', 'Explore major museum collections'],
        ['03', 'Take time for cultural highlights'],
        ['04', 'Short break'],
        ['05', `Continue to ${nearby}`]
      ],

      "3+ hours": [
        ['START', 'Arrive at CSMVS'],
        ['01', focus],
        ['02', 'Explore major museum collections'],
        ['03', 'Explore cultural highlights'],
        ['04', 'Take a relaxed break'],
        ['05', `Continue to ${nearby}`],
        ['06', 'Explore the surrounding South Mumbai area']
      ]
    };

    const crowdText =
      crowdPref === 'Less crowded'
        ? 'Prioritize a quieter visit'
        : crowdPref === 'Crowd doesn\'t matter'
          ? 'Crowd level is not a priority'
          : 'Moderate crowd preference';

    const selectedRoute = routes[duration];

    const itineraryHTML = selectedRoute.map((item, index) => {

      const isStart = item[0] === 'START';

      return `
      <div class="itinerary-step ${isStart ? 'start-step' : ''}">
        <div class="itinerary-number">${isStart ? 'V' : item[0]}</div>
        <div class="itinerary-content">
          <span>${isStart ? 'BEGIN YOUR JOURNEY' : 'STOP ' + item[0]}</span>
          <strong>${item[1]}</strong>
        </div>
      </div>
    `;

    }).join('');

    const result = $('#plannerResult');

    result.innerHTML = `
    <div class="result-top">
      <span class="mini-label">YOUR ITINERARY</span>
      <span class="result-status">Personalized plan</span>
    </div>

    <div class="plan-output">

      <h3>
        Your ${duration} CSMVS journey.
      </h3>

      <p class="plan-sub">
        ${group} · ${purpose} 
      </p>

      <div class="plan-meta">

        <div class="meta-box">
          <span>Your focus</span>
          <strong>${focus}</strong>
        </div>

        <div class="meta-box">
          <span>Crowd preference</span>
          <strong>${crowdText}</strong>
        </div>

      </div>

      <div class="itinerary">

        ${itineraryHTML}

      </div>

      <div class="itinerary-footer">
        <span>Built from the CSMVS visitor study</span>
      </div>

      <p class="plan-note">
        This is a survey-informed planning prototype, not a live
        crowd forecast or museum booking service.
      </p>

    </div>
  `;

    result.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  });
  document.querySelectorAll('.place-card').forEach(b => b.addEventListener('click', () => { state.nearby = b.dataset.place; location.hash = 'planner'; toast(b.dataset.place + ' added to your visit plan.') }));
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200) }
})();
