class UserRepository {
  constructor(UsersModel) {
    this.usersModel = UsersModel;
  }
  // DB에서 중복되는 닉네임 찾기
  findNickname = async (nickname) => {
    const existNickname = await this.usersModel.findOne({
      where: { nickname },
    });
    return existNickname;
  };
  // DB에서 중복되는 이메일 찾기
  findEmail = async (email) => {
    const existEmail = await this.usersModel.findOne({ where: { email } });
    return existEmail;
  };

  // 회원가입
  signup = async (
    nickname,
    hashedPassword,
    email,
    location,
    profile_image,
    introduction
  ) => {
    const signupData = await this.usersModel.create({
      nickname,
      hashedPassword,
      email,
      location,
      profile_image,
      introduction,
    });
    return signupData;
  };

  // 회원탈퇴
  deleteSignup = async (user_id) => {
    await this.usersModel.destroy({
      where: { user_id },
    });
    return;
  };

  // 로그인 정보
  login = async (nickname) => {
    const loginUser = await this.usersModel.findOne({ where: { nickname } });
    return loginUser;
  };
}

module.exports = UserRepository;
