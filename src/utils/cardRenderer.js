const OUT_W = 1350
const OUT_H = 2400

const F = 3.31 // design px (408-wide card) -> 1350 export scale

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
  }
}

const SIDE = 76 // card side padding (23px design * 3.31)

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

export async function renderCardToBlob(cardEl) {
  if (!cardEl) return null
  if (document.fonts?.ready) await document.fonts.ready
  await new Promise(r => setTimeout(r, 150))

  Promise.all(
    Array.from(cardEl.querySelectorAll('img')).map(img =>
      img.decode ? img.decode().catch(() => {}) : Promise.resolve()
    )
  ).catch(() => {})

  const themeKey = Array.from(cardEl.classList).find(c => THEMES[c]) || 'futuristic-final'
  const theme = THEMES[themeKey]
  const styleHex = getComputedStyle(cardEl).getPropertyValue('--krct-accent').trim()
  const accent = /^#[0-9a-fA-F]{6}$/.test(styleHex) ? styleHex : theme.accent

  const text = (sel) => (cardEl.querySelector(sel)?.textContent || '').trim()
  const lite = cardEl.querySelector('.krct-brand')?.classList.contains('krct-brand-lite')

  const canvas = document.createElement('canvas')
  canvas.width = OUT_W
  canvas.height = OUT_H
  const ctx = canvas.getContext('2d')

  const family = getComputedStyle(cardEl.querySelector('.krct-name') || cardEl).fontFamily

  paintBackground(ctx, theme.bgType)
  paintDecorations(ctx, theme.bgType, accent)

  const cx = OUT_W / 2
  const divW = OUT_W - SIDE * 2

  // ---- Header logo chip ----
  const chipY = 46
  const chipH = 232
  ctx.save()
  roundedRect(ctx, SIDE, chipY, divW, chipH, 46)
  if (lite) {
    const g = ctx.createLinearGradient(SIDE, chipY, SIDE, chipY + chipH)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(1, '#dfe7f3')
    ctx.fillStyle = g
  } else {
    const g = ctx.createLinearGradient(SIDE, chipY, SIDE + divW, chipY + chipH)
    g.addColorStop(0, theme.chip[0])
    g.addColorStop(1, theme.chip[1])
    ctx.fillStyle = g
  }
  ctx.fill()
  ctx.restore()
  try {
    const img = await loadImg(cardEl.querySelector('.krct-brand').src)
    const pad = Math.round(divW * 0.04)
    const destW = divW - pad * 2
    const destH = chipH - pad * 2
    const ir = Math.min(destW / img.width, destH / img.height)
    const dw = img.width * ir
    const dh = img.height * ir
    ctx.drawImage(img, cx - dw / 2, chipY + (chipH - dh) / 2, dw, dh)
  } catch (e) {
    console.warn('Logo draw failed', e)
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(SIDE, 330)
  ctx.lineTo(OUT_W - SIDE, 330)
  ctx.stroke()

  // ---- Photo ----
  const photoR = 210
  const photoCy = 700
  try {
    const img = await loadImg(cardEl.querySelector('.krct-photo-img').src)
    const side = photoR * 2
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, photoCy, photoR, 0, Math.PI * 2)
    ctx.clip()
    const s = Math.max(side / img.width, side / img.height)
    const dw = img.width * s
    const dh = img.height * s
    ctx.drawImage(img, cx - dw / 2, photoCy - dh / 2, dw, dh)
    ctx.restore()
  } catch (e) {
    console.warn('Photo draw failed', e)
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.beginPath()
    ctx.arc(cx, photoCy, photoR, 0, Math.PI * 2)
    ctx.fill()
  }

  const draw = (textStr, size, color, weight, y, letterSpacing, maxW) => {
    if (!textStr) return
    ctx.save()
    ctx.font = `${weight} ${size}px ${family}`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (typeof ctx.letterSpacing === 'string') ctx.letterSpacing = letterSpacing || '0px'
    let t = textStr
    if (maxW) {
      while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1)
      if (t !== textStr) t += '…'
    }
    ctx.fillText(t, cx, y)
    ctx.restore()
  }

  // ---- Identity ----
  draw(text('.krct-eyebrow') || 'WELCOME, FRESHER', 42, accent, 500, 990, '5.9px')
  draw(text('.krct-name'), 84, '#ffffff', 600, 1090, '0px', divW * 0.98)
  draw(text('.krct-dept').toUpperCase(), 46, '#8b95a6', 500, 1182, '2.5px')

  // ---- Quote ----
  ctx.font = `600 74px ${family}`
  ctx.fillStyle = accent
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('❞', cx, 1295)
  const qStart = text('.krct-quote-text') || 'Make today count, tomorrow will thank you.'
  ctx.save()
  ctx.font = `italic 500 52px ${family}`
  const qLines = wrapText(ctx, qStart, divW * 0.94)
  const lines = qLines.slice(0, 3)
  if (qLines.length > 3) lines[2] = lines[2].slice(0, -1) + '…'
  const lh = Math.round(52 * 1.55)
  const blockTop = 1400 + ((3 - lines.length) * lh) / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  lines.forEach((line, i) => ctx.fillText(line, cx, blockTop + i * lh))
  ctx.restore()

  // ---- Footer ----
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(SIDE, 2040)
  ctx.lineTo(OUT_W - SIDE, 2040)
  ctx.stroke()
  draw(text('.krct-hashtag') || 'FRESHERS DAY 2026', 42, 'rgba(255,255,255,0.7)', 600, 2110, '3.4px')

  const id = text('.krct-card-id')
  ctx.save()
  ctx.font = `600 30px ${family}`
  const pillW = Math.round(ctx.measureText(id).width) + 96
  const pillH = 88
  const pillY = 2194
  roundedRect(ctx, cx - pillW / 2, pillY, pillW, pillH, pillH / 2)
  ctx.fillStyle = rgba(accent, 0.14)
  ctx.fill()
  ctx.strokeStyle = rgba(accent, 0.35)
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.restore()
  draw(id, 30, accent, 600, pillY + pillH / 2, '1.2px')

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export failed'))
    }, 'image/png')
  })
}