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
pnpm run build              # Compile to dist/ with SWC (does NOT type-check)
pnpm exec tsc --noEmit -p tsconfig.build.json   # Type-check (excludes specs)

# Testing
pnpm run test               # Run all tests with Vitest
pnpm run test:e2e           # Broken: vitest.config.e2e.ts does not exist
pnpm run test:cov           # Generate test coverage
pnpm run test:watch         # Run tests in watch mode

# Database operations (Drizzle ORM, drizzle-kit 0.20 syntax; reads .env)
pnpm run drizzle:generate   # Generate SQL migrations into drizzle/
pnpm run drizzle:push       # Push schema changes to the configured database
pnpm run drizzle:seed       # Run seeds from dist/ (build first)

# Production
pnpm run start:prod         # Run production build
pnpm run deploy             # Deploy via SCP to production server

# Code quality
pnpm run lint               # ESLint — runs with --fix, so it rewrites files
pnpm run format             # Format with Prettier
```

**Known baselines (verify before attributing failures to your change):**
- `tsc --noEmit -p tsconfig.build.json` reports 3 pre-existing errors (`checkpoint/queries/handlers/get-all.ts`, `arrival-registration.repository.ts`, `seed/provinces/province-translate-seed.ts`). TS is loosely configured (`strictNullChecks: false`, `noImplicitAny: false`).
- `src/infrastructure/drizzle/drizzle.service.spec.ts` needs a live database and fails without one; the interceptor specs are pure unit tests.
- If `pnpm run …` aborts with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` (pnpm's deps check wants to reinstall `node_modules`), call the binaries directly instead, e.g. `./node_modules/.bin/vitest run`. Both `pnpm-lock.yaml` and `package-lock.json` exist; pnpm is what CI uses.

## Workspace rules

This package sits inside the `immigration-admin/` workspace, whose `AGENTS.md` (loaded via the parent `CLAUDE.md`) governs work here: non-trivial changes need an approved OpenSpec change under `../openspec/`, and commit, push, and deploy each need explicit human authorization. Pushing to `main` is itself a deploy — `.github/workflows/deploy-uat.yml` builds and rsyncs to the server and restarts it with pm2.

## Architecture

### CQRS Pattern Implementation

The codebase strictly separates write and read operations using NestJS CQRS:

**Commands (Write Operations):**
- Located in `modules/*/*/commands/*.command.ts` or `modules/*/commands/impl/*.command.ts`
- Handlers in `modules/*/*/commands/*.handler.ts` or `modules/*/commands/handlers/*.handler.ts`
- Executed via `CommandBus.execute(new SomeCommand(input))`

**Queries (Read Operations):**
- Located in `modules/*/*/queries/*.query.ts` or `modules/*/queries/impl/*.query.ts`
- Handlers in `modules/*/*/queries/*.handler.ts` or `modules/*/queries/handlers/*.handler.ts`
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

The codebase has **two organizational patterns**:

**Pattern A: Simple modules** with commands/queries at the module level:
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
├── dto/                # Valibot validation schemas (note: some use "dtos")
├── {domain}.controller.ts
└── {domain}.module.ts
```

**Pattern B: Nested sub-modules** (for complex domains):
```
modules/{parent-domain}/
├── {child-domain}/
│   ├── commands/
│   ├── queries/
│   ├── repositories/
│   ├── dto/            # May also be "dtos"
│   └── {child}.controller.ts
└── {parent-domain}.module.ts
```

**Examples:**
- `news/news/` and `news/category/` - Nested sub-modules
- `registrations/arrival/` and `registrations/departure/` - Nested sub-modules
- `users/auth/`, `users/roles/`, `users/users/` - Nested sub-modules

**Important Notes:**
- Some modules use `dto/` (singular), others use `dtos/` (plural) - follow the existing pattern
- Some modules use `handler` (singular) instead of `handlers` for query/command handlers
- There is a typo in `users/roles/quries` (should be `queries`)
- **Handler file naming**: Most handlers use `.handler.ts` but some (notably in `news/` module) use `.repository.ts` for query handlers
- **Handler export patterns**: Handlers are exported via `index.ts` files. Two patterns exist:
  - `export default const Handlers = [Handler1, Handler2, ...]` - imported without brackets
  - `export const handlers: Provider[] = [Handler1, Handler2, ...]` - imported with spread operator

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

### Infrastructure Layer

**Location:** `src/infrastructure/`

The infrastructure layer contains cross-cutting concerns and external service integrations:

- **`drizzle/`** - Database connection and service (DrizzleService, DrizzleModule)
- **`file-upload/`** - File upload abstraction with multiple implementations:
  - `NodeFileUploadModule` (active) - Local filesystem storage
  - `SupabaseStorageModule` (available but commented out) - Supabase cloud storage
  - `file-upload.interface.ts` - Interface for file upload implementations
  - `inject-key.ts` - Injection token for file upload services

**File Upload Abstraction:**
```typescript
// Interface definition in file-upload.interface.ts
export interface IFileUpload {
  upload(file: Express.Multer.File): Promise<string>;
  delete(url: string): Promise<void>;
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
4. **Google reCAPTCHA**: `RecaptchaGuard` for bot prevention on sensitive endpoints

**Guard Execution Order:** Guards are applied in the order they are registered in `app.module.ts`: ThrottlerGuard → AuthGuard → PermissionsGuard

**Decorators:**
- `@Public()` - Bypass authentication (e.g., login endpoint)
- `@Auth()` - Access JWT payload (returns `IJwtPayload`)
- `@Permissions(PermissionGroup.News, PermissionName.Write)` - Require specific permissions
- `@Recaptcha()` - Require Google reCAPTCHA validation

**Session Management:**
- JWT tokens contain `token_id` referencing `sessions` table
- Sessions are validated on each request
- Logout deletes session from database

### Request Context & Interceptors

- **Module**: `RequestContextModule` from `nestjs-request-context`
- **Interceptor**: `MergeDrizzleToReqInterceptor` injects `DrizzleService` into request object
- **Usage**: Access database via `req.drizzle` instead of direct injection in some cases

**MergeParamToBodyInterceptor:**
- Merges route parameters into the request body: `req.body = { ...req.params, ...req.body }`
- Useful when PUT/PATCH endpoints need both URL params and body fields validated together with Valibot

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

- **`dto/`** - Reusable DTOs for common operations (GetById, GetBySlug, pagination, language)
- **`decorators/`** - Custom NestJS decorators (@Auth, @Public, @Permissions, @Recaptcha, @Valibot)
- **`guards/`** - Auth and permission guards
- **`enum/`** - Common enums (PermissionName, PermissionGroup, DateTimeFormat, etc.)
- **`interface/`** - Shared TypeScript interfaces
- **`utils/`** - Utility functions:
  - `generate-slug.ts` - URL slug generation
  - `image-optimize.util.ts` - Image processing with Sharp
  - `generate-code.util.ts` / `generate-verify-code.ts` - Code generation and verification
  - `check-date.util.ts` / `validate-date.ts` - Date validation
  - `english-only.ts` - Language filtering
- **`filters/`** - Global exception filters (ValibotExceptionsFilter)
- **`google-recaptcha/`** - Google reCAPTCHA integration

## Key Configuration Files

- **`drizzle.config.ts`**: Database schema paths and credentials
- **`vitest.config.ts`**: Test configuration with SWC plugin and path aliases (`@src`, `@test`)
- **`nest-cli.json`**: NestJS compiler config with SWC builder
- **`tsconfig.json`**: TypeScript compiler options

## Environment Configuration

**Required Environment Variables** (see `src/common/interface/env.interface.ts`):
- `DB_HOST` - MySQL database host
- `DB_USER` - MySQL database user
- `DB_PASS` - MySQL database password
- `DB_DATABASE` - MySQL database name
- `REDIS_URL` - Redis connection URL
- `JWT_SECRET` - JWT signing secret

**Additional Configuration:**
- `PORT` - Application port (defaults to 3000 if not specified)

**Static File Serving:**
- Files are served from `client/` directory at `/client` route
- The `client/` directory is automatically created on startup if it doesn't exist

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
- `contacts/` - Contact information management
- `files_and_directories/` - File and directory management

**Module Barrel Exports:**
Parent domains with sub-modules use barrel exports for cleaner imports:
```typescript
// Example from registrations/index.ts
export const registrationModules = [
  ArrivalRegistrationModule,
  DepartureRegistrationModule,
  NoOfRegisterModule,
  NoOfTouristsModule,
  VisitorModule,
];
```

## Database Seeding

**Location:** `src/seed/`

The seed directory contains scripts to populate the database with initial data:
- `provinces/` - Province and province translation seeds
- `user/` - Default user, roles, and permissions seeds
- `main.ts` - Entry point for seed execution

**Running seeds:**
```bash
pnpm run build          # First build the project
pnpm run drizzle:seed   # Run all seed scripts
```

The default-user seed requires `SEED_DEV_PASSWORD` and `SEED_ADMIN_PASSWORD` in the environment and aborts without them. Never hard-code credentials in seeds.

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

**Note:** The `test:e2e` script references `vitest.config.e2e.ts`, which does not exist, so the script fails. The main `vitest.config.ts` already includes `*.e2e-spec.ts`, so `pnpm run test` runs those too.

**Running specific tests:**
```bash
# Run a specific test file (or every spec under a directory)
pnpm run test src/common/interceptor/merge-param-to-body

# Run tests whose name matches a pattern (Vitest uses -t, not --grep)
pnpm run test -t "test name"
```

## Deployment

**Production Server:** Ubuntu at 157.119.183.230
**Deploy Command:** `pnpm run deploy` - Copies `dist/` and `package.json` via SCP
**Server Path:** `/var/www/api.immigration.gov`

**CI deploy:** every push to `main` runs `.github/workflows/deploy-uat.yml`, which builds, rsyncs the repo (excluding `client/`, `.env*`, `node_modules`) to `/var/www/admin.immigration.gov/`, writes `.env` from secrets, and runs `pm2 restart api`.
