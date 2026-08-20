/**
 * app/(app)/onboarding/page.tsx
 *
 * Stage 3 Part 2: Onboarding Page
 * Renders the 3-step Onboarding Wizard for new users.
 */
import { OnboardingWizard } from "./onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="py-6">
      <OnboardingWizard />
    </div>
  );
}
