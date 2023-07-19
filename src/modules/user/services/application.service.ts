import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { JobRepository } from 'src/modules/jobs/repository/job.repository';
import { UsersEntity } from 'src/database/entities/users.entity';
import { JobsEntity } from 'src/database/entities/jobs.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async applyForJob(user: UsersEntity, jobId: string): Promise<void> {
    const job = await this.jobRepository.findOneById(jobId);

    if (!job) {
      throw new Error('Trabalho não encontrado!');
    }

    const hasApplied = this.hasUserApplied(user, jobId);

    if (hasApplied) {
      throw new Error('Já foi realizado candidatura para o emprego!');
    }

    if (!user.pdf1 && !user.pdf2) {
      throw new Error(
        'É necessário ter um currículo para candidatar-se ao emprego!',
      );
    }

    user.applications.push(job);
    await this.userRepository.save(user);
    return;
  }

  private hasUserApplied(user: UsersEntity, jobId: string): boolean {
    return user.applications.some((application) => application.id === jobId);
  }

  // async getUserApplications(user: UsersEntity): Promise<JobsEntity[]> {
  //   const userData = await this.userRepository.findOne(
  //     { id: user.id },
  //     { relations: ['applications'] },
  //   );
  //   return userData.applications;
  // }

  async removeJobApplication(
    user: UsersEntity,
    applicationId: string,
  ): Promise<void> {
    const userData = await this.userRepository.findOne(
      { id: user.id },
      { relations: ['applications'] },
    );

    const applicationIndex = userData.applications.findIndex(
      (application) => application.id === applicationId,
    );

    if (applicationIndex !== -1) {
      userData.applications.splice(applicationIndex, 1);
      await this.userRepository.save(userData);
    }
  }
}
