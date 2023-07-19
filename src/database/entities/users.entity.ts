import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationEntity } from './applications.entity';
import { CurriculumEntity } from './curriculum.entity';
import { PersonalDataEntity } from './personal-data.entity';
import { ApiProperty } from '@nestjs/swagger';

enum RolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('tb_users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  policies: boolean;

  @Column({ nullable: true })
  ip: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'USER'],
    default: RolesEnum.USER,
  })
  type: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mainPhone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @OneToOne(() => PersonalDataEntity)
  @JoinColumn()
  personalData: PersonalDataEntity;

  @OneToMany(() => CurriculumEntity, (curriculum) => curriculum.user)
  curriculums: CurriculumEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.user)
  applications: ApplicationEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ update: true })
  updated_at: Date;

  @Column({ default: false })
  mailConfirm: boolean;

  @Column({ nullable: true })
  recoverPasswordToken?: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Currículo 1.',
    type: 'string',
    format: 'binary',
  })
  pdf1: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Currículo 2.',
    type: 'string',
    format: 'binary',
  })
  pdf2: string;

  getPdfFile(pdfNumber: number): string | null {
    if (pdfNumber === 1) {
      return this.pdf1;
    } else if (pdfNumber === 2) {
      return this.pdf2;
    } else {
      throw new Error('Seleção Inválida.');
    }
  }

  // @ManyToMany(() => JobsEntity)
  // @JoinTable()
  // applications: JobsEntity[];

  constructor(user?: Partial<UsersEntity>) {
    this.id = user?.id;
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.type = user?.type;
    this.mailConfirm = user?.mailConfirm;
    this.recoverPasswordToken = user?.recoverPasswordToken;
    this.created_at = user?.created_at;
    this.updated_at = user?.updated_at;
  }
}
