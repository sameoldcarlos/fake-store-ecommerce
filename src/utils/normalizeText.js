function normalizeText(text) {
  const desired = text.replace(/[^\w\s]/gi, '').replaceAll(' ', '')

  return desired
}

export default normalizeText