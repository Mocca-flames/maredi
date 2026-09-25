window.__MAREDI_LOGO__ = "assets/optimized/logo.webp";

/* ---------- Image asset map (assets/optimized/ for production, assets/raw/ for dev) ---------- */
var IMG = {
  hero:       "assets/optimized/vehicle_motion.webp",
  guarding:   "assets/optimized/receptionist.webp",
  armed:      "assets/optimized/response_vehicle.webp",
  cctv:       "assets/optimized/cctv_installation.webp",
  monitoring: "assets/optimized/control_room.webp",
  vip:        "assets/optimized/vip.webp",
  officer:    "assets/optimized/officer.webp"
};
window.__MAREDI_IMG__ = IMG;

/* ============ Maredi Protection — app.js ============ */
(function(){
"use strict";

var LOGO = window.__MAREDI_LOGO__;

/* ---------- DB capability (leads) ---------- */
var dbCap = null;
(async function initDb(){
  try{ dbCap = await claude.use("db"); }catch(e){ dbCap = null; }
})();

function saveLead(kind, payload){
  var record = Object.assign({kind:kind, ts:Date.now(), id:'lead_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)}, payload);
  if(dbCap){
    try{ dbCap.doc('leads/'+record.id).set(record).catch(function(){}); }catch(e){}
  }
  return record;
}

/* ---------- icons (inline SVG, stroke currentColor via CSS var) ---------- */
var ICONS = {
  guard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9.5 12l1.8 1.8L14.5 10"/></svg>',
  response: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h3l2-2h8l2 2h3v11H3z"/><circle cx="12" cy="13.5" r="3.4"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/></svg>',
  vip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.6 5.8L21 9l-4.5 4.2L17.6 20 12 16.8 6.4 20l1.1-6.8L3 9l6.4-1.2z"/></svg>',
  fence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16M9 4v16M14 4v16M19 4v16M2 9h20M2 15h20"/></svg>',
  patrol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l4-9 4 5 3-4 5 8"/><circle cx="6" cy="19" r="1.4"/><circle cx="18" cy="19" r="1.4"/></svg>',
  invasion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M6 20V10l6-5 6 5v10M10 20v-5h4v5"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s-5 5-5 10a5 5 0 0010 0c0-2-1-3-1-3s-1 2-2 2c-1.2 0-1-2-1-2s3 1 3 5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  dog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l3-4 3 1 2-2 2 2 3-1 3 4v6a2 2 0 01-2 2h-1l-1-2h-6l-1 2H6a2 2 0 01-2-2z"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/></svg>'
};

/* ---------- Content data ---------- */
var SERVICES = [
  {
    id:'manned-guarding',
    icon:'guard',
    title:'Manned Guarding',
    short:'PSIRA-registered armed and unarmed officers stationed at your site, day and night.',
    tags:['Estates','Offices','Retail','Industrial'],
    lead:'PSIRA-registered officers on your ground, not just on paper',
    body:'Maredi places vetted, PSIRA-registered security officers directly on your property — at the gate, on the floor, or walking your perimeter. Every officer is graded to the risk level of the site: unarmed access-control staff for a reception desk, armed response-capable officers for a high-value warehouse or an estate entrance exposed to the road.',
    features:[
      ['Access control & reception','Officers manage visitor logs, deliveries, and ID verification at every entry point — armed or unarmed, matched to your risk profile.'],
      ['Residential estate guarding','24/7 gatehouse presence, resident verification, and coordinated patrol with your existing committee or body corporate.'],
      ['Commercial & office sites','Front-of-house presence during trading hours, after-hours lockup checks, and incident escalation straight to armed response.'],
      ['Industrial & warehouse sites','Perimeter patrol, loading-bay control, and stock-theft deterrence for yards, depots and distribution centres.']
    ],
    interactive:'guarding'
  },
  {
    id:'armed-response',
    icon:'response',
    title:'Armed Response',
    short:'24/7 rapid dispatch, tactical units, and K-9 patrols responding to your alarm the moment it triggers.',
    tags:['24/7','Panic Button','K-9'],
    lead:'From alarm to armed officer on-site — minutes, not excuses',
    body:'When your alarm activates, Maredi\'s dispatch desk routes the nearest armed response vehicle to your address immediately. For higher-risk properties we layer in tactical response units and trained K-9 patrol teams, so the first responder through your gate is exactly the right one for what\'s happening.',
    features:[
      ['24/7 alarm dispatch','Every panic activation and alarm trigger is routed to the nearest available armed vehicle with live GPS dispatch.'],
      ['Tactical response units','Specially trained units for high-risk activations — armed intrusions, hijack-in-progress, and multi-suspect incidents.'],
      ['K-9 patrol & response','Trained dog units for perimeter sweeps and building searches, deployed alongside armed officers on serious activations.'],
      ['Direct-to-SAPS escalation','Every serious incident is logged and escalated in parallel with South African Police Service protocol.']
    ],
    interactive:'response'
  },
  {
    id:'electronic-security',
    icon:'camera',
    title:'Electronic Security & Technical Installations',
    short:'CCTV, AI video analytics, automated gates, electric fencing, and biometric access — designed and installed.',
    tags:['CCTV','Biometrics','Gate Automation','Fencing'],
    lead:'The hardware layer that never blinks',
    body:'Maredi designs and installs the technical backbone that makes physical guarding smarter: camera coverage engineered to your actual site geometry, AI analytics that flag loitering or perimeter breaches before a human would notice, and access hardware that removes guesswork from who comes and goes.',
    features:[
      ['CCTV & AI video analytics','Coverage plans engineered from your site\'s real layout, with intrusion, loitering and line-crossing detection layered on top.'],
      ['Automated gates & booms','Remote-triggered and access-linked gate automation for estates, complexes and commercial yards.'],
      ['Electric fencing','SANS 10222-compliant electric fence design, installation and energiser maintenance.'],
      ['Biometric access control','Fingerprint and facial-recognition entry systems tied into your guarding and monitoring stack.']
    ],
    interactive:'cctv'
  },
  {
    id:'off-site-monitoring',
    icon:'monitor',
    title:'Off-Site Monitoring',
    short:'Real-time remote camera and alarm oversight from a dedicated 24/7 control centre.',
    tags:['24/7 Control Room','Live Camera Feed'],
    lead:'A second set of eyes on your property, every hour of the day',
    body:'Your cameras and alarms are only as good as the person watching them. Maredi\'s control centre monitors your site continuously, verifies alarm activations before dispatching a vehicle, and keeps a recorded log of everything — so you\'re never relying on footage alone after the fact.',
    features:[
      ['Live remote camera monitoring','Control-room operators watch your feed in real time, not just record it for later review.'],
      ['Alarm verification','Every activation is visually or audibly verified before an armed unit is dispatched, cutting false-alarm callouts.'],
      ['Incident recording & handover','Full incident logs and footage handed to you and, where needed, to SAPS.'],
      ['Integration with your existing hardware','Works with most existing CCTV and alarm brands — no forced hardware swap required.']
    ],
    interactive:null
  },
  {
    id:'specialized-high-risk',
    icon:'vip',
    title:'Specialized & High-Risk Services',
    short:'VIP protection, armed transit escorts, special operations, and anti-land-invasion perimeter defence.',
    tags:['VIP Close Protection','Cash-in-Transit Escort','Land Invasion Defence'],
    lead:'When the standard service level isn\'t enough',
    body:'Some situations call for a different tier of operator entirely. Maredi runs close-protection details for executives and public figures, armed escorts for high-value transit, and dedicated perimeter operations against land invasion and unlawful occupation — each one built around a formal risk assessment, not a fixed package.',
    features:[
      ['VIP & executive close protection','Dedicated protection officers and route planning for executives, public figures and their families.'],
      ['Armed transit escort','Escort vehicles and armed officers for high-value cargo, cash-in-transit, and sensitive relocations.'],
      ['Special operations','Purpose-built teams assembled for a specific, time-bound risk — event security, crisis response, asset recovery support.'],
      ['Anti-land-invasion perimeter defence','Rapid-deployment perimeter teams and legal-process-aligned response to protect undeveloped or vacant land.']
    ],
    interactive:'vip'
  }
];

var EXTRA_SERVICES = [
  {icon:'fence', title:'Perimeter Detection Systems', body:'Beam, vibration and fence-mounted detection layered under your existing wall or fence line.'},
  {icon:'patrol', title:'Mobile Patrol Contracts', body:'Scheduled or randomised vehicle patrols across multi-site portfolios, with GPS-logged proof of visit.'},
  {icon:'invasion', title:'Fire & Life-Safety Integration', body:'Fire detection and evacuation coordination bundled into your existing guarding contract at complex sites.'},
  {icon:'dog', title:'K-9 Detection Units', body:'Explosive and narcotic detection dog units available for event and site screening on request.'}
];

var WHY_MAREDI = [
  ['PSIRA-registered, end to end','Every officer, vehicle and control-room operator on your contract is registered and audited — not just the company on paper.'],
  ['One provider, every layer','Guards, armed response, cameras, monitoring and access control from a single accountable operator — no finger-pointing between vendors.'],
  ['Engineered, not guessed','CCTV counts, guard numbers and escort sizing come from an actual risk assessment of your site, not a flat rate card.'],
  ['Built for the region','Cross-border SADC logistics corridors, industrial yards and estate perimeters — Maredi is built around South African risk realities.']
];

var COMPARE_ROWS = [
  ['PSIRA-registered officers', true, true],
  ['Armed response under 15 min avg.', true, false],
  ['In-house 24/7 control room', true, false],
  ['Engineered CCTV design (not flat quote)', true, false],
  ['Single contract for guarding + tech + monitoring', true, false],
  ['K-9 & tactical unit availability', true, false]
];

var PRICING = [
  {name:'Essential Guarding', price:'From R 8,500', period:'/ officer / month', features:['1x unarmed PSIRA officer, 12hr shift','Access control & visitor logging','Monthly site audit report','Armed response add-on available'], featured:false},
  {name:'Estate & Business Shield', price:'From R 18,900', period:'/ month', features:['Armed guarding + 24/7 armed response','Off-site monitoring included','Quarterly risk reassessment','Priority dispatch under 15 min avg.'], featured:true},
  {name:'Enterprise & High-Risk', price:'Custom quote', period:'built from assessment', features:['Multi-site guarding + electronic security','VIP / transit / special-ops on demand','Dedicated account manager','SLA-backed response commitment'], featured:false}
];

/* ---------- state & router ---------- */
var state = {
  route: 'home',
  serviceId: null,
  builder: null // {type, step, data}
};

function go(route, opts){
  state.route = route;
  if(opts){ Object.assign(state, opts); }
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
  render();
}

function h(tag, attrs, children){
  attrs = attrs || {};
  var el = document.createElement(tag);
  Object.keys(attrs).forEach(function(k){
    if(k === 'class'){ el.className = attrs[k]; }
    else if(k === 'html'){ el.innerHTML = attrs[k]; }
    else if(k.indexOf('on') === 0 && typeof attrs[k] === 'function'){ el.addEventListener(k.slice(2), attrs[k]); }
    else if(k === 'style'){ el.setAttribute('style', attrs[k]); }
    else { el.setAttribute(k, attrs[k]); }
  });
  (children||[]).forEach(function(c){
    if(c === null || c === undefined) return;
    if(typeof c === 'string'){ el.appendChild(document.createTextNode(c)); }
    else { el.appendChild(c); }
  });
  return el;
}
function icon(name, cls){
  return h('span', {class:'service-icon '+(cls||''), html: ICONS[name] || ''});
}

/* app.js part 1 ends here - continued in app2.js content appended below */

/* ============ RENDER: shell ============ */
function renderNav(){
  var nav = h('div', {class:'topnav'}, [
    h('div', {class:'topnav-inner'}, [
      h('button', {class:'brand', onclick:function(){ go('home'); }}, [
        h('img', {src:LOGO, alt:'Maredi Protection'}),
        h('span', {class:'brand-text'}, ['MAREDI', h('small', {}, ['ALWAYS VIGILANT'])])
      ]),
      h('div', {style:'display:flex;align-items:center;gap:14px;'}, [
        h('a', {class:'nav-tel', href:'https://wa.me/27720495530'}, ['WhatsApp: 27 72 049 5530']),
        h('button', {class:'nav-cta', onclick:function(){ go('quote'); }}, ['Request a quote'])
      ])
    ])
  ]);
  return nav;
}

function renderHero(){
  var blips = [
    {top:'20%', left:'62%'}, {top:'55%', left:'22%'}, {top:'70%', left:'75%'}
  ];
  var radar = h('div', {class:'radar-wrap'}, [
    h('div', {class:'radar-ring'}), h('div', {class:'radar-ring r2'}),
    h('div', {class:'radar-ring r3'}), h('div', {class:'radar-ring r4'}),
    h('div', {class:'radar-sweep'}),
    h('img', {class:'radar-crest', src:LOGO, alt:''}),
  ].concat(blips.map(function(b){ return h('div', {class:'radar-blip', style:'top:'+b.top+';left:'+b.left+';'}); })));

  return h('div', {class:'hero'}, [
    h('div', {class:'wrap'}, [
      radar,
      h('div', {class:'hero-copy'}, [
        h('div', {class:'eyebrow-line'}, [h('span',{class:'dot'}), 'PSIRA registered · 24/7 control room']),
        h('h1', {class:'hero-title'}, ['Always ', h('span',{class:'accent'},['Vigilant.'])]),
        h('p', {class:'hero-sub'}, ['Armed guarding, rapid response, and engineered surveillance for South African homes, estates and businesses — from one accountable operator.']),
        h('div', {class:'hero-ctas'}, [
          h('button', {class:'btn btn-primary', onclick:function(){ go('quote'); }}, ['Get a free risk assessment']),
          h('button', {class:'btn btn-ghost', onclick:function(){ document.getElementById('services-anchor').scrollIntoView({behavior:'smooth'}); }}, ['View our services'])
        ]),
        h('div', {class:'hero-stats'}, [
          h('div', {}, [h('b',{},['<15min']), h('span',{},['Avg. response time'])]),
          h('div', {}, [h('b',{},['24/7']), h('span',{},['Control room & dispatch'])]),
          h('div', {}, [h('b',{},['PSIRA']), h('span',{},['Registered officers'])])
        ])
      ])
    ])
  ]);
}

function renderValueProp(){
  var points = [
    ['Under 15 min','Average armed response time, day or night.'],
    ['PSIRA-registered','Officers, vehicles and control-room staff — all audited.'],
    ['Risk-engineered','Sizing from your site assessment, not a rate card.']
  ];
  var stats = [
    ['<15min','Avg. response time'],
    ['24/7','Control room & dispatch'],
    ['PSIRA','Registered officers']
  ];

  var video = h('video', {
    class:'valueprop-video',
    src:'assets/hero.webm',
    poster:IMG.hero,
    autoplay:'', muted:'', loop:'', playsinline:'', 'webkit-playsinline':'',
    preload:'metadata'
  }, []);
  video.muted = true;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    video.removeAttribute('autoplay');
    video.autoplay = false;
    video.addEventListener('loadedmetadata', function(){ video.pause(); });
  }

  var pointEls = points.map(function(p){
    return h('li', {class:'valueprop-point'}, [h('h4', {}, [p[0]]), h('p', {}, [p[1]])]);
  });

  var statEls = stats.map(function(s){
    return h('div', {}, [h('b', {}, [s[0]]), h('span', {}, [s[1]])]);
  });

  var overlay = h('div', {class:'valueprop-overlay'}, [
    h('div', {class:'valueprop-head'}, [
      h('div', {class:'section-tag'}, ['WHY CHOOSE US']),
      h('h2', {}, ['One operator. Every layer.'])
    ]),
    h('ul', {class:'valueprop-points'}, pointEls),
    h('div', {class:'valueprop-stats'}, statEls)
  ]);

  var sticky = h('div', {class:'valueprop-sticky'}, [
    video,
    h('div', {class:'valueprop-scrim'}),
    overlay
  ]);

  var section = h('div', {class:'section valueprop-band'}, [sticky]);

  initValuePropScroll(section);

  return section;
}

/* pins the video full-bleed while the user scrolls through the copy/stats reveal */
function initValuePropScroll(section){
  var items = section.querySelectorAll('.valueprop-point');
  var stats = section.querySelector('.valueprop-stats');
  var stages = items.length + 1;

  function onScroll(){
    if(!document.body.contains(section)){
      window.removeEventListener('scroll', onScroll);
      return;
    }
    var rect = section.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var progress = scrollable > 0 ? (-rect.top) / scrollable : 0;
    progress = Math.max(0, Math.min(1, progress));
    var activeStage = Math.floor(progress * stages);
    items.forEach(function(el, i){ el.classList.toggle('is-visible', activeStage > i); });
    if(stats) stats.classList.toggle('is-visible', activeStage >= items.length);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  onScroll();
}

function renderRiskStrip(){
  var opts = [
    {label:'Home / Family', sub:'Household & estate', route:'quote', payload:{context:'residential'}},
    {label:'Business Premises', sub:'Office, retail, industrial', route:'quote', payload:{context:'commercial'}},
    {label:'High-Value / VIP', sub:'Executive or public figure', route:'service', payload:{serviceId:'specialized-high-risk'}},
    {label:'Not sure yet', sub:'Walk me through it', route:'quote', payload:{context:'unsure'}}
  ];
  return h('div', {class:'section'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'risk-strip'}, [
        h('div', {class:'risk-strip-top'}, [h('span',{class:'dot'}), h('span',{},['60-SECOND RISK CHECK'])]),
        h('h3', {}, ['What are you protecting?']),
        h('p', {}, ['Tell us what you need protected — we\'ll route you to the right service and pricing.']),
        h('div', {class:'risk-options'}, opts.map(function(o){
          return h('button', {class:'risk-opt', onclick:function(){
            if(o.route === 'service'){ go('service', {serviceId:o.payload.serviceId}); }
            else { go('quote', {builder:{type:'general', step:0, data:o.payload}}); }
          }}, [h('b',{},[o.label]), h('span',{},[o.sub])]);
        }))
      ])
    ])
  ]);
}

function renderServices(){
  return h('div', {class:'section dark-band', id:'services-anchor'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'section-head'}, [
        h('div', {class:'section-tag'}, ['WHAT WE DO']),
        h('h2', {}, ['Five service lines, one accountable operator.']),
        h('p', {}, ['From gatehouse to control room, armed response to AI analytics — we deploy the full stack so you never have to coordinate between vendors.'])
      ]),
h('div', {class:'service-grid'}, SERVICES.map(function(s){
        var featured = (s.features||[]).slice(0,2);
        var isInteractive = !!s.interactive;
        var imgSrc = {
          'manned-guarding': IMG.guarding,
          'armed-response': IMG.armed,
          'electronic-security': IMG.cctv,
          'off-site-monitoring': IMG.monitoring,
          'specialized-high-risk': IMG.vip
        }[s.id] || '';
        return h('div', {class:'service-card', onclick:function(){ go('service', {serviceId:s.id}); }}, [
          h('div', {class:'service-img-wrap'}, [h('img', {src:imgSrc, alt:s.title, loading:'lazy'})]),
          h('div', {class:'service-img-overlay'}),
          icon(s.icon),
          h('h3', {}, [s.title]),
          h('div', {class:'service-lead'}, [s.lead]),
          h('p', {class:'service-body'}, [s.body]),
          h('ul', {class:'service-features'}, featured.map(function(f){
            return h('li', {}, [h('span', {class:'feat-check', html: ICONS.check}), h('span', {}, [f[0]])]);
          })),
          h('div', {class:'service-tags'}, s.tags.map(function(t){ return h('span',{},[t]); })),
          h('button', {
            class:'service-card-btn' + (isInteractive ? ' service-card-btn-primary' : ''),
            onclick:function(e){ e.stopPropagation(); if(isInteractive){ go('builder', {builder:{type:s.interactive, step:0, data:{}}}); }else{ go('service', {serviceId:s.id}); } }
          }, [isInteractive ? 'Build your quote' : 'Explore ' + s.title]),
          h('span', {class:'arrow', html: ICONS.arrow})
        ]);
      }).concat([
        h('div', {class:'service-card service-card-cta', onclick:function(){ go('quote'); }}, [
          h('div', {class:'service-img-wrap'}, [h('img', {src:IMG.officer, alt:'Not sure what you need?', loading:'lazy'})]),
          h('div', {class:'service-img-overlay'}),
          icon('shield'),
          h('h3', {}, ['Not sure what you need?']),
          h('div', {class:'service-lead'}, ['Answer a few questions about your site']),
          h('p', {class:'service-body'}, ['We\'ll scope the right combination of guarding, response and technology — no obligation, free of charge.']),
          h('ul', {class:'service-features'}, [
            h('li', {}, [h('span', {class:'feat-check', html: ICONS.check}), h('span', {}, ['Free risk assessment'])]),
            h('li', {}, [h('span', {class:'feat-check', html: ICONS.check}), h('span', {}, ['No commitment required'])])
          ]),
          h('div', {class:'service-tags'}, [h('span', {}, ['Free risk assessment'])]),
          h('button', {class:'service-card-btn service-card-btn-primary', onclick:function(e){ e.stopPropagation(); go('quote'); }}, ['Start now']),
          h('span', {class:'arrow', html: ICONS.arrow})
        ])
      ])),
      h('div', {style:'margin-top:26px;'}, [
        h('div', {class:'section-tag'}, ['ALSO AVAILABLE']),
        h('div', {class:'feature-list'}, EXTRA_SERVICES.map(function(e){
          return h('div', {class:'feature-item'}, [
            h('h4', {}, [e.title]), h('p', {}, [e.body])
          ]);
        }))
      ])
    ])
  ]);
}

function renderPower(){
  return h('div', {class:'section power-band'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'section-head'}, [
        h('div', {class:'section-tag'}, ['WHY MAREDI']),
        h('h2', {}, ['Accountable for every layer.']),
        h('p', {}, ['South Africa has no shortage of security companies. Very few run guarding, armed response, technical installation and monitoring as one accountable operation.'])
      ]),
      h('div', {class:'power-grid'}, WHY_MAREDI.map(function(w){
        return h('div', {class:'power-item'}, [h('h4',{},[w[0]]), h('p',{},[w[1]])]);
      })),
      h('div', {class:'compare-scroll'}, [
        h('table', {class:'compare-table'}, [
          h('thead', {}, [h('tr', {}, [h('th',{},['']), h('th',{},['Maredi']), h('th',{},['Typical provider'])])]),
          h('tbody', {}, COMPARE_ROWS.map(function(r){
            return h('tr', {}, [
              h('td', {}, [r[0]]),
              h('td', {class:'yes', html: ICONS.check}),
              h('td', {class: r[2] ? 'yes' : 'no', html: r[2] ? ICONS.check : '—'})
            ]);
          }))
        ])
      ])
    ])
  ]);
}

function renderDeployBand(){
  var stats = [
    ['120+','Officers deployed'],
    ['15 min','Avg. response time'],
    ['24/7','Control room uptime'],
    ['9', 'Provinces served']
  ];
  return h('div', {class:'deploy-band dark-band'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'deploy-grid'}, stats.map(function(s){
        return h('div', {class:'deploy-item'}, [h('b',{},[s[0]]), h('span',{},[s[1]])]);
      }))
    ])
  ]);
}

function renderPricing(){
  return h('div', {class:'section pricing-band dark-band'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'section-head'}, [
        h('div', {class:'section-tag'}, ['INDICATIVE PRICING']),
        h('h2', {}, ['Transparent tiers. Precise quotes.']),
        h('p', {}, ['These are starting reference points — your actual quote is engineered from a real risk assessment of your site, free of charge.'])
      ]),
      h('div', {class:'pricing-grid'}, PRICING.map(function(p){
        return h('div', {class:'price-card' + (p.featured ? ' featured' : '')}, [
          p.featured ? h('span', {class:'price-badge'}, ['Most requested']) : null,
          h('h4', {}, [p.name]),
          h('div', {class:'price'}, [p.price, ' ', h('small',{},[p.period])]),
          h('ul', {}, p.features.map(function(f){ return h('li',{},[f]); })),
          h('button', {class:'btn '+(p.featured?'btn-primary':'btn-ghost')+' btn-block', onclick:function(){ go('quote'); }}, ['Build this quote'])
        ]);
      })),
      h('p', {class:'price-note'}, ['Prices exclude VAT and vary by region, risk grading and contract length. Final pricing confirmed after a free on-site or remote risk assessment.'])
    ])
  ]);
}

function renderFooter(){
  return h('div', {class:'footer dark-band'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'footer-grid'}, [
        h('div', {}, [
          h('div', {class:'footer-brand'}, [h('img',{src:LOGO,alt:''}), h('span',{class:'brand-text'},['MAREDI PROTECTION'])]),
          h('p', {}, ['PSIRA-registered guarding, armed response, electronic security and off-site monitoring — deployed across South Africa. Always vigilant.'])
        ]),
        h('div', {}, [
          h('h5', {}, ['Services']),
          h('ul', {}, SERVICES.map(function(s){
            return h('li',{},[h('a',{href:'#', onclick:function(e){e.preventDefault(); go('service',{serviceId:s.id});}},[s.title])]);
          }))
        ]),
        h('div', {}, [
          h('h5', {}, ['Contact']),
          h('ul', {}, [
            h('li', {}, [h('a', {href:'https://wa.me/27720495530'}, ['24/7 Line: 27 72 049 5530'])]),
            h('li', {}, [h('a', {href:'mailto:info@marediprotection.co.za'}, ['info@marediprotection.co.za'])]),
            h('li', {}, [h('a', {href:'#', onclick:function(e){e.preventDefault(); go('quote');}}, ['Request a quote'])])
          ])
        ])
      ]),
      h('div', {class:'footer-bottom'}, ['© '+new Date().getFullYear()+' Maredi Protection. PSIRA registered. All rights reserved.'])
    ])
  ]);
}

function renderStickyCta(){
  return h('div', {class:'sticky-cta'}, [
    h('a', {class:'btn btn-ghost', href:'https://wa.me/27720495530'}, ['Call now']),
    h('button', {class:'btn btn-primary', onclick:function(){ go('quote'); }}, ['Request a quote'])
  ]);
}

function renderHome(){
  var frag = document.createDocumentFragment();
  [renderHero(), renderValueProp(), renderRiskStrip(), renderServices(), renderDeployBand(), renderPower(), renderPricing()].forEach(function(n){ frag.appendChild(n); });
  return frag;
}

/* ============ RENDER: service detail ============ */
function renderServiceDetail(id){
  var s = SERVICES.filter(function(x){ return x.id === id; })[0];
  if(!s){ go('home'); return document.createDocumentFragment(); }
var frag = document.createDocumentFragment();

  var imgSrc = {
    'manned-guarding': IMG.guarding,
    'armed-response': IMG.armed,
    'electronic-security': IMG.cctv,
    'off-site-monitoring': IMG.monitoring,
    'specialized-high-risk': IMG.vip
  }[id] || '';
  frag.appendChild(h('div', {class:'detail-hero dark-band has-bg-image', style:'--hero-img:url('+imgSrc+')'}, [
    h('div', {class:'detail-hero-overlay'}),
    h('div', {class:'wrap'}, [
      h('button', {class:'back-link', onclick:function(){ go('home'); }}, ['← All services']),
      h('h1', {style:'margin-top:14px;'}, [s.title]),
      h('p', {class:'lead'}, [s.body]),
      h('div', {class:'detail-badges'}, s.tags.map(function(t){ return h('span',{},[t]); }))
    ])
  ]));

  frag.appendChild(h('div', {class:'section'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'section-head'}, [
        h('div', {class:'section-tag'}, ['HOW IT WORKS']),
        h('h2', {}, [s.lead])
      ]),
      h('div', {class:'feature-list'}, s.features.map(function(f){
        return h('div', {class:'feature-item'}, [h('h4',{},[f[0]]), h('p',{},[f[1]])]);
      }))
    ])
  ]));

  if(s.interactive){
    frag.appendChild(h('div', {class:'section', style:'border-bottom:none;'}, [
      h('div', {class:'wrap'}, [
        h('div', {class:'risk-strip', style:'text-align:center;padding:34px 22px;'}, [
          h('h3', {}, ['Build your ' + s.title.toLowerCase() + ' quote']),
          h('p', {}, ['Answer a few questions about your site and risk level — get an indicative price and a real quote request in under two minutes.']),
          h('button', {class:'btn btn-primary', onclick:function(){ go('builder', {builder:{type:s.interactive, step:0, data:{}}}); }}, ['Start interactive quote'])
        ])
      ])
    ]));
  } else {
    frag.appendChild(h('div', {class:'section', style:'border-bottom:none;'}, [
      h('div', {class:'wrap', style:'text-align:center;'}, [
        h('button', {class:'btn btn-primary', onclick:function(){ go('quote'); }}, ['Request a quote for this service'])
      ])
    ]));
  }

  return frag;
}

/* ============ Generic quote landing (chooses a builder) ============ */
function renderQuoteLanding(){
  var frag = document.createDocumentFragment();
  frag.appendChild(h('div', {class:'detail-hero dark-band'}, [
    h('div', {class:'wrap'}, [
      h('button', {class:'back-link', onclick:function(){ go('home'); }}, ['← Home']),
      h('h1', {}, ['What do you need protected?']),
      h('p', {class:'lead'}, ['Pick the closest match. Each flow is built to give you a real, engineered estimate — not a guess.'])
    ])
  ]));
  var choiceImgs = {
    guarding:'assets/optimized/receptionist.webp',
    response:'assets/optimized/response_vehicle.webp',
    cctv:'assets/optimized/cctv_installation.webp',
    vip:'assets/optimized/vip.webp'
  };
  var choices = [
    {type:'guarding', title:'On-site guarding', sub:'Armed or unarmed officers at your property', img:choiceImgs.guarding},
    {type:'response', title:'Armed response cover', sub:'24/7 alarm dispatch for your address', img:choiceImgs.response},
    {type:'cctv', title:'CCTV & electronic security', sub:'Cameras, gates, fencing, access control', img:choiceImgs.cctv},
    {type:'vip', title:'VIP / high-risk protection', sub:'Close protection or transit escort', img:choiceImgs.vip}
  ];
  frag.appendChild(h('div', {class:'section', style:'border-bottom:none;'}, [
    h('div', {class:'wrap'}, [
      h('button', {class:'back-link', onclick:function(){ go('home'); }}, ['← Home']),
      h('h1', {}, ['What do you need protected?']),
      h('p', {class:'lead'}, ['Pick the closest match. Each flow is built to give you a real, engineered estimate — not a guess.'])
    ])
  ]));
  frag.appendChild(h('div', {class:'section', style:'border-bottom:none;'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'choice-grid cols-2'}, choices.map(function(c){
        return h('div', {class:'choice-card', onclick:function(){ go('builder', {builder:{type:c.type, step:0, data:{}}}); }}, [
          h('div', {class:'choice-card-img-wrap'}, [h('img', {src:c.img, alt:c.title, loading:'lazy'})]),
          h('div', {class:'choice-card-img-overlay'}),
          icon(c.icon),
          h('b', {style:'margin-top:10px;'}, [c.title]),
          h('span', {}, [c.sub])
        ]);
      }))
    ])
  ]));
  return frag;
}

/* ============ BUILDER ENGINE ============ */

function progressBar(step, total){
  var segs = [];
  for(var i=0;i<total;i++){
    var cls = 'seg' + (i < step ? ' done' : (i === step ? ' active' : ''));
    segs.push(h('div', {class:cls}));
  }
  return h('div', {class:'builder-progress'}, segs);
}

function builderShell(stepLabel, title, sub, body, navButtons){
  return h('div', {class:'section', style:'border-bottom:none;padding-bottom:100px;'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'builder-shell'}, [
        h('button', {class:'back-link', onclick:function(){ go('home'); }}, ['← Exit to home']),
        progressBar(state.builder.stepIndex, state.builder.totalSteps),
        h('div', {class:'builder-step-label'}, [stepLabel]),
        h('h2', {class:'builder-step-title'}, [title]),
        h('p', {class:'builder-step-sub'}, [sub]),
        body,
        h('div', {class:'builder-nav'}, navButtons)
      ])
    ])
  ]);
}

function choiceCard(opts){
  // opts: {label, sub, selected, onClick}
  return h('div', {class:'choice-card' + (opts.selected ? ' selected' : ''), onclick:opts.onClick}, [
    h('div', {class:'check'}),
    h('b', {}, [opts.label]),
    opts.sub ? h('span', {}, [opts.sub]) : null
  ]);
}

function nextBtn(label, onClick, disabled){
  return h('button', {class:'btn btn-primary', onclick: disabled ? null : onClick, disabled: disabled ? 'disabled' : null}, [label || 'Continue']);
}
function backBtn(onClick){
  return h('button', {class:'btn btn-ghost', onclick:onClick}, ['Back']);
}

/* ---------- GUARDING BUILDER ----------
Steps: 0 site type, 1 armed/unarmed, 2 hours, 3 num officers (risk-based suggestion), 4 contact -> result */
var GUARDING_STEPS = 5;
function renderGuardingBuilder(d){
  var step = d._step || 0;
  state.builder.stepIndex = step; state.builder.totalSteps = GUARDING_STEPS;

  if(step === 0){
    var opts = [
      {v:'residential', l:'Residential Estate', s:'Complex, estate or gated community'},
      {v:'commercial', l:'Commercial / Office', s:'Office park, retail, business premises'},
      {v:'industrial', l:'Industrial / Warehouse', s:'Yard, depot, distribution centre'},
      {v:'event', l:'Event / Temporary Site', s:'Short-term or once-off coverage'}
    ];
    var body = h('div', {class:'choice-grid cols-2'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.siteType===o.v, onClick:function(){ d.siteType=o.v; rerender(); }});
    }));
    return builderShell('STEP 1 OF '+GUARDING_STEPS, 'What type of site needs guarding?', 'This determines the officer grading and shift structure we recommend.', body, [
      nextBtn('Continue', function(){ d._step=1; rerender(); }, !d.siteType)
    ]);
  }
  if(step === 1){
    var opts = [
      {v:'armed', l:'Armed Officers', s:'Firearm-carrying, higher-risk sites'},
      {v:'unarmed', l:'Unarmed Officers', s:'Access control, reception, low-risk'},
      {v:'mixed', l:'Mixed Team', s:'Armed + unarmed combination'}
    ];
    var body = h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.armedLevel===o.v, onClick:function(){ d.armedLevel=o.v; rerender(); }});
    }));
    return builderShell('STEP 2 OF '+GUARDING_STEPS, 'Armed or unarmed officers?', 'You can mix tiers across a single site.', body, [
      backBtn(function(){ d._step=0; rerender(); }),
      nextBtn('Continue', function(){ d._step=2; rerender(); }, !d.armedLevel)
    ]);
  }
  if(step === 2){
    var opts = [
      {v:'12h1', l:'12-hour, single shift', s:'One officer, one 12hr shift/day'},
      {v:'12h2', l:'12-hour, two shifts', s:'Day + night coverage, 24hr total'},
      {v:'24h3', l:'24/7 rotating roster', s:'Full round-the-clock, 3-shift roster'}
    ];
    var body = h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.shiftPattern===o.v, onClick:function(){ d.shiftPattern=o.v; rerender(); }});
    }));
    return builderShell('STEP 3 OF '+GUARDING_STEPS, 'What coverage window do you need?', 'This sets how many officer-shifts are staffed per day.', body, [
      backBtn(function(){ d._step=1; rerender(); }),
      nextBtn('Continue', function(){ d._step=3; rerender(); }, !d.shiftPattern)
    ]);
  }
  if(step === 3){
    if(d.officerCount === undefined) d.officerCount = suggestOfficerCount(d);
    var body = h('div', {}, [
      h('p', {style:'color:var(--silver-300);font-size:13px;margin-bottom:14px;'}, ['Based on your site type and coverage, we suggest a starting point below — adjust if you already know your headcount.']),
      h('div', {class:'stepper-row'}, [
        h('button', {onclick:function(){ if(d.officerCount>1){d.officerCount--; rerender();} }}, ['–']),
        h('span', {class:'val'}, [String(d.officerCount)]),
        h('button', {onclick:function(){ d.officerCount++; rerender(); }}, ['+'])
      ]),
      h('p', {style:'color:var(--silver-300);font-size:12px;margin-top:10px;'}, ['officers on contract'])
    ]);
    return builderShell('STEP 4 OF '+GUARDING_STEPS, 'How many officers?', 'Suggested from your risk profile — you\'re in full control of the final number.', body, [
      backBtn(function(){ d._step=2; rerender(); }),
      nextBtn('See my estimate', function(){ d._step=4; rerender(); })
    ]);
  }
  if(step === 4){
    return renderContactAndResult(d, 'guarding', computeGuardingPrice(d), guardingSummaryRows(d));
  }
}

function suggestOfficerCount(d){
  var base = {residential:2, commercial:1, industrial:2, event:2}[d.siteType] || 1;
  if(d.shiftPattern === '12h2') base += 1;
  if(d.shiftPattern === '24h3') base += 2;
  if(d.armedLevel === 'mixed') base += 1;
  return base;
}
function computeGuardingPrice(d){
  var rate = d.armedLevel === 'armed' ? 12500 : (d.armedLevel === 'mixed' ? 11000 : 8500);
  var shiftMult = {'12h1':1, '12h2':1.9, '24h3':2.8}[d.shiftPattern] || 1;
  var monthly = Math.round((rate * shiftMult * d.officerCount) / 100) * 100;
  return monthly;
}
function guardingSummaryRows(d){
  var siteLabel = {residential:'Residential Estate', commercial:'Commercial / Office', industrial:'Industrial / Warehouse', event:'Event / Temporary'}[d.siteType];
  var armedLabel = {armed:'Armed', unarmed:'Unarmed', mixed:'Mixed team'}[d.armedLevel];
  var shiftLabel = {'12h1':'12hr, single shift','12h2':'12hr, two shifts (24hr)','24h3':'24/7 rotating roster'}[d.shiftPattern];
  return [
    ['Site type', siteLabel],
    ['Officer tier', armedLabel],
    ['Coverage', shiftLabel],
    ['Officers on contract', String(d.officerCount)]
  ];
}

/* ---------- ARMED RESPONSE BUILDER ----------
Steps: 0 property type, 1 once-off/recurring, 2 add-ons (K9/tactical), 3 contact -> result */
var RESPONSE_STEPS = 4;
function renderResponseBuilder(d){
  var step = d._step || 0;
  state.builder.stepIndex = step; state.builder.totalSteps = RESPONSE_STEPS;

  if(step === 0){
    var opts = [
      {v:'house', l:'Private House', s:'Single residential property'},
      {v:'estate', l:'Estate / Complex', s:'Body corporate or HOA-level cover'},
      {v:'business', l:'Business Premises', s:'Office, retail or small industrial'}
    ];
    var body = h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.propType===o.v, onClick:function(){ d.propType=o.v; rerender(); }});
    }));
    return builderShell('STEP 1 OF '+RESPONSE_STEPS, 'What are we covering?', 'Response vehicle allocation differs between a single home and a full estate.', body, [
      nextBtn('Continue', function(){ d._step=1; rerender(); }, !d.propType)
    ]);
  }
  if(step === 1){
    var opts = [
      {v:'recurring', l:'Recurring / Monthly Cover', s:'Ongoing 24/7 armed response contract'},
      {v:'once', l:'Once-off Callout Cover', s:'Single event or short-term coverage'}
    ];
    var body = h('div', {class:'choice-grid cols-2'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.billing===o.v, onClick:function(){ d.billing=o.v; rerender(); }});
    }));
    return builderShell('STEP 2 OF '+RESPONSE_STEPS, 'Once-off or recurring?', '', body, [
      backBtn(function(){ d._step=0; rerender(); }),
      nextBtn('Continue', function(){ d._step=2; rerender(); }, !d.billing)
    ]);
  }
  if(step === 2){
    d.addons = d.addons || [];
    var opts = [
      {v:'k9', l:'K-9 Patrol Unit', s:'Trained dog unit on serious activations'},
      {v:'tactical', l:'Tactical Response Unit', s:'Specialist team for high-risk incidents'},
      {v:'monitoring', l:'Off-Site Monitoring', s:'24/7 control room camera oversight'}
    ];
    var body = h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
      var sel = d.addons.indexOf(o.v) > -1;
      return choiceCard({label:o.l, sub:o.s, selected:sel, onClick:function(){
        var idx = d.addons.indexOf(o.v);
        if(idx>-1) d.addons.splice(idx,1); else d.addons.push(o.v);
        rerender();
      }});
    }));
    return builderShell('STEP 3 OF '+RESPONSE_STEPS, 'Any additional layers?', 'Optional — select as many as apply, or skip.', body, [
      backBtn(function(){ d._step=1; rerender(); }),
      nextBtn('See my estimate', function(){ d._step=3; rerender(); })
    ]);
  }
  if(step === 3){
    return renderContactAndResult(d, 'response', computeResponsePrice(d), responseSummaryRows(d));
  }
}
function computeResponsePrice(d){
  var base = {house:650, estate:1450, business:1100}[d.propType] || 650;
  if(d.billing === 'once') base = Math.round(base * 0.6);
  (d.addons||[]).forEach(function(a){
    base += {k9:450, tactical:900, monitoring:550}[a] || 0;
  });
  return base;
}
function responseSummaryRows(d){
  var propLabel = {house:'Private House', estate:'Estate / Complex', business:'Business Premises'}[d.propType];
  return [
    ['Property type', propLabel],
    ['Billing', d.billing === 'once' ? 'Once-off callout cover' : 'Recurring monthly cover'],
    ['Add-ons', (d.addons&&d.addons.length) ? d.addons.map(function(a){return {k9:'K-9',tactical:'Tactical',monitoring:'Monitoring'}[a];}).join(', ') : 'None']
  ];
}

/* ---------- CCTV BUILDER ----------
Steps: 0 home/business, 1 upload map or use estimate slider, 2 compute cameras, 3 brand choice, 4 contact -> result */
var CCTV_STEPS = 5;
function renderCctvBuilder(d){
  var step = d._step || 0;
  state.builder.stepIndex = step; state.builder.totalSteps = CCTV_STEPS;

  if(step === 0){
    var opts = [
      {v:'home', l:'Home / Residential', s:'House, estate or complex'},
      {v:'business', l:'Business', s:'Office, retail, industrial yard'}
    ];
    var body = h('div', {class:'choice-grid cols-2'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.propKind===o.v, onClick:function(){ d.propKind=o.v; rerender(); }});
    }));
    return builderShell('STEP 1 OF '+CCTV_STEPS, 'Home or business installation?', 'This sets the default coverage assumptions for the next step.', body, [
      nextBtn('Continue', function(){ d._step=1; rerender(); }, !d.propKind)
    ]);
  }

  if(step === 1){
    var body = h('div', {}, [
      h('div', {class:'upload-zone', onclick:function(){ document.getElementById('map-file-input').click(); }}, [
        d.mapImageData ?
          h('img', {class:'upload-preview', src:d.mapImageData}) :
          h('div', {html: ICONS.upload, style:'color:var(--blue-400);width:32px;height:32px;margin:0 auto;'}),
        h('p', {}, [d.mapImageData ? 'Map uploaded — tap to replace' : 'Tap to upload a site map, plan, or satellite screenshot'])
      ]),
      h('input', {type:'file', id:'map-file-input', accept:'image/*', style:'display:none;', onchange:function(e){
        var file = e.target.files[0];
        if(!file) return;
        var reader = new FileReader();
        reader.onload = function(ev){ d.mapImageData = ev.target.result; d.perimeterM = d.perimeterM || 80; rerender(); };
        reader.readAsDataURL(file);
      }}),
      h('p', {style:'text-align:center;color:var(--silver-300);font-size:12.5px;margin:14px 0;'}, ['— or skip the upload and estimate by perimeter length —']),
      h('div', {}, [
        h('label', {style:'display:block;font-size:13px;color:var(--silver-300);margin-bottom:8px;font-weight:600;'}, ['Approx. perimeter / boundary length: ' + (d.perimeterM||80) + ' m']),
        h('input', {type:'range', min:'20', max:'400', step:'10', value:String(d.perimeterM||80), style:'width:100%;', oninput:function(e){ d.perimeterM = parseInt(e.target.value,10); rerender(); }}),
        h('div', {class:'field-row cols-2', style:'margin-top:16px;'}, [
          h('div', {}, [
            h('label', {}, ['Entry / exit points']),
            h('input', {type:'number', min:'1', max:'12', value:String(d.entryPoints||2), oninput:function(e){ d.entryPoints = parseInt(e.target.value,10)||1; rerender(); }})
          ]),
          h('div', {}, [
            h('label', {}, ['Number of buildings']),
            h('input', {type:'number', min:'1', max:'20', value:String(d.buildings||1), oninput:function(e){ d.buildings = parseInt(e.target.value,10)||1; rerender(); }})
          ])
        ])
      ])
    ]);
    return builderShell('STEP 2 OF '+CCTV_STEPS, 'Map your site', 'Upload a plan or satellite image, or just tell us the rough size — we\'ll compute camera angles and count either way.', body, [
      backBtn(function(){ d._step=0; rerender(); }),
      nextBtn('Compute coverage', function(){ d._step=2; rerender(); })
    ]);
  }

  if(step === 2){
    var calc = computeCctvCoverage(d);
    d._cameraCount = calc.count;
    var body = h('div', {}, [
      h('div', {class:'map-svg-wrap'}, [ buildCoverageSvg(d, calc) ]),
      h('div', {class:'summary-box'}, [
        h('div', {class:'summary-row'}, [h('span',{},['Perimeter / boundary']), h('span',{},[(d.perimeterM||80)+' m'])]),
        h('div', {class:'summary-row'}, [h('span',{},['Entry / exit points']), h('span',{},[String(d.entryPoints||2)])]),
        h('div', {class:'summary-row'}, [h('span',{},['Buildings']), h('span',{},[String(d.buildings||1)])]),
        h('div', {class:'summary-row'}, [h('span',{},['Computed camera positions']), h('span',{},[String(calc.count)])]),
        h('div', {class:'summary-row'}, [h('span',{},['Avg. field-of-view overlap']), h('span',{},[calc.overlap+'%'])])
      ]),
      h('p', {style:'color:var(--silver-300);font-size:12.5px;margin-top:12px;'}, ['Camera count is computed from perimeter length (one camera per ~25m of boundary), entry points (dedicated camera each) and buildings (2 per building for entrance + rear coverage).'])
    ]);
    return builderShell('STEP 3 OF '+CCTV_STEPS, 'Computed coverage plan', 'Here\'s the camera layout our engineers would start from.', body, [
      backBtn(function(){ d._step=1; rerender(); }),
      nextBtn('Choose camera brand', function(){ d._step=3; rerender(); })
    ]);
  }

  if(step === 3){
    var opts = [
      {v:'hikvision', l:'Hikvision', s:'Best value, wide compatibility'},
      {v:'dahua', l:'Dahua', s:'Strong low-light performance'},
      {v:'axis', l:'Axis (Premium)', s:'Enterprise-grade, higher spec'}
    ];
    var body = h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.brand===o.v, onClick:function(){ d.brand=o.v; rerender(); }});
    }));
    return builderShell('STEP 4 OF '+CCTV_STEPS, 'Choose your camera brand', 'This sets per-camera hardware cost in your estimate.', body, [
      backBtn(function(){ d._step=2; rerender(); }),
      nextBtn('See final price', function(){ d._step=4; rerender(); }, !d.brand)
    ]);
  }

  if(step === 4){
    return renderContactAndResult(d, 'cctv', computeCctvPrice(d), cctvSummaryRows(d));
  }
}

function computeCctvCoverage(d){
  var perimeter = d.perimeterM || 80;
  var entry = d.entryPoints || 2;
  var buildings = d.buildings || 1;
  var perimeterCams = Math.max(2, Math.ceil(perimeter / 25));
  var count = perimeterCams + entry + (buildings * 2);
  var overlap = Math.min(35, 12 + Math.round(perimeterCams * 1.4));
  return {count: count, perimeterCams: perimeterCams, overlap: overlap};
}

function buildCoverageSvg(d, calc){
  // simple radial layout representing camera coverage cones around a boundary
  var n = Math.min(calc.count, 16);
  var cx = 150, cy = 100, rx = 120, ry = 70;
  var svgns = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgns, 'svg');
  svg.setAttribute('viewBox', '0 0 300 200');
  var bg = document.createElementNS(svgns, 'rect');
  bg.setAttribute('x','0'); bg.setAttribute('y','0'); bg.setAttribute('width','300'); bg.setAttribute('height','200');
  bg.setAttribute('fill','none');
  svg.appendChild(bg);
  var boundary = document.createElementNS(svgns,'ellipse');
  boundary.setAttribute('cx',cx); boundary.setAttribute('cy',cy); boundary.setAttribute('rx',rx); boundary.setAttribute('ry',ry);
  boundary.setAttribute('fill','none'); boundary.setAttribute('stroke','var(--line-strong)'); boundary.setAttribute('stroke-width','1.5'); boundary.setAttribute('stroke-dasharray','4 4');
  svg.appendChild(boundary);
  for(var i=0;i<n;i++){
    var ang = (i/n) * Math.PI * 2;
    var px = cx + rx*Math.cos(ang), py = cy + ry*Math.sin(ang);
    var cone = document.createElementNS(svgns,'path');
    var innerAng1 = ang - 0.35, innerAng2 = ang + 0.35;
    var ix1 = px - 26*Math.cos(innerAng1+Math.PI), iy1 = py - 26*Math.sin(innerAng1+Math.PI);
    var ix2 = px - 26*Math.cos(innerAng2+Math.PI), iy2 = py - 26*Math.sin(innerAng2+Math.PI);
    cone.setAttribute('d', 'M'+px+','+py+' L'+ix1+','+iy1+' L'+ix2+','+iy2+' Z');
    cone.setAttribute('fill','rgba(46,143,217,0.28)');
    svg.appendChild(cone);
    var dot = document.createElementNS(svgns,'circle');
    dot.setAttribute('cx',px); dot.setAttribute('cy',py); dot.setAttribute('r','4');
    dot.setAttribute('fill','var(--blue-400)');
    svg.appendChild(dot);
  }
  var center = document.createElementNS(svgns,'text');
  center.setAttribute('x',cx); center.setAttribute('y',cy); center.setAttribute('text-anchor','middle');
  center.setAttribute('fill','var(--silver-300)'); center.setAttribute('font-size','11'); center.setAttribute('font-family','Inter, sans-serif');
  center.textContent = 'Your site';
  svg.appendChild(center);
  return svg;
}

function computeCctvPrice(d){
  var perCam = {hikvision:2400, dahua:2600, axis:4200}[d.brand] || 2400;
  var count = d._cameraCount || computeCctvCoverage(d).count;
  var hardware = perCam * count;
  var install = count * 900;
  var nvr = 4500;
  return hardware + install + nvr;
}
function cctvSummaryRows(d){
  var brandLabel = {hikvision:'Hikvision', dahua:'Dahua', axis:'Axis (Premium)'}[d.brand];
  return [
    ['Site', d.propKind === 'home' ? 'Home / Residential' : 'Business'],
    ['Camera positions', String(d._cameraCount || computeCctvCoverage(d).count)],
    ['Camera brand', brandLabel],
    ['Includes', 'NVR unit, cabling & professional install']
  ];
}

/* ---------- VIP / HIGH-RISK BUILDER ----------
Steps: 0 once-off/recurring, 1 num officers by risk factor, 2 escort type, 3 contact -> result */
var VIP_STEPS = 4;
function renderVipBuilder(d){
  var step = d._step || 0;
  state.builder.stepIndex = step; state.builder.totalSteps = VIP_STEPS;

  if(step === 0){
    var opts = [
      {v:'once', l:'Once-off Event', s:'Single engagement or travel period'},
      {v:'recurring', l:'Recurring Protection', s:'Ongoing monthly close-protection detail'}
    ];
    var body = h('div', {class:'choice-grid cols-2'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.term===o.v, onClick:function(){ d.term=o.v; rerender(); }});
    }));
    return builderShell('STEP 1 OF '+VIP_STEPS, 'Once-off or recurring protection?', '', body, [
      nextBtn('Continue', function(){ d._step=1; rerender(); }, !d.term)
    ]);
  }
  if(step === 1){
    var opts = [
      {v:'low', l:'Standard Risk', s:'Low public profile, no known threats'},
      {v:'elevated', l:'Elevated Risk', s:'Public profile, occasional exposure'},
      {v:'high', l:'High Risk', s:'Known threats or high-value target'}
    ];
    var body = h('div', {}, [
      h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
        return choiceCard({label:o.l, sub:o.s, selected:d.riskFactor===o.v, onClick:function(){ d.riskFactor=o.v; d.officerCount = suggestVipOfficers(o.v); rerender(); }});
      })),
      d.riskFactor ? h('div', {style:'margin-top:22px;'}, [
        h('label', {style:'display:block;font-size:13px;color:var(--silver-300);margin-bottom:8px;font-weight:600;'}, ['Recommended protection officers']),
        h('div', {class:'stepper-row'}, [
          h('button', {onclick:function(){ if(d.officerCount>1){d.officerCount--; rerender();} }}, ['–']),
          h('span', {class:'val'}, [String(d.officerCount)]),
          h('button', {onclick:function(){ d.officerCount++; rerender(); }}, ['+'])
        ])
      ]) : null
    ]);
    return builderShell('STEP 2 OF '+VIP_STEPS, 'What\'s the risk factor?', 'This sets the recommended detail size — a low-risk once-off outing needs far fewer officers than a high-risk ongoing detail.', body, [
      backBtn(function(){ d._step=0; rerender(); }),
      nextBtn('Continue', function(){ d._step=2; rerender(); }, !d.riskFactor)
    ]);
  }
  if(step === 2){
    var opts = [
      {v:'foot', l:'Foot Escort Only', s:'Close protection officers on foot'},
      {v:'vehicle', l:'Vehicle Escort', s:'Armed escort vehicle + officers'},
      {v:'full', l:'Full Convoy Detail', s:'Lead + principal + follow vehicle'}
    ];
    var body = h('div', {class:'choice-grid cols-3'}, opts.map(function(o){
      return choiceCard({label:o.l, sub:o.s, selected:d.escortType===o.v, onClick:function(){ d.escortType=o.v; rerender(); }});
    }));
    return builderShell('STEP 3 OF '+VIP_STEPS, 'What type of escort?', '', body, [
      backBtn(function(){ d._step=1; rerender(); }),
      nextBtn('See my estimate', function(){ d._step=3; rerender(); }, !d.escortType)
    ]);
  }
  if(step === 3){
    return renderContactAndResult(d, 'vip', computeVipPrice(d), vipSummaryRows(d));
  }
}
function suggestVipOfficers(risk){ return {low:1, elevated:2, high:4}[risk] || 1; }
function computeVipPrice(d){
  var perOfficer = {low:3200, elevated:4500, high:6800}[d.riskFactor] || 3200;
  var escortMult = {foot:1, vehicle:1.6, full:2.4}[d.escortType] || 1;
  var base = perOfficer * (d.officerCount||1) * escortMult;
  if(d.term === 'once') return Math.round(base);
  return Math.round(base * 22); // approx monthly from daily-equivalent
}
function vipSummaryRows(d){
  return [
    ['Term', d.term === 'once' ? 'Once-off event' : 'Recurring monthly'],
    ['Risk factor', {low:'Standard', elevated:'Elevated', high:'High'}[d.riskFactor]],
    ['Protection officers', String(d.officerCount||1)],
    ['Escort type', {foot:'Foot escort only', vehicle:'Vehicle escort', full:'Full convoy detail'}[d.escortType]]
  ];
}

/* ---------- shared contact + result step ---------- */
var STANDARD_RATE_LABELS = {
  guarding:'a typical uncoordinated agency', response:'a typical single-service alarm company',
  cctv:'a typical hardware-only installer', vip:'a typical ad-hoc protection broker'
};
function renderContactAndResult(d, type, price, rows){
  if(!d._submitted){
    var body = h('div', {}, [
      h('div', {class:'field'}, [h('label',{},['Full name']), h('input', {type:'text', value:d.name||'', oninput:function(e){d.name=e.target.value;}})]),
      h('div', {class:'field-row cols-2'}, [
        h('div', {class:'field'}, [h('label',{},['Phone number']), h('input', {type:'tel', value:d.phone||'', oninput:function(e){d.phone=e.target.value;}})]),
        h('div', {class:'field'}, [h('label',{},['Email']), h('input', {type:'email', value:d.email||'', oninput:function(e){d.email=e.target.value;}})])
      ]),
      h('div', {class:'field'}, [h('label',{},['Location / suburb']), h('input', {type:'text', value:d.location||'', oninput:function(e){d.location=e.target.value;}})])
    ]);
    return builderShell('STEP '+(state.builder.totalSteps)+' OF '+state.builder.totalSteps, 'Almost done — where should we send it?', 'We\'ll confirm your estimate and follow up to schedule a free site risk assessment.', body, [
      backBtn(function(){ d._step = d._step - 1; rerender(); }),
      nextBtn('Get my estimate', function(){
        if(!d.name || !d.phone){ showToast('Please add your name and phone number.'); return; }
        d._submitted = true;
        var lead = saveLead(type, {answers:d, estimate:price, name:d.name, phone:d.phone, email:d.email, location:d.location});
        d._leadId = lead.id;
        rerender();
      })
    ]);
  }

  // result view
  var standardMult = 1.35;
  var standardPrice = Math.round(price * standardMult);
  var savings = standardPrice - price;
  var isMonthly = (type !== 'cctv') && !(type==='vip' && d.term==='once') && !(type==='response' && d.billing==='once');
  var priceLabel = 'R ' + price.toLocaleString('en-ZA');

  var body = h('div', {}, [
    h('div', {class:'result-hero'}, [
      h('div', {class:'num'}, [priceLabel, h('small',{},[isMonthly ? 'estimated / month, excl. VAT' : 'estimated once-off, excl. VAT'])])
    ]),
    h('div', {class:'savings-strip'}, [
      h('span', {html: ICONS.shield, style:'width:26px;height:26px;color:var(--amber-500);flex-shrink:0;'}),
      h('div', {}, [
        h('b', {}, ['You save ~R ' + savings.toLocaleString('en-ZA')]),
        h('p', {}, ['vs. ' + (STANDARD_RATE_LABELS[type]||'a typical provider') + ' quoting the same scope separately.'])
      ])
    ]),
    h('div', {class:'summary-box'}, rows.map(function(r){
      return h('div', {class:'summary-row'}, [h('span',{},[r[0]]), h('span',{},[r[1]])]);
    })),
    h('p', {style:'color:var(--silver-300);font-size:12.5px;margin-top:14px;'}, ['This is an indicative estimate generated from your answers. Final pricing is confirmed after a free on-site or remote risk assessment — no obligation.']),
    h('div', {style:'display:flex;gap:10px;margin-top:22px;flex-wrap:wrap;'}, [
      h('a', {class:'btn btn-primary', href:'https://wa.me/27720495530'}, ['Call us now']),
      h('button', {class:'btn btn-ghost', onclick:function(){ go('home'); }}, ['Back to home'])
    ])
  ]);

  return h('div', {class:'section', style:'border-bottom:none;padding-bottom:80px;'}, [
    h('div', {class:'wrap'}, [
      h('div', {class:'builder-shell'}, [
        h('div', {class:'eyebrow-line', style:'justify-content:flex-start;'}, [h('span',{class:'dot'}), 'QUOTE REQUEST RECEIVED']),
        h('h2', {class:'builder-step-title'}, ['Here\'s your estimate, ' + (d.name ? d.name.split(' ')[0] : '') + '.']),
        body
      ])
    ])
  ]);
}

var toastTimer = null;
function showToast(msg){
  var existing = document.querySelector('.toast');
  if(existing) existing.remove();
  var t = h('div', {class:'toast'}, [msg]);
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.remove(); }, 2600);
}

/* ---------- builder dispatcher ---------- */
function renderBuilderPage(){
  var b = state.builder;
  if(!b){ go('quote'); return document.createDocumentFragment(); }
  b.data = b.data || {};
  var d = b.data;
  d._step = d._step !== undefined ? d._step : (b.step || 0);

  var content;
  if(b.type === 'guarding') content = renderGuardingBuilder(d);
  else if(b.type === 'response') content = renderResponseBuilder(d);
  else if(b.type === 'cctv') content = renderCctvBuilder(d);
  else if(b.type === 'vip') content = renderVipBuilder(d);
  else content = renderQuoteLanding();
  return content;
}

function rerender(){ render(); }

/* ---------- main render ---------- */
function render(){
  var app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(renderNav());

  var main = h('div', {class:'page'});
  if(state.route === 'home'){ main.appendChild(renderHome()); }
  else if(state.route === 'service'){ main.appendChild(renderServiceDetail(state.serviceId)); }
  else if(state.route === 'quote'){
    if(state.builder){ main.appendChild(renderBuilderPage()); }
    else { main.appendChild(renderQuoteLanding()); }
  }
  else if(state.route === 'builder'){ main.appendChild(renderBuilderPage()); }
  else { main.appendChild(renderHome()); }
  app.appendChild(main);

  if(state.route === 'home'){ app.appendChild(renderFooter()); }
  else { app.appendChild(renderFooter()); }

  if(state.route === 'home'){ app.appendChild(renderStickyCta()); }
}

/* ---------- boot ---------- */
render();

})();
