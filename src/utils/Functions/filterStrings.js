const filterStrings = (newIds = [], currentIds = []) => {
  const uniqueIds = [...new Set([...currentIds, ...newIds])]

  return uniqueIds
}

module.exports = filterStrings
