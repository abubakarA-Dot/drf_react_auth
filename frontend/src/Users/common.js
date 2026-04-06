export const ROLES = [
    {
        id: "SU",
        label: "Superuser",
        description: "Full access to everything in the platform.",
        permissions: [
            { id: "manage_users",       label: "Manage Users",         description: "Create, edit, and delete user accounts." },
            { id: "manage_roles",       label: "Manage Roles",         description: "Assign and revoke roles across the platform." },
            { id: "view_audit_logs",    label: "View Audit Logs",      description: "Access full audit trail of all actions." },
            { id: "system_settings",    label: "System Settings",      description: "Modify global platform configuration." },
        ],
    },
    {
        id: "MG",
        label: "Manager",
        description: "Manages platform operations and team members.",
        permissions: [
            { id: "view_reports",       label: "View Reports",         description: "Access operational and performance reports." },
            { id: "manage_orders",      label: "Manage Orders",        description: "View, assign, and cancel orders." },
            { id: "manage_riders",      label: "Manage Riders",        description: "Assign and monitor rider activity." },
            { id: "manage_zones",       label: "Manage Zones",         description: "Configure delivery zones and coverage areas." },
        ],
    },
    {
        id: "AC",
        label: "Accountant",
        description: "Handles financial records and reports.",
        permissions: [
            { id: "view_financials",    label: "View Financials",      description: "Access revenue, payout, and transaction data." },
            { id: "export_reports",     label: "Export Reports",       description: "Download financial statements and CSV exports." },
            { id: "manage_payouts",     label: "Manage Payouts",       description: "Process and approve rider or vendor payouts." },
            { id: "view_invoices",      label: "View Invoices",        description: "Access all invoice records across the platform." },
        ],
    },
    {
        id: "RD",
        label: "Rider",
        description: "Can accept or reject orders and deliver them.",
        permissions: [
            { id: "view_assigned_orders",  label: "View Assigned Orders",  description: "See orders assigned to this rider." },
            { id: "update_order_status",   label: "Update Order Status",   description: "Mark orders as picked up or delivered." },
            { id: "view_earnings",         label: "View Earnings",         description: "Access personal earnings and history." },
            { id: "contact_support",       label: "Contact Support",       description: "Raise issues directly with customer support." },
        ],
    },
    {
        id: "CS",
        label: "Customer Support",
        description: "Manages customer inquiries and support tickets.",
        permissions: [
            { id: "view_orders",        label: "View Orders",          description: "Look up any order by ID or customer." },
            { id: "issue_refunds",      label: "Issue Refunds",        description: "Process full or partial refunds." },
            { id: "manage_tickets",     label: "Manage Tickets",       description: "Open, update, and close support tickets." },
            { id: "contact_riders",     label: "Contact Riders",       description: "Send messages to riders regarding active orders." },
        ],
    },
];