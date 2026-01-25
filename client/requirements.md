## Packages
react-markdown | Rendering markdown in chat messages
remark-gfm | GitHub Flavored Markdown support (tables, lists)
react-syntax-highlighter | Syntax highlighting for code blocks
date-fns | Date formatting for timestamps
framer-motion | Smooth animations for UI elements and messages
lucide-react | Beautiful icons (already in stack but good to confirm)
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind classes

## Notes
- The `POST /api/conversations/:id/messages` endpoint returns a Server-Sent Events (SSE) stream.
- We need to manually handle the `fetch` and `ReadableStream` decoding for the chat interface to show real-time typing.
- Auth is handled via `useAuth` hook which communicates with Replit Auth endpoints.
