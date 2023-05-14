const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const TokenRepository = require("../repositories/token.repository");

TokenRepository = new TokenRepository();

module.exports = async (req, res, next) => {
  const { AccessToken, RefreshToken } = req.headers;
  try {
    const [authAccessType, authAccessToken] = (AccessToken ?? "").split(" ");
    const [authRefreshType, authRefreshToken] = (RefreshToken ?? "").split(" ");

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
    const isRefreshTokenValidate = validateRefrefhToken(authRefreshToken);

    // refresh token이 만료되었을때
    if (!isRefreshTokenValidate) {
      return res
        .status(419)
        .json({ errorMessage: "Refresh Token이 만료되었습니다." });
    }

    // access token이 만료되었을때
    if (!isAccessTokenValidate) {
      const accessTokenId = await this.tokenRepository.findToken(
        authRefreshToken
      );
      if (!accessTokenId) {
        return res.json({
          errorMessage: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
        });
      }
      const newAccessToken = createAccessToken(accessTokenId);

      // 새로운 access token 응답
      res.cookie("AccessToken", `Bearer ${newAccessToken}`);
    }

    // authAccessToken의 payload에서 user_id를 가져온다.
    const { user_id } = jwt.verify(authAccessToken, "access-secret-key");
    const user = await Users.findOne({ where: { user_id: user_id } });
    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("AccessToken", "RefreshToken");
    return res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }

  // access token을 검증한다.
  validateAccessToken = (authAccessToken) => {
    try {
      jwt.verify(authAccessToken, "access-secret-key");
      return true;
    } catch (error) {
      return false;
    }
  };

  // refresh token을 검증한다.
  validateRefrefhToken = (authRefreshToken) => {
    try {
      jwt.verify(authRefreshToken, "refresh-secret-key");
      return true;
    } catch (error) {
      return false;
    }
  };

  // 새로운 access token 생성
  createAccessToken = async (accessTokenId) => {
    const accessToken = jwt.sign(
      { user_id: accessTokenId },
      "access-secret-key",
      {
        expiresIn: "1h",
      }
    );
    return accessToken;
  };

  //   // access token의 payload에서 user_id를 가져온다.
  //   getAccessTokenPayload = async (authAccessToken) => {
  //     try {
  //       const payload = jwt.verify(authAccessToken, "access-secret-key");
  //       return payload;
  //     } catch (error) {
  //       return null;
  //     }
  //   };
};
