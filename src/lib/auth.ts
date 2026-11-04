const ACCOUNTS_KEY = "rupaiya_accounts";
const SESSION_KEY = "auth_user";
const PBKDF2_ITERATIONS = 100_000;

const LEDGER_BASES = ["expenses_v2", "income_v2", "investments_v2"] as const;

export type LedgerBase = (typeof LEDGER_BASES)[number];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type StoredAccount = SessionUser & {
  salt: string;
  passwordHash: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return bytesToBase64(new Uint8Array(bits));
}

function hashesMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (account): account is StoredAccount =>
        account &&
        typeof account.id === "string" &&
        typeof account.name === "string" &&
        typeof account.email === "string" &&
        typeof account.salt === "string" &&
        typeof account.passwordHash === "string"
    );
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toSessionUser(account: StoredAccount): SessionUser {
  return { id: account.id, name: account.name, email: account.email };
}

export function getSessionUser(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    return { id: parsed.id, name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

function setSession(user: SessionUser) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function ledgerKey(base: LedgerBase, userId: string) {
  return `${base}:${userId}`;
}

export function migrateLegacyLedger(userId: string) {
  for (const base of LEDGER_BASES) {
    const legacy = localStorage.getItem(base);
    if (legacy === null) continue;
    const dest = ledgerKey(base, userId);
    if (localStorage.getItem(dest) === null) {
      localStorage.setItem(dest, legacy);
    }
    localStorage.removeItem(base);
  }
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<SessionUser> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  if (!name) throw new Error("Enter your name.");
  if (!emailPattern.test(email)) throw new Error("Enter a valid email.");
  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const user: SessionUser = {
    id: crypto.randomUUID(),
    name,
    email,
  };

  accounts.push({
    ...user,
    salt: bytesToBase64(saltBytes),
    passwordHash: await derivePasswordHash(input.password, saltBytes),
  });
  writeAccounts(accounts);
  migrateLegacyLedger(user.id);
  setSession(user);
  return user;
}

export async function logIn(input: {
  email: string;
  password: string;
}): Promise<SessionUser> {
  const email = normalizeEmail(input.email);
  const account = readAccounts().find((item) => item.email === email);
  if (!account) throw new Error("Email or password is incorrect.");

  const hash = await derivePasswordHash(
    input.password,
    base64ToBytes(account.salt)
  );
  if (!hashesMatch(hash, account.passwordHash)) {
    throw new Error("Email or password is incorrect.");
  }

  const user = toSessionUser(account);
  migrateLegacyLedger(user.id);
  setSession(user);
  return user;
}
