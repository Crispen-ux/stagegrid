import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Safety — STAGEGRID",
  description: "How STAGEGRID approaches technical safety across sound, trussing, staging, lighting and AV.",
};

export default function SafetyPage() {
  return (
    <LegalLayout
      title="Safety"
      updated="24 September 2026"
      intro="Safety underpins everything STAGEGRID deploys. This page explains how technical safety fits into our process, and what STAGEGRID does and does not certify."
      sections={[
        {
          heading: "1. Indicative recommendations, not certified designs",
          paragraphs: [
            "The Event Builder and Equipment catalog produce indicative technical recommendations based on the information provided. They are planning tools, not a substitute for professional engineering assessment.",
            "STAGEGRID does not automatically certify structural safety, electrical safety, rigging safety or noise compliance through these tools. Any warnings shown (for example around power requirements or outdoor weather protection) are general planning flags, not a safety sign-off.",
          ],
        },
        {
          heading: "2. Qualified technical review",
          paragraphs: [
            "Before deployment, bookings involving structural rigging, elevated staging, or high-load trussing are reviewed by qualified STAGEGRID technical staff. Where a configuration falls outside standard parameters, additional engineering input may be required before we can confirm the booking.",
          ],
        },
        {
          heading: "3. On-site safety",
          paragraphs: [
            "All rigging, staging and electrical work is carried out by trained STAGEGRID crew or vetted subcontractors. Restricted areas (rigging zones, power distribution, backstage technical areas) are managed on site during build, live operation and strike.",
          ],
        },
        {
          heading: "4. Electrical and power",
          paragraphs: [
            "Power distribution is planned against the estimated load of the confirmed equipment package. Clients are responsible for confirming venue supply capacity in advance; where supply may be insufficient, this is flagged during configuration and confirmed during technical review.",
          ],
        },
        {
          heading: "5. Weather and outdoor events",
          paragraphs: [
            "Outdoor events carry additional risk from wind, rain and lightning. Weather protection is recommended by default for outdoor configurations, and STAGEGRID reserves the right to adjust or pause operations on site if conditions become unsafe.",
          ],
        },
        {
          heading: "6. Crew certification",
          paragraphs: [
            "Riggers and technical crew working at height or on load-bearing structures are trained and, where applicable, hold relevant certifications for their role.",
          ],
        },
        {
          heading: "7. Incident reporting",
          paragraphs: [
            "Any safety incident on site is documented by the lead technician and reported internally. Clients are encouraged to raise any safety concerns with the lead technician on site immediately, or with a STAGEGRID technical specialist via the Contact page.",
          ],
        },
      ]}
    />
  );
}
