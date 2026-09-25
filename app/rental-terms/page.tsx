import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Rental Terms — STAGEGRID",
  description: "Terms governing the rental of STAGEGRID equipment and infrastructure.",
};

export default function RentalTermsPage() {
  return (
    <LegalLayout
      title="Rental Terms"
      updated="24 September 2026"
      intro="These Rental Terms apply once a quote has been confirmed and equipment, crew or logistics services are booked through STAGEGRID. They sit alongside our general Terms of Service."
      sections={[
        {
          heading: "1. Equipment condition",
          paragraphs: [
            "All equipment is inspected and tested before dispatch. Equipment remains the property of STAGEGRID at all times and must be returned in the same condition, ordinary wear and tear excepted.",
          ],
        },
        {
          heading: "2. Delivery and collection",
          paragraphs: [
            "Delivery windows are confirmed as part of the booking and depend on venue access, loading conditions and route scheduling. Delays caused by venue access restrictions outside STAGEGRID's control are not the responsibility of STAGEGRID.",
            "Clients selecting self-collect are responsible for safe transport, loading and handling of all equipment for the duration of the rental period.",
          ],
        },
        {
          heading: "3. Damage and loss",
          paragraphs: [
            "The client is responsible for equipment from delivery/collection until it is returned to and checked in by STAGEGRID. Damage, loss or theft during this period may be charged at replacement or repair cost.",
            "We strongly recommend clients confirm their own event insurance covers third-party equipment in their care.",
          ],
        },
        {
          heading: "4. Payment terms",
          paragraphs: [
            "A deposit is required to confirm a booking, with the balance due prior to delivery unless otherwise agreed in writing. Invoices not settled by the due date may incur late payment charges.",
          ],
        },
        {
          heading: "5. Cancellation policy",
          paragraphs: [
            "Cancellations made with sufficient notice ahead of the event date may be eligible for a partial refund of any deposit paid, less costs already committed (crew scheduling, equipment reservation, third-party bookings). Cancellations closer to the event date may forfeit the full deposit.",
          ],
        },
        {
          heading: "6. Client responsibilities",
          paragraphs: [
            "Clients must ensure venue access, power supply (where not provided by STAGEGRID), and any required permits or permissions are confirmed and available ahead of the agreed delivery window.",
          ],
        },
        {
          heading: "7. Indemnity",
          paragraphs: [
            "The client agrees to indemnify STAGEGRID against claims arising from misuse of equipment by the client, their staff, or their other appointed suppliers, except where such claims arise from STAGEGRID's own negligence.",
          ],
        },
      ]}
    />
  );
}
