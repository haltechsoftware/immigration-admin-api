import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { NumberDto, NumberDtoType } from '../dtos/number.dto';
import { DecrementRegisterEnterCommand } from './commands/impl/decrement-register-enter.command';
import { DecrementRegisterExitCommand } from './commands/impl/decrement-register-exit.command';
import { IncrementRegisterEnterCommand } from './commands/impl/increment-register-enter.command';
import { IncrementRegisterExitCommand } from './commands/impl/increment-register-exit.command';
import { NumberRegisterEnterQuery } from './queries/impl/number-register-enter.query';
import { NumberRegisterExitQuery } from './queries/impl/number-register-exit.query';
import { Public } from 'src/common/decorators/public.decorator';
import { NumberRegisterEnterClientQuery } from './queries/impl/number-register-enter-client.query';

@Controller('no-of-register')
export class NoOfRegisterController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('enter/increment')
  async incrementEnter(
    @Valibot({ schema: NumberDto }) body: NumberDtoType,
  ): Promise<any> {
    const message =
      await this.commandBus.execute<IncrementRegisterEnterCommand>(
        new IncrementRegisterEnterCommand(body),
      );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('enter/decrement')
  async decrementEnter(
    @Valibot({ schema: NumberDto }) body: NumberDtoType,
  ): Promise<any> {
    const message =
      await this.commandBus.execute<DecrementRegisterEnterCommand>(
        new DecrementRegisterEnterCommand(body),
      );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get('enter')
  async numberEnter(): Promise<any> {
    return await this.queryBus.execute<NumberRegisterEnterQuery>(
      new NumberRegisterEnterQuery(),
    );
  }

  @Public()
  @Get('client')
  async numberEnterClient(): Promise<any> {
    return await this.queryBus.execute<NumberRegisterEnterClientQuery>(
      new NumberRegisterEnterClientQuery(),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('exit/increment')
  async incrementExit(
    @Valibot({ schema: NumberDto }) body: NumberDtoType,
  ): Promise<any> {
    const message = await this.commandBus.execute<IncrementRegisterExitCommand>(
      new IncrementRegisterExitCommand(body),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('exit/decrement')
  async decrementExit(
    @Valibot({ schema: NumberDto }) body: NumberDtoType,
  ): Promise<any> {
    const message = await this.commandBus.execute<DecrementRegisterExitCommand>(
      new DecrementRegisterExitCommand(body),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get('exit')
  async numberRegisterExit(): Promise<any> {
    return await this.queryBus.execute<NumberRegisterExitQuery>(
      new NumberRegisterExitQuery(),
    );
  }
}
