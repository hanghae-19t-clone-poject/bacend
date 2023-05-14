// errorHandler = async (err, req, res, next) => {
//   const { status_code, message, failed_api } = err;
//   console.error(err);
//   if (status_code) {
//     res.status(status_code).json({ error_message: message });
//   } else {
//     res.status(400).json({ error_message: `${failed_api} 에 실패했습니다` });
//   }
// };
