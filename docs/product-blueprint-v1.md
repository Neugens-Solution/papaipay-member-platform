# Product Blueprint v1

## Purpose

This blueprint defines the initial product model for the PAPAIPAY Member Platform. It is a planning document only and does not define implementation details, database schema, API contracts, authentication logic, or application routes.

## Roles

### Member

Members are end users who participate in platform opportunities and monitor their related activity.

#### Member Capabilities

- View available opportunities.
- Review opportunity summaries, requirements, timelines, and status.
- Submit or track participation interest.
- View active project status for accepted participations.
- View completed projects and historical outcomes.
- View distribution records and expected distribution schedules.
- Receive notifications about platform activity.
- Read announcements published by authorized staff.
- Manage profile information.
- Submit and monitor KYC information.
- Access member-facing reports and statements.
- Manage basic account settings and communication preferences.

### Admin

Admins operate the daily administrative workflows of the platform.

#### Admin Capabilities

- View and manage member records.
- Review member profile and KYC status.
- Create, edit, and archive opportunities when permitted.
- Review and process participations.
- Monitor active and completed project records.
- Prepare and review distribution records.
- Publish notifications and announcements within assigned permissions.
- Generate operational reports.
- Manage routine platform settings assigned to the admin role.

### Manager

Managers oversee operational performance and portfolio-level activity.

#### Manager Capabilities

- Review opportunity pipeline and performance.
- Approve or reject opportunity updates when workflow requires approval.
- Monitor participation volume and conversion.
- Oversee active and completed project performance.
- Review distribution planning and execution summaries.
- Publish manager-level announcements.
- Access management reports and dashboards.
- Review admin activity and operational workload.
- Configure team-level settings within assigned scope.

### Super Admin

Super Admins govern the entire platform.

#### Super Admin Capabilities

- Manage all roles and permissions.
- Manage administrative users.
- Configure global platform settings.
- Review audit activity and governance reports.
- Access all platform modules.
- Define permission boundaries for Admins and Managers.
- Control system-level announcement and notification settings.
- Approve high-impact operational changes when required.

## Core Platform Areas

### Opportunities

Opportunities represent available offerings that members may review and potentially join.

Key information:

- Opportunity title and summary.
- Opportunity status.
- Eligibility requirements.
- Target participation window.
- Funding or allocation targets.
- Risk and disclosure summary.
- Related project category.
- Supporting documents.

### Participations

Participations represent a member's interest, commitment, or accepted involvement in an opportunity.

Key information:

- Member reference.
- Opportunity reference.
- Participation amount or unit detail.
- Participation status.
- Submission date.
- Approval or rejection metadata.
- Related project reference when converted.

### Projects

Projects represent opportunities that have moved into an active or completed lifecycle.

#### Active Projects

- Show ongoing status.
- Track milestones.
- Track member participation relevance.
- Display expected distribution timing.
- Provide project updates and manager commentary.

#### Completed Projects

- Show completion date.
- Display outcome summary.
- Provide final distribution status.
- Archive related reporting and documents.

### Distributions

Distributions represent payment, return, credit, or benefit events associated with member participations or projects.

Key information:

- Distribution reference.
- Member reference.
- Project or opportunity reference.
- Amount.
- Status.
- Scheduled date.
- Paid date.
- Method or channel summary.

### Notifications

Notifications deliver targeted platform messages to users.

Notification types:

- Opportunity updates.
- Participation status changes.
- Project milestone updates.
- Distribution notices.
- KYC reminders.
- Administrative alerts.
- System notices.

### Announcements

Announcements are broadcast messages published to role-specific or platform-wide audiences.

Announcement attributes:

- Title.
- Audience.
- Body.
- Publish status.
- Publish date.
- Expiration date.
- Author role.

### Reports

Reports provide structured visibility into member activity, platform operations, project performance, and governance.

Report categories:

- Member reports.
- Participation reports.
- Opportunity reports.
- Project reports.
- Distribution reports.
- KYC reports.
- Operational reports.
- Governance reports.

### Settings

Settings define configurable preferences and platform controls.

Settings categories:

- Account preferences.
- Notification preferences.
- Platform display settings.
- Operational settings.
- Report settings.
- Security and governance settings.

### Roles & Permissions

Roles and permissions define access boundaries for every platform area.

Permission concepts:

- Module access.
- Read permission.
- Create permission.
- Update permission.
- Delete or archive permission.
- Approval permission.
- Publishing permission.
- Export permission.
- Administrative delegation.
