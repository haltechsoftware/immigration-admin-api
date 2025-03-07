import { Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { NumberDto, NumberDtoType } from "../dtos/number.dto";
import { VisitorCommand } from "./commands/impl/visitor.command";
import { Public } from "src/common/decorators/public.decorator";
import { VisitorQuery } from "./queries/impl/visitor.query";


@Controller('visitors')
export class VisitorController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

    @Public()
    @Post()
    async visitor(
      @Valibot({ schema: NumberDto }) body: NumberDtoType,
    ): Promise<any> {
      const message = await this.commandBus.execute<VisitorCommand>(
        new VisitorCommand(body),
      );
  
      return { message };
    }

    @Public()
    @Get()
    async get(): Promise<any> {
    return await this.queryBus.execute<VisitorQuery>(
        new VisitorQuery(),
    );
    }
}