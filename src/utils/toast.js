let toastEl = null

export function showToast(message, type = 'success') {
  if (toastEl) {
    toastEl.remove()
  }

  toastEl = document.createElement('div')
  toastEl.className = `toast ${type}`
  toastEl.textContent = message
  document.body.appendChild(toastEl)

  setTimeout(() => {
    if (toastEl) {
      toastEl.style.opacity = '0'
      toastEl.style.transform = 'translateX(-50%) translateY(20px)'
      toastEl.style.transition = 'all 0.3s ease'
      setTimeout(() => {
        if (toastEl) {
          toastEl.remove()
          toastEl = null
        }
      }, 300)
    }
  }, 3000)
}