const { ref } = require("joi");
const UserRepository = require("../repositories/users.repository");
const TokenRepository = require("../repositories/tokens.repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Users, Tokens } = require("../models");

class UserService {
  userRepository = new UserRepository(Users);
  tokenRepository = new TokenRepository(Tokens);

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
    const saltRounds = BCRYPT_SALT_ROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const signupData = await this.userRepository.signup(
      nickname,
      hashedPassword,
      email,
      location,
      profile_image,
      introduction
    );
    return signupData;
  };

  // 회원탈퇴 API
  deleteSignup = async (user_id) => {
    await this.userRepository.deleteSignup(user_id);
    return;
  };

  // 로그인 가능한 회원인지 확인
  login = async (nickname) => {
    const loginUser = await this.userRepository.login(nickname);

    // accessToken 생성
    const accessToken = jwt.sign(
      { user_id: loginUser.user_id },
      process.env.ACCESS_KEY,
      {
        expiresIn: process.env.ACCESS_EXPIRES,
      }
    );

    // refreshToken 생성
    const refreshToken = jwt.sign({}, process.env.REFRESH_KEY, {
      expiresIn: process.env.REFRESH_EXPIRES,
    });

    // Tokens Table에 refresh token 저장
    await this.tokenRepository.saveToken(loginUser.user_id, refreshToken);

    return { accessToken, refreshToken };
  };

  // logout 했을 때, token 삭제
  logout = async (user_id) => {
    await this.tokenRepository.deleteToken(user_id);
    return;
  };
}
module.exports = UserService;
