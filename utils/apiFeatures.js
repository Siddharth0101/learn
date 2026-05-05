class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryobj = { ...this.queryString }
    const excludedQuery = ['page', 'limit', 'sort', 'fields']
    excludedQuery.forEach((ele) => delete queryobj[ele])

    let queryStr = JSON.stringify(queryobj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr));
    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(" ")
      this.query = this.query.sort(sortBy)
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(" ")
      this.query = this.query.select(field)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  pagination() {
    if (this.queryString.page && this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 5;
      const skip = (page - 1) * limit
      this.query = this.query.skip(skip).limit(limit)
    }
    return this
  }
}

module.exports = APIFeatures