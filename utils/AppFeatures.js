class ApiFeatures {
  // (query Object , query come from express)
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['sort', 'page', 'limit', 'fields', 'keyword'];

    excludedFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject); // { duration: { gte: '5' } }
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`); // { duration: { $gte: '5' } }

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortedBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // Field limiting 127.0.0.1:8000/api/v1/categorise?fields=name,duration,difficulty,price
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(countDocuments) {
    // pagination. allowing user to only select a certain page of our results
    // ?page=2&limit=10  => page=2$limit=10, 1-10 page 1 , 11-20 page 2, 21-30 page 3  => ((page-1)*limit).

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }

    if (skip > 0) {
      pagination.prevPage = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.paginationResults = pagination;

    return this;
  }

  keyWordsSearch(modelName) {
    // keyword search 127.0.0.1:8000/api/v1/categorise?keyword=javascript
    if (this.queryString.keyword) {
      const query = {};
      // The $or operator is used to match documents where at least one of the specified conditions is true

      if (modelName === 'Product' || modelName === 'Review') {
        query.$or = [
          {
            title: { $regex: this.queryString.keyword, $options: 'i' },
          },
          {
            description: { $regex: this.queryString.keyword, $options: 'i' },
          },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      }
      this.query = this.query.find(query);
    }
    return this;
  }
}

module.exports = ApiFeatures;
