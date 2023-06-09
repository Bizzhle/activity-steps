import { DataSource, FindOperator, Raw, Repository } from 'typeorm';
import { UserAccount } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Injectable } from '@nestjs/common';

export interface UserCondition {
  id?: UserAccount['id'];
  user_id?: UserAccount['user_id'];
  email_address?: UserAccount['email_address'];
}
@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {
  constructor(ds: DataSource) {
    super(UserAccount, ds.manager);
  }
  public async createUserAccount(dto: CreateUserDto, password: string): Promise<UserAccount> {
    const userAccount = this.create({
      first_name: dto.firstName,
      last_name: dto.lastName,
      email_address: dto.emailAddress,
      enabled: true,
      registration_date: new Date(),
      password: password,
    });

    await this.save<UserAccount>(userAccount);

    return userAccount;
  }

  public async findUserByEmail(email_address: string): Promise<UserAccount | null> {
    return await this.createQueryBuilder('user_account')
      .where('LOWER(user_account.email_address) = LOWER(:email_address)', {
        email_address: email_address,
      })
      .getOne();
  }

  public async getUserDetail(userCondition: UserCondition): Promise<UserAccount | null> {
    return await this.findOne({
      where: UserAccountRepository.filterCondition(userCondition),
    });
  }

  private static filterCondition(
    userCondition: UserCondition,
  ): Record<string, FindOperator<UserAccount> | number> {
    const whereQuery: Record<string, FindOperator<UserAccount> | number> = {};

    if (userCondition.email_address) {
      whereQuery['email_address'] = Raw<UserAccount>((column) => `LOWER(${column}) = :value`, {
        value: userCondition.email_address.toLowerCase(),
      });
    }

    return whereQuery;
  }
}
