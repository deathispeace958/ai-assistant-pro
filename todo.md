# AI Assistant Pro — TODO

## Phase 1: Schema & Server
- [x] Database schema: settings table (passcode, restrictions, config)
- [x] Database schema: chat_sessions and chat_messages tables
- [x] tRPC router: chat (streaming AI chat with image support)
- [x] tRPC router: ai.generateImage
- [x] tRPC router: ai.animatePhoto
- [x] tRPC router: ai.generateVideo
- [x] tRPC router: settings (get/update passcode, restrictions)
- [x] File upload endpoint for images

## Phase 2: Brutalist UI Layout
- [x] Global Brutalist CSS (black bg, white oversized condensed type, red divider)
- [x] Google Fonts: Bebas Neue + Inter for body
- [x] App layout with full-width red divider header
- [x] Navigation tabs: Chat | Generate | Animate | Settings
- [x] Dark theme throughout

## Phase 3: AI Chat
- [x] Streaming chat interface using SSE
- [x] Photo upload in chat (image analysis)
- [x] Friend Mode toggle button
- [x] Speaking modes selector (Formal, Casual, Expert, Creative, Concise)
- [x] System prompt builder based on mode + friend mode
- [x] Markdown rendering in chat messages
- [x] Chat history per session

## Phase 4: AI Media Generation
- [x] AI Image Generation page with text prompt input
- [x] Generated image display + download
- [x] Animate Photo page with upload + animation style selector
- [x] Clear "AI ANIMATION" label on animate feature
- [x] AI Video Generation page with text prompt
- [x] Video display after generation

## Phase 5: Owner Settings
- [x] Passcode entry dialog (default: hackerx)
- [x] Owner panel: change passcode
- [x] Owner panel: toggle content restrictions for users
- [x] Owner panel: restriction presets (Safe, Moderate, None)
- [x] Persist settings in database

## Phase 6: Polish & Tests
- [x] Vitest tests for settings router
- [x] Vitest tests for chat router
- [x] Loading states and error handling throughout
- [x] Mobile responsive layout
- [x] Final checkpoint

## Voice Input Feature
- [x] Server: tRPC mutation for audio transcription using Whisper API
- [x] Server: multipart audio upload endpoint
- [x] Client: Microphone button in chat input bar (record/stop toggle)
- [x] Client: MediaRecorder API for in-browser audio capture
- [x] Client: Upload audio blob to server and get transcription back
- [x] Client: Auto-fill transcribed text into chat input field
- [x] Client: Visual recording indicator (pulsing red dot)
- [x] Client: Error handling for mic permission denied

## Content Policy Clarification
- [x] Update Settings panel to clarify explicit and sexual content is allowed by default
- [x] Update NO RESTRICTIONS preset description to mention explicit/sexual content

## Age Verification Feature
- [x] Create AgeVerificationModal component with 18+ confirmation
- [x] Store age verification in localStorage with timestamp
- [x] Show modal on first visit only (check localStorage flag)
- [x] Block app access until user confirms they are 18+
- [x] Add reset button in Settings for testing
