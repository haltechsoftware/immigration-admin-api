# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **NestJS-based administrative API** for an immigration management system, built with TypeScript and following **CQRS (Command Query Responsibility Segregation)** architecture patterns.

**Core Technologies:**
- NestJS with CQRS (@nestjs/cqrs)
- Drizzle ORM with MySQL
- Valibot for validation
- JWT authentication with session management
- SWC for fast TypeScript compilation

## Development Commands

```bash
# Development
pnpm run start:dev          # Start dev server with SWC watch mode

# Building
pnpm run build              # Compile TypeScript to dist/

# Testing
pnpm run test               # Run unit tests with Vitest
pnpm run test:e2e           # Run end-to-end tests
pnpm run test:cov           # Generate test coverage
pnpm run test:watch         # Run tests in watch mode

# Database operations (Drizzle ORM)
pnpm run drizzle:generate   # Generate database migrations
pnpm run drizzle:push       # Push schema changes to database
pnpm run drizzle:seed       # Run database seed scripts

# Production
pnpm run start:prod         # Run production build
pnpm run deploy             # Deploy via SCP to production server

# Code quality
pnpm run lint               # Lint and auto-fix TypeScript
pnpm run format             # Format with Prettier
```

## Architecture

### CQRS Pattern Implementation

The codebase strictly separates write and read operations using NestJS CQRS:

**Commands (Write Operations):**
- Located in `modules/*/commands/impl/*.command.ts`
- Handlers in `modules/*/commands/handlers/*.handler.ts`
- Executed via `CommandBus.execute(new SomeCommand(input))`

**Queries (Read Operations):**
- Located in `modules/*/queries/impl/*.query.ts`
- Handlers in `modules/*/queries/handlers/*.handler.ts` or repository files
- Executed via `QueryBus.execute(new SomeQuery(input))`

**Typical Controller Pattern:**
```typescript
@Controller('resource')
export class ResourceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Valibot({ schema: CreateDto }) body: CreateDtoType) {
    return await this.commandBus.execute(new CreateCommand(body));
  }

  @Get()
  async findAll(@Valibot({ schema: QueryDto, type: 'query' }) query: QueryDtoType) {
    return await this.queryBus.execute(new GetAllQuery(query));
  }
}
```

### Module Structure

Each domain module follows this structure:
```
modules/{domain}/
├── commands/
│   ├── impl/           # Command classes (input DTOs)
│   └── handlers/       # Command handlers (business logic)
├── queries/
│   ├── impl/           # Query classes (input parameters)
│   └── handlers/       # Query handlers (data retrieval)
├── repositories/       # Optional: Data access layer
├── entities/           # Drizzle ORM schema definitions
├── dto/                # Valibot validation schemas (singular "dto")
├── {domain}.controller.ts
└── {domain}.module.ts
```

**Note:** Some modules use `handler` (singular) instead of `handlers` for query/command handlers. Follow the existing pattern in each module.

### Database Layer (Drizzle ORM)

- **Global Service**: `DrizzleService` is globally available via `@Global()` decorator
- **Access Pattern**: Injected into repositories and handlers for database operations
- **Schema Location**: Each module defines entities in `modules/*/entities/*.ts`
- **Configuration**: `drizzle.config.ts` points to `./src/modules/**/entities/*`
- **Prepared Statements**: Repositories use `.prepare()` for query optimization

**Repository Pattern:**
```typescript
@Injectable()
export class SomeRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  private _getPrepared = this.drizzle
    .db()
    .query.someTable.findFirst({ where: ... })
    .prepare();

  async findOne(id: number) {
    return await this._getPrepared.execute({ id });
  }
}
```

### Validation with Valibot

- **Custom Decorator**: `@Valibot({ schema: SomeDto, type: 'body' })`
- **Types**: Import generated types (e.g., `CreateDtoType`) for type safety
- **Locations**: `body` (default), `query`, `params`
- **Global Filter**: `ValibotExceptionsFilter` handles validation errors globally

**Example:**
```typescript
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { CreateUserDto, CreateUserDtoType } from './dto/create-user.dto';

@Post()
async create(@Valibot({ schema: CreateUserDto }) body: CreateUserDtoType) {
  // body is fully typed and validated
}
```

### Authentication & Authorization

**Multi-Layered Security:**
1. **Rate Limiting**: `ThrottlerGuard` (60 requests/minute per IP)
2. **JWT Auth**: `AuthGuard` validates JWT tokens via session IDs
3. **Permissions**: `PermissionsGuard` checks role-based access

**Decorators:**
- `@Public()` - Bypass authentication (e.g., login endpoint)
- `@Auth()` - Access JWT payload (returns `IJwtPayload`)
- `@Permissions(PermissionGroup.News, PermissionName.Write)` - Require specific permissions

**Session Management:**
- JWT tokens contain `token_id` referencing `sessions` table
- Sessions are validated on each request
- Logout deletes session from database

### Request Context

- **Module**: `RequestContextModule` from `nestjs-request-context`
- **Interceptor**: `MergeDrizzleToReqInterceptor` injects `DrizzleService` into request object
- **Usage**: Access database via `req.drizzle` instead of direct injection in some cases

### File Uploads

**Configuration:**
- `nestjs-form-data` handles multipart/form-data
- `@FormDataRequest()` decorator on endpoints accepting file uploads
- Two implementations: `NodeFileUploadModule` (active) and `SupabaseStorageModule` (commented out)

### Pagination Patterns

**Common DTOs** (import from `src/common/dtos/`):
- `GetByIdDto` - Standard ID parameter validation
- `GetBySlugDto` - Slug parameter validation
- `OffsetBasePaginateDto` - Traditional offset/limit pagination
- `CursorBasePaginateDto` - Cursor-based pagination (for large datasets)
- `LanguageDto` - Language code validation

**Interface** (`src/common/interface/pagination/paginated.interface.ts`):
```typescript
interface IPaginated<Entity> {
  data: Entity[];
  total: number;
}
```

## Common Utilities and Interfaces

**Location:** `src/common/`

- **`dto/`** - Reusable DTOs for common operations ( GetById, GetBySlug, pagination, language)
- **`decorators/`** - Custom NestJS decorators (@Auth, @Public, @Permissions, @Valibot)
- **`guards/`** - Auth and permission guards
- **`enum/`** - Common enums (PermissionName, PermissionGroup, etc.)
- **`interface/`** - Shared TypeScript interfaces
- **`utils/`** - Utility functions (slug generation, date validation, image optimization)
- **`filters/`** - Global exception filters (ValibotExceptionsFilter)

## Key Configuration Files

- **`drizzle.config.ts`**: Database schema paths and credentials
- **`vitest.config.ts`**: Test configuration with SWC plugin and path aliases (`@src`, `@test`)
- **`nest-cli.json`**: NestJS compiler config with SWC builder
- **`tsconfig.json`**: TypeScript compiler options

## Domain Modules

**Primary domains:**
- `users/` - Authentication, roles, permissions, user management
- `registrations/` - Arrival/departure registrations, reporting
- `checkpoints/` - Border checkpoints, provinces, countries
- `news/` - News articles and categories
- `hotels/` - Hotel management and guest check-in
- `visa/` - Visa categories
- `banners/` - Hero banners and popups
- `feedback/` - User feedback system
- `laws/` - Legal information
- `services/` - Government services
- `nationality/` - Nationality management

## Important Patterns

### Translation Support
Many entities have translation tables (e.g., `news_translate`, `province_translate`) with fields:
- `id` - Foreign key to parent entity
- `lang` - Language code ('lo', 'en', 'zh_cn')
- `slug` - URL-friendly identifier
- Localized content fields (e.g., `name`, `description`)

### Error Handling
- Validation errors return Lao language messages
- Use `ConflictException` for duplicate data
- Use `NotFoundException` for missing resources
- Global exception filter formats all errors consistently

### Testing
- Unit tests: `**/*.spec.ts`
- E2E tests: `**/*.e2e-spec.ts`
- Test configuration: `vitest.config.ts` (handles both unit and e2e tests)
- Use Vitest with SWC for fast test execution

**Running specific tests:**
```bash
# Run a specific test file
pnpm run test path/to/file.spec.ts

# Run tests matching a pattern
pnpm run test -- --grep "test name"
```

## Deployment

**Production Server:** Ubuntu at 157.119.183.230
**Deploy Command:** `pnpm run deploy` - Copies `dist/` and `package.json` via SCP
**Server Path:** `/var/www/api.immigration.gov`
