import { createClient, type Client } from "@libsql/client";
import { createHash, randomBytes, randomUUID } from "node:crypto";

export function hashSession(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export class BillingStore {
  readonly db: Client;
  private ready: Promise<unknown>;
  constructor(url: string, authToken?: string) {
    this.db = createClient({ url, authToken });
    this.ready = this.db.batch([
      `CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, email TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS subscriptions (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, plan_id TEXT NOT NULL, interval TEXT NOT NULL, status TEXT NOT NULL, pro INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, event_time TEXT NOT NULL DEFAULT '')`,
      `CREATE TABLE IF NOT EXISTS webhook_events (id TEXT PRIMARY KEY, created_at TEXT NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS download_usage (customer_id TEXT NOT NULL, day TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(customer_id, day))`,
    ], "write");
  }
  async findCustomer(token: string | undefined) {
    await this.ready;
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const r = await this.db.execute({ sql: "SELECT id FROM customers WHERE token_hash=?", args: [hashSession(token)] });
    return r.rows[0] ? String(r.rows[0].id) : null;
  }
  async createCustomer() {
    await this.ready;
    const id = randomUUID();
    const token = randomBytes(32).toString("hex");
    const now = new Date().toISOString();
    await this.db.execute({ sql: "INSERT INTO customers VALUES (?,?,NULL,?,?)", args: [id, hashSession(token), now, now] });
    return { id, token };
  }
  async entitlement(customerId: string) {
    await this.ready;
    const r = await this.db.execute({ sql: "SELECT id,interval,status,pro FROM subscriptions WHERE customer_id=? ORDER BY pro DESC,updated_at DESC LIMIT 1", args: [customerId] });
    const usage = await this.db.execute({ sql: "SELECT count FROM download_usage WHERE customer_id=? AND day=?", args: [customerId, new Date().toISOString().slice(0, 10)] });
    return { pro: r.rows[0]?.pro === 1, status: r.rows[0] ? String(r.rows[0].status) : "FREE", remaining: Math.max(0, 3 - Number(usage.rows[0]?.count ?? 0)) };
  }
  async saveSubscription(id: string, customerId: string, planId: string, interval: string, status: string) {
    await this.ready;
    const now = new Date().toISOString();
    await this.db.execute({ sql: "INSERT OR IGNORE INTO subscriptions (id,customer_id,plan_id,interval,status,pro,created_at,updated_at) VALUES (?,?,?,?,?,0,?,?)", args: [id, customerId, planId, interval, status, now, now] });
  }
  async subscription(id: string) {
    await this.ready;
    const r = await this.db.execute({ sql: "SELECT * FROM subscriptions WHERE id=?", args: [id] });
    return r.rows[0] ?? null;
  }
  async updateSubscription(id: string, status: string, email?: string, event?: { id: string; time: string }) {
    await this.ready;
    const tx = await this.db.transaction("write");
    try {
      if (event) {
        const result = await tx.execute({ sql: "INSERT OR IGNORE INTO webhook_events VALUES (?,?)", args: [event.id, new Date().toISOString()] });
        if (!result.rowsAffected) { await tx.commit(); return; }
      }
      const now = new Date().toISOString();
      await tx.execute({ sql: "UPDATE subscriptions SET status=?,pro=?,updated_at=?,event_time=CASE WHEN ?='' THEN event_time ELSE ? END WHERE id=? AND (?='' OR event_time<=?)", args: [status, status === "ACTIVE" ? 1 : 0, now, event?.time ?? "", event?.time ?? "", id, event?.time ?? "", event?.time ?? "",] });
      if (email) await tx.execute({ sql: "UPDATE customers SET email=?,updated_at=? WHERE id=(SELECT customer_id FROM subscriptions WHERE id=?)", args: [email, now, id] });
      await tx.commit();
    } catch (error) { await tx.rollback(); throw error; }
  }
  async consumeFreeDownload(customerId: string) {
    await this.ready;
    const r = await this.db.execute({ sql: "INSERT INTO download_usage VALUES (?,?,1) ON CONFLICT(customer_id,day) DO UPDATE SET count=count+1 WHERE count<3 RETURNING count", args: [customerId, new Date().toISOString().slice(0, 10)] });
    return r.rows.length > 0;
  }
}
