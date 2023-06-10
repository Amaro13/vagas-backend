import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UsersEntity } from '../../database/entities/users.entity';
import { BadRequestSwagger } from '../../shared/Swagger/bad-request.swagger';
import { UnauthorizedSwagger } from '../../shared/Swagger/unauthorized.swagger';
import { PageOptionsDto } from '../../shared/pagination';
import { LoggedAdmin } from '../auth/decorator/logged-admin.decorator';
import { LoggedUser } from '../auth/decorator/logged-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { EmailDto } from './dtos/email-user.dto';
import { CreatePasswordHashDto } from './dtos/update-my-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

import { NotFoundSwagger } from '../../shared/Swagger/not-found.swagger';
import { UnprocessableEntitySwagger } from '../../shared/Swagger/unprocessable-entity.swagger';
import { CreateResponseSwagger } from '../../shared/Swagger/user/create-response.swagger';
import { ListResponseSwagger } from '../../shared/Swagger/user/list-response.swagger';
import { RecoveryPasswordSwagger } from '../../shared/Swagger/user/recovery-password.swagger';
import { GetByParamsDto } from './dtos/get-by-params.dto';
import {
  CreateUserService,
  DeleteUserService,
  FindAllUsersService,
  FindOneUserService,
  RecoveryPasswordByEmail,
  UpdatePasswordByEmailService,
  UpdateUserService,
} from './services';
import { ActivateUserService } from './services/activate-user.service';
import { AddPdfService } from './services/addpdfservice';
import { RemovePdfService } from './services/removepdfservice';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetPdfService } from './services/getpdf.service';
import { UserRepository } from './repository/user.repository';

import { multerConfig } from './config/multer.config';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private findOneUserService: FindOneUserService,
    private findAllUsersService: FindAllUsersService,
    private updateUserService: UpdateUserService,
    private deleteUserService: DeleteUserService,
    private recoveryPasswordByEmail: RecoveryPasswordByEmail,
    private updatePasswordByEmailService: UpdatePasswordByEmailService,
    private activateUserService: ActivateUserService,
    private addPdfService: AddPdfService,
    private removePdfService: RemovePdfService,
    private getPdfService: GetPdfService,
    private UserRepository: UserRepository,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Exemplo do retorno de sucesso da rota',
    type: CreateResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Criar um usuário!',
  })
  async createNewUser(
    @Body() createUser: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { data, status } = await this.createUserService.execute(
      createUser,
      req,
    );

    return res.status(status).send(data);
  }

  @Put('activate/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: CreateResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Modelo de erro',
    type: UnprocessableEntitySwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Ativar um usuário pelo ID',
  })
  async activateUser(@Param('id') id: string) {
    return this.activateUserService.execute(id);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: ListResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Visualizar todos os usuários',
  })
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth()
  async getAllUsers(
    // @LoggedAdmin() user: UsersEntity,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.findAllUsersService.execute(pageOptionsDto);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: CreateResponseSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Visualizar um usuário pelo ID (precisa ser adm)',
  })
  @ApiParam({
    type: GetByParamsDto,
    name: '',
  })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async getOneUser(@LoggedUser() user: UsersEntity) {
    return this.findOneUserService.execute(user);
  }

  @Put()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Atualizar um usuário pelo ID',
  })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async updateUser(
    @Body() data: UpdateUserDto,
    @LoggedUser() user: UsersEntity,
  ) {
    return this.updateUserService.execute(user, data);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Deletar um usuário pelo ID',
  })
  @ApiParam({
    type: GetByParamsDto,
    name: '',
  })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteUser(@LoggedUser() user: UsersEntity) {
    return this.deleteUserService.execute(user);
  }

  @Patch('recovery_password')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: RecoveryPasswordSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Send email to recovery password.',
  })
  async recoveryPasswordSendEmail(
    @Body() { email }: EmailDto,
    @Res() res: Response,
  ) {
    const { status, data } = await this.recoveryPasswordByEmail.execute(email);

    return res.status(status).send(data);
  }

  @Patch('update_password')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'User update password.',
  })
  async updatePassword(
    @Body() updatePassword: CreatePasswordHashDto,
    @Res() res: Response,
  ) {
    const { data, status } = await this.updatePasswordByEmailService.execute(
      updatePassword,
    );

    return res.status(status).send(data);
  }

  @Post('add-pdf')
  @ApiOperation({ summary: 'Adicionar Currículo' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async addPdf(
    @UploadedFile() file: Express.Multer.File,
    @LoggedUser() user: UsersEntity,
  ) {
    return this.addPdfService.execute(user, file);
  }

  @Patch('pdf/:pdfNumber')
  @ApiOperation({ summary: 'Remover Currículo' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async removePdf(
    @Param('pdfNumber') pdfNumber: number,
    @LoggedUser() user: UsersEntity,
  ) {
    return this.removePdfService.execute(user, pdfNumber);
  }

  @Get(':userId/pdf/:pdfNumber')
  @ApiOperation({ summary: 'Buscar um Currículo' })
  async getPdf(
    @Param('userId') userId: string,
    @Param('pdfNumber') pdfNumber: number,
    @Res() response: Response,
  ) {
    const user: UsersEntity = await this.UserRepository.findOneById(userId);
    if (!user) {
      response.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }
    const pdfFile: string | null = this.getPdfService.execute(user, pdfNumber);
    if (!pdfFile) {
      response.status(404).json({ message: 'Currículo não encontrado' });
      return;
    }
    response.sendFile(pdfFile);
  }
}
