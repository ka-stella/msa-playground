const authController = require('../../src/controllers/authController');
const authService = require('../../src/services/authService');
const bcrypt = require('bcrypt');
const { Prisma } = require('@prisma/client');
const { PrismaClientKnownRequestError } = Prisma;

jest.mock('../../src/services/authService', () => ({
  registerUser: jest.fn(),
  findUserByUserName: jest.fn(),
}));
jest.mock('bcrypt');

describe('AuthController Unit Test', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  //テスト前の初期化処理
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
    };

    mockNext = jest.fn(); //ミドルウェア関数のモック

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('ユーザ登録成功時に201を返す', async () => {
      mockRequest.body = {
        username: 'testuser',
        password: 'password123',
      };

      bcrypt.hash.mockResolvedValue('hashedpassword');
      authService.registerUser.mockResolvedValue({
        id: 1,
        username: 'testuser',
        passwordhash: 'hashedpassword',
      });

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'ユーザ登録成功', userId: 1 });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('ユニーク制約違反時に409を返す', async () => {
      mockRequest.body = {
        username: 'existtuser',
        password: 'password123',
      };
      //if (error instanceof PrismaClientKnownRequestError) を通るように
      const mockError = {
        message: 'Unique constraint failed',
        code: 'P2002',
        clientVersion: '1.0.0',
        meta: { target: ['username'] },
        instanceof: PrismaClientKnownRequestError,
      };
      Object.setPrototypeOf(mockError, PrismaClientKnownRequestError.prototype);

      authService.registerUser.mockRejectedValue(mockError);

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'このユーザー名はすでに使用されている可能性があります。',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('サーバー内部エラー(DB操作以外のエラー)に500を返す', async () => {
      const error = new Error('テスト用のエラーメッセージ');
      authService.registerUser.mockRejectedValue(error);

      await authController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'サーバー内部で予期せぬエラーが発生しました',
        error: 'テスト用のエラーメッセージ',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
