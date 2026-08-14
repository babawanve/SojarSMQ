$ErrorActionPreference = "Stop"

$components = @(
    "auth/login",
    "auth/forgot-password",
    "auth/register",
    "layout/dashboard",
    "layout/sidebar",
    "home",
    "quality/change-requests",
    "quality/manage",
    "quality/reports",
    "documents",
    "training/my-trainings",
    "training/manage-trainings",
    "training/instructor-trainings",
    "training/user-trainings/manage",
    "training/user-trainings/review",
    "training/reports",
    "admin/organization-configuration",
    "admin/user-management",
    "admin/reports",
    "settings/system-codes",
    "settings/schedules"
)

foreach ($comp in $components) {
    npx @angular/cli@latest g c $comp --skip-tests
}
