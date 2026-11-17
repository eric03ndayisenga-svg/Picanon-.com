# Picanon Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity & PII Isolation**: Every `users/{userId}` document contains PII (`phone`) and MUST only be readable (`get`, `list`) by its owner (`resource.data.ownerUid == request.auth.uid`) or a verified Admin (`eric03ndayisenga@gmail.com` with `email_verified == true` or registered in `/admins/{uid}`).
2. **Self-Assigned Privilege Blocking**: On `create` of `/users/{userId}`, non-admin users MUST set `isAdmin == false`, `vipLevel == 0`, `balance == 0`, and `ownerUid == request.auth.uid`. Users cannot escalate `balance`, `vipLevel`, `isAdmin`, or `isBanned` on update.
3. **Referential & ID Integrity**: All document IDs (`userId`, `rechargeId`, `withdrawId`, `investmentId`, `codeId`, `settingId`) MUST match `^[a-zA-Z0-9_\\-]+$` and have length `<= 128`.
4. **Temporal Integrity**: `createdAt` MUST equal `request.time` on creation and remain immutable forever (`incoming().createdAt == existing().createdAt`). `updatedAt` MUST equal `request.time` on every write.
5. **Terminal State Locking**: `/recharges/{rechargeId}` and `/withdrawals/{withdrawId}` MUST be created with `status == 'pending'`. Only an Admin can transition `status` to `'approved'` or `'rejected'`, and non-admins can never modify a document once `status` is `'approved'` or `'rejected'`.
6. **Admin-Only Configuration**: `/redemptionCodes/{codeId}` and `/settings/{settingId}` mutations are strictly reserved for verified Admins.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Privilege Escalation on User Create**: Creating `/users/u1` with `{ isAdmin: true, balance: 999999, ownerUid: request.auth.uid }` -> **DENIED**.
2. **Ghost / Shadow Field Injection**: Creating `/users/u1` with extra unexpected key `{ shadowVerified: true }` -> **DENIED** via `keys().hasOnly(...)`.
3. **Identity Spoofing on Create**: Creating `/recharges/r1` with `{ ownerUid: "victim_uid" }` while signed in as attacker -> **DENIED**.
4. **Email Spoofing Admin Bypass**: Request with `request.auth.token.email == "eric03ndayisenga@gmail.com"` but `email_verified: false` -> **DENIED**.
5. **PII Blanket List Scraping**: Non-admin attempting `list` on `/users` without `where('ownerUid', '==', uid)` -> **DENIED**.
6. **Cross-User PII Get**: User B attempting `get(/users/userA)` -> **DENIED**.
7. **Self-Approval State Shortcutting**: Regular user creating `/recharges/r2` directly with `status: "approved"` -> **DENIED**.
8. **Terminal State Tampering**: Regular user attempting to update `/withdrawals/w1` whose existing `status` is `'rejected'` back to `'pending'` -> **DENIED**.
9. **Balance Self-Credit on Update**: Regular user updating `/users/u1` with `affectedKeys().hasOnly(['balance'])` -> **DENIED**.
10. **ID Poisoning / Resource Exhaustion**: Writing to `/users/` with a 1500-char ID or invalid characters `bad/../../id` -> **DENIED** by `isValidId()`.
11. **Timestamp Forgery**: Creating a document with backdated `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time` -> **DENIED**.
12. **Admin Settings Takeover**: Non-admin attempting to update `/settings/global` to change `mtnNumber` -> **DENIED**.
