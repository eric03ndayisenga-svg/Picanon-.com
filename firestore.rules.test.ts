/**
 * Phase 0: Dirty Dozen Security Test Specification for Picanon Firestore Rules
 * Validates that every adversarial payload targeting Identity, Integrity, and State
 * receives PERMISSION_DENIED under firestore.rules.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collection: string;
  operation: 'create' | 'update' | 'get' | 'list';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Self-Assigned Admin & Balance on User Create',
    collection: 'users/attacker_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      id: 'attacker_1',
      ownerUid: 'attacker_uid',
      phone: '0780000001',
      balance: 5000000,
      isAdmin: true,
      vipLevel: 10,
    },
  },
  {
    id: 2,
    name: 'Shadow Field Injection on User Create',
    collection: 'users/attacker_2',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      id: 'attacker_2',
      ownerUid: 'attacker_uid',
      phone: '0780000002',
      balance: 0,
      isAdmin: false,
      shadowBypass: true,
    },
  },
  {
    id: 3,
    name: 'Identity Spoofing OwnerUID on Recharge Create',
    collection: 'recharges/req_spoof',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      id: 'req_spoof',
      ownerUid: 'victim_uid',
      userId: 'user_victim',
      amount: 100000,
      status: 'pending',
    },
  },
  {
    id: 4,
    name: 'Unverified Admin Email Spoof',
    collection: 'settings/global',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { mtnNumber: '0789999999' },
  },
  {
    id: 5,
    name: 'Blanket List Query on Users PII',
    collection: 'users',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Cross-User PII Get',
    collection: 'users/victim_doc',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Self-Approved Recharge Creation',
    collection: 'recharges/req_self_approve',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      id: 'req_self_approve',
      ownerUid: 'attacker_uid',
      amount: 250000,
      status: 'approved',
    },
  },
  {
    id: 8,
    name: 'Terminal State Tampering on Withdrawal',
    collection: 'withdrawals/wth_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { status: 'pending' },
  },
  {
    id: 9,
    name: 'Unauthorized Balance Update on User Doc',
    collection: 'users/attacker_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { balance: 999999 },
  },
  {
    id: 10,
    name: 'ID Poisoning Long Document Key',
    collection: `users/${'a'.repeat(300)}`,
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { id: 'a'.repeat(300), ownerUid: 'attacker_uid' },
  },
  {
    id: 11,
    name: 'Client-Forged Backdated Timestamp',
    collection: 'investments/inv_forged',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      id: 'inv_forged',
      ownerUid: 'attacker_uid',
      createdAt: '2020-01-01T00:00:00Z',
    },
  },
  {
    id: 12,
    name: 'Non-Admin MoMo Gateway Hijack',
    collection: 'settings/global',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { mtnNumber: '0781111111', airtelNumber: '0721111111' },
  },
];
