# SojarSMQ Workspace Instructions

## Project Scope

This repository contains an Angular enterprise multi-tenant QMS prototype. Keep the application desktop-focused and enterprise-oriented. Do not add responsive breakpoints or responsive UI themes unless explicitly requested.

## Angular Structure

- Use the latest Angular version and standalone components.
- Keep separate `.html`, `.ts`, and `.css` files for every component.
- Keep shared reusable UI under `src/app/shared/`.
- Keep backend/API boundary services under `src/app/services/`.
- Keep TypeScript domain models under `src/app/model/`.
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
- New files are metadata-only until file storage is explicitly implemented.
- Support Add Folder, Add Document, edit, delete, search, paging, and refresh in every folder view.
- Use confirmation before deleting files and an explicit recursive warning before deleting folders with descendants.
- Keep the reusable explorer behavior consistent between the root Documents page and nested folder pages.

## Dialogs and Forms

- Use native HTML `<dialog>` for Add/Edit folder and file forms unless a different approach is explicitly requested.
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
- Keep tenant context and authorization concerns out of client-only assumptions; future backend enforcement must be server-side.

## Validation

- Run `npm run build` after implementation changes.
- Resolve Angular template warnings as well as errors.
- Validate dynamic routes, nested folder navigation, add/edit/delete behavior, search, pagination, breadcrumbs, and invalid-folder states when changing Documents functionality.
- Do not commit or create branches unless explicitly requested.
- Do not revert unrelated user changes.

## Repository

The expected Git remote is:

`https://github.com/babawanve/SojarSMQ.git`

Use the existing branch and repository configuration unless explicitly asked to change them.
