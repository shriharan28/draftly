/**
 * Simple HTML templates for Draftly emails.
 */

export const getWelcomeEmailHtml = () => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
  <h1 style="color: #000;">Welcome to Draftly! 🎉</h1>
  <p>We're thrilled to have you on board.</p>
  <p>We've credited your account with <strong>15 free credits</strong> so you can start generating platform-ready content right away.</p>
  <br/>
  <a href="https://draftly-pink.vercel.app/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to your Dashboard</a>
  <br/><br/>
  <p>Happy creating!<br/>— The Draftly Team</p>
</div>
`;

export const getLowCreditsEmailHtml = (creditsLeft: number) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
  <h1 style="color: #000;">You're running low on credits! ⚡</h1>
  <p>Just a quick heads-up that you only have <strong>${creditsLeft} credit${creditsLeft === 1 ? "" : "s"}</strong> remaining in your account.</p>
  <p>Don't let your creative streak end here. Upgrade to Draftly Pro to unlock 500 credits per month.</p>
  <br/>
  <a href="https://draftly-pink.vercel.app/billing" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Upgrade to Pro</a>
  <br/><br/>
  <p>Keep creating!<br/>— The Draftly Team</p>
</div>
`;
