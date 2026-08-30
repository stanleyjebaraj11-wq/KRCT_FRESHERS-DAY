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

  // Lay out a real copy at export size so we can read every element's geometry.
  const clone = cardEl.cloneNode(true)
  clone.removeAttribute('id')
  clone.style.cssText =
    'width:1350px;height:auto;margin:0;position:static;touch-action:auto;'

  const holder = document.createElement('div')
  holder.style.cssText =
    'position:fixed;left:-20000px;top:0;width:1350px;z-index:-9999;pointer-events:none;'
  holder.appendChild(clone)
  document.body.appendChild(holder)

  try {
    await new Promise(r => setTimeout(r, 120))
    await Promise.all(
      Array.from(clone.querySelectorAll('img')).map(img =>
        img.decode ? img.decode().catch(() => {}) : Promise.resolve()
      )
    )

    const base = holder.getBoundingClientRect()
    const scale = OUT_W / (clone.getBoundingClientRect().width || OUT_W)

    const qrect = (sel) => {
      const el = clone.querySelector(sel)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        x: (r.left - base.left) * scale,
        y: (r.top - base.top) * scale,
        w: r.width * scale,
        h: r.height * scale
      }
    }

    const themeKey = Array.from(cardEl.classList).find(c => THEMES[c]) || 'futuristic-final'
    const theme = THEMES[themeKey]
    const accentHex = theme.accent
    const styleHex = getComputedStyle(cardEl).getPropertyValue('--krct-accent').trim()
    const accent = /^#[0-9a-fA-F]{6}$/.test(styleHex) ? styleHex : accentHex

    const canvas = document.createElement('canvas')
    canvas.width = OUT_W
    canvas.height = OUT_H
    const ctx = canvas.getContext('2d')

    paintBackground(ctx, theme.bgType)
    paintDecorations(ctx, theme.bgType, accent)

    // ---- Header logo chip ----
    const brandRect = qrect('.krct-brand')
    if (brandRect) {
      const lite = clone.querySelector('.krct-brand')?.classList.contains('krct-brand-lite')
      ctx.save()
      roundedRect(ctx, brandRect.x, brandRect.y, brandRect.w, brandRect.h, 40)
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
      const logoImg = clone.querySelector('.krct-brand')
      if (logoImg) {
        try {
          const img = await loadImg(logoImg.src)
          const pad = Math.round(brandRect.w * 0.04)
          const destW = brandRect.w - pad * 2
          const destH = brandRect.h - pad * 2
          const ir = Math.min(destW / img.width, destH / img.height)
          const dw = img.width * ir
          const dh = img.height * ir
          ctx.drawImage(img, brandRect.x + (brandRect.w - dw) / 2, brandRect.y + (brandRect.h - dh) / 2, dw, dh)
        } catch (e) {
          console.warn('Logo draw failed', e)
        }
      }
    }

    // ---- Photo (circle) ----
    const photoRect = qrect('.krct-photo')
    const photoImg = clone.querySelector('.krct-photo-img')
    if (photoRect && photoImg) {
      try {
        const img = await loadImg(photoImg.src)
        const cx = photoRect.x + photoRect.w / 2
        const cy = photoRect.y + photoRect.h / 2
        const r = Math.min(photoRect.w, photoRect.h) / 2
        const side = r * 2
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.clip()
        const s = Math.max(side / img.width, side / img.height)
        const dw = img.width * s
        const dh = img.height * s
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
        ctx.restore()
      } catch (e) {
        console.warn('Photo draw failed', e)
      }
    }

    // ---- Text block ----
    const drawCenter = (rect, text, font, color, letterSpacing, maxW) => {
      if (!rect || !text) return
      ctx.save()
      ctx.font = font
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if (typeof ctx.letterSpacing === 'string') ctx.letterSpacing = letterSpacing || '0px'
      if (maxW) {
        let t = text
        while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1)
        if (t !== text) text = t + '…'
      }
      ctx.fillText(text, rect.x + rect.w / 2, rect.y + rect.h / 2)
      ctx.restore()
    }

    const family = getComputedStyle(clone.querySelector('.krct-name') || cardEl).fontFamily

    const eyebrow = qrect('.krct-eyebrow')
    drawCenter(eyebrow, clone.querySelector('.krct-eyebrow')?.textContent, `500 ${Math.round(eyebrow.h * 0.85)}px ${family}`, accent, '1px')

    const nameRect = qrect('.krct-name')
    drawCenter(nameRect, clone.querySelector('.krct-name')?.textContent, `600 ${Math.round(nameRect.h * 0.85)}px ${family}`, '#ffffff', '0px', nameRect.w * 0.98)

    const deptRect = qrect('.krct-dept')
    drawCenter(deptRect, (clone.querySelector('.krct-dept')?.textContent || '').toUpperCase(), `500 ${Math.round(deptRect.h * 0.75)}px ${family}`, '#8b95a6', '1px')

    const quoteRect = qrect('.krct-quote-text')
    if (quoteRect) {
      const iconRect = qrect('.krct-quote-icon')
      if (iconRect) {
        ctx.save()
        ctx.font = `${Math.round(iconRect.h * 0.9)}px ${family}`
        ctx.fillStyle = accent
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('❞', iconRect.x + iconRect.w / 2, iconRect.y + iconRect.h / 2)
        ctx.restore()
      }
      const q = clone.querySelector('.krct-quote-text')?.textContent
      ctx.save()
      ctx.font = `italic 500 ${Math.round(quoteRect.h * 0.9)}px ${family}`
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const lines = wrapText(ctx, q, quoteRect.w)
      const lh = Math.round(quoteRect.h * 0.9 * 1.6)
      const startY = quoteRect.y + quoteRect.h / 2 - ((lines.length - 1) * lh) / 2
      lines.forEach((line, i) => {
        ctx.fillText(line, quoteRect.x + quoteRect.w / 2, startY + i * lh)
      })
      ctx.restore()
    }

    // ---- Footer ----
    const footerRect = qrect('.krct-footer-row')
    if (footerRect) {
      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(footerRect.x, footerRect.y)
      ctx.lineTo(footerRect.x + footerRect.w, footerRect.y)
      ctx.stroke()
      ctx.restore()

      const hashtagRect = qrect('.krct-hashtag')
      drawCenter(hashtagRect, clone.querySelector('.krct-hashtag')?.textContent, `600 ${Math.round(hashtagRect.h * 0.9)}px ${family}`, 'rgba(255,255,255,0.7)', '1px')

      const pillRect = qrect('.krct-card-id')
      if (pillRect) {
        ctx.save()
        roundedRect(ctx, pillRect.x, pillRect.y, pillRect.w, pillRect.h, pillRect.h / 2)
        ctx.fillStyle = rgba(accent, 0.14)
        ctx.fill()
        ctx.strokeStyle = rgba(accent, 0.35)
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
        drawCenter(pillRect, clone.querySelector('.krct-card-id')?.textContent, `600 ${Math.round(pillRect.h * 0.55)}px ${family}`, accent)
      }
    }

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas export failed'))
      }, 'image/png')
    })
  } finally {
    holder.remove()
  }
}