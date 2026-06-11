# CoStaff — Your AI Staff

Specialist AI agents that collaborate automatically. Each runs in its own Docker container, calls MCP tools, and communicates via A2A protocol. Six repos are open source (including the agent template); the rest of the fleet is private — contact for access.

## Open source

### ❶ Business Analysis Agent

For: business analysts, slide designers.

Auto-chart, narrate, polished PDF/PPT. Throw data at it, it picks the right chart type, writes the narrative, and outputs polished PDFs/PPTs with full Chinese typography support.

- Auto-chart selection + narrative writing
- PDF / PPT / PNG output (full CJK font support)
- Polished layout, no post-processing needed
- Natural-language follow-up

### ❷ Coding Agent

For: data engineers, Python engineers.

Messy Excel from a client? Hand the 30-min cleanup over. Writes Python, runs computations, cleans data. Remembers your last cleanup rules so you don't have to repeat yourself.

- CSV / Excel cleaning + format conversion
- Python execution
- Data computation + batch jobs
- Workspace file read/write

### ❸ Database Agent

For: data analysts, DBAs.

Want numbers without queueing for engineers? Ask "which product sold best last month" in plain language — it pokes the database, finds the right tables, runs the query. You don't need to know the schema.

- Plain-language query, schema auto-discovery
- Multi-DB support (PostgreSQL, MySQL...)
- Cross-DB joins
- Structured output (JSON / CSV)

### ❹ Twinkle Hub Agent

For: open-data specialists.

Want government open data? No more crawling 19 ministry sites. Ask in plain language — it finds the right datasets (52,960+), runs DuckDB SQL at the source for just the slice you need, saves clean CSV with provenance metadata. Downstream agents pick up directly.

- 52,960+ government datasets across 19 domains
- DuckDB SQL filtering at source
- Data provenance sidecar (agency, query, time)
- Auto-handoff to BA / Coding agents

### ❺ WrenAI GenBI Agent (OSS)

For: natural-language SQL analysts.

Ask a data question in plain English — it writes the SQL, runs it against your self-hosted WrenAI GenBI deployment, and returns the answer with an optional chart. Auto-retries via WrenAI's corrections API if the engine rejects the generated SQL.

- One-shot natural-language → SQL → answer
- Optional Vega-Lite v5 chart spec output
- Auto SQL repair via /v1/sql-corrections
- Persist verified Q/SQL pairs as few-shot examples

### ❻ Agent Template

Build your own specialist + tools with ADK & MCP. Your private workflows, your way.

- Full access to CoStaff MCP tools
- A2A protocol compatible
- Bring your own LLM model
- Deploy alongside built-in agents

## Private fleet (contact for access)

- **Gmail** — inbox automation: list / search / read / compose / label, `gmail.modify` scope (never permanently deletes)
- **Google Calendar** — query and edit events in plain language; relative-time anchoring via a real time tool
- **Google Drive** — Drive file management + Google Docs + Google Sheets editing, `drive.file` scope
- **Notion** — end-to-end Notion workspace agent over the official hosted Notion MCP
- **RSS Feed** — subscribe and curate RSS / Atom feeds, full-text search, starter packs
- **Web Search** — open-web and news search, quick answers, URL content extraction (Tavily backend)
- **HR** — recruiting docs generator: JD, interview plan, scorecard, question bank
- **Kubernetes** — cluster operations over the official `kubectl-ai` MCP, write-path gated by confirmation
- **Terraform** — Registry search, HCP TFE workspace inspection, gated plan / apply
- **Nutrition** — weight / fat-loss nutritionist: photo + text diet logging, trend plots, grounded Q&A
- **Fill-Table** — .docx template + PDF attachments → filled, ready-to-send PDF; 17 fields field-tested, CJK OK
- **Browser Operator** — Playwright headless browser; government website patrols, public tender tracking
- **Builder** — one-sentence brief → scaffolded agent repo: clone → generate → validate → push, fully automated
- **Medical** — medical-domain Q&A assistant

Each enterprise platform (ERP / CRM / HRM / SCM / PLM / Accounting / KMS / Project / Expense / Helpdesk) also has a paired operator agent — see [Platforms](https://costaffs.app/platforms/).

## Build your own

Start from the open-source [agent template](https://github.com/costaff-ai/costaff-agent-template), or contact us to commission a custom agent.

## How they work together

A Manager Agent dispatches work via A2A protocol. You ask "Q3 sales report PDF" — Manager routes to Database Agent for the data, then Business Analysis Agent for the report. You see one chat, one PDF.

[Full HTML version](https://costaffs.app/agents/)
