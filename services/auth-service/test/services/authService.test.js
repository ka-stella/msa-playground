const prisma = require('../../src/config/prisma');
const authService = require('../../src/services/authService');

jest.mock('../../src/config/prisma', () => ({
  authUser: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe('AuthService Unit Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('正常に登録できる', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        passwordhash: 'hashedpassword',
        provider: null,
        provideUserId: null,
      };
      prisma.authUser.create.mockResolvedValue(mockUser);

      const result = await authService.registerUser('testuser', 'hashedpassword');

      expect(prisma.authUser.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          passwordHash: 'hashedpassword',
          provider: null,
          providerUserId: null,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('例外が発生した場合はそのままthrowされること', async () => {
      const mockError = new Error('DBエラー');
      prisma.authUser.create.mockRejectedValue(mockError);

      await expect(authService.registerUser('testuser', 'hashedpassword')).rejects.toThrow(
        'DBエラー',
      );
    });

    it('provider と providerUserId が指定された場合も正しく処理されること', async () => {
      const mockUser = {
        id: 2,
        username: 'socialuser',
        passwordHash: null,
        provider: 'google',
        providerUserId: 'google-12345',
      };
      prisma.authUser.create.mockResolvedValue(mockUser);

      const result = await authService.registerUser('socialuser', null, 'google', 'google-12345');
      expect(prisma.authUser.create).toHaveBeenCalledWith({
        data: {
          username: 'socialuser',
          passwordHash: null,
          provider: 'google',
          providerUserId: 'google-12345',
        },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
