module.exports = {
  ifCond: (categoryOptionId, selectedCategoryId, options) => {
    if (categoryOptionId === selectedCategoryId) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}