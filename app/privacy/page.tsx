import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — STAGEGRID",
  description: "How STAGEGRID collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="24 September 2026"
      intro="This Privacy Policy explains how STAGEGRID collects, uses and protects information when you use this website, the Event Builder, the Equipment catalog, or the Portal, and when you engage us for event infrastructure services."
      sections={[
        {
          heading: "1. Information we collect",
          paragraphs: [
            "We collect information you provide directly, such as your name, company, email address, phone number, event details and configuration choices submitted through the Event Builder, Equipment catalog, Contact form or Request a Quote form.",
            "We also collect limited technical information automatically, such as browser type and general usage patterns, to help us maintain and improve the site.",
          ],
        },
        {
          heading: "2. How we use information",
          paragraphs: [
            "Information is used to respond to enquiries, prepare technical quotes, coordinate bookings, deliveries and crew, and to communicate with you about your event.",
            "We may use aggregated, non-identifying usage information to improve the Event Builder's recommendations and this website generally.",
          ],
        },
        {
          heading: "3. Sharing of information",
          paragraphs: [
            "We do not sell personal information. Information may be shared with STAGEGRID crew, contracted delivery partners and technical subcontractors solely as needed to deliver a confirmed booking.",
            "We may disclose information where required by law or to protect the rights, property or safety of STAGEGRID, our clients or the public.",
          ],
        },
        {
          heading: "4. Data security",
          paragraphs: [
            "We take reasonable technical and organisational measures to protect information against unauthorised access, loss or misuse. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
          ],
        },
        {
          heading: "5. Your rights",
          paragraphs: [
            "You may request access to, correction of, or deletion of your personal information by contacting us using the details on the Contact page. We will respond within a reasonable timeframe in accordance with applicable South African law.",
          ],
        },
        {
          heading: "6. Cookies",
          paragraphs: [
            "This prototype does not set tracking or advertising cookies. A production deployment may use functional cookies (for example, to remember your Event Builder configuration or Equipment basket) — this policy will be updated accordingly.",
          ],
        },
        {
          heading: "7. Contact",
          paragraphs: [
            "Questions about this Privacy Policy can be sent via the Contact page.",
          ],
        },
      ]}
    />
  );
}
