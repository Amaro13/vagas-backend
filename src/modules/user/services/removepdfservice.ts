import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/database/entities/users.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class RemovePdfService {
  constructor(private userRepository: UserRepository) {}

  async execute(user: UsersEntity, pdfNumber: number): Promise<void> {
    if (pdfNumber === 1) {
      user.pdf1 = null;
    } else if (pdfNumber === 2) {
      user.pdf2 = null;
    } else {
      throw new Error('Ação Inválida');
    }

    await this.userRepository.save(user);
  }
}
