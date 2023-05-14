const Joi = require("joi");

module.exports = {
  update_info_schema: Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        "string.base": "입력형식이 일치하지 않습니다.",
        "string.empty": "이메일을 입력해주세요",
        "string.email": "이메일 형식으로 입력해수제요.",
        "any.required": "이메일을 입력해주세요",
      }),
    introduction: Joi.string().required().min(1).messages({
      "string.base": "입력형식이 일치하지 않습니다.",
      "string.empty": "소개를 입력해주세요.",
      "string.min": "좀 더 소개해주세요.",
      "any.required": "소개를 입력해주세요",
    }),
    location: Joi.string().required().messages({
      "string.base": "입력형식이 일치하지 않습니다.",
      "string.empty": "위치를 입력해주세요.",
      "any.required": "위치를 입력해주세요",
    }),
    profile_image: Joi.string().optional(),
  }),
  // __schema: 이어서 하시면됩니다 등록하는곳, 사용하는곳:mypage.controller.updated_info 확인해주세요!
  //에러 joi도 에러 내보는방법은 다양하니 회의 후 수정하겠습니다. 지금은 일시적인겁니다!
};
