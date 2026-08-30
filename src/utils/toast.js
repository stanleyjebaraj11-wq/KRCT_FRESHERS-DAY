let toastEl = null

export function showToast(message, type = 'success') {
  if (toastEl) {
    toastEl.remove()
  }

  const el = document.createElement('div')
  el.className = `toast ${type}`
  el.textContent = message
  document.body.appendChild(el)
  toastEl = el

  const hide = () => {
    if (toastEl !== el) return
    el.style.opacity = '0'
    el.style.transform = 'translateX(-50%) translateY(20px)'
    el.style.transition = 'all 0.3s ease'
    setTimeout(() => {
      if (toastEl === el) {
        el.remove()
        toastEl = null
      }
    }, 300)
  }

  setTimeout(hide, 3000)
}