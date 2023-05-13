const { Users, UsersInfos } = require("../models");

class UserRepository {
  // DB에서 중복되는 닉네임 찾기
  findNickname = async (nickname) => {
    const existNickname = await Users.findOne({ where: { nickname } });
    return existNickname;
  };
  // DB에서 중복되는 이메일 찾기
  findEmail = async (email) => {
    const existEmail = await Users.findOne({ where: { email } });
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
    const signupData = await Users.create({
      nickname,
      password,
      email,
      location,
      profile_image,
      introduction,
    });
    return signupData;
  };

  // 로그인 정보
  login = async (nickname) => {
    const loginUser = await Users.findOne({ nickname });
    return loginUser;
  };
}

module.exports = UserRepository;
