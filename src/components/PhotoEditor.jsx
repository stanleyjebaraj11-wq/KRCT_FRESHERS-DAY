import { useEffect, useRef, useState } from 'react'

const VIEW_SIZE = 320
const OUT_SIZE = 600
const MIN_ZOOM = 1
const MAX_ZOOM = 5
const ZOOM_STEP = 1.12

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function PhotoEditor({ src, onConfirm, onRetake, onChooseAnother, onBack, busy }) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)

  const [loaded, setLoaded] = useState(false)
  const [imgW, setImgW] = useState(0)
  const [imgH, setImgH] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const getSize = () => (wrapRef.current ? wrapRef.current.clientWidth || VIEW_SIZE : VIEW_SIZE)

  useEffect(() => {
    setLoaded(false)
    setZoom(1)
    setImgW(0)
    setImgH(0)
    if (!src) return
    const img = new Image()
    img.onload = () => {
      const size = getSize()
      const bs = size / Math.min(img.width, img.height)
      setImgW(img.width)
      setImgH(img.height)
      setOffset({
        x: (size - img.width * bs) / 2,
        y: (size - img.height * bs) / 2
      })
      setLoaded(true)
    }
    img.src = src
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  const size = getSize()
  const baseScale = imgW && imgH ? size / Math.min(imgW, imgH) : 1
  const scale = baseScale * zoom

  const clampOffset = (o) => ({
    x: clamp(o.x, size - imgW * scale, 0),
    y: clamp(o.y, size - imgH * scale, 0)
  })

  const applyZoom = (factor, center = { x: size / 2, y: size / 2 }) => {
    const next = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM)
    const nz = next / zoom
    setZoom(next)
    setOffset((prev) => clampOffset({
      x: center.x - (center.x - prev.x) * nz,
      y: center.y - (center.y - prev.y) * nz
    }))
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      applyZoom(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, imgW, imgH, size])

  const onPointerDown = (e) => {
    if (!loaded || e.button !== 0) return
    dragRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }
    wrapRef.current.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    setOffset(clampOffset({
      x: d.ox + e.clientX - d.sx,
      y: d.oy + e.clientY - d.sy
    }))
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const handleConfirm = () => {
    if (!loaded || !imgRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = OUT_SIZE
    canvas.height = OUT_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const viewSize = size / scale
    ctx.drawImage(
      imgRef.current,
      -offset.x / scale,
      -offset.y / scale,
      viewSize,
      viewSize,
      0,
      0,
      OUT_SIZE,
      OUT_SIZE
    )
    onConfirm(canvas.toDataURL('image/jpeg', 0.9))
  }

  return (
    <div className="photo-editor">
      <h2 className="photo-editor-title">Adjust your photo</h2>
      <div
        ref={wrapRef}
        className="photo-editor-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none' }}
      >
        {loaded && (
          <img
            ref={imgRef}
            src={src}
            alt="Your photo"
            draggable={false}
            style={{
              width: imgW * baseScale,
              height: imgH * baseScale,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`
            }}
          />
        )}
        <div className="photo-editor-crop-ring" />
      </div>

      <div className="photo-editor-zoom">
        <button
          type="button"
          onClick={() => applyZoom(1 / ZOOM_STEP)}
          aria-label="Zoom out"
          disabled={zoom <= MIN_ZOOM || busy}
        >
          −
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => applyZoom(ZOOM_STEP)}
          aria-label="Zoom in"
          disabled={zoom >= MAX_ZOOM || busy}
        >
          +
        </button>
      </div>

      <div className="photo-editor-actions">
        <button type="button" className="btn btn-secondary" onClick={onRetake} disabled={busy}>
          Retake
        </button>
        <label className="btn btn-secondary" style={{ margin: 0, cursor: busy ? 'not-allowed' : 'pointer' }}>
          Choose Another
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              e.target.value = ''
              if (file) onChooseAnother(file)
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={busy || !loaded}
        >
          {busy ? 'Generating...' : 'Use Photo'}
        </button>
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={onBack}
        style={{ marginTop: 12 }}
        disabled={busy}
      >
        Back to Form
      </button>

      <p className="photo-editor-hint">Drag to reposition • scroll or + / − to zoom</p>
    </div>
  )
}