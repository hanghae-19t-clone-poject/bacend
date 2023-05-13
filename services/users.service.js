const { ref } = require("joi");
const UserRepository = require("../repositories/users.repository");
const TokenRepository = require("../repositories/token.repository");
const jwt = require("jsonwebtoken");

class UserService {
  userRepository = new UserRepository();
  tokenRepository = new TokenRepository();

  // 중복되는 닉네임 찾기
  findNickname = async (nickname) => {
    const existNickname = await this.userRepository.findNickname(nickname);
    return existNickname;
  };

  // 중복되는 이메일 찾기
  findEmail = async (email) => {
    const existEmail = await this.userRepository.findEmail(email);
    return existEmail;
  };

  // 회원가입
  signup = async (
    nickname,
    password,
    email,
    location,
    profile_image,
    introduction
  ) => {
    const signupData = await this.UserRepository.signup(
      nickname,
      password,
      email,
      location,
      profile_image,
      introduction
    );
    return signupData;
  };

  // 로그인 가능한 회원인지 확인
  loginUser = async (nickname) => {
    const loginUser = await this.userRepository.login(nickname);
    return loginUser;
  };

  // accessToken 생성
  createAccessToken = async (user_id) => {
    const accessToken = jwt.sign({ user_id }, "access-secret-key", {
      expiresIn: "1h",
    });
    return accessToken;
  };
  // refreshToken 생성
  createRefreshToken = async (user_id) => {
    const refreshToken = jwt.sign({ user_id }, "refresh-secret-key", {
      expiresIn: "14d",
    });
    return refreshToken;
  };

  // Tokens table에 refresh token 저장
  saveRefreshToken = async (user_id, refreshToken) => {
    await this.TokenRepository(user_id, refreshToken);
  };
}

module.exports = UserService;
