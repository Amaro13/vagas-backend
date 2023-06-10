import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/database/entities/users.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class GetPdfService {
  constructor(private userRepository: UserRepository) {}

  execute(user: UsersEntity, pdfNumber: number): string | null {
    return user.getPdfFile(pdfNumber);
  }
}
