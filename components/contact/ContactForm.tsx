"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/contact";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Message sent.");
      formRef.current?.reset();
    } else if (state.status === "error" && state.message && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* Honeypot field — hidden from real users via CSS, bots fill it in */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input id="name" name="name" required maxLength={120} disabled={isPending} />
        <FieldError>{state.fieldErrors?.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" name="email" type="email" required disabled={isPending} />
        <FieldError>{state.fieldErrors?.email}</FieldError>
      </div>

      <div>
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={4000} rows={6} disabled={isPending} />
        <FieldError>{state.fieldErrors?.message}</FieldError>
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
