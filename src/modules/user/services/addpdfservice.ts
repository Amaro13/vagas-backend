import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/database/entities/users.entity';
import { UserRepository } from '../repository/user.repository';
import { writeFile } from 'fs';
import { promisify } from 'util';

export type MulterFile = Express.Multer.File;

const writeFileAsync = promisify(writeFile);

@Injectable()
export class AddPdfService {
  constructor(private userRepository: UserRepository) {}

  async execute(user: UsersEntity, pdfFile: MulterFile): Promise<void> {
    const filePath = await this.saveFileToDisk(pdfFile);
    this.updateUserPdfPath(user, filePath);
    await this.userRepository.save(user);
  }

  private async saveFileToDisk(file: MulterFile): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const path = `uploads/${fileName}`;

    try {
      await writeFileAsync(path, file.buffer);
      return path;
    } catch (error) {
      throw new Error(`Não foi possível salvar arquivo.`);
    }
  }

  private updateUserPdfPath(user: UsersEntity, filePath: string): void {
    if (user.pdf1 == null) {
      user.pdf1 = filePath;
    } else {
      user.pdf2 = filePath;
    }
  }
}
