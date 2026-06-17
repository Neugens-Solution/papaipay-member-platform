# Codex Rules

## Purpose

These rules guide Codex contributions for the PAPAIPAY Member Platform repository.

## Documentation-First Approach

- Start with documentation for new product areas.
- Do not create application pages, routes, components, services, schemas, API endpoints, or authentication logic until the relevant documentation exists and the implementation scope is approved.
- Keep planning documents clear, versioned, and easy to review.
- Update documentation when product decisions change.

## Small Pull Requests

- Keep pull requests focused on one concern.
- Prefer small, reviewable changes over large multi-feature submissions.
- Avoid mixing documentation, UI, backend, and infrastructure changes unless explicitly requested.
- Include a concise summary and validation notes in every pull request.

## Feature Isolation

- Keep each feature area isolated during implementation.
- Do not introduce shared abstractions before at least two real use cases exist.
- Keep member, admin, manager, and super admin concerns clearly separated unless a shared primitive is intentional.
- Avoid cross-feature side effects.

## Branch and Commit Rules

- Do not commit directly to `main`.
- Use descriptive branch names for feature work.
- Use clear commit messages that describe the intent of the change.
- Keep commits coherent and scoped.

## Build Verification Before Merge

- Run relevant build, type, lint, and test checks before merge when implementation code exists.
- Document any skipped checks and the reason.
- Do not merge changes with known failing checks unless the failure is documented and explicitly accepted.

## Naming Conventions

- Use clear, descriptive names.
- Use kebab-case for documentation file names.
- Use PascalCase for future component names.
- Use camelCase for future TypeScript variables and object fields.
- Use role names consistently: Member, Admin, Manager, Super Admin.
- Use module names consistently: Opportunities, Participations, Projects, Distributions, Notifications, Announcements, Reports, Settings, Roles & Permissions.

## Greenfield Boundary

- Treat this repository as a new project.
- Do not copy, migrate, reference, or reuse code, routes, components, documents, structures, naming conventions, or assumptions from previous repositories.
- Base decisions only on requirements documented in this repository and approved future work.
