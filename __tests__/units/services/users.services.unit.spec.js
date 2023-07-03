const UserService = require("../../../services/users.service");
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

let mockUserRepository = {
  findNickname: jest.fn(),
  findEmail: jest.fn(),
  signup: jest.fn(),
  deleteSignup: jest.fn(),
  login: jest.fn(),
  saveToken: jest.fn(),
  logout: jest.fn(),
};

let mockTokenRepository = {
  saveToken: jest.fn(),
};

let userService = new UserService();
// userService의 Repository를 Mock Repository로 변경
userService.userRepository = mockUserRepository;
userService.tokenRepository = mockTokenRepository;

describe("User Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화
  });

  test("회원가입 메서드", async () => {
    // signup Method를 실행했을 때, Return 값
    const signupReturnValue = {
      user_id: 1,
      nickname: "Nickname_1",
      email: "Email_1",
      location: "Location_1",
      profile_image: expect.anything(),
      introduction: expect.anything(),
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    };

    // signup method를 실행하기 위해 필요한 params
    const signupParams = {
      nickname: "signupNickname",
      password: "signupPassword",
      email: "signupEmail",
      location: "signupLocation",
      profile_image: expect.anything(),
      introduction: expect.anything(),
    };

    // Repository의 signup Method를 Mocking하고,
    // signupReturnValue를 Return 값으로 변경한다.
    mockUserRepository.signup = jest.fn(() => {
      return signupReturnValue;
    });

    // UserService의 signup Method를 실행한다.
    const signupData = await userService.signup(
      signupParams.nickname,
      signupParams.password,
      signupParams.email,
      signupParams.location,
      signupParams.profile_image,
      signupParams.introduction
    );

    // UserRepository의 signup Method가 1번 호출되었는지 검증
    expect(mockUserRepository.signup).toHaveBeenCalledTimes(1);
    // signup Method의 Return 값과
    // userService의 signup Method 실행했을 때 Return 값과 일치하는지 검증
    expect(signupData).toEqual(signupReturnValue);
  });
  test("login 메서드", async () => {
    // nickname으로 loginUser 찾기
    // 1. 닉네임 Params 설정
    const nicknameParams = { nickname: "Nickname_1" };
    // 2. Params를 전달했을 때 loginUser Return 값
    const loginUserReturnValue = {
      user_id: 1,
      nickname: nicknameParams.nickname,
    };

    // 3. mockUserRepository의 findNickname Method를 호출될 때,
    //    loginUserReturnValue이 반환되도록 설정
    mockUserRepository.login.mockResolvedValue(loginUserReturnValue);

    // accessToken과 refreshToken은 테스트 코드에서 문자열로 설정
    const accessToken = "access token";
    const refreshToken = "refresh token";

    // jwt.sign Method를 호출했을 때 첫번째 반환 값
    jwt.sign.mockReturnValueOnce(accessToken);

    // jwt.sign Method를 호출했을 때 두번째 반환 값
    jwt.sign.mockReturnValueOnce(refreshToken);

    // 생성된 refresh token을 db에 저장
    mockTokenRepository.saveToken.mockResolvedValue();

    // 4. access token과 refresh token 설정
    const result = await userService.login(loginUserReturnValue.nickname);

    // 올바른 인자로 jwt.sign이 호출되었는지 검증
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenCalledWith(
      { user_id: loginUserReturnValue.user_id },
      process.env.ACCESS_KEY,
      { expiresIn: process.env.ACCESS_EXPIRES }
    );
    expect(jwt.sign).toHaveBeenCalledWith({}, process.env.REFRESH_KEY, {
      expiresIn: process.env.REFRESH_EXPIRES,
    });

    // 올바른 토큰이 생성되었는지 검증

    expect(result.accessToken).toBe(accessToken);
    expect(result.refreshToken).toBe(refreshToken);

    //
    expect(mockTokenRepository.saveToken).toHaveBeenCalledTimes(1);
    expect(mockTokenRepository.saveToken).toHaveBeenCalledWith(
      loginUserReturnValue.user_id,
      refreshToken
    );
  });
});
