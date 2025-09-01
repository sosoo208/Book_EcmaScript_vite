const messageStyles = {
    success: {
        color: '#28a745',
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb'
    },
    error: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb'
    }
}

let messageTimer = null

export const uiService = {
    showSuccess: (message) => {
        uiService.showMessage(message, 'success')
    },

    showError: (message) => {
        uiService.showMessage(message, 'error')
    },

    showMessage: (message, type = 'error') => {
        const errorSpan = document.getElementById('formError')
        if (!errorSpan) return

        uiService.clearMessageTimer()

        const { color, backgroundColor, borderColor } = messageStyles[type] || messageStyles.error

        errorSpan.textContent = message
        errorSpan.style.display = 'block'
        errorSpan.style.color = color
        errorSpan.style.backgroundColor = backgroundColor
        errorSpan.style.borderColor = borderColor

        const duration = type === 'success' ? 3000 : 5000
        messageTimer = setTimeout(() => {
            uiService.hideMessage()
        }, duration)
    },

    hideMessage: () => {
        const errorSpan = document.getElementById('formError')
        if (!errorSpan) return

        errorSpan.style.display = 'none'
        errorSpan.style.backgroundColor = ''
        errorSpan.style.borderColor = ''
        uiService.clearMessageTimer()
    },

    clearMessageTimer: () => {
        if (messageTimer) {
            clearTimeout(messageTimer)
            messageTimer = null
        }
    },

    setButtonLoading: (button, isLoading = false, text = '') => {
        if (!button) return

        button.disabled = isLoading
        if (text) {
            button.textContent = text
        }

        if (isLoading) {
            button.style.opacity = '0.7'
            button.style.cursor = 'not-allowed'
        } else {
            button.style.opacity = '1'
            button.style.cursor = 'pointer'
        }
    }
}
