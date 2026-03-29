# Neon Serverless Postgres — Ship faster

**URL:** https://neon.tech

---

Team accounts with unlimited members now available to everyone! Invite your teammates and ship faster together, even on the Free Plan.
Neon
Product
Solutions
Docs
Pricing
Resources
CORE DATABASE
Neon's lakebase architecture
Storage-compute separation.
Autoscaling
Automatic instance sizing
Read Replicas
Instant, autoscaling replicas
Instant Restore
Instant recovery when mistakes happen
BUILT-IN FEATURES
Database Branches
Faster Postgres workflows
Authentication
Auth for your App, built in to your DB
Data API
REST HTTP API for your database
Connection Pooling
Efficiently manage database connections

What is Neon

Serverless Postgres, by Databricks

USE CASES
Serverless App
Autoscale with traffic
Multi-TB
Scale and restore instantly
Database per tenant
Data isolation without overhead
BUILD & OPERATE
Platforms
Offer Postgres for your users
Dev/Tests
Production-like environment
Agents
Build full-stack AI agents
LEARN
Blog
Technical posts & product updates
Case studies
Explore customer stories
Changelog
Product updates
Community
Connect on Discord
Startups
Build with Neon
COMPANY
About us
The company and the mission
Careers
Join the team
Contact sales
Contact sales team
Security
Compliance & privacy
Status
Service status
Discord
21.3k
Log in
Sign up
A DATABRICKS COMPANY
Fast Postgres Databases
for Teams and Agents
Get started
Read the docs
AI
Advanced Autoscaling
Instant Branching
Auth Included
Production-Grade Features
Postgres for the AI Engineering era. Integrate with a single command and the LLM does the hard work.

Try for yourself, start building with Neon now.

$ npx neonctl init

Connect MCP clients to Neon:

Advanced autoscaling. Keep scaling without worrying about capacity. Never overpay for resources you don’t use.
Avoid incidentsSave costs

0
PERFORMANCE DEGRADATIONS PREVENTED BY AUTOSCALING EVERY DAY

Neon autoscaling

Database load

Fixed-resource provisioned

By separating compute and storage, Neon automatically scales CPU, memory and storage to fit your workload.

Instant branching. Develop and test with efficient copies of any database to eliminate surprises in production deploys.
Copy-on-write

Create editable copies of databases instantly with git-like branching, saving space and time.

Anonymization

Mask sensitive data with realistic fake values, enabling safe testing and sharing of datasets.

Ephemerality

Obsolete branches delete themselves automatically after work is complete.

Authentication included, free. Simplify your application with user authentication and management built in to the database.
No platform fees. Enterprise-grade features available to everyone, without fixed fees or monthly minimums.

HIPAA and SOC2. Meet your compliance requirements without high spend commitments.

Private networking. Keep traffic off the public internet via PrivateLink, no additional costs.

Logs & metrics export. Forward them directly to Datadog or any OTel-compatible service — no extra fees.

Uptime SLAs. 99.95% uptime guaranteed by SLA for all workloads in Scale.

Point-in-time recovery. Restore your database instantly to any moment in time without flat monthly fees.

Single sign-on. Centralize your team access with SSO to manage logins securely.

SYSTEM: NEON DATABASE PLATFORM
[ STATUS: ONLINE ]
[ CONNECTION: STABLE ]
AGENT PLATFORM
Speed and scale for agents. And devs.

Codegen and agent platforms rely on Neon to run the backend for user-generated apps.

I’m building an agent
Deploy thousands of databases that turn off when idle. Inactive databases pause on their own, keeping your fleet efficient and cost-effective.
Learn more
Databases deployed:
0
Friday
Active:
0
Idle:
0
09:00
10:00
11:00
12:00
13:00
14:00
15:00
16:00
17:00
18:00
19:00
20:00
21:00
22:00
23:00
Saturday
Active:
0
Idle:
0
09:00
10:00
11:00
12:00
13:00
14:00
15:00
16:00
17:00
18:00
19:00
20:00
21:00
22:00
23:00
Manage your fleet via API. Neon databases spin up in milliseconds, with APIs for quota controls and fleet scaling.
Learn more
01
Send API call and receive connection string in 120ms
curl -X POST https://api.neon.tech/v2/projects/:id/database
02
Test and deploy >>
CREATE TABLE IF NOT EXISTS playing_with_neon(
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL
);
INSERT INTO playing_with_neon(name, value)
SELECT LEFT(md5(i::TEXT),10),random() FROM generate_series(1,10)s(i);
SELECT * FROM playing_with_neon;
Run Query
Database checkpoints. Copy-on-write storage makes it cheap and fast to save point-in-time versions of your database and restore a previous state when necessary.
BACKED BY GIANTS
Trusted Postgres, Backed by Giants. Neon was founded by Postgres committers, bringing decades of expertise. In 2025, Neon became a Databricks company.
150,000+

New Postgres compute endpoints provisioned daily.

Databricks

Neon has been a Databricks Company since May 2025.

TRUSTED BY THE BEST
Neon's serverless philosophy is aligned with our vision: no infrastructure to manage, no servers to provision, no database cluster to maintain.
Neon's serverless philosophy is aligned with our vision: no infrastructure to manage, no servers to provision, no database cluster to maintain.
Edouard Bonlieu Co-founder at Koyeb
Edouard Bonlieu
Co-founder at Koyeb
The world's most advanced
Postgres platform.

Trusted by developers, ready for agents.
Build and scale applications faster with Neon.

Get started
Read the docs
$ npx neonctl init
Neon
A Databricks Company
Neon status loading...

Made in SF and the World.
Copyright Ⓒ 2022 – 2026 Neon, LLC

COMPANY
About
Blog
Careers
Contact Sales
Security
Legal
Privacy Policy
Terms of Service
DPA
Subprocessors List
Cookie Policy
Business Information
RESOURCES
Docs
Changelog
Support
Community Guides
PostgreSQL Tutorial
Startups
COMMUNITY
Discord
GitHub
X.com
LinkedIn
YouTube
COMPLIANCE
CCPA
Compliant
GDPR
Compliant
ISO 27001
Certified
ISO 27701
Certified
SOC 2
Certified
HIPAA
Compliant
Compliance Guide
Neon’s Sub Contractors
Trust Center