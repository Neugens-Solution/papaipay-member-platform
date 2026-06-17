# PAPAIPAY Member Platform

PAPAIPAY Member Platform is a greenfield portal foundation for managing member-facing investment-style opportunities, participations, project lifecycle tracking, distributions, announcements, notifications, profiles, KYC workflows, reporting, settings, and role-based administration.

This repository currently contains documentation only. It defines the intended product architecture, portal structure, navigation model, UI planning, reusable component expectations, mock data contracts, and Codex contribution rules before implementation begins.

## Platform Overview

The platform is intended to support secure, role-aware workflows across member, operational, management, and executive administration experiences. The initial documentation foundation establishes the boundaries for future Next.js implementation without creating application routes, pages, components, backend services, database schemas, API endpoints, or authentication logic.

## Roles

- **Members**: Review opportunities, track participations, monitor projects, receive distributions, manage profile and KYC information, and view notifications and announcements.
- **Admins**: Operate daily platform workflows, manage member records, review KYC status, publish announcements, monitor participations, and support reporting tasks.
- **Managers**: Oversee portfolios, projects, distributions, reports, announcements, and operational performance.
- **Super Admins**: Manage global platform settings, roles, permissions, administrative users, audit visibility, and organization-wide governance.

## Core Modules

- Opportunities
- Participations
- Active Projects
- Completed Projects
- Distributions
- Notifications
- Announcements
- Member Profile & KYC
- Reports
- Settings
- Roles & Permissions

## Technology Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Architecture**: shadcn/ui style architecture

## Repository Principles

- Documentation comes before implementation.
- Product scope must be defined before application pages, routes, services, schemas, or APIs are created.
- Features should be isolated and introduced through small, reviewable pull requests.
- Naming conventions must remain consistent across documentation and future code.
- Build and quality verification should be completed before merging implementation changes.
- Direct commits to `main` are not allowed.

## Documentation Index

- [Product Blueprint](docs/product-blueprint-v1.md)
- [Portal Structure](docs/portal-structure-v1.md)
- [Navigation](docs/navigation-v1.md)
- [UI Wireframe](docs/ui-wireframe-v1.md)
- [Component Library](docs/component-library-v1.md)
- [Mock Data Specification](docs/mock-data-spec-v1.md)
- [Codex Rules](docs/codex-rules.md)
