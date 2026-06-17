# UI Wireframe v1

## Purpose

This document describes planned page layouts and content sections by role. It does not create pages, components, or routes.

## Shared Layout Shell

- Sidebar navigation.
- Top bar with title and user controls.
- Main content area.
- Optional right rail for contextual details.
- Responsive stacking for smaller viewports.

## Member Pages

### Member Dashboard

- **Purpose**: Provide a personalized summary of member activity.
- **Layout Structure**: Header summary, metric cards, opportunity highlights, participation status list, project updates, distribution summary, announcements panel.
- **Components Required**: Metric card, opportunity card, status badge, project update card, distribution summary card, announcement list.
- **Data Required**: Member profile summary, open opportunities, participation counts, active project updates, distribution totals, unread announcements.

### Opportunities

- **Purpose**: Let members discover available opportunities.
- **Layout Structure**: Page header, filters, searchable opportunity grid, pagination, empty state.
- **Components Required**: Filter bar, search input, opportunity card, status badge, pagination control, empty state.
- **Data Required**: Opportunity title, summary, category, status, target dates, eligibility, participation availability.

### Opportunity Detail

- **Purpose**: Present complete opportunity information for member review.
- **Layout Structure**: Hero section, detail tabs, requirement summary, timeline, document list, participation call-to-action.
- **Components Required**: Detail header, tabs, timeline, document list, call-to-action panel, disclosure block.
- **Data Required**: Opportunity details, timeline, requirements, documents, risk summary, participation availability.

### My Participations

- **Purpose**: Show all member participation records.
- **Layout Structure**: Summary cards, filters, participation table, status details.
- **Components Required**: Metric card, filter bar, data table, status badge, detail drawer.
- **Data Required**: Participation records, related opportunities, submitted dates, amounts or units, statuses.

### Participation Detail

- **Purpose**: Show one participation record and lifecycle activity.
- **Layout Structure**: Detail header, status timeline, opportunity reference, documents, activity log.
- **Components Required**: Timeline, status badge, document list, activity log, summary card.
- **Data Required**: Participation metadata, status history, related opportunity, documents, activity records.

### Active Projects

- **Purpose**: Show member-related active projects.
- **Layout Structure**: Project cards, milestone indicators, distribution preview, update list.
- **Components Required**: Project card, progress indicator, milestone timeline, update card.
- **Data Required**: Active project records, milestones, member participation references, upcoming distributions.

### Completed Projects

- **Purpose**: Show historical completed projects.
- **Layout Structure**: Filterable project list, outcome summaries, final distribution indicators.
- **Components Required**: Data table, project summary card, status badge, date filter.
- **Data Required**: Completed project records, completion dates, outcomes, final distribution status.

### Distributions

- **Purpose**: Show distribution history and upcoming schedules.
- **Layout Structure**: Totals summary, upcoming distributions, distribution table, detail drawer.
- **Components Required**: Metric card, data table, status badge, detail drawer, date range filter.
- **Data Required**: Distribution amounts, dates, statuses, related projects, payment or channel summary.

### Notifications

- **Purpose**: Show member-specific notifications.
- **Layout Structure**: Notification list, unread filter, category filter, detail preview.
- **Components Required**: Notification item, filter chips, empty state, mark-read control.
- **Data Required**: Notification title, body, category, read status, created date.

### Announcements

- **Purpose**: Show published announcements visible to members.
- **Layout Structure**: Announcement list, pinned section, archive section.
- **Components Required**: Announcement card, pinned badge, date label, empty state.
- **Data Required**: Announcement title, body, audience, publish date, expiration date.

### Profile & KYC

- **Purpose**: Let members review profile information and KYC progress.
- **Layout Structure**: Profile summary, editable sections, KYC status panel, document checklist.
- **Components Required**: Form section, status badge, checklist, document upload placeholder, alert.
- **Data Required**: Member identity details, contact details, KYC status, required documents, verification notes.

### Reports

- **Purpose**: Provide downloadable or viewable member reports.
- **Layout Structure**: Report category cards, report table, date range selector.
- **Components Required**: Report card, data table, date range picker, export button placeholder.
- **Data Required**: Report names, categories, periods, generated dates, availability status.

### Settings

- **Purpose**: Manage member preferences.
- **Layout Structure**: Preference groups, notification settings, account settings.
- **Components Required**: Settings section, toggle, select, save action, confirmation alert.
- **Data Required**: Communication preferences, display preferences, account preference values.

## Admin Pages

### Admin Dashboard

- **Purpose**: Summarize operational workload.
- **Layout Structure**: Metrics, pending KYC queue, participation queue, recent activity, alerts.
- **Components Required**: Metric card, queue table, alert panel, activity feed.
- **Data Required**: Pending reviews, member counts, participation statuses, recent administrative activity.

### Members

- **Purpose**: Manage member records.
- **Layout Structure**: Search and filters, members table, bulk action area, detail drawer.
- **Components Required**: Data table, filter bar, search input, status badge, action menu.
- **Data Required**: Member names, member IDs, KYC status, account status, joined date, contact summary.

### KYC Reviews

- **Purpose**: Review and process KYC submissions.
- **Layout Structure**: Review queue, document preview area, decision panel, notes section.
- **Components Required**: Queue table, document preview placeholder, decision controls, notes field.
- **Data Required**: KYC submissions, documents, verification status, reviewer notes, decision history.

### Admin Opportunities

- **Purpose**: Manage opportunity records.
- **Layout Structure**: Opportunity table, status filters, create action, detail drawer.
- **Components Required**: Data table, filter bar, status badge, action menu, confirmation dialog.
- **Data Required**: Opportunity records, statuses, dates, participation counts, owner metadata.

### Admin Participations

- **Purpose**: Review and process participation records.
- **Layout Structure**: Queue metrics, participation table, status filters, detail drawer.
- **Components Required**: Metric card, data table, status badge, action menu, detail drawer.
- **Data Required**: Participation records, member references, opportunity references, amounts, statuses.

### Admin Projects

- **Purpose**: Monitor active and completed project records.
- **Layout Structure**: Project lists, milestone summary, update panel, status filters.
- **Components Required**: Project card, data table, milestone timeline, status badge.
- **Data Required**: Project records, milestones, updates, related opportunities, lifecycle status.

### Admin Distributions

- **Purpose**: Prepare and review distributions.
- **Layout Structure**: Distribution batches, schedule view, review table, exception panel.
- **Components Required**: Batch card, data table, status badge, date filter, alert panel.
- **Data Required**: Distribution records, amounts, statuses, scheduled dates, related members and projects.

### Admin Notifications

- **Purpose**: Create and monitor operational notifications.
- **Layout Structure**: Notification list, compose panel, audience selector, delivery status.
- **Components Required**: Data table, form panel, audience selector, status badge.
- **Data Required**: Notification templates, audiences, delivery status, created dates.

### Admin Announcements

- **Purpose**: Publish announcements to assigned audiences.
- **Layout Structure**: Announcement table, editor area, publish controls.
- **Components Required**: Data table, rich text placeholder, audience selector, publish status badge.
- **Data Required**: Announcement records, audiences, publish dates, expiration dates, authors.

### Admin Reports

- **Purpose**: Generate operational reports.
- **Layout Structure**: Report categories, generation controls, report history table.
- **Components Required**: Report card, date range picker, data table, export button placeholder.
- **Data Required**: Report definitions, generated files, periods, statuses.

### Admin Settings

- **Purpose**: Manage assigned operational settings.
- **Layout Structure**: Settings groups, permission notice, save controls.
- **Components Required**: Settings section, form controls, alert, save action.
- **Data Required**: Admin-configurable settings, permission boundaries, current values.

## Manager Pages

### Manager Dashboard

- **Purpose**: Show portfolio and operational performance.
- **Layout Structure**: Executive metrics, trend charts, project status overview, distribution overview, team workload.
- **Components Required**: Metric card, chart placeholder, project status card, workload table.
- **Data Required**: Opportunity metrics, participation metrics, project metrics, distribution metrics, team activity.

### Manager Opportunities

- **Purpose**: Oversee opportunity pipeline.
- **Layout Structure**: Pipeline summary, status board, opportunity table, approval queue.
- **Components Required**: Kanban-style board placeholder, data table, status badge, approval controls.
- **Data Required**: Opportunity statuses, approval needs, owner metadata, performance metrics.

### Manager Participations

- **Purpose**: Monitor participation performance.
- **Layout Structure**: Metrics, trend chart, participation table, conversion summary.
- **Components Required**: Metric card, chart placeholder, data table, status badge.
- **Data Required**: Participation counts, amounts, conversion stages, member segments.

### Manager Projects

- **Purpose**: Oversee active and completed project performance.
- **Layout Structure**: Project health summary, milestone board, project table, risk panel.
- **Components Required**: Health badge, milestone timeline, data table, alert panel.
- **Data Required**: Project statuses, milestone health, risk notes, completion summaries.

### Manager Distributions

- **Purpose**: Review distribution planning and execution.
- **Layout Structure**: Distribution summary, schedule table, exception list, approval panel.
- **Components Required**: Metric card, data table, status badge, approval controls.
- **Data Required**: Distribution totals, schedules, exceptions, approval status.

### Manager Announcements

- **Purpose**: Review and publish manager-level communications.
- **Layout Structure**: Draft list, published list, editor panel, audience controls.
- **Components Required**: Data table, editor placeholder, audience selector, status badge.
- **Data Required**: Announcement records, draft status, audiences, publish metadata.

### Manager Reports

- **Purpose**: Provide management reporting.
- **Layout Structure**: Report dashboard, category cards, filters, generated report history.
- **Components Required**: Report card, chart placeholder, date range picker, data table.
- **Data Required**: Report definitions, metrics, generated dates, export availability.

### Team Activity

- **Purpose**: Show admin workload and operational activity.
- **Layout Structure**: Team member list, activity feed, workload metrics, escalation panel.
- **Components Required**: User summary card, activity feed, metric card, alert panel.
- **Data Required**: Admin users, task counts, recent actions, escalations.

### Manager Settings

- **Purpose**: Configure team-level management preferences.
- **Layout Structure**: Preference sections, notification rules, report defaults.
- **Components Required**: Settings section, toggle, select, save action.
- **Data Required**: Manager settings, team defaults, notification preferences.

## Super Admin Pages

### Super Admin Dashboard

- **Purpose**: Show global platform governance and system overview.
- **Layout Structure**: Global metrics, system alerts, governance summary, audit activity.
- **Components Required**: Metric card, alert panel, audit feed, chart placeholder.
- **Data Required**: Platform-wide counts, alerts, audit events, governance metrics.

### Users

- **Purpose**: Manage administrative users.
- **Layout Structure**: User table, role filters, invite action, detail drawer.
- **Components Required**: Data table, role badge, action menu, invite form placeholder.
- **Data Required**: User records, assigned roles, account status, last activity.

### Roles

- **Purpose**: Manage role definitions.
- **Layout Structure**: Role list, permission summary, role detail panel.
- **Components Required**: Role card, permission matrix, status badge, action menu.
- **Data Required**: Role names, descriptions, permission assignments, user counts.

### Permissions

- **Purpose**: Configure module-level permission rules.
- **Layout Structure**: Permission matrix, module list, change summary panel.
- **Components Required**: Permission matrix, checkbox control, module selector, confirmation dialog.
- **Data Required**: Permission keys, modules, role assignments, change history.

### Super Admin Members

- **Purpose**: Provide global visibility into member records.
- **Layout Structure**: Search, filters, member table, governance indicators.
- **Components Required**: Data table, filter bar, status badge, detail drawer.
- **Data Required**: Member records, KYC status, account status, governance flags.

### Super Admin Platform Modules

- **Purpose**: Review global opportunity, participation, project, distribution, notification, and announcement activity.
- **Layout Structure**: Module summaries, global tables, status filters, audit references.
- **Components Required**: Metric card, data table, status badge, audit link placeholder.
- **Data Required**: Module records, statuses, ownership metadata, audit references.

### Governance Reports

- **Purpose**: Provide executive and compliance-oriented reporting.
- **Layout Structure**: Report categories, governance metrics, generated reports, export controls.
- **Components Required**: Report card, chart placeholder, data table, export button placeholder.
- **Data Required**: Governance report definitions, metrics, generated dates, availability status.

### Audit Log

- **Purpose**: Show platform-wide administrative activity.
- **Layout Structure**: Filter bar, audit event table, event detail drawer.
- **Components Required**: Filter bar, data table, severity badge, detail drawer.
- **Data Required**: Actor, action, target, timestamp, IP or session summary, severity.

### Super Admin Settings

- **Purpose**: Configure global platform settings.
- **Layout Structure**: Settings groups, risk notices, approval controls, save action.
- **Components Required**: Settings section, alert, form controls, confirmation dialog.
- **Data Required**: Global settings, current values, change history, required approvals.
