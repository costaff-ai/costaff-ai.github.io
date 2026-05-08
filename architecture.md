# CoStaff — Technical Architecture

> Six layers, each independently replaceable. Deployment view: Docker containers, the Manager Agent orchestrator, 5 specialist Agents + MCP tools, PostgreSQL + shared volume, and the external LLM API layer — all running on the user's own machine.

CoStaff is not a single monolithic AI. It's a multi-agent + tool system stitched together. Each layer runs in its own container, does one thing, and can be swapped or extended independently.

## USER

Hand off a task in a single chat message — you give the brief, you get the result.

## CHANNELS

WebChat · Telegram · LINE · Discord · Slack — Docker container per channel. Each channel adapter handles its platform's quirks; same agents, multiple chat apps.

## MANAGER

**Manager Agent** — parses intent, remembers conversation, dispatches multi-agent work via A2A Protocol. The orchestrator that lets you say one sentence and have specialists collaborate.

## SPECIALISTS

Business · Coding · Database · Twinkle Hub · **Custom Agent with MCP Server** — each in its own container. Manager dispatches via A2A; specialists call MCP tools to do the actual work.

## DATA

PostgreSQL + Shared Workspace — per-agent persistent storage. Conversation memory lives in PostgreSQL; file artifacts live in the shared workspace volume.

## LLM

Gemini · Gemma · Twinkle T1 · 3rd-party models — per-agent configurable. Each specialist can use a different LLM; data and inference stay local if you choose local models.

## Why this design

- **Independently replaceable** — swap any layer without touching others
- **Pluggable** — add new agents, new channels, new LLMs as Docker services
- **Marketplace-ready** — third-party agents can register via A2A and join the orchestration

## Diagrams

- Full SVG: https://costaffs.app/images/architecture/01-tech-architecture.svg
- HTML view: https://costaffs.app/architecture/
- User flow sequence: https://costaffs.app/user-flow/
