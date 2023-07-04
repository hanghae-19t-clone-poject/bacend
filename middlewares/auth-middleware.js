const jwt = require("jsonwebtoken");
const { Users, Tokens } = require("../models");
const TokenRepository = require("../repositories/tokens.repository");

const tokenRepository = new TokenRepository(Tokens);

module.exports = async (req, res, next) => {
  let { accesstoken, refreshtoken } = req.headers;
  console.log(req.headers);
  console.log(accesstoken);
  console.log(refreshtoken);

  // const { AccessToken, RefreshToken } = req.cookies;
  try {
    accesstoken = !req.headers.refreshtoken
      ? req.cookies.accesstoken
      : accesstoken;

    refreshtoken = !req.headers.refreshtoken
      ? req.cookies.refreshtoken
      : refreshtoken;
    console.log(accesstoken);
    console.log(refreshtoken);
    const [authAccessType, authAccessToken] = (accesstoken ?? "").split(" ");
    const [authRefreshType, authRefreshToken] = (refreshtoken ?? "").split(" ");

    // access token 존재하지 않을때
    if (authRefreshType !== "Bearer" || !authRefreshToken) {
      return res
        .status(403)
        .json({ errorMessage: "로그인이 필요한 기능입니다." });
    }

    // refresh token 존재하지 않을때
    if (authAccessType !== "Bearer" || !authAccessToken) {
      return res
        .status(400)
        .json({ errorMessage: "로그인이 필요한 기능입니다." });
    }

    const isAccessTokenValidate = validateAccessToken(authAccessToken);
    const isRefreshTokenValidate = validateRefreshToken(authRefreshToken);

    // refresh token이 만료되었을때
    if (!isRefreshTokenValidate) {
      return res
        .status(419)
        .json({ errorMessage: "Refresh Token이 만료되었습니다." });
    }

    // access token이 만료되었을때
    if (!isAccessTokenValidate) {
      const accessTokenId = await tokenRepository.findTokenId(authRefreshToken);
      if (!accessTokenId) {
        return res.json({
          errorMessage: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
        });
      }
      const newAccessToken = createAccessToken(accessTokenId);

      // 새로운 access token Responce
      res.cookie("accesstoken", `Bearer ${newAccessToken}`);
      return res.status(200).json({ newAccessToken });
    }

    // authAccessToken의 payload에서 user_id를 가져온다.
    const { user_id } = jwt.verify(authAccessToken, process.env.ACCESS_KEY);
    const user = await Users.findOne({ where: { user_id: user_id } });
    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
    return res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};

// 새로운 access token 생성 함수
const createAccessToken = (accessTokenId) => {
  const accessToken = jwt.sign(
    { user_id: accessTokenId },
    process.env.ACCESS_KEY,
    {
      expiresIn: process.env.ACCESS_EXPIRES,
    }
  );
  return accessToken;
};

// access token 검증 함수
const validateAccessToken = (authAccessToken) => {
  try {
    jwt.verify(authAccessToken, process.env.ACCESS_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

// refresh token 검증 함수
const validateRefreshToken = (authRefreshToken) => {
  try {
    jwt.verify(authRefreshToken, process.env.REFRESH_KEY);
    return true;
  } catch (error) {
    return false;
  }
};
