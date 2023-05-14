module.exports = async (req, res, next) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1; //현재 페이지
  const pageSize = parseInt(limit) || 4; //한페이지에서 보여줄 갯수

  req.pagination = {
    offset: (pageNumber - 1) * pageSize,
    limit: pageSize,
  };
  next();
};
