# Component Library v1

## Purpose

This document defines the reusable UI component inventory expected for the PAPAIPAY Member Platform. It is a planning document only and does not create components.

## Component Architecture Principles

- Follow shadcn/ui style composition patterns.
- Prefer small, reusable primitives over large monolithic components.
- Keep role-specific behavior outside base primitives.
- Use TypeScript-friendly prop naming in future implementation.
- Keep visual language consistent across member and administrative portals.

## Foundation Components

- Button
- Icon Button
- Link Button
- Input
- Textarea
- Select
- Checkbox
- Radio Group
- Switch
- Label
- Form Field
- Field Error
- Date Picker
- Date Range Picker
- File Upload Placeholder
- Tooltip
- Popover
- Dialog
- Alert Dialog
- Drawer
- Sheet
- Tabs
- Accordion
- Separator
- Scroll Area
- Skeleton
- Spinner
- Empty State
- Error State

## Layout Components

- App Shell
- Role Sidebar
- Top Bar
- Page Header
- Section Header
- Content Card
- Metric Card Grid
- Detail Layout
- Split Pane Layout
- Right Rail
- Responsive Stack
- Breadcrumbs

## Navigation Components

- Sidebar Item
- Sidebar Group
- Sidebar Badge
- Top Bar Menu
- Profile Menu
- Notification Shortcut
- Global Search Placeholder
- Role Context Indicator

## Data Display Components

- Data Table
- Table Toolbar
- Table Pagination
- Table Bulk Actions
- Sort Control
- Filter Bar
- Filter Chip
- Status Badge
- Role Badge
- Health Badge
- Severity Badge
- Timeline
- Activity Feed
- Audit Event Row
- Document List
- Description List
- Key Value List

## Product Components

- Opportunity Card
- Opportunity Summary Panel
- Participation Summary Card
- Participation Status Timeline
- Project Card
- Project Milestone Timeline
- Project Update Card
- Distribution Summary Card
- Distribution Schedule Table
- Notification Item
- Announcement Card
- Report Card
- KYC Status Panel
- KYC Document Checklist
- Member Profile Summary
- Permission Matrix
- Role Summary Card
- Settings Section

## Feedback Components

- Alert
- Toast Placeholder
- Confirmation Dialog
- Inline Validation Message
- Permission Notice
- Publish Status Indicator
- Loading State
- Success State
- Warning State

## Chart and Reporting Placeholders

- Metric Trend Chart Placeholder
- Distribution Chart Placeholder
- Participation Funnel Placeholder
- Project Health Chart Placeholder
- Report Export Action Placeholder

## Component Naming Guidelines

- Use PascalCase for component names in future implementation.
- Use descriptive nouns, such as `OpportunityCard` and `DistributionSummaryCard`.
- Prefix role-specific components only when the component cannot be generalized.
- Keep shared components under a future shared UI area when implementation begins.
