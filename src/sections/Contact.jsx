import { useState } from "react";
import { SectionReveal } from "@/components/SectionReveal";
import { ContactCard } from "@/components/contact/ContactCard";
import { ContactIntroColumn } from "@/components/contact/ContactIntroColumn";
import { site } from "@/config/site";
import { useToast } from "@/context/ToastContext";
import { trackEvent } from "@/analytics/analytics";
import { ACT_FORM_SUBMIT, CAT_CONTACT } from "@/analytics/eventConstants";
import { saveMessage } from "@/utils/messages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 20;
const MESSAGE_MAX = 500;

const emptyForm = () => ({
  name: "",
  email: "",
  subject: "",
  message: "",
  budget: "",
  projectType: "",
});

/**
 * Split contact layout with local contact form, floating labels, and clipboard email.
 */
export function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const f = site.contact.form;

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = /** @type {Record<string, string>} */ ({});
    if (!formData.name.trim()) nextErrors.name = f.requiredHint;
    if (!formData.email.trim()) nextErrors.email = f.requiredHint;
    else if (!EMAIL_RE.test(formData.email.trim())) nextErrors.email = f.emailInvalidHint;
    if (!formData.subject.trim()) nextErrors.subject = f.requiredHint;
    if (!formData.budget) nextErrors.budget = f.requiredHint;
    if (!formData.projectType) nextErrors.projectType = f.requiredHint;
    const msgLen = formData.message.trim().length;
    if (msgLen < MESSAGE_MIN) nextErrors.message = f.messageMinHint;
    if (formData.message.length > MESSAGE_MAX) nextErrors.message = f.messageMaxHint;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise((r) => window.setTimeout(r, 800));
      saveMessage({
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        budget: formData.budget,
        projectType: formData.projectType,
        sentAt: new Date().toISOString(),
        read: false,
        starred: false,
        replied: false,
      });
      showToast(f.successMessage, "success");
      trackEvent({ category: CAT_CONTACT, action: ACT_FORM_SUBMIT });
      setFormData(emptyForm());
      setErrors({});
    } catch (err) {
      console.error(err);
      showToast(f.genericErrorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      showToast(site.contact.section.copiedLabel, "success");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      showToast(site.contact.form.genericErrorMessage, "error");
    }
  };

  return (
    <SectionReveal
      id="contact"
      className="relative overflow-hidden scroll-mt-24 py-24 md:scroll-mt-28 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-24 h-72 w-72 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        <div className="absolute bottom-16 right-10 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <ContactIntroColumn copied={copied} onCopyEmail={copyEmail} />
          <ContactCard
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={loading}
            onSubmit={submit}
          />
        </div>
      </div>
    </SectionReveal>
  );
}
