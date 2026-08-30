import { useState, useCallback, useRef } from 'react'

export function useCamera() {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(false)
  const streamRef = useRef(null)

  const startCamera = useCallback(async () => {
    setError(null)
    // Always release any previous stream before requesting a new one (also
    // protects against React StrictMode double-invoke leaving a stale stream).
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
    setStarting(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      streamRef.current = mediaStream
      setStream(mediaStream)
    } catch (err) {
      setError(err.message)
    } finally {
      setStarting(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  const capturePhoto = useCallback((videoEl, canvasEl) => {
    if (!videoEl || !canvasEl || !stream) return Promise.resolve(null)
    if (!videoEl.videoWidth || !videoEl.videoHeight) return Promise.resolve(null)

    const size = Math.min(videoEl.videoWidth, videoEl.videoHeight)
    canvasEl.width = size
    canvasEl.height = size

    const ctx = canvasEl.getContext('2d')
    const x = (videoEl.videoWidth - size) / 2
    const y = (videoEl.videoHeight - size) / 2
    ctx.drawImage(videoEl, x, y, size, size, 0, 0, size, size)

    return Promise.resolve(canvasEl.toDataURL('image/jpeg', 0.9))
  }, [stream])

  return { stream, startCamera, stopCamera, capturePhoto, error, starting }
}