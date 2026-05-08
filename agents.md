# CoStaff — Your AI Staff

5 specialist AI agents that collaborate automatically. Each runs in its own Docker container, calls MCP tools, and communicates via A2A protocol.

## ❶ Custom Agent

Build your own specialist + tools with ADK & MCP. Your private workflows, your way.

- Full access to CoStaff MCP tools
- A2A protocol compatible
- Bring your own LLM model
- Deploy alongside built-in agents

## ❷ Business Analysis Agent

For: business analysts, slide designers.

Auto-chart, narrate, polished PDF/PPT. Throw data at it, it picks the right chart type, writes the narrative, and outputs polished PDFs/PPTs with full Chinese typography support.

- Auto-chart selection + narrative writing
- PDF / PPT / PNG output (full CJK font support)
- Polished layout, no post-processing needed
- Natural-language follow-up

## ❸ Coding Agent

For: data engineers, Python engineers.

Messy Excel from a client? Hand the 30-min cleanup over. Writes Python, runs computations, cleans data. Remembers your last cleanup rules so you don't have to repeat yourself.

- CSV / Excel cleaning + format conversion
- Python execution
- Data computation + batch jobs
- Workspace file read/write

## ❹ Database Agent

For: data analysts, DBAs.

Want numbers without queueing for engineers? Ask "which product sold best last month" in plain language — it pokes the database, finds the right tables, runs the query. You don't need to know the schema.

- Plain-language query, schema auto-discovery
- Multi-DB support (PostgreSQL, MySQL...)
- Cross-DB joins
- Structured output (JSON / CSV)

## ❺ Twinkle Hub Agent

For: Taiwan open data specialists.

Want Taiwan government open data? No more crawling 19 ministry sites. Ask in plain language — it finds the right datasets (52,960+), runs DuckDB SQL at the source for just the slice you need, saves clean CSV with provenance metadata. Downstream agents pick up directly.

- 52,960+ Taiwan government datasets across 19 domains
- DuckDB SQL filtering at source
- Data provenance sidecar (agency, query, time)
- Auto-handoff to BA / Coding agents

## How they work together

A Manager Agent dispatches work via A2A protocol. You ask "Q3 sales report PDF" — Manager routes to Database Agent for the data, then Business Analysis Agent for the report. You see one chat, one PDF.

[Full HTML version](https://costaffs.app/agents/)
