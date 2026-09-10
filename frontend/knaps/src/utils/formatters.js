/**
 * Indian Numbering System Formatting Utilities
 */

/**
 * Formats a number to Indian Numbering format (e.g. 1,00,000 or 23,345)
 * @param {number|string} val 
 * @param {object} options 
 * @returns {string}
 */
export function formatIndianNumber(val, { decimals = 0, currency = false, prefix = '', suffix = '' } = {}) {
  if (val == null || val === '' || val === 'N/A' || val === '-') return 'N/A'
  
  const str = String(val).trim()
  if (typeof val === 'string' && isNaN(Number(str.replace(/[₹,crCR%\s]/g, '')))) {
    return val
  }

  const num = typeof val === 'number' ? val : parseFloat(str.replace(/[₹,crCR%\s]/g, ''))
  if (isNaN(num)) return String(val)

  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })

  const curPrefix = currency ? '₹' : ''
  return `${curPrefix}${prefix}${formatted}${suffix}`
}

/**
 * Formats a currency value with ₹ symbol and Indian commas (e.g. ₹10,00,000)
 */
export function formatIndianCurrency(val, decimals = 0) {
  return formatIndianNumber(val, { decimals, currency: true })
}

/**
 * Formats AUM value with Indian numbering system and Cr suffix (e.g. ₹23,345 Cr)
 */
export function formatAum(val) {
  if (val == null || val === '' || val === 'N/A' || val === '-') return 'N/A'
  if (typeof val === 'number') {
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`
  }
  const str = String(val).trim()
  const clean = str.replace(/[₹,crCR\s]/g, '')
  const num = parseFloat(clean)
  if (!isNaN(num) && num > 0) {
    return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`
  }
  return str
}

/**
 * Formats NAV value with Indian numbering system and ₹ symbol (e.g. ₹11.2776)
 */
export function formatNav(val) {
  if (val == null || val === '' || val === 'N/A' || val === '-') return 'N/A'
  if (typeof val === 'number') {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
  }
  const str = String(val).trim()
  const clean = str.replace(/[₹Rs\.\s]/g, '')
  const num = parseFloat(clean)
  if (!isNaN(num) && num > 0) {
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
  }
  if (str.startsWith('Rs ') || str.startsWith('Rs.')) {
    return str.replace(/^Rs\.?\s*/, '₹')
  }
  if (!str.startsWith('₹')) {
    return `₹${str}`
  }
  return str
}
