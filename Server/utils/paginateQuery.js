const paginateQuery = async (Model, filterQuery, page = 1, limit = 20, populateFields = '', sortOptions = { createdAt: -1 }) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const totalCount = await Model.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalCount / limitNum);

  let query = Model.find(filterQuery).sort(sortOptions).skip(skip).limit(limitNum);

  if (populateFields) {
    query = query.populate(populateFields);
  }

  const items = await query.lean();

  return {
    data: {
      items,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    }
  };
};

module.exports = paginateQuery;
