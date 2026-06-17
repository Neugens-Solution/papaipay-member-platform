# Portal Structure v1

## Purpose

This document defines the intended portal route map for planning purposes only. These routes must not be created until implementation work is explicitly approved.

## Route Principles

- Keep role areas clearly separated.
- Use predictable naming.
- Prefer nouns for top-level sections.
- Keep detail routes nested under their parent resource.
- Keep authentication routes separate from role portals.

## `/auth`

Planned authentication area:

- `/auth/sign-in`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-email`
- `/auth/mfa`
- `/auth/session-expired`

## `/member`

Planned member portal:

- `/member/dashboard`
- `/member/opportunities`
- `/member/opportunities/[opportunityId]`
- `/member/participations`
- `/member/participations/[participationId]`
- `/member/projects/active`
- `/member/projects/active/[projectId]`
- `/member/projects/completed`
- `/member/projects/completed/[projectId]`
- `/member/distributions`
- `/member/distributions/[distributionId]`
- `/member/notifications`
- `/member/announcements`
- `/member/profile`
- `/member/profile/kyc`
- `/member/reports`
- `/member/settings`

## `/admin`

Planned admin portal:

- `/admin/dashboard`
- `/admin/members`
- `/admin/members/[memberId]`
- `/admin/members/[memberId]/kyc`
- `/admin/opportunities`
- `/admin/opportunities/new`
- `/admin/opportunities/[opportunityId]`
- `/admin/participations`
- `/admin/participations/[participationId]`
- `/admin/projects/active`
- `/admin/projects/active/[projectId]`
- `/admin/projects/completed`
- `/admin/projects/completed/[projectId]`
- `/admin/distributions`
- `/admin/distributions/[distributionId]`
- `/admin/notifications`
- `/admin/announcements`
- `/admin/reports`
- `/admin/settings`

## `/manager`

Planned manager portal:

- `/manager/dashboard`
- `/manager/opportunities`
- `/manager/opportunities/[opportunityId]`
- `/manager/participations`
- `/manager/projects/active`
- `/manager/projects/active/[projectId]`
- `/manager/projects/completed`
- `/manager/projects/completed/[projectId]`
- `/manager/distributions`
- `/manager/announcements`
- `/manager/reports`
- `/manager/reports/opportunities`
- `/manager/reports/participations`
- `/manager/reports/projects`
- `/manager/reports/distributions`
- `/manager/team-activity`
- `/manager/settings`

## `/super-admin`

Planned super admin portal:

- `/super-admin/dashboard`
- `/super-admin/users`
- `/super-admin/users/[userId]`
- `/super-admin/roles`
- `/super-admin/roles/[roleId]`
- `/super-admin/permissions`
- `/super-admin/members`
- `/super-admin/opportunities`
- `/super-admin/participations`
- `/super-admin/projects`
- `/super-admin/distributions`
- `/super-admin/notifications`
- `/super-admin/announcements`
- `/super-admin/reports`
- `/super-admin/reports/governance`
- `/super-admin/audit-log`
- `/super-admin/settings`
