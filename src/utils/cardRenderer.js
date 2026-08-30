const OUT_W = 1350
const OUT_H = 2400

const THEMES = {
  'futuristic-final': {
    accent: '#67dcff',
    bgType: 'futuristic',
    chip: ['#06233f', '#0a3056']
  },
  'dreamer-final': {
    accent: '#ffd1e8',
    bgType: 'dreamer',
    chip: ['#241c58', '#402a6b']
  },
  'bold-final': {
    accent: '#f02222',
    bgType: 'bold',
    chip: ['#16060a', '#2b0d13']
  },
  'classic-final': {
    accent: '#ffc845',
    bgType: 'classic',
    chip: ['#0b2240', '#123a5e']
  },
  'royal-final': {
    accent: '#ffd76a',
    bgType: 'royal',
    chip: ['#241252', '#4b2380']
  },
  'spiderman-final': {
    accent: '#59d0ff',
    bgType: 'spiderman',
    chip: ['#6b1522', '#244a7d']
  },
  'batman-final': {
    accent: '#e2b13c',
    bgType: 'batman',
    chip: ['#1a1a1e', '#33333b']
  },
  'onepiece-final': {
    accent: '#f0c15a',
    bgType: 'onepiece',
    chip: ['#0a2c38', '#2f5f63']
  },
  'anime-final': {
    accent: '#ffd9ea',
    bgType: 'anime',
    chip: ['#6a2f92', '#9a4a7f']
  }
}

function hexRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  }
}

function rgba(hex, alpha) {
  const { r, g, b } = hexRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function paintBackground(ctx, type) {
  ctx.save()
  if (type === 'futuristic') {
    ctx.fillStyle = '#030b1a'
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const g = ctx.createRadialGradient(OUT_W / 2, OUT_H * 0.45, 0, OUT_W / 2, OUT_H * 0.45, 700)
    g.addColorStop(0, 'rgba(0,120,255,0.25)')
    g.addColorStop(1, 'rgba(0,120,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'dreamer') {
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#241c58')
    g.addColorStop(0.55, '#5d3577')
    g.addColorStop(1, '#b36b91')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const glow = ctx.createRadialGradient(OUT_W * 0.5, OUT_H * 0.15, 0, OUT_W * 0.5, OUT_H * 0.15, 700)
    glow.addColorStop(0, 'rgba(255,194,242,0.55)')
    glow.addColorStop(1, 'rgba(255,194,242,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'bold') {
    ctx.fillStyle = '#08090d'
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const g = ctx.createRadialGradient(OUT_W / 2, -120, 0, OUT_W / 2, -120, 1100)
    g.addColorStop(0, 'rgba(240,34,34,0.18)')
    g.addColorStop(1, 'rgba(240,34,34,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'sunset') {
    // removed
  } else if (type === 'spiderman') {
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#8b1e2d')
    g.addColorStop(0.45, '#b3263a')
    g.addColorStop(1, '#1d3a66')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const glow = ctx.createRadialGradient(OUT_W / 2, 0, 0, OUT_W / 2, 0, 700)
    glow.addColorStop(0, 'rgba(255,255,255,0.16)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'batman') {
    ctx.fillStyle = '#15151a'
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#0d0d10')
    g.addColorStop(1, '#27272d')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const glow = ctx.createRadialGradient(OUT_W / 2, OUT_H * 0.08, 0, OUT_W / 2, OUT_H * 0.08, 620)
    glow.addColorStop(0, 'rgba(226,177,60,0.14)')
    glow.addColorStop(1, 'rgba(226,177,60,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'onepiece') {
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#06202c')
    g.addColorStop(0.55, '#0e4b52')
    g.addColorStop(1, '#7a2a1c')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const glow = ctx.createRadialGradient(OUT_W * 0.88, OUT_H * 0.06, 0, OUT_W * 0.88, OUT_H * 0.06, 500)
    glow.addColorStop(0, 'rgba(240,193,90,0.22)')
    glow.addColorStop(1, 'rgba(240,193,90,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'anime') {
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#4a1a6b')
    g.addColorStop(0.55, '#c2558f')
    g.addColorStop(1, '#ff9db3')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const glow = ctx.createRadialGradient(OUT_W / 2, OUT_H * 0.1, 0, OUT_W / 2, OUT_H * 0.1, 650)
    glow.addColorStop(0, 'rgba(255,194,230,0.28)')
    glow.addColorStop(1, 'rgba(255,194,230,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else if (type === 'royal') {
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#140a30')
    g.addColorStop(0.5, '#2a1156')
    g.addColorStop(1, '#4d1f7d')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
    const glow = ctx.createRadialGradient(OUT_W / 2, OUT_H * 0.12, 0, OUT_W / 2, OUT_H * 0.12, 700)
    glow.addColorStop(0, 'rgba(255,215,106,0.16)')
    glow.addColorStop(1, 'rgba(255,215,106,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, OUT_H)
    g.addColorStop(0, '#07152c')
    g.addColorStop(1, '#0a1d3a')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, OUT_W, OUT_H)
  }
  ctx.restore()
}

function paintDecorations(ctx, type, accent) {
  ctx.save()
  if (type === 'futuristic') {
    ctx.strokeStyle = rgba(accent, 0.05)
    ctx.lineWidth = 2
    const step = 106
    for (let x = 0; x <= OUT_W; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, OUT_H)
      ctx.stroke()
    }
    for (let y = 0; y <= OUT_H; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(OUT_W, y)
      ctx.stroke()
    }
    ctx.strokeStyle = rgba(accent, 0.28)
    ctx.lineWidth = 3
    ctx.strokeRect(40, 40, OUT_W - 80, OUT_H - 80)
  } else if (type === 'dreamer') {
    const stars = [
      [180, 340, 4], [330, 180, 3], [820, 470, 4], [1150, 620, 3], [180, 1050, 3],
      [1180, 1380, 4], [230, 1650, 3], [870, 1820, 3]
    ]
    for (const [x, y, r] of stars) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(255,209,232,0.18)'
    ctx.lineWidth = 3
    ctx.strokeRect(46, 46, OUT_W - 92, OUT_H - 92)
  } else if (type === 'bold') {
    ctx.strokeStyle = 'rgba(240,34,34,0.07)'
    ctx.lineWidth = 6
    const gap = 88
    for (let x = -OUT_H; x < OUT_W; x += gap) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + OUT_H, OUT_H)
      ctx.stroke()
    }
  } else if (type === 'sunset') {
    // removed
  } else if (type === 'spiderman') {
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 2
    const step = 110
    for (let x = 0; x <= OUT_W; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, OUT_H)
      ctx.stroke()
    }
    for (let y = 0; y <= OUT_H; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(OUT_W, y)
      ctx.stroke()
    }
    ctx.strokeStyle = rgba(accent, 0.3)
    ctx.lineWidth = 3
    ctx.strokeRect(40, 40, OUT_W - 80, OUT_H - 80)
  } else if (type === 'batman') {
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 4
    const gap = 110
    for (let x = -OUT_H; x < OUT_W; x += gap) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + OUT_H, OUT_H)
      ctx.stroke()
    }
    ctx.strokeStyle = rgba(accent, 0.22)
    ctx.lineWidth = 3
    ctx.strokeRect(46, 46, OUT_W - 92, OUT_H - 92)
  } else if (type === 'onepiece') {
    ctx.strokeStyle = 'rgba(159,232,232,0.05)'
    ctx.lineWidth = 3
    const gap = 96
    for (let x = -OUT_H; x < OUT_W; x += gap) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + OUT_H, OUT_H)
      ctx.stroke()
    }
    const sparkle = [
      [200, 320, 3], [1120, 520, 3], [240, 1680, 3], [1180, 1450, 3], [660, 180, 3]
    ]
    for (const [x, y, r] of sparkle) {
      ctx.fillStyle = 'rgba(240,193,90,0.6)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (type === 'anime') {
    const sparkle = [
      [200, 330, 4], [330, 180, 3], [980, 450, 4], [1180, 620, 3], [180, 1650, 3]
    ]
    for (const [x, y, r] of sparkle) {
      ctx.fillStyle = 'rgba(255,241,246,0.75)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = rgba(accent, 0.25)
    ctx.lineWidth = 3
    ctx.strokeRect(46, 46, OUT_W - 92, OUT_H - 92)
  } else if (type === 'royal') {
    const sparkle = [
      [170, 300, 3], [1150, 560, 3], [200, 1750, 3], [1180, 1520, 3], [660, 240, 2]
    ]
    for (const [x, y, r] of sparkle) {
      ctx.fillStyle = 'rgba(255,215,106,0.65)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = rgba(accent, 0.35)
    ctx.lineWidth = 3
    ctx.strokeRect(44, 44, OUT_W - 88, OUT_H - 88)
  } else {
    ctx.strokeStyle = rgba(accent, 0.32)
    ctx.lineWidth = 3
    ctx.strokeRect(46, 46, OUT_W - 92, OUT_H - 92)
  }
  ctx.restore()
}

function roundedRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawWrapped(ctx, textStr, maxWidth, maxLines, size, color, weight, yCenter, family, letterSpacing) {
  if (!textStr) return
  let s = size
  let lines = wrapText(ctx, textStr, maxWidth)
  while (lines.length > maxLines && s > 18) {
    s -= 2
    ctx.font = `${weight} ${s}px ${family}`
    lines = wrapText(ctx, textStr, maxWidth)
  }
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
    lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…'
  }
  const lh = Math.round(s * 1.4)
  ctx.save()
  ctx.font = `${weight} ${s}px ${family}`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (typeof ctx.letterSpacing === 'string') ctx.letterSpacing = letterSpacing || '0px'
  const blockTop = yCenter - ((lines.length - 1) * lh) / 2
  lines.forEach((line, i) => {
    ctx.fillText(line, OUT_W / 2, blockTop + i * lh)
  })
  ctx.restore()
}

export async function renderCardToBlob(cardEl) {
  if (!cardEl) return null
  if (document.fonts?.ready) await document.fonts.ready
  // Wait for entrance animation + decode all card images.
  await new Promise(r => setTimeout(r, 150))
  await Promise.all(
    Array.from(cardEl.querySelectorAll('img')).map(img =>
      img.decode ? img.decode().catch(() => {}) : Promise.resolve()
    )
  ).catch(() => {})

  // Measure the LIVE card: identical positions/fonts to the screen, scaled up.
  const liveRect = cardEl.getBoundingClientRect()
  const designW = liveRect.width && liveRect.width > 50 ? liveRect.width : 408
  const S = OUT_W / designW

  const qrect = (sel) => {
    const el = cardEl.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: (r.left - liveRect.left) * S,
      y: (r.top - liveRect.top) * S,
      w: r.width * S,
      h: r.height * S
    }
  }

  const qfont = (sel, mult) => {
    const el = cardEl.querySelector(sel)
    if (!el) return 14
    const fs = parseFloat(getComputedStyle(el).fontSize)
    return Math.max(12, Math.round((fs || 14) * S * (mult || 1)))
  }

  const qls = (sel) => {
    const el = cardEl.querySelector(sel)
    if (!el) return '0px'
    const ls = parseFloat(getComputedStyle(el).letterSpacing)
    return `${Math.max(0, Math.round((ls || 0) * S))}px`
  }

  const text = (sel) => (cardEl.querySelector(sel)?.textContent || '').trim()

  const themeKey = Array.from(cardEl.classList).find(c => THEMES[c]) || 'futuristic-final'
  const theme = THEMES[themeKey]
  const styleHex = getComputedStyle(cardEl).getPropertyValue('--krct-accent').trim()
  const accent = /^#[0-9a-fA-F]{6}$/.test(styleHex) ? styleHex : theme.accent

  const canvas = document.createElement('canvas')
  canvas.width = OUT_W
  canvas.height = OUT_H
  const ctx = canvas.getContext('2d')

  const family = getComputedStyle(cardEl.querySelector('.krct-name') || cardEl).fontFamily
  const cx = OUT_W / 2

  paintBackground(ctx, theme.bgType)
  paintDecorations(ctx, theme.bgType, accent)

  // ---- Header divider ----
  const headerRect = qrect('.krct-header')
  if (headerRect) {
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = Math.max(1, headerRect.h * 0.01)
    ctx.beginPath()
    ctx.moveTo(headerRect.x, headerRect.y + headerRect.h)
    ctx.lineTo(headerRect.x + headerRect.w, headerRect.y + headerRect.h)
    ctx.stroke()
    ctx.restore()
  }

  // ---- Header logo chip ----
  const brandRect = qrect('.krct-brand')
  const brandEl = cardEl.querySelector('.krct-brand')
  if (brandRect && brandEl) {
    const lite = brandEl.classList.contains('krct-brand-lite')
    ctx.save()
    roundedRect(ctx, brandRect.x, brandRect.y, brandRect.w, brandRect.h, brandRect.h * 0.2)
    if (lite) {
      const g = ctx.createLinearGradient(brandRect.x, brandRect.y, brandRect.x, brandRect.y + brandRect.h)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(1, '#dfe7f3')
      ctx.fillStyle = g
    } else {
      const g = ctx.createLinearGradient(brandRect.x, brandRect.y, brandRect.x + brandRect.w, brandRect.y + brandRect.h)
      g.addColorStop(0, theme.chip[0])
      g.addColorStop(1, theme.chip[1])
      ctx.fillStyle = g
    }
    ctx.fill()
    ctx.restore()
    try {
      const img = await loadImg(brandEl.src)
      const padX = Math.max(1, brandRect.w * 0.03)
      const padY = Math.max(1, brandRect.h * 0.09)
      const destW = brandRect.w - padX * 2
      const destH = brandRect.h - padY * 2
      const ir = Math.min(destW / img.width, destH / img.height)
      const dw = img.width * ir
      const dh = img.height * ir
      ctx.drawImage(img, brandRect.x + (brandRect.w - dw) / 2, brandRect.y + (brandRect.h - dh) / 2, dw, dh)
    } catch (e) {
      console.warn('Logo draw failed', e)
    }
  }

  // ---- Photo ----
  const photoRect = qrect('.krct-photo')
  const photoImg = cardEl.querySelector('.krct-photo-img')
  if (photoRect && photoImg) {
    try {
      const img = await loadImg(photoImg.src)
      const cxp = photoRect.x + photoRect.w / 2
      const cyp = photoRect.y + photoRect.h / 2
      const r = Math.min(photoRect.w, photoRect.h) / 2
      const side = r * 2
      ctx.save()
      ctx.beginPath()
      ctx.arc(cxp, cyp, r, 0, Math.PI * 2)
      ctx.clip()
      const s = Math.max(side / img.width, side / img.height)
      const dw = img.width * s
      const dh = img.height * s
      ctx.drawImage(img, cxp - dw / 2, cyp - dh / 2, dw, dh)
      ctx.restore()
    } catch (e) {
      console.warn('Photo draw failed', e)
    }
  }

  // ---- Identity ----
  const eyebrowRect = qrect('.krct-eyebrow')
  if (eyebrowRect) {
    ctx.save()
    ctx.font = `${qfont('.krct-eyebrow')}px ${family}`
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = qls('.krct-eyebrow')
    ctx.fillText(text('.krct-eyebrow'), eyebrowRect.x + eyebrowRect.w / 2, eyebrowRect.y + eyebrowRect.h / 2)
    ctx.restore()
  }

  const nameRect = qrect('.krct-name')
  if (nameRect) {
    ctx.save()
    ctx.font = `600 ${qfont('.krct-name')}px ${family}`
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = qls('.krct-name')
    let t = text('.krct-name')
    const maxW = nameRect.w * 0.98
    while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1)
    if (t !== text('.krct-name')) t += '…'
    ctx.fillText(t, nameRect.x + nameRect.w / 2, nameRect.y + nameRect.h / 2)
    ctx.restore()
  }

  const deptRect = qrect('.krct-dept')
  if (deptRect) {
    ctx.font = `${qfont('.krct-dept')}px ${family}`
    drawWrapped(ctx, text('.krct-dept').toUpperCase(), deptRect.w, 2, qfont('.krct-dept'), '#8b95a6', 500, deptRect.y + deptRect.h / 2, family, qls('.krct-dept'))
  }

  // ---- Quote ----
  const quoteRect = qrect('.krct-quote')
  const quoteTextRect = qrect('.krct-quote-text')
  const iconRect = qrect('.krct-quote-icon')
  if (quoteRect && quoteTextRect) {
    if (iconRect) {
      ctx.save()
      ctx.font = `${qfont('.krct-quote-icon')}px ${family}`
      ctx.fillStyle = accent
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('❞', iconRect.x + iconRect.w / 2, iconRect.y + iconRect.h / 2)
      ctx.restore()
    }

    ctx.font = `italic 500 ${qfont('.krct-quote-text')}px ${family}`
    drawWrapped(ctx, text('.krct-quote-text'), quoteTextRect.w, 3, qfont('.krct-quote-text'), 'rgba(255,255,255,0.85)', 500, quoteTextRect.y + quoteTextRect.h / 2, family, '0px')
  }

  // ---- Footer ----
  const footerRect = qrect('.krct-footer-row')
  const hashtagRect = qrect('.krct-hashtag')
  let pillRect = qrect('.krct-card-id')

  // Safety clamp: the hashtag and ID pill must never overlap.
  if (hashtagRect && pillRect) {
    const minGap = Math.max(6, Math.round(8 * S * 0.6))
    const overlap = hashtagRect.y + hashtagRect.h - pillRect.y
    if (overlap > -minGap) {
      const pillH = pillRect.h
      pillRect = { ...pillRect, y: hashtagRect.y + hashtagRect.h + minGap }
    }
  }

  if (footerRect && hashtagRect) {
    // DOM border-top of the footer row = divider line.
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = Math.max(1, footerRect.h * 0.02)
    ctx.beginPath()
    ctx.moveTo(footerRect.x, footerRect.y)
    ctx.lineTo(footerRect.x + footerRect.w, footerRect.y)
    ctx.stroke()
    ctx.restore()
  }

  if (hashtagRect) {
    ctx.save()
    ctx.font = `${qfont('.krct-hashtag')}px ${family}`
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = qls('.krct-hashtag')
    ctx.fillText(text('.krct-hashtag'), hashtagRect.x + hashtagRect.w / 2, hashtagRect.y + hashtagRect.h / 2)
    ctx.restore()
  }

  const id = text('.krct-card-id')
  if (pillRect && id) {
    ctx.save()
    roundedRect(ctx, pillRect.x, pillRect.y, pillRect.w, pillRect.h, pillRect.h / 2)
    ctx.fillStyle = rgba(accent, 0.14)
    ctx.fill()
    ctx.strokeStyle = rgba(accent, 0.35)
    ctx.lineWidth = Math.max(1, pillRect.h * 0.03)
    ctx.stroke()
    ctx.restore()
    ctx.save()
    ctx.font = `600 ${qfont('.krct-card-id', 0.55)}px ${family}`
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = qls('.krct-card-id')
    ctx.fillText(id, pillRect.x + pillRect.w / 2, pillRect.y + pillRect.h / 2)
    ctx.restore()
  }

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export failed'))
    }, 'image/png')
  })
}