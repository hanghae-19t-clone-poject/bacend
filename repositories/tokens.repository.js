class TokenRepository {
  constructor(TokensModel) {
    this.tokensModel = TokensModel;
  }
  // Tokens table에 refresh token 저장
  saveToken = async (user_id, refreshToken) => {
    const saveToken = await this.tokensModel.create({
      token: refreshToken,
      user_id: user_id,
    });

    return saveToken;
  };

  // 새로운 Access Token 발급받을때 Refresh Token으로 user_id 가져오기
  findTokenId = async (authRefreshToken) => {
    const accessTokenId = await this.tokensModel.findOne({
      where: { token: authRefreshToken },
    });
    const { user_id } = accessTokenId;

    return user_id;
  };

  deleteToken = async (user_id) => {
    await this.tokensModel.destroy({ where: { user_id } });
    return;
  };
}

module.exports = TokenRepository;
