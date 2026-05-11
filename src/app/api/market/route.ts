import { NextRequest, NextResponse } from "next/server";
import { getMarketData, db } from "@/db";
import { syncLogs, stocks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sector = searchParams.get("sector") || "All";
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";

  try {
    const result = await getMarketData({ page, limit: 16, sort: "desc", sector, query });

    let isReady = false;
    let log = null;
    const logs = await db.select().from(syncLogs).where(eq(syncLogs.id, 1));
    if (logs.length > 0) {
      log = logs[0];
      isReady = log.status === "READY";
    }

    const sectors = await db.selectDistinct({ sector: stocks.sector }).from(stocks);

    const buySignals = await db.select({ count: sql`count(*)` }).from(stocks)
      .where(sql`ai_signal IN ('OVERSOLD_BOUNCE', 'MOMENTUM_SPIKE')`);
    const sellSignals = await db.select({ count: sql`count(*)` }).from(stocks)
      .where(sql`ai_signal IN ('MEAN_REVERSION', 'BEARISH_DUMP')`);

    return NextResponse.json({
      data: result.data,
      allIndexes: result.allIndexes,
      totalPages: result.totalPages,
      log,
      isReady,
      sectors,
      buyCount: Number(buySignals[0]?.count ?? 0),
      sellCount: Number(sellSignals[0]?.count ?? 0),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
