import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend, EMAIL_FROM } from "@/lib/resend/client";
import { getLowCreditsEmailHtml } from "@/lib/resend/templates";

// Initialize Supabase admin client to bypass RLS for cron
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Verify cron secret to prevent unauthorized execution
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find users who dropped to <= 3 credits in the last 24 hours
    // We look at the ledger to find events that caused balance to drop.
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: ledgerEvents, error: ledgerError } = await supabaseAdmin
      .from("credit_ledger")
      .select("user_id, balance_after")
      .gte("created_at", yesterday)
      .lte("balance_after", 3)
      .eq("reason", "generation"); // Only care about organic spend

    if (ledgerError) {
      console.error("Error fetching ledger events:", ledgerError);
      return NextResponse.json({ error: ledgerError.message }, { status: 500 });
    }

    if (!ledgerEvents || ledgerEvents.length === 0) {
      return NextResponse.json({ message: "No users fell to <=3 credits in the last 24h." });
    }

    // Get unique user IDs
    const userIds = [...new Set(ledgerEvents.map(e => e.user_id))];
    let emailsSent = 0;

    // 3. For each user, verify their *current* balance is still <= 3
    for (const userId of userIds) {
      // Get current balance
      const { data: latestLedger } = await supabaseAdmin
        .from("credit_ledger")
        .select("balance_after")
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (!latestLedger || latestLedger.balance_after > 3) {
        continue; // User replenished credits or didn't drop
      }

      // 4. Get the user's email from auth.users
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (userError || !userData?.user?.email) {
        continue;
      }

      // 5. Send the email
      try {
        await resend.emails.send({
          from: `Draftly <${EMAIL_FROM}>`,
          to: userData.user.email,
          subject: "Draftly: You're running low on credits ⚡",
          html: getLowCreditsEmailHtml(latestLedger.balance_after),
        });
        emailsSent++;
      } catch (emailError) {
        console.error(`Failed to send low credits email to ${userData.user.email}:`, emailError);
      }
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (err: any) {
    console.error("Cron low-credits error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
