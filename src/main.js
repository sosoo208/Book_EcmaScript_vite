import './css/style.css'

import { apiServiceBook } from './modules/api.js'
import { validateBook } from './modules/validation.js'
import { uiService } from './modules/ui.js'
import { formatDate } from './utils/helpers.js'

let editingBookId = null
let elements = {}

document.addEventListener('DOMContentLoaded', async () => {
    findElements()
    setupEvents()
    await loadBooks()
})

const findElements = () => {
    elements = {
        form: document.getElementById('bookForm'),
        tableBody: document.getElementById('bookTableBody'),
        submitButton: document.querySelector('button[type="submit"]'),
        cancelButton: document.querySelector('.cancel-btn'),
        errorSpan: document.getElementById('formError')
    }
}

const setupEvents = () => {
    elements.form.addEventListener('submit', async (event) => {
        event.preventDefault()
        await handleFormSubmit()
    })
    
    elements.cancelButton.addEventListener('click', () => {
        resetForm()
    })
}

const handleFormSubmit = async () => {
    try {
        const bookData = getFormData()
        const validation = validateBook(bookData)
        if (!validation.isValid) {
            uiService.showError(validation.message)
            focusField(validation.field)
            return
        }

        if (editingBookId) {
            await updateBook(editingBookId, bookData)
        } else {
            await createBook(bookData)
        }
        
    } catch (error) {
        uiService.showError(error.message)
    }
}

const getFormData = () => {
    const formData = new FormData(elements.form)
    const title = formData.get('title') || ''
    const author = formData.get('author') || ''
    const isbn = formData.get('isbn') || ''
    const price = formData.get('price') || ''
    const publishDate = formData.get('publishDate') || null
    const publisher = formData.get('publisher') || ''

    return {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        price: parseInt(price, 10) || 0,
        publishDate,
        bookDetail: {
            publisher: publisher.trim()
        }
    }
}

const createBook = async (bookData) => {
    try {
        uiService.setButtonLoading(elements.submitButton, true, '등록 중...')
        await apiServiceBook.createBook(bookData)
        uiService.showSuccess('책이 성공적으로 등록되었습니다!')
        elements.form.reset()
        await loadBooks()
    } catch (error) {
        uiService.showError(error.message)
    } finally {
        uiService.setButtonLoading(elements.submitButton, false, '책 등록')
    }
}

const updateBook = async (bookId, bookData) => {
    try {
        uiService.setButtonLoading(elements.submitButton, true, '수정 중...')
        await apiServiceBook.updateBook(bookId, bookData)
        uiService.showSuccess('책이 성공적으로 수정되었습니다!')
        resetForm()
        await loadBooks()
    } catch (error) {
        uiService.showError(error.message)
    } finally {
        uiService.setButtonLoading(elements.submitButton, false, '책 등록')
    }
}

window.deleteBook = async (bookId, bookTitle) => {
    if (!confirm(`제목 = ${bookTitle} 책을 정말로 삭제하시겠습니까?`)) return
    try {
        await apiServiceBook.deleteBook(bookId)
        uiService.showSuccess('책이 성공적으로 삭제되었습니다!')
        await loadBooks()
    } catch (error) {
        uiService.showError(error.message)
    }
}

window.editBook = async (bookId) => {
    try {
        const book = await apiServiceBook.getBook(bookId)
        fillFormWithBookData(book)
        setEditMode(bookId)
    } catch (error) {
        uiService.showError(error.message)
    }
}

const fillFormWithBookData = (book) => {
    const { title = '', author = '', isbn = '', price = '', publishDate = '', bookDetail = {} } = book
    const { publisher = '' } = bookDetail

    elements.form.elements.title.value = title
    elements.form.elements.author.value = author
    elements.form.elements.isbn.value = isbn
    elements.form.elements.price.value = price
    elements.form.elements.publishDate.value = publishDate
    elements.form.elements.publisher.value = publisher
}

const setEditMode = (bookId) => {
    editingBookId = bookId
    elements.submitButton.textContent = '책 수정'
    elements.cancelButton.style.display = 'inline-block'
    elements.form.elements.title.focus()
}

const resetForm = () => {
    elements.form.reset()
    editingBookId = null
    elements.submitButton.textContent = '책 등록'
    elements.cancelButton.style.display = 'none'
    uiService.hideMessage()
    elements.form.elements.title.focus()
}

const loadBooks = async () => {
    try {
        const books = await apiServiceBook.getBooks()
        renderBookTable(books)
    } catch (error) {
        uiService.showError(error.message)
        renderErrorTable(error.message)
    }
}

const renderBookTable = (books) => {
    elements.tableBody.innerHTML = ''
    if (books.length === 0) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #666; padding: 20px;">
                    등록된 책이 없습니다.
                </td>
            </tr>
        `
        return
    }

    for (let i = 0; i < books.length; i++) {
        const row = createBookRow(books[i])
        elements.tableBody.appendChild(row)
    }
}

const createBookRow = (book) => {
    const { id, title = '', author = '', isbn = '', price = '', publishDate = '', bookDetail = {} } = book
    const { publisher = '' } = bookDetail

    const row = document.createElement('tr')
    row.innerHTML = `
        <td>${title}</td>
        <td>${author}</td>
        <td>${isbn}</td>
        <td>${price}</td>
        <td>${publisher}</td>
        <td>${publishDate ? formatDate(publishDate) : '-'}</td>
        <td class="action-buttons">
            <button class="edit-btn" onclick="editBook(${id})">수정</button>
            <button class="delete-btn" onclick="deleteBook(${id}, '${title}')">삭제</button>
        </td>
    `
    return row
}

const renderErrorTable = (errorMessage) => {
    elements.tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; color: #dc3545; padding: 20px;">
                오류: 데이터를 불러올 수 없습니다.<br>
                ${errorMessage}
            </td>
        </tr>
    `
}

const focusField = (fieldName) => {
    const field = elements.form.elements[fieldName]
    if (field) field.focus()
}
