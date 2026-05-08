# CoStaff — User Flow Example

> A single user request traced end-to-end through all five layers — chat app → orchestrator → specialist agents → tools → data layer → and back to the user.

## Conversation transcript

**YOU**: Show me Q3 sales, make it a PDF.

**MANAGER**: Got it. DB Agent first, then BA Agent. *(Routing: DB → BA)*

**DB AGENT**: SQL query → 12,345 rows. *(via MCP · PostgreSQL)*

**BA AGENT**: Charts + narrative → final PDF. *(via MCP · PDF/Chart tool)*

**YOU ◀**: 📎 Q3-report.pdf — Done, back in your chat.

## What happened technically

1. User sends message to a chat channel (e.g., Telegram bot)
2. Channel adapter forwards via A2A to Manager Agent
3. Manager parses intent: "needs DB query + report generation"
4. Manager calls DB Agent via A2A: "fetch Q3 sales"
5. DB Agent calls MCP tool to query PostgreSQL → returns 12,345 rows
6. DB Agent returns rows to Manager
7. Manager calls BA Agent via A2A: "make this a PDF"
8. BA Agent calls MCP tool to chart + narrate + render PDF
9. BA Agent returns Q3-report.pdf to Manager
10. Manager forwards to channel adapter → user sees PDF in chat

Total user touchpoints: 1 message in, 1 file out. Total agent handoffs: 4. Total MCP tool calls: ~3-5.

## Diagrams

- Full SVG sequence diagram: https://costaffs.app/images/architecture/02-app-architecture.svg
- HTML view: https://costaffs.app/user-flow/
- System architecture: https://costaffs.app/architecture/
