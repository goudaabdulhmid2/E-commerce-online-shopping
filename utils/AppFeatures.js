class ApiFeatures {
  // (query Object , query come from express)
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject); // { duration: { gte: '5' } }
    queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`); // { duration: { $gte: '5' } }

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

  limitFileds() {
    // Field limiting 127.0.0.1:8000/api/v1/categorise?fields=name,duration,difficulty,price
    if (this.query.fields) {
      const fields = this.query.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // pagination. allowing user to only select a certain page of our results
    // ?page=2&limit=10  => page=2$limit=10, 1-10 page 1 , 11-20 page 2, 21-30 page 3  => ((page-1)*limit).

    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
