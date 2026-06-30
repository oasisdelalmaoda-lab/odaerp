// Generador del documento de Propuesta Comercial de Oasis del Alma.
// buildPropuestaDoc(p, mode, logos) -> string HTML completo.
//  mode: 'print' (una página por slide, auto-imprime) | 'preview' (apilado y escalado)
//  logos: { brown, white }  (data URIs)

const DEF = {
  bienvenida: 'Bienvenidos a este sueño. Pensado, planeado e inspirado en y para ti. Para que te explores, te conozcas y así puedas encontrar tu Oasis donde siempre ha estado; en tu Alma.',
  quienes: 'En Oasis del Alma creamos aromaterapia natural hecha en Colombia: aceites esenciales 100% puros, roll-ons, brumas y kits diseñados alrededor de cómo quieres sentirte. Acompañamos a marcas, empresas y espacios de bienestar con productos que se personalizan con tu identidad.',
  beneficios: [
    'Aceites esenciales 100% puros',
    'Ingredientes naturales · Cruelty free',
    'Hecho en Colombia con amor',
    'Personalización con la identidad de tu marca',
    'Acompañamiento y asesoría en cada pedido',
    'Empaque cuidado y entregas a tiempo'
  ]
};

const C = { cream:'#F7F2E9', ivory:'#FBF8F2', ink:'#3A3326', brown:'#5A4A33', gold:'#A78659', goldbg:'#A0805A', border:'#E4DBCC', muted:'#8A8073' };

const LINEAS = [['Calma','#5C8A8A'],['Respira','#6E8E5E'],['Despierta','#C9A24B'],['Descansa','#5E7A92'],['Alivio','#9C5A4A'],['Pasión','#B06A7E']];

const WA_PATH = 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-.96.24-3.23-.67-2.73-1.08-4.45-3.88-4.58-4.06-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.95-2.25.24-.27.53-.34.71-.34.18 0 .35 0 .51.01.16.01.39-.06.6.46.24.58.81 2 .88 2.15.07.15.12.32.02.5-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.27.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.26.34-.21.58-.13.24.09 1.51.71 1.77.84.26.13.43.2.49.31.06.11.06.62-.18 1.3Z';

function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function nl2br(s){ return esc(s).replace(/\n/g,'<br>'); }
function bg(url){ return 'background-image:url("' + url + '");background-size:cover;background-position:center;'; }

function slide(bgColor, inner){
  return '<section class="slide" style="background:' + bgColor + ';">' + inner + '</section>';
}
function eyebrow(t, col){
  return '<div style="font-family:Mulish,sans-serif;font-size:13px;letter-spacing:0.28em;text-transform:uppercase;color:' + (col||C.gold) + ';margin-bottom:18px;">' + esc(t) + '</div>';
}

export function buildPropuestaDoc(p, mode, logos){
  p = p || {};
  logos = logos || {};
  const cliente = esc(p.cliente || 'tu marca');
  const slides = [];

  // 1 — Portada
  const portadaImg = p.portadaImg;
  if(portadaImg){
    slides.push(slide(C.cream,
      '<div style="position:absolute;inset:0;display:flex;">'
      + '<div style="width:55%;height:100%;padding:64px 56px;display:flex;flex-direction:column;">'
        + '<img src="' + logos.brown + '" style="height:56px;width:auto;align-self:flex-start;">'
        + '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;">'
          + eyebrow('Propuesta comercial')
          + '<h1 style="font-family:\'Cormorant Garamond\',serif;font-size:60px;line-height:1.02;font-weight:600;color:' + C.brown + ';margin:0 0 26px;">Para ' + cliente + '</h1>'
          + '<p style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:24px;line-height:1.5;color:' + C.ink + ';max-width:460px;margin:0;">' + nl2br(p.bienvenida || DEF.bienvenida) + '</p>'
        + '</div>'
        + '<div style="font-family:Mulish,sans-serif;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:' + C.gold + ';">Bienestar en cada respiro</div>'
      + '</div>'
      + '<div style="width:45%;height:100%;' + bg(portadaImg) + '"></div>'
      + '</div>'));
  } else {
    slides.push(slide(C.cream,
      '<div style="position:absolute;inset:0;padding:64px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">'
      + '<img src="' + logos.brown + '" style="height:74px;width:auto;margin-bottom:42px;">'
      + eyebrow('Propuesta comercial')
      + '<h1 style="font-family:\'Cormorant Garamond\',serif;font-size:66px;line-height:1.02;font-weight:600;color:' + C.brown + ';margin:0 0 28px;">Para ' + cliente + '</h1>'
      + '<p style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:26px;line-height:1.5;color:' + C.ink + ';max-width:700px;margin:0;">' + nl2br(p.bienvenida || DEF.bienvenida) + '</p>'
      + '<div style="font-family:Mulish,sans-serif;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:' + C.gold + ';margin-top:42px;">Bienestar en cada respiro</div>'
      + '</div>'));
  }

  // 2 — Quiénes somos
  const dots = LINEAS.map(function(l){
    return '<span style="display:inline-flex;align-items:center;gap:8px;font-family:Mulish,sans-serif;font-size:14px;color:' + C.brown + ';margin-right:22px;"><span style="width:11px;height:11px;border-radius:50%;background:' + l[1] + ';"></span>' + l[0] + '</span>';
  }).join('');
  const qImg = p.quienesImg;
  slides.push(slide(C.ivory,
    '<div style="position:absolute;inset:0;display:flex;">'
    + (qImg ? '<div style="width:44%;height:100%;' + bg(qImg) + '"></div>' : '')
    + '<div style="flex:1;height:100%;padding:72px 64px;display:flex;flex-direction:column;justify-content:center;">'
      + eyebrow('Quiénes somos')
      + '<h2 style="font-family:\'Cormorant Garamond\',serif;font-size:46px;font-weight:600;color:' + C.brown + ';margin:0 0 22px;line-height:1.05;">Bienestar en cada respiro</h2>'
      + '<p style="font-family:Mulish,sans-serif;font-size:17px;line-height:1.7;color:' + C.ink + ';max-width:580px;margin:0 0 36px;">' + nl2br(p.quienesSomos || DEF.quienes) + '</p>'
      + '<div style="display:flex;flex-wrap:wrap;row-gap:12px;align-items:center;">' + dots + '</div>'
    + '</div>'
    + '</div>'));

  // 3 — Kits / propuestas armadas (hasta 3 por slide)
  const kits = (p.kits || []).filter(function(k){ return k && (k.nombre || k.desc || k.img); });
  for(let g=0; g<kits.length; g+=3){
    const grp = kits.slice(g, g+3);
    const cards = grp.map(function(k){
      return '<div style="flex:1;background:#fff;border:1px solid ' + C.border + ';border-radius:16px;overflow:hidden;display:flex;flex-direction:column;">'
        + (k.img
            ? '<div style="height:236px;' + bg(k.img) + '"></div>'
            : '<div style="height:236px;background:' + C.cream + ';display:flex;align-items:center;justify-content:center;color:' + C.muted + ';font-family:Mulish,sans-serif;font-size:13px;">Imagen</div>')
        + '<div style="padding:24px 26px;display:flex;flex-direction:column;flex:1;">'
          + '<h3 style="font-family:\'Cormorant Garamond\',serif;font-size:27px;font-weight:600;color:' + C.brown + ';margin:0 0 8px;">' + esc(k.nombre || 'Kit') + '</h3>'
          + (k.desc ? '<p style="font-family:Mulish,sans-serif;font-size:13.5px;line-height:1.6;color:' + C.ink + ';margin:0 0 12px;">' + nl2br(k.desc) + '</p>' : '')
          + (k.incluye ? '<div style="font-family:Mulish,sans-serif;font-size:12.5px;line-height:1.55;color:' + C.muted + ';margin:0 0 14px;"><strong style="color:' + C.brown + ';">Incluye:</strong> ' + nl2br(k.incluye) + '</div>' : '')
          + '<div style="flex:1;"></div>'
          + (k.precio ? '<div style="font-family:\'Cormorant Garamond\',serif;font-size:25px;font-weight:700;color:' + C.gold + ';">' + esc(k.precio) + '</div>' : '')
        + '</div>'
      + '</div>';
    }).join('');
    slides.push(slide(C.cream,
      '<div style="position:absolute;inset:0;padding:60px 60px 56px;display:flex;flex-direction:column;">'
      + eyebrow('Propuestas armadas')
      + '<h2 style="font-family:\'Cormorant Garamond\',serif;font-size:42px;font-weight:600;color:' + C.brown + ';margin:0 0 32px;">Pensado para ' + cliente + '</h2>'
      + '<div style="flex:1;display:flex;gap:24px;align-items:stretch;">' + cards + '</div>'
      + '</div>'));
  }

  // 4 — Beneficios
  const bens = (p.beneficios || DEF.beneficios).filter(function(b){ return String(b||'').trim(); });
  const check = '<span style="flex-shrink:0;width:27px;height:27px;border-radius:50%;background:' + C.gold + ';display:inline-flex;align-items:center;justify-content:center;margin-right:15px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>';
  const benList = bens.map(function(b){
    return '<li style="display:flex;align-items:flex-start;font-family:Mulish,sans-serif;font-size:17px;line-height:1.4;color:' + C.ink + ';margin:0 0 18px;">' + check + '<span style="padding-top:3px;">' + esc(b) + '</span></li>';
  }).join('');
  const bImg = p.beneficiosImg;
  slides.push(slide(C.ivory,
    '<div style="position:absolute;inset:0;display:flex;">'
    + '<div style="flex:1;height:100%;padding:72px 60px;display:flex;flex-direction:column;justify-content:center;">'
      + eyebrow('Por qué Oasis del Alma')
      + '<h2 style="font-family:\'Cormorant Garamond\',serif;font-size:43px;font-weight:600;color:' + C.brown + ';margin:0 0 32px;line-height:1.06;">Más que un regalo,<br>una experiencia de bienestar</h2>'
      + '<ul style="list-style:none;padding:0;margin:0;">' + benList + '</ul>'
    + '</div>'
    + (bImg ? '<div style="width:42%;height:100%;' + bg(bImg) + '"></div>' : '')
    + '</div>'));

  // 5 — Inversión
  const inv = (p.inversion || []).filter(function(r){ return r && (r.concepto || r.valor); });
  if(inv.length){
    const rows = inv.map(function(r){
      return '<tr><td style="padding:15px 18px;border-bottom:1px solid ' + C.border + ';font-family:Mulish,sans-serif;font-size:15px;color:' + C.ink + ';">' + esc(r.concepto) + (r.detalle ? '<div style="font-size:12.5px;color:' + C.muted + ';margin-top:3px;">' + esc(r.detalle) + '</div>' : '') + '</td><td style="padding:15px 18px;border-bottom:1px solid ' + C.border + ';text-align:right;font-family:Mulish,sans-serif;font-size:15px;font-weight:700;color:' + C.brown + ';white-space:nowrap;">' + esc(r.valor) + '</td></tr>';
    }).join('');
    slides.push(slide('#ffffff',
      '<div style="position:absolute;inset:0;padding:66px 84px;display:flex;flex-direction:column;justify-content:center;">'
      + eyebrow('Inversión')
      + '<h2 style="font-family:\'Cormorant Garamond\',serif;font-size:44px;font-weight:600;color:' + C.brown + ';margin:0 0 28px;">Tu propuesta de inversión</h2>'
      + '<table style="width:100%;max-width:840px;border-collapse:collapse;"><tbody>' + rows + '</tbody></table>'
      + (p.inversionTotal ? '<div style="max-width:840px;display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid ' + C.gold + ';margin-top:4px;padding-top:16px;"><span style="font-family:Mulish,sans-serif;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:' + C.muted + ';">Total</span><span style="font-family:\'Cormorant Garamond\',serif;font-size:34px;font-weight:700;color:' + C.brown + ';">' + esc(p.inversionTotal) + '</span></div>' : '')
      + (p.inversionNota ? '<p style="font-family:Mulish,sans-serif;font-size:13px;color:' + C.muted + ';margin-top:24px;max-width:840px;line-height:1.6;">' + nl2br(p.inversionNota) + '</p>' : '')
      + '</div>'));
  }

  // 6 — Contacto / cierre
  const ct = p.contacto || {};
  slides.push(slide(C.goldbg,
    '<div style="position:absolute;inset:0;padding:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">'
    + (p.cierreMsg ? '<p style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:27px;line-height:1.5;color:#FBF8F2;max-width:760px;margin:0 0 44px;">' + nl2br(p.cierreMsg) + '</p>' : '')
    + '<img src="' + logos.white + '" style="height:100px;width:auto;margin-bottom:40px;">'
    + '<div style="display:flex;align-items:center;gap:13px;font-family:Mulish,sans-serif;font-size:22px;color:#FBF8F2;margin-bottom:18px;"><svg width="26" height="26" viewBox="0 0 24 24" fill="#FBF8F2"><path d="' + WA_PATH + '"/></svg>' + esc(ct.whatsapp || '(313) 406 3259') + '</div>'
    + '<div style="font-family:Mulish,sans-serif;font-size:15px;letter-spacing:0.04em;color:rgba(251,248,242,0.85);">' + esc(ct.instagram || '@oasisdelalma') + '&nbsp;&nbsp;·&nbsp;&nbsp;' + esc(ct.facebook || '/oasisdelalma') + '&nbsp;&nbsp;·&nbsp;&nbsp;' + esc(ct.web || 'oasisdelalma.co') + '</div>'
    + '<div style="width:380px;height:1px;background:rgba(251,248,242,0.4);margin-top:38px;"></div>'
    + '</div>'));

  // Ensamblar documento
  const isPrint = mode === 'print';
  const fontLink = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Mulish:wght@400;600;700&display=swap" rel="stylesheet">';
  let css = '*{box-sizing:border-box;} body{margin:0;} .slide{width:1280px;height:720px;position:relative;overflow:hidden;}';
  if(isPrint){
    css += ' body{background:#fff;} @page{size:1280px 720px;margin:0;} .slide{page-break-after:always;} .slide:last-child{page-break-after:auto;}';
  } else {
    css += ' body{background:#9a9a9a;display:flex;flex-direction:column;align-items:center;gap:16px;padding:16px;} .slide{zoom:0.4;box-shadow:0 6px 22px rgba(0,0,0,0.28);border-radius:3px;}';
  }
  const body = slides.map(function(s){ return s; }).join('');
  const auto = isPrint ? ('<scr' + 'ipt>window.onload=function(){setTimeout(function(){try{window.print();}catch(e){}},500);};<\/scr' + 'ipt>') : '';
  return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Propuesta ' + cliente + '</title>' + fontLink + '<style>' + css + '</style></head><body>' + body + auto + '</body></html>';
}

export const PROPUESTA_DEFAULT_TEXT = DEF;
