# Project Issues

This document catalogs technical debt, bugs, and concerns found in the codebase.

## TODO/FIXME Items

| File | Line | Issue |
|------|------|-------|
| `apps/web/hooks/use-chat-event-handler.ts` | 38 | TODO: try to handle set streaming here if found the lag in the production version |
| `apps/web/hooks/use-chat-event-handler.ts` | 56 | TODO: this shit code remove it from here only delete if the event is consumed here |
| `apps/web/components/mail-editor/editor.tsx` | 40 | TODO: fix height remove the navbar height |
| `apps/web/components/mail-editor/editor.tsx` | 77 | TODO: fix remove the mjml preview and mjml title these are causing issues in the render of the mjml |
| `apps/api/src/web-sockets/cases/new-chat.ts` | 17 | TODO: if user balance is too low then only allow to run the one at a time |
| `apps/api/src/web-sockets/handlers/refine-template-event.ts` | 44 | TODO: please store the version temp in the redis so that when user refresh can be sent to the user |
| `apps/api/src/controllers/brandkit/create-manual-brandkit.ts` | 46 | TODO: make it the transaction and remove from the deleting the images |
| `apps/api/src/controllers/brandkit/createManualBrandkit.ts` | 46 | TODO: make it the transaction and remove from the deleting the images |
| `apps/api/src/controllers/markplace/purchase-template.ts` | 197 | TODO: update the wallet balance after confirming the grants |
| `apps/api/src/controllers/user/test-mail-controller.ts` | 208 | TODO: please also verify using the user id |

## Console.log/Debug Statements

| File | Line | Issue |
|------|------|-------|
| `packages/database/src/seeding.ts` | 13 | console.log in production code |
| `apps/web/contexts/web-socket-context.tsx` | 173 | console.log in catch block |
| `apps/web/hooks/use-media-upload.ts` | 69 | console.log in catch block |
| `apps/web/components/mail-editor/editor.tsx` | 20, 29, 30 | Multiple console.log statements |
| `apps/api/src/web-sockets/socket-handler.ts` | 22 | console.log in development only |
| `apps/api/src/queues/thumbnail-update-queue.ts` | 26, 35, 64 | Multiple console.log statements |
| `apps/api/src/services/otp-service.ts` | 308 | console.log in production |
| `apps/api/src/prompts/index.ts` | 46 | console.log warning |
| `apps/api/src/controllers/payments/dodo-webhook.ts` | 25 | console.log in webhook |
| `apps/api/src/controllers/payments/functions/payment-success.ts` | 82, 124 | console.log in payment handler |
| `apps/api/src/controllers/chats/chat-controllers.ts` | 13 | console.log in controller |
| `apps/api/src/index.ts` | 87, 90, 99, 111, 123 | Multiple console.log statements |
| `apps/api/src/ai/mail/user-instructions/update-user-instructions.ts` | 18, 21 | console.log statements |
| `apps/api/src/ai/mail/refine-template/rewrite-prompt.ts` | 12, 14, 22, 29 | Multiple console.log statements |
| `apps/api/src/ai/mail/refine-template/generate-refined-mjml.ts` | 13, 21, 22, 29 | Multiple console.log statements |

## Missing/Empty Error Handling

| File | Line | Issue |
|------|------|-------|
| `apps/web/hooks/use-media-upload.ts` | 68-70 | Empty catch block - swallows error silently |
| `apps/api/src/queues/thumbnail-update-queue.ts` | 63-65 | Empty catch block - error silently ignored |
| `apps/api/src/ai/mail/refine-template/generate-refined-mjml.ts` | 28-34 | Returns empty string on error without proper error handling |
| `apps/api/src/ai/mail/refine-template/rewrite-prompt.ts` | 28-34 | Returns empty string on error without proper error handling |
| `apps/api/src/ai/mail/user-instructions/update-user-instructions.ts` | 20-22 | Returns empty string on error without proper error handling |
| `apps/api/src/web-sockets/socket-handler.ts` | 63-66 | Generic error handling, doesn't differentiate error types |
| `apps/web/contexts/web-socket-context.tsx` | 171 | Empty onerror handler |

## Inconsistent Error Throwing

| File | Line | Issue |
|------|------|-------|
| `apps/api/src/controllers/user/test-mail-controller.ts` | 40, 56 | Uses `throw new Error()` instead of `AppError` - inconsistent error handling |
| `apps/api/src/controllers/auth/lib/create-user.ts` | 37, 67 | Uses `throw new Error()` instead of `AppError` |
| `apps/api/src/controllers/auth/google-auth.ts` | 37 | Uses `throw new Error()` instead of `AppError` |

## Type Safety Issues

| File | Line | Issue |
|------|------|-------|
| `packages/ui/src/hooks/use-mobile.ts` | 6-7 | `undefined` as initial state |
| `apps/api/src/ai/utils.ts` | 70 | `any` type parameter |
| `apps/web/zustand-store/socket-events-store.ts` | 4-5 | `any` type with eslint-disable comment |
| `apps/api/src/lib/env.ts` | 5-35 | All env variables use non-null assertion (`!`) without validation at startup |

## Hardcoded Values

| File | Line | Issue |
|------|------|-------|
| `apps/web/contexts/web-socket-context.tsx` | 47 | Hardcoded `ws://localhost:8000` |
| `apps/web/lib/contants.ts` | 2 | Hardcoded `http://localhost:8000` |
| `apps/web/app/layout.tsx` | 19 | Hardcoded `https://mailstudio.com` |
| `apps/api/src/services/otp-service.ts` | 250, 143 | Hardcoded `jashan.dev` in email templates |
| `apps/api/src/controllers/auth/lib/create-user.ts` | 102-110 | Hardcoded default brand kit data including URLs |
| `apps/api/src/web-sockets/cases/new-chat.ts` | 29 | Magic number `0.08` for wallet balance check |
| `apps/api/src/controllers/markplace/purchase-template.ts` | 195 | Magic number `0.75` for profit calculation |
| `apps/api/src/ai/models.ts` | 25, 38 | Magic numbers for token cost calculations |

## Potential Security Issues

| File | Line | Issue |
|------|------|-------|
| `apps/api/src/lib/env.ts` | 1-2 | dotenv loaded at module level before validation |
| `apps/api/src/controllers/internal/get-chat-template-html.ts` | 19-20 | Query parameter `secret` comparison without constant-time comparison |
| `apps/api/src/controllers/payments/functions/payment-success.ts` | 42-46 | Missing validation of user_id/order_id before processing |
| `apps/api/src/controllers/user/test-mail-controller.ts` | 208 | TODO indicates missing user_id verification |
| `apps/api/src/middlewares/check-authorization.ts` | 31 | Magic number `300` for cache TTL without constant |

## Code Smells & Architectural Issues

| File | Line | Issue |
|------|------|-------|
| `apps/api/src/middlewares/attach-user-if-exists.ts` | 41-43 | Silent error swallowing in middleware |
| `apps/api/src/index.ts` | 59-67 | Exposes server internal info (RANDOM_NUMBER, START_TIME) in health endpoint |
| `apps/web/components/mail-editor/deprecated-editor.tsx` | Entire file | Entire file commented out - dead code |
| `apps/api/src/web-sockets/functions/stream-and-handle-question.ts` | 147 | Empty `.then(() => {})` - anti-pattern |
| `apps/api/src/index.ts` | 106 | URI component decoding without try-catch for malformed cookies |
| `apps/web/hooks/use-chat-event-handler.ts` | 56-57 | Events deleted for ALL event types, not just consumed ones |

## API Endpoint Issues

| File | Line | Issue |
|------|------|-------|
| `apps/api/src/routes/chat-routes.ts` | 17-18 | POST to `/chats` calls `updateChat` - confusing REST semantics |
| `apps/api/src/routes/chat-routes.ts` | 29 | `/clone` uses POST without body schema validation |
| `apps/api/src/routes/chat-routes.ts` | 31 | `/like/` has trailing slash inconsistency |

## Incomplete Implementations

| File | Line | Issue |
|------|------|-------|
| `apps/api/src/controllers/markplace/purchase-template.ts` | 197 | Wallet update not implemented after grant confirmation |
| `apps/api/src/controllers/brandkit/createManualBrandkit.ts` | 34, 42 | Early `return` without error response when media not found |
| `apps/api/src/web-sockets/handlers/refine-template-event.ts` | 44 | Version temp not stored in Redis |
| `apps/web/lib/contants.ts` | 24-25 | Missing handling for `free` plan type in `getPlanInfoByType` |

## Unused/Deprecated Code

| File | Line | Issue |
|------|------|-------|
| `apps/web/components/mail-editor/deprecated-editor.tsx` | Entire file | Completely commented out code |
| `apps/api/src/controllers/internal/get-chat-template-html.ts` | 26-34 | Commented out authentication code |
| `apps/api/src/ai/utils.ts` | 141-143 | Commented out code for content building |
| `apps/web/contexts/web-socket-context.tsx` | 137 | Commented out WS URL |
| `apps/api/src/test.ts` | Entire file | Placeholder test function |

## Missing Validations

| File | Line | Issue |
|------|------|-------|
| `apps/api/src/controllers/user/test-mail-controller.ts` | 208 | Missing user_id verification |
| `apps/api/src/controllers/markplace/purchase-template.ts` | 197 | Missing wallet balance update after grant confirmation |
| `apps/api/src/controllers/auth/google-auth.ts` | 51 | No validation if `payload` is null before parsing |
| `apps/api/src/web-sockets/cases/new-chat.ts` | 17 | Missing balance-based concurrency limit |

## WebSocket Issues

| File | Line | Issue |
|------|------|-------|
| `apps/web/contexts/web-socket-context.tsx` | 171 | Empty `onerror` handler swallows errors |
| `apps/web/contexts/web-socket-context.tsx` | 156-168 | Reconnection logic doesn't notify user |
| `apps/api/src/web-sockets/socket-handler.ts` | 19 | Silent return when event parsing fails |

## Priority Issues to Address

1. **Console.log statements in production** - Security/performance concern
2. **Inconsistent error handling** - Mix of `throw new Error()` and `AppError`
3. **Hardcoded values** - Should use environment variables
4. **Empty catch blocks** - Silent error swallowing
5. **TODO items** - Incomplete implementations scattered throughout
6. **Security concerns** - Non-constant time comparison, missing validations
