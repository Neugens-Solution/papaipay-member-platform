# Mock Data Specification v1

## Purpose

This document defines mock data structures needed for future prototyping and UI validation. It is not a database schema, API contract, or backend implementation.

## Common Conventions

- Use stable string IDs in mock data.
- Use ISO 8601 date strings for dates.
- Use explicit status strings.
- Use nullable fields only when the planned UI requires absent data states.
- Include created and updated timestamps where useful for audit-oriented UI.

## Members

Required fields:

- `id`
- `memberNumber`
- `firstName`
- `lastName`
- `email`
- `phone`
- `accountStatus`
- `kycStatus`
- `joinedAt`
- `lastLoginAt`
- `addressSummary`
- `communicationPreferences`
- `createdAt`
- `updatedAt`

Suggested statuses:

- `active`
- `pending`
- `suspended`
- `closed`

Suggested KYC statuses:

- `not_started`
- `in_progress`
- `submitted`
- `approved`
- `rejected`
- `needs_information`

## Opportunities

Required fields:

- `id`
- `title`
- `summary`
- `category`
- `status`
- `eligibilitySummary`
- `targetAmount`
- `minimumParticipationAmount`
- `openDate`
- `closeDate`
- `expectedProjectStartDate`
- `riskSummary`
- `documentIds`
- `createdAt`
- `updatedAt`

Suggested statuses:

- `draft`
- `review`
- `open`
- `closed`
- `archived`

## Participations

Required fields:

- `id`
- `memberId`
- `opportunityId`
- `projectId`
- `amount`
- `units`
- `status`
- `submittedAt`
- `reviewedAt`
- `reviewedByUserId`
- `notes`
- `createdAt`
- `updatedAt`

Suggested statuses:

- `draft`
- `submitted`
- `under_review`
- `approved`
- `rejected`
- `cancelled`
- `converted_to_project`

## Projects

Required fields:

- `id`
- `opportunityId`
- `title`
- `summary`
- `status`
- `healthStatus`
- `startDate`
- `targetCompletionDate`
- `completedAt`
- `milestones`
- `updates`
- `managerUserId`
- `createdAt`
- `updatedAt`

Milestone fields:

- `id`
- `title`
- `status`
- `dueDate`
- `completedAt`

Suggested project statuses:

- `planned`
- `active`
- `paused`
- `completed`
- `archived`

Suggested health statuses:

- `on_track`
- `at_risk`
- `delayed`
- `complete`

## Distributions

Required fields:

- `id`
- `memberId`
- `projectId`
- `participationId`
- `amount`
- `currency`
- `status`
- `scheduledDate`
- `paidDate`
- `methodSummary`
- `referenceNumber`
- `createdAt`
- `updatedAt`

Suggested statuses:

- `scheduled`
- `processing`
- `paid`
- `failed`
- `cancelled`

## Notifications

Required fields:

- `id`
- `recipientUserId`
- `recipientRole`
- `title`
- `body`
- `category`
- `readStatus`
- `actionUrl`
- `createdAt`
- `readAt`

Suggested categories:

- `opportunity`
- `participation`
- `project`
- `distribution`
- `kyc`
- `announcement`
- `system`

## Announcements

Required fields:

- `id`
- `title`
- `body`
- `audienceRoles`
- `status`
- `pinned`
- `publishedAt`
- `expiresAt`
- `authorUserId`
- `createdAt`
- `updatedAt`

Suggested statuses:

- `draft`
- `scheduled`
- `published`
- `expired`
- `archived`

## Reports

Required fields:

- `id`
- `name`
- `description`
- `category`
- `audienceRoles`
- `periodStart`
- `periodEnd`
- `status`
- `generatedAt`
- `generatedByUserId`
- `downloadUrl`
- `createdAt`

Suggested categories:

- `member`
- `opportunity`
- `participation`
- `project`
- `distribution`
- `kyc`
- `operational`
- `governance`

Suggested statuses:

- `available`
- `generating`
- `failed`
- `expired`

## Settings

Required fields:

- `id`
- `scope`
- `scopeId`
- `key`
- `label`
- `description`
- `valueType`
- `value`
- `defaultValue`
- `editableByRoles`
- `updatedByUserId`
- `createdAt`
- `updatedAt`

Suggested scopes:

- `user`
- `role`
- `team`
- `platform`

Suggested value types:

- `string`
- `number`
- `boolean`
- `select`
- `multi_select`
- `json`
