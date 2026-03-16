/**
 * NovaTech Support — Demo Knowledge Base
 * Rich seed data for SmartDesk portfolio demo.
 * Combined from: NovaTech-FAQ.txt, NovaTech-Returns-Policy.txt, NovaTech-Product-Guide.txt
 */

export const SEED_DOCS = [
  {
    sourceFile: "NovaTech-FAQ.txt",
    content: `NovaTech Support — Frequently Asked Questions

Q: What is NovaTech?
A: NovaTech is a project management and team collaboration platform designed for small to mid-size businesses. It combines task boards, time tracking, document sharing, and real-time messaging into a single workspace.

Q: How much does NovaTech cost?
A: NovaTech offers three pricing tiers:
- Starter: $12/user/month (up to 10 users, 5GB storage)
- Professional: $29/user/month (unlimited users, 50GB storage, advanced analytics)
- Enterprise: $59/user/month (unlimited everything, SSO, priority support, custom integrations)
All plans include a 14-day free trial with no credit card required.

Q: Can I try NovaTech before buying?
A: Yes. Every plan includes a 14-day free trial. No credit card is needed to start. You get full access to all features during the trial period.

Q: What integrations does NovaTech support?
A: NovaTech integrates with Slack, Google Workspace, Microsoft 365, GitHub, Jira, Figma, Zapier, and over 50 other tools via our API. Custom integrations are available on the Enterprise plan.

Q: How do I invite team members?
A: Go to Settings → Team → Invite Members. Enter their email addresses and select a role (Admin, Editor, or Viewer). They will receive an email invitation and can join immediately.

Q: What is the maximum file upload size?
A: Individual files can be up to 100MB. On the Starter plan, total storage is 5GB per workspace. Professional plan includes 50GB, and Enterprise has unlimited storage.

Q: Does NovaTech have a mobile app?
A: Yes. NovaTech has native apps for iOS and Android, available on the App Store and Google Play. The mobile app supports all core features including task management, messaging, and file access.

Q: How does time tracking work?
A: Each task has a built-in timer. Click the clock icon on any task to start tracking. You can also manually log hours. Time reports can be exported as CSV or viewed in the Analytics dashboard.

Q: Can I create custom workflows?
A: Yes. On the Professional and Enterprise plans, you can create custom task statuses, automated workflows, and trigger-based actions. For example, automatically assign a reviewer when a task moves to "In Review."

Q: Is my data secure?
A: NovaTech uses AES-256 encryption at rest and TLS 1.3 for data in transit. We are SOC 2 Type II certified and GDPR compliant. Enterprise customers can also enable data residency controls to keep data in specific regions.

Q: How do I contact support?
A: Starter and Professional users can reach support via email at support@novatech.io (response within 24 hours). Enterprise users get a dedicated Slack channel with 2-hour response SLA and a named account manager.

Q: Can I export my data?
A: Yes. Go to Settings → Data → Export. You can export all projects, tasks, messages, and files as a ZIP archive. Data exports are available on all plans.

Q: What happens when my trial ends?
A: Your workspace data is preserved for 30 days after the trial ends. You can upgrade to a paid plan anytime during that period to continue without losing anything. After 30 days, inactive trial workspaces are deleted.

Q: Does NovaTech support single sign-on (SSO)?
A: SSO via SAML 2.0 is available on the Enterprise plan. We support Okta, Azure AD, Google Workspace, and OneLogin. Contact our sales team to configure SSO for your organization.

Q: Can I use NovaTech for client projects?
A: Yes. You can create guest accounts with limited access. Guests can view and comment on specific projects without seeing your internal workspace. Guest seats are free on all plans.`,
  },
  {
    sourceFile: "NovaTech-Returns-Policy.txt",
    content: `NovaTech — Returns & Cancellation Policy

1. Free Trial Cancellation
You can cancel your free trial at any time with no charge. Simply go to Settings → Billing → Cancel Trial. No reason required, and your data will be preserved for 30 days in case you change your mind.

2. Monthly Plan Cancellation
Monthly subscriptions can be cancelled at any time. When you cancel:
- Your plan remains active until the end of the current billing cycle.
- You will not be charged for the next month.
- All your data (projects, tasks, files) is preserved for 30 days after cancellation.
- After 30 days, your workspace and all associated data are permanently deleted.

3. Annual Plan Cancellation
Annual subscriptions can be cancelled with a prorated refund for unused months:
- If you cancel within the first 30 days, you receive a full refund.
- After 30 days, your refund is calculated as: (remaining full months ÷ 12) × annual price.
- Partial months are not refunded.
- To request an annual plan refund, email billing@novatech.io with your workspace ID.

4. Refund Processing
All refunds are processed within 5-10 business days and returned to the original payment method. Credit card refunds may take an additional 1-3 business days to appear on your statement.

5. Downgrading Plans
You can downgrade from Enterprise to Professional, or from Professional to Starter, at any time:
- The downgrade takes effect at the start of your next billing cycle.
- Features exclusive to your current plan will become unavailable after the downgrade.
- Your data is never deleted during a downgrade, but storage limits of the new plan apply. If you exceed the new plan's storage limit, you will need to remove files before the downgrade activates.

6. Account Deletion
To permanently delete your account and all associated data, go to Settings → Account → Delete Account. This action is irreversible. We recommend exporting your data first (Settings → Data → Export).

7. Dispute Resolution
If you believe you were incorrectly charged, contact billing@novatech.io within 60 days of the charge. Include your workspace ID, the charge amount, and the date. We respond to all billing disputes within 2 business days.

8. Enterprise Contract Terms
Enterprise customers on custom contracts should refer to their Master Service Agreement (MSA) for cancellation and refund terms. Standard policies above do not apply to custom enterprise agreements.`,
  },
  {
    sourceFile: "NovaTech-Product-Guide.txt",
    content: `NovaTech — Product Guide

Overview
NovaTech is a unified workspace for teams that need project management, communication, and document collaboration in one place. Built for teams of 5 to 500, NovaTech replaces the need for separate tools like Trello, Slack, and Google Drive.

Core Features

1. Task Boards
Create Kanban boards with customizable columns. Drag and drop tasks between stages. Each task supports:
- Assignees (multiple people per task)
- Due dates and priority levels (Low, Medium, High, Critical)
- Subtasks and checklists
- File attachments (up to 100MB per file)
- Comments and @mentions
- Time tracking

2. Team Messaging
Real-time messaging built into the platform. Features include:
- Direct messages between team members
- Group channels (public or private)
- Thread replies for organized discussions
- File sharing in any conversation
- Emoji reactions
- Message search across all conversations

3. Document Hub
A centralized place for all team documents:
- Create rich-text documents directly in NovaTech
- Upload files of any type (PDF, Word, Excel, images, videos)
- Version history with the ability to restore previous versions
- Folder organization with drag-and-drop
- Share documents with external guests via secure links

4. Analytics Dashboard
Track team performance and project health:
- Task completion rates by team member and project
- Time tracking reports with exportable CSV
- Burndown charts for sprint-based workflows
- Workload distribution view (who has too much, who has capacity)
- Custom date range filtering

5. Automations (Professional and Enterprise)
Create custom automation rules:
- "When a task moves to Done → notify the project owner"
- "When a due date is missed → change priority to Critical"
- "When a new member joins → assign onboarding checklist"
- Up to 50 automation rules on Professional, unlimited on Enterprise

Pricing
- Starter: $12/user/month — ideal for small teams getting organized
- Professional: $29/user/month — for growing teams that need automations and analytics
- Enterprise: $59/user/month — for large organizations requiring SSO, compliance, and dedicated support

All prices are per user, billed monthly. Annual billing saves 20%.

System Requirements
- Web: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS 15+ or Android 12+
- Desktop: macOS 11+ or Windows 10+ (Electron app available)

Getting Started
1. Sign up at app.novatech.io
2. Create your first workspace
3. Invite your team via email
4. Create a project board
5. Start adding tasks

Need help? Email support@novatech.io or open the chat widget on our website.`,
  },
];

// Keep backward compat for the existing seed route
export const SEED_SOURCE_FILE = SEED_DOCS[0].sourceFile;
export const SEED_CONTENT = SEED_DOCS[0].content;
