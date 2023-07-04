const UserService = require("../services/users.service");
const bcrypt = require("bcryptjs");

class UserController {
  userService = new UserService();

  // 회원가입 API
  signup = async (req, res, next) => {
    const {
      nickname,
      password,
      confirmpassword,
      email,
      location,
      profile_image,
      introduction,
    } = req.body;
    try {
      const nicknameFilter = /^[a-zA-Z0-9]{6,}/gi;
      const passwordFilter = /[a-zA-Z0-9]{8,}/gi;
      const emailFilter = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/gi;
      const existNickname = await this.userService.findNickname(nickname);
      const existEmail = await this.userService.findEmail(email);

      // 닉네임 길이 6 이상, 영어 대소문자만, 숫자0-9만 가능
      if (!nicknameFilter.test(nickname)) {
        return res
          .status(412)
          .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
      }

      // 이메일 형식이 비정상적인 경우
      if (!emailFilter.test(email)) {
        return res
          .status(412)
          .json({ errorMessage: "이메일의 형식이 일치하지 않습니다." });
      }

      // password 길이 8이상, 영어대소문자만, 숫자0-9만 가능
      if (!passwordFilter.test(password)) {
        return res
          .status(412)
          .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
      }
      // password에 닉네임이 포함되어있는 경우
      if (password.includes(nickname)) {
        return res
          .status(412)
          .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
      }

      // password 가 confirmpassword와 다른 경우
      if (password !== confirmpassword) {
        return res
          .status(412)
          .json({ errorMessage: "패스워드가 일치하지 않습니다." });
      }
      // 닉네임이 중복된 경우
      if (existNickname) {
        return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
      }
      // 이메일이 중복된 경우
      if (existEmail) {
        return res.status(412).json({ errorMessage: "중복된 이메일입니다." });
      }

      // location이 존재하지 않거나 비정상적인 경우
      if (!location || typeof location !== "string") {
        return res.status(412).json({
          errorMessage: "location이 존재하지 않거나 형식이 일치하지 않습니다.",
        });
      }

      // 회원가입 성공
      await this.userService.signup(
        nickname,
        password,
        email,
        location,
        profile_image,
        introduction
      );
      res.status(200).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      // # 400 예외 케이스에서 처리하지 못한 에러
      console.error(error);
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
  };

  // 닉네임 중복 확인
  checkNickname = async (req, res, next) => {
    const { nickname } = req.body;
    const nicknameFilter = /^[a-zA-Z0-9]{6,}/gi;
    try {
      const existNickname = await this.userService.findNickname(nickname);
      if (existNickname || !nicknameFilter.test(nickname)) {
        return res.status(412).json({ message: false });
      }
      return res.status(200).json({ message: true });
    } catch (error) {
      console.error(error);
      return res
        .status(412)
        .json({ errorMessage: "닉네임 중복 확인에 실패하였습니다." });
    }
  };

  // 회원탈퇴 API
  deleteSignup = async (req, res, next) => {
    const { user_id } = res.locals.user;
    const { nickname, password } = req.body;

    try {
      const existUser = await this.userService.findNickname(nickname);

      if (existUser.nickname === nickname && existUser.password === password) {
        return res
          .status(412)
          .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      }
      if (user_id === existUser.user_id) {
        await this.userService.deleteSignup(user_id);
        return res.status(200).json({ message: "회원탈퇴에 성공하였습니다." });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ errorMessage: "회원탈퇴에 실패하였습니다." });
    }
  };

  // 로그인 API
  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;

      // nickname과 password가 존재하지 않는 경우
      if (!nickname || !password) {
        return res
          .status(412)
          .json({ errorMessage: "데이터의 형식이 일치하지 않습니다." });
      }

      // 해당하는 유저가 존재하지 않는 경우
      const findNicknameUser = await this.userService.findNickname(nickname);

      if (!findNicknameUser) {
        return res
          .status(412)
          .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      }

      const matchPassword = await bcrypt.compare(
        password,
        findNicknameUser.password
      );

      if (!matchPassword) {
        return res
          .status(412)
          .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      }

      // 로그인 성공하면 Access token, Refresh token 생성
      const { accessToken, refreshToken } = await this.userService.login(
        nickname
      );

      // Tokens table에 refresh token 저장

      res.cookie("accesstoken", `Bearer ${accessToken}`);
      res.cookie("refreshtoken", `Bearer ${refreshToken}`);

      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
    }
  };
  // 로그아웃 API
  logout = async (req, res, next) => {
    const user_id = req.params;
    // const user_id = 1;
    try {
      // logout했을때 db에서 refresh token 제거
      await this.userService.logout(user_id);
      res.clearCookie("accesstoken");
      res.clearCookie("refreshtoken");

      return res.status(200).json({ message: "로그아웃에 성공하였습니다." });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ errorMessage: "로그아웃에 실패하였습니다." });
    }
  };
}

module.exports = UserController;
