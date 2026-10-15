import { z } from "zod";
export const queryOptions = [
  { id: "website", title: "I need a website", detail: "A new website, landing page or a complete redesign.", icon: "01" },
  { id: "product", title: "I’m building a digital product", detail: "Turn an idea into user flows, interfaces and a prototype.", icon: "02" },
  { id: "improve", title: "I want a better user experience", detail: "Find friction and improve an existing website or product.", icon: "03" },
  { id: "strategy", title: "I need product guidance", detail: "Clarify requirements, prioritise features and define an MVP.", icon: "04" },
  { id: "ongoing", title: "I need an ongoing design partner", detail: "Design support as your business or product grows.", icon: "05" },
  { id: "unsure", title: "I’m not sure where to start", detail: "Let’s understand the problem and find the right next step.", icon: "06" },
] as const;
export const enquirySchema = z.object({
  submissionId: z.string().uuid(),
  queries: z.array(z.enum(["website", "product", "improve", "strategy", "ongoing", "unsure"])).min(1).max(6).refine(a => new Set(a).size === a.length),
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  contactMethod: z.enum(["email", "phone"]),
  contact: z.string().trim().max(254),
  website: z.string().max(0).optional(),
}).superRefine((data, ctx) => {
  const valid = data.contactMethod === "email"
    ? z.string().email().safeParse(data.contact).success
    : /^\+?[\d\s().-]+$/.test(data.contact) && data.contact.replace(/\D/g, "").length >= 7 && data.contact.replace(/\D/g, "").length <= 15;
  if (!valid) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact"], message: data.contactMethod === "email" ? "Please enter a valid email address." : "Please enter a valid phone number (7–15 digits)." });
});
