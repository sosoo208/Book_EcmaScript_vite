import { stringUtils } from '../utils/helpers'

const { isEmpty, safeTrim } = stringUtils

export const patterns = {
    isbn: /^[0-9]{10,13}$/,
    price: /^\d+$/,
    publishDate: /^\d{4}-\d{2}-\d{2}$/
}

export const messages = {
    required: {
        title: '제목을 입력해주세요.',
        author: '저자를 입력해주세요.',
        isbn: 'ISBN을 입력해주세요.',
        price: '가격을 입력해주세요.',
        publishDate: '출판일을 입력해주세요.'
    },
    format: {
        isbn: 'ISBN은 10자리 또는 13자리 숫자로 입력해주세요.',
        price: '가격은 숫자로 입력해주세요.',
        publishDate: '출판일은 YYYY-MM-DD 형식으로 입력해주세요.'
    }
}

const validators = {
    title: (title) => {
        if (isEmpty(title)) {
            return { isValid: false, message: messages.required.title, field: 'title' }
        }
        if (safeTrim(title).length < 1) {
            return { isValid: false, message: '제목은 최소 1글자 이상이어야 합니다.', field: 'title' }
        }
        return { isValid: true }
    },
    author: (author) => {
        if (isEmpty(author)) {
            return { isValid: false, message: messages.required.author, field: 'author' }
        }
        if (safeTrim(author).length < 2) {
            return { isValid: false, message: '저자는 최소 2글자 이상이어야 합니다.', field: 'author' }
        }
        return { isValid: true }
    },
    isbn: (isbn) => {
        if (isEmpty(isbn)) {
            return { isValid: false, message: messages.required.isbn, field: 'isbn' }
        }
        if (!patterns.isbn.test(safeTrim(isbn))) {
            return { isValid: false, message: messages.format.isbn, field: 'isbn' }
        }
        return { isValid: true }
    },
    price: (price) => {
        if (isEmpty(price)) {
            return { isValid: false, message: messages.required.price, field: 'price' }
        }
        if (!patterns.price.test(String(price))) {
            return { isValid: false, message: messages.format.price, field: 'price' }
        }
        if (Number(price) <= 0) {
            return { isValid: false, message: '가격은 0보다 커야 합니다.', field: 'price' }
        }
        return { isValid: true }
    },
    publishDate: (publishDate) => {
        if (isEmpty(publishDate)) {
            return { isValid: false, message: messages.required.publishDate, field: 'publishDate' }
        }
        if (!patterns.publishDate.test(safeTrim(publishDate))) {
            return { isValid: false, message: messages.format.publishDate, field: 'publishDate' }
        }
        return { isValid: true }
    },
    description: (description) => {
        if (!isEmpty(description) && safeTrim(description).length < 10) {
            return { isValid: false, message: '설명은 최소 10자 이상 입력해주세요.', field: 'description' }
        }
        return { isValid: true }
    },
    language: (language) => {
        if (!isEmpty(language) && safeTrim(language).length < 2) {
            return { isValid: false, message: '언어는 최소 2글자 이상 입력해주세요.', field: 'language' }
        }
        return { isValid: true }
    },
    pageCount: (pageCount) => {
        if (pageCount != null && Number(pageCount) <= 0) {
            return { isValid: false, message: '페이지 수는 0보다 커야 합니다.', field: 'pageCount' }
        }
        return { isValid: true }
    },
    publisher: (publisher) => {
        if (!isEmpty(publisher) && safeTrim(publisher).length < 2) {
            return { isValid: false, message: '출판사는 최소 2글자 이상 입력해주세요.', field: 'publisher' }
        }
        return { isValid: true }
    },
    coverImageUrl: (coverImageUrl) => {
        if (!isEmpty(coverImageUrl) && !/^https?:\/\/.+/.test(safeTrim(coverImageUrl))) {
            return { isValid: false, message: '올바른 이미지 URL을 입력해주세요.', field: 'coverImageUrl' }
        }
        return { isValid: true }
    },
    edition: (edition) => {
        if (!isEmpty(edition) && safeTrim(edition).length < 1) {
            return { isValid: false, message: '판차는 최소 1글자 이상이어야 합니다.', field: 'edition' }
        }
        return { isValid: true }
    }
}

export const validateBook = (book) => {
    if (!book) {
        return { isValid: false, message: '도서 데이터가 필요합니다.' }
    }
    const { title, author, isbn, price, publishDate, detailRequest } = book
    const titleResult = validators.title(title)
    if (!titleResult.isValid) return titleResult
    const authorResult = validators.author(author)
    if (!authorResult.isValid) return authorResult
    const isbnResult = validators.isbn(isbn)
    if (!isbnResult.isValid) return isbnResult
    const priceResult = validators.price(price)
    if (!priceResult.isValid) return priceResult
    const publishDateResult = validators.publishDate(publishDate)
    if (!publishDateResult.isValid) return publishDateResult

    if (detailRequest) {
        const { description, language, pageCount, publisher, coverImageUrl, edition } = detailRequest
        const descriptionResult = validators.description(description)
        if (!descriptionResult.isValid) return descriptionResult
        const languageResult = validators.language(language)
        if (!languageResult.isValid) return languageResult
        const pageCountResult = validators.pageCount(pageCount)
        if (!pageCountResult.isValid) return pageCountResult
        const publisherResult = validators.publisher(publisher)
        if (!publisherResult.isValid) return publisherResult
        const coverImageResult = validators.coverImageUrl(coverImageUrl)
        if (!coverImageResult.isValid) return coverImageResult
        const editionResult = validators.edition(edition)
        if (!editionResult.isValid) return editionResult
    }
    return { isValid: true }
}

export const validateField = (fieldName, value) => {
    const validator = validators[fieldName]
    if (!validator) {
        return { isValid: true, message: '알 수 없는 필드입니다.' }
    }
    return validator(value)
}
