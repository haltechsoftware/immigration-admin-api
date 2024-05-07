import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { DecrementTouristEnterCommand } from './commands/impl/decrement-tourist-enter.command';
import { DecrementTouristExitCommand } from './commands/impl/decrement-tourist-exit.command';
import { IncrementTouristEnterCommand } from './commands/impl/increment-tourist-enter.command';
import { IncrementTouristExitCommand } from './commands/impl/increment-tourist-exit.command';
import {
  NumberTouristDto,
  NumberTouristDtoType,
} from './dto/number-tourist.dto';
import { NumberTouristEnterQuery } from './queries/impl/number-tourist-enter.query';
import { NumberTouristExitQuery } from './queries/impl/number-tourist-exit.query';

@Controller('no-of-tourists')
export class NoOfTouristsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('enter/increment')
  async incrementTouristEnter(
    @Valibot({ schema: NumberTouristDto }) body: NumberTouristDtoType,
  ): Promise<any> {
    const message = await this.commandBus.execute<IncrementTouristEnterCommand>(
      new IncrementTouristEnterCommand(body),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('enter/decrement')
  async decrementTouristEnter(
    @Valibot({ schema: NumberTouristDto }) body: NumberTouristDtoType,
  ): Promise<any> {
    const message = await this.commandBus.execute<DecrementTouristEnterCommand>(
      new DecrementTouristEnterCommand(body),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get('enter')
  async numberTouristEnter(): Promise<any> {
    return await this.queryBus.execute<NumberTouristEnterQuery>(
      new NumberTouristEnterQuery(),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('exit/increment')
  async incrementTouristExit(
    @Valibot({ schema: NumberTouristDto }) body: NumberTouristDtoType,
  ): Promise<any> {
    const message = await this.commandBus.execute<IncrementTouristExitCommand>(
      new IncrementTouristExitCommand(body),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post('exit/decrement')
  async decrementTouristExit(
    @Valibot({ schema: NumberTouristDto }) body: NumberTouristDtoType,
  ): Promise<any> {
    const message = await this.commandBus.execute<DecrementTouristExitCommand>(
      new DecrementTouristExitCommand(body),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get('exit')
  async numberTouristExit(): Promise<any> {
    return await this.queryBus.execute<NumberTouristExitQuery>(
      new NumberTouristExitQuery(),
    );
  }
}
