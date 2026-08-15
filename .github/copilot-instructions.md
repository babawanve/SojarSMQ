# SojarSMQ Workspace Instructions

## Project Scope

This repository contains an Angular enterprise multi-tenant QMS prototype. Keep the application desktop-focused and enterprise-oriented. Do not add responsive breakpoints or responsive UI themes unless explicitly requested.

## Angular Structure

- Use the latest Angular version and standalone components.
- Declare `standalone: true` explicitly on routed standalone components to avoid runtime JIT compilation errors in browser bundles.
- Keep separate `.html`, `.ts`, and `.css` files for every component.
- Keep shared reusable UI under `src/app/shared/`.
- Keep backend/API boundary services under `src/app/services/`.
- Keep TypeScript domain models under `src/app/model/`.
- Use PascalCase for all domain model interface names and members across the application. Keep local component-only UI state in the existing style unless it is part of a model or DTO.
- Keep each main menu area in its own folder: `home`, `quality`, `documents`, `training`, `admin`, and `settings`.
- Keep nested menu pages inside the corresponding main-menu folder.
- Prefer existing Angular patterns and minimal focused changes.

## Visual Language

- Preserve the fixed desktop enterprise layout.
- Use FontAwesome icons for navigation, actions, folders, files, and status controls.
- Angular Material is allowed for functional controls such as slide toggles, but do not introduce a responsive theme.
- Keep the existing QMS Portal dashboard header, collapsible sidebar, nested accordion navigation, and top-right Logout action.
- Use separate CSS files and preserve existing CSS variables and visual conventions.
- Use meaningful icons for menu and grid actions, with accessible labels or tooltips.

## Authentication and Dashboard

- Login is the default route at `/`.
- Keep Login, Forgot Password, and Organization Registration as separate components.
- Authentication pages use a fixed 50/50 split layout with the image section on the left.
- The dashboard has a collapsible sidebar; the QMS Portal header text must remain visible when toggling.
- Logout actions navigate to `/login`.

## Document Explorer

The Documents feature must behave like a Windows File Explorer-style hierarchy.

- Use a normalized in-memory collection with a consistent `name` property and `parentId` relationships.
- Represent records as `type: 'Folder' | 'File'`.
- Root records use `parentId: null`.
- Use a shared injectable document service as the single source of truth.
- Keep the service API shaped for future HTTP replacement, but do not add .NET, Dapper, SQL, or backend code unless explicitly requested.
- Use dynamic routes such as `/dashboard/documents/folder/:folderId`; do not use a static SubFolders route.
- Show only direct children of the active folder.
- Folder names are links and navigate to their folder-specific route.
- Folder records display a folder icon; file records display a file icon.
- Support navigation at any nesting depth, including breadcrumbs, root navigation, and Up navigation.
- Adding a folder or file must use the current folder as `parentId`.
- The root Documents page is list/navigation only; do not reintroduce embedded Add Folder or Add Document dialogs there.
- Use lazy-loaded standalone routes for document workflows: `/dashboard/documents/add` for root files, `/dashboard/documents/add/folder/:folderId` for nested files, `/dashboard/documents/add-folder` for root folders, and `/dashboard/documents/add-folder/:documentId` for folder editing.
- Add Document must preserve the originating `parentId` and return to the originating folder list after save, cancel, or delete. Root workflows return to the root Documents list.
- Add Folder is a standalone workflow component. Nested folder pages may retain their native folder dialog, but must route file creation and file editing to the standalone Add Document workflow.
- New files are metadata-only for backend persistence until file storage is explicitly implemented, but the current prototype may retain selected `File` objects in the in-memory service for same-session edit/preview behavior.
- Add Document supports local browser previews for PDF/images, DOCX text extraction, and XLS/XLSX table extraction. Legacy `.doc` selection may be accepted but cannot be assumed browser-renderable without conversion.
- Keep file preview content in component-local state; do not place raw `File`, Blob, object URLs, or parser output into the domain model.
- Revoke browser object URLs when replacing files and when preview components are destroyed.
- Support Add Folder, Add Document, edit, delete, search, paging, and refresh in every folder view.
- All application data grids must support sortable column headers. Use ascending, descending, and reset-to-default states with a visible sort-direction icon; sort filtered records before pagination and keep sorting keyboard accessible.
- Use confirmation before deleting files and an explicit recursive warning before deleting folders with descendants.
- Keep the reusable explorer behavior consistent between the root Documents page and nested folder pages.

## Dialogs and Forms

- Use the standalone routed Add Document and Add Folder workflows for root and file operations. Use native HTML `<dialog>` only for the remaining nested folder form unless a different approach is explicitly requested.
- Use Angular Material slide toggles for Yes/No configuration fields.
- Preserve the expandable multi-line Document Types selector.
- Preserve Groups, Folder Designation, Folder Code, document type, status, and folder configuration fields.
- Reuse form logic where practical; avoid duplicating root and nested-folder implementations.

## Future Persistence Boundary

Future persistence may use a .NET Core Web API, Dapper, and a database. Prepare for that without implementing it now:

- Keep models stable and explicit.
- Keep `id`, `parentId`, `name`, `type`, status, metadata, timestamps, and future concurrency fields conceptually separate.
- Keep document mutations inside the Angular service boundary rather than directly inside templates.
- Do not store binary file content in the frontend document model.
- Keep file-specific metadata such as version, effective/expiration dates, change request, revision details, and tags explicit and optional in the document model so folder records remain compatible.
- Keep tenant context and authorization concerns out of client-only assumptions; future backend enforcement must be server-side.

## Validation

- Run `npm run build` after implementation changes.
- Resolve Angular template warnings as well as errors.
- Validate dynamic routes, nested folder navigation, add/edit/delete behavior, search, pagination, breadcrumbs, and invalid-folder states when changing Documents functionality.
- When changing lazy-loaded routes, perform a fresh browser runtime check in addition to the build; a clean build does not catch JIT/runtime route failures.
- When changing file preview or parsing, verify loading-overlay start/finish behavior, scrollability, zoom controls, object URL cleanup, and unsupported-file fallback.
- The root loading overlay is shared application infrastructure; use `LoadingService` for operations that visibly take time and always finish it in a `finally` path.
- Do not commit or create branches unless explicitly requested.
- Do not revert unrelated user changes.

## Repository

The expected Git remote is:

`https://github.com/babawanve/SojarSMQ.git`

Use the existing branch and repository configuration unless explicitly asked to change them.
