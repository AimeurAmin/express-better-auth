import { User } from '@/models/User';
import { AppDataSource } from '@/config/database';
import { createError } from '@/middlewares/error';

export interface UpdateUserData {
  name?: string;
  image?: string;
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  }

  async updateUserProfile(userId: string, data: UpdateUserData): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    if (data.name) {
      if (data.name.trim().length < 2) {
        throw createError('Name must be at least 2 characters long', 400);
      }
      user.name = data.name.trim();
    }

    if (data.image) {
      user.image = data.image;
    }

    return this.userRepository.save(user);
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .where('(user.name LIKE :query OR user.email LIKE :query)', { 
        query: `%${query}%` 
      })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}