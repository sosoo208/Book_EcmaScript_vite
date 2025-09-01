export const formatDate = (dateString, locale = 'ko-KR') => {
    if (!dateString) return '-'
    
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return dateString
        }
        return date.toLocaleDateString(locale)
    } catch (error) {
        console.error('날짜 포맷팅 오류:', error)
        return dateString
    }
}

export const stringUtils = {
    safeTrim: (str) => {
        if (!str) return ''
        return str.toString().trim()
    },
    
    isEmpty: (str) => {
        if (!str) return true
        return str.toString().trim().length === 0
    },
    
    truncate: (str, maxLength = 50) => {
        if (!str || str.length <= maxLength) return str || ''
        return str.substring(0, maxLength) + '...'
    },
    
    capitalize: (str) => {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    },
    
    extractNumbers: (str) => {
        if (!str) return ''
        return str.replace(/[^0-9]/g, '')
    }
}

export const arrayUtils = {
    isEmpty: (arr) => {
        return !Array.isArray(arr) || arr.length === 0
    },
    
    unique: (arr) => {
        if (!Array.isArray(arr)) return []
        return [...new Set(arr)]
    },
    
    sortBy: (arr, key, ascending = true) => {
        if (!Array.isArray(arr)) return []
        
        return [...arr].sort((a, b) => {
            const aValue = a[key]
            const bValue = b[key]
            
            if (aValue === bValue) return 0
            
            const comparison = aValue > bValue ? 1 : -1
            return ascending ? comparison : -comparison
        })
    }
}

export const domUtils = {
    exists: (selector) => {
        return Boolean(document.querySelector(selector))
    },
    
    selectAll: (selector) => {
        return Array.from(document.querySelectorAll(selector))
    },
    
    toggleClass: (element, className) => {
        if (!element) return false
        return element.classList.toggle(className)
    },
    
    scrollToTop: (smooth = true) => {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        })
    }
}

export const storageUtils = {
    set: (key, value) => {
        try {
            const data = JSON.stringify(value)
            localStorage.setItem(key, data)
            return true
        } catch (error) {
            console.error('로컬 스토리지 저장 오류:', error)
            return false
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key)
            if (item === null) return defaultValue
            return JSON.parse(item)
        } catch (error) {
            console.error('로컬 스토리지 읽기 오류:', error)
            return defaultValue
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            console.error('로컬 스토리지 삭제 오류:', error)
            return false
        }
    },
    
    clear: () => {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            console.error('로컬 스토리지 초기화 오료:', error)
            return false
        }
    }
}

export const generateId = (prefix = 'id') => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `${prefix}_${timestamp}_${random}`
}

export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime())
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item))
    }
    
    const cloned = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key])
        }
    }
    return cloned
}
