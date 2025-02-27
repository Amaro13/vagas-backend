import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mails/mail.module';
import { UserRepository } from './repository/user.repository';
import {
  CreateUserService,
  FindOneUserService,
  FindAllUsersService,
  UpdateUserService,
  DeleteUserService,
  RecoveryPasswordByEmail,
  UpdatePasswordByEmailService,
} from './services';
import { ActivateUserService } from './services/activate-user.service';
import { UserController } from './user.controller';
import { AddPdfService } from './services/addpdfservice';
import { RemovePdfService } from './services/removepdfservice';
import { GetPdfService } from './services/getpdf.service';
import { JobApplicationService } from './services/application.service';
import { JobRepository } from '../jobs/repository/job.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, JobRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserService,
    FindOneUserService,
    FindAllUsersService,
    UpdateUserService,
    DeleteUserService,
    RecoveryPasswordByEmail,
    UpdatePasswordByEmailService,
    ActivateUserService,
    AddPdfService,
    RemovePdfService,
    GetPdfService,
    JobApplicationService,
  ],
  exports: [RecoveryPasswordByEmail],
})
export class UserModule {}
