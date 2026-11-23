

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const programs = ["Generic BS Nursing", "Post RN BSN", "Diploma"] as const;

type AcademicRow = {
  exam: string;
  board: string;
  year: string;
  obtained: string;
  total: string;
};

const emptyRow: AcademicRow = {
  exam: "",
  board: "",
  year: "",
  obtained: "",
  total: "",
};

export function AdmissionApplicationForm() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [academic, setAcademic] = useState<AcademicRow[]>([
    { ...emptyRow },
    { ...emptyRow },
    { ...emptyRow },
  ]);

  function updateAcademic(index: number, field: keyof AcademicRow, value: string) {
    setAcademic((rows) =>
      rows.map((row, i) => i === index ? { ...row, [field]: value } : row)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const required = [
      "session_year", "applicant_name", "father_name",
      "date_of_birth", "cnic_bform", "phone", "address",
      "gender", "marital_status", "program_applied",
      "applicant_signature",
    ];

    for (const field of required) {
      if (!String(data.get(field) ?? "").trim()) {
        setError("Please complete all required fields.");
        return;
      }
    }

    const qualifications = academic.filter((row) =>
      Object.values(row).some((value) => value.trim())
    );

    if (!qualifications.length) {
      setError("Please enter at least one academic qualification.");
      return;
    }

    if (qualifications.some((row) => Object.values(row).some((value) => !value.trim()))) {
      setError("Please complete every field in each academic qualification row.");
      return;
    }

    const program = String(data.get("program_applied"));
    const documentsChecklist = data.getAll("documents_checklist").map(String);

    if (!programs.includes(program as (typeof programs)[number])) {
      setError("Please select a valid program.");
      return;
    }
    setSending(true);

    try {
      const { error: insertError } = await supabase
        .from("admission_applications")
        .insert({
          session_year: String(data.get("session_year")).trim(),
          applicant_name: String(data.get("applicant_name")).trim(),
          father_name: String(data.get("father_name")).trim(),
          date_of_birth: String(data.get("date_of_birth")),
          cnic_bform: String(data.get("cnic_bform")).trim(),
          phone: String(data.get("phone")).trim(),
          email: String(data.get("email")).trim() || null,
          address: String(data.get("address")).trim(),
          gender: String(data.get("gender")),
          marital_status: String(data.get("marital_status")),
          academic_qualifications: qualifications as unknown as Json,
          documents_checklist: documentsChecklist as unknown as Json,
          program_applied: program,
          applicant_signature: String(data.get("applicant_signature")).trim(),
          application_date: String(data.get("application_date")),
        });

      if (insertError) throw insertError;

      form.reset();
      setAcademic([{ ...emptyRow }, { ...emptyRow }, { ...emptyRow }]);
      setSuccess(true);
    } catch (err) {
      console.error("Admission application submission failed:", err);
      setError("Your application could not be submitted. Please check your details and try again.");
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div role="status" className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-12 text-green-600" />
        <h3 className="mt-4 text-2xl font-bold text-primary">Application Submitted</h3>
        <p className="mt-2 text-muted-foreground">
          Your admission application has been received successfully.
          Our Educational Consultancy team will contact you.
        </p>
        <Button className="mt-6" onClick={() => setSuccess(false)}>
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-blue-200 bg-white text-slate-900 shadow-lg"
    >
      <div className="border-b-4 border-blue-900 px-5 py-7 text-center sm:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-900">
          MAAK Enterprises — Educational Consultancy
        </p>
        <h2 className="mt-4 rounded-lg bg-blue-900 px-3 py-3 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
          Application for Admission
        </h2>
      </div>

      <div className="space-y-8 p-5 sm:p-8">
        <section className="space-y-4">
          <Field label="Session / Year">
            <Input name="session_year" placeholder="e.g. 2026–2027" required />
          </Field>

          <Field label="Applicant Name">
            <Input name="applicant_name" maxLength={150} required />
          </Field>

          <Field label="Father's Name">
            <Input name="father_name" maxLength={150} required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date of Birth">
              <Input name="date_of_birth" type="date" required />
            </Field>
            <Field label="CNIC / B-Form No.">
              <Input name="cnic_bform" maxLength={25} required />
            </Field>
            <Field label="Phone Number">
              <Input name="phone" type="tel" maxLength={30} required />
            </Field>
            <Field label="Email (Optional)">
              <Input name="email" type="email" maxLength={255} />
            </Field>
          </div>

          <Field label="Address">
            <Textarea name="address" rows={3} maxLength={1000} required />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Gender">
              <div className="flex gap-5 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="Male" required />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="Female" />
                  Female
                </label>
              </div>
            </Field>

            <Field label="Marital Status">
              <div className="flex gap-5 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="marital_status" value="Single" required />
                  Single
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="marital_status" value="Married" />
                  Married
                </label>
              </div>
            </Field>
          </div>
        </section>

        <section>
          <SectionTitle>Academic Qualifications</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-950">
                  {["Exam", "Board / University", "Year", "Marks Obtained", "Total Marks"].map((heading) => (
                    <th key={heading} className="border border-blue-300 p-2 text-left">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {academic.map((row, index) => (
                  <tr key={index}>
                    {(["exam", "board", "year", "obtained", "total"] as const).map((field) => (
                      <td key={field} className="border border-blue-300 p-1">
                        <Input
                          aria-label={`${field} for qualification ${index + 1}`}
                          className="h-10 border-0 shadow-none"
                          value={row[field]}
                          onChange={(event) => updateAcademic(index, field, event.target.value)}
                          maxLength={100}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionTitle>Program Applied For</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            {programs.map((program) => (
              <label key={program} className="flex items-center gap-2 rounded-lg border border-blue-200 p-3 font-medium">
                <input type="radio" name="program_applied" value={program} required />
                {program}
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Documents Checklist</SectionTitle>
          <p className="text-sm text-slate-600">
            Please confirm which documents you have available. No files need to be uploaded.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "CNIC / B-Form Copy",
              "Domicile Certificate",
              "Matric Certificate / DMC",
              "Passport Size Photographs (2)",
              "F.Sc. / Intermediate Certificate / DMC",
              "Other",
            ].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="documents_checklist" value={item} />
                {item}
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            This checklist is for the applicant's reference only.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Applicant Signature (Type Full Name)">
            <Input name="applicant_signature" maxLength={150} required />
          </Field>
          <Field label="Date">
            <Input
              name="application_date"
              type="date"
              defaultValue={new Date().toLocaleDateString("en-CA")}
              required
            />
          </Field>
        </section>

        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-950">
          By submitting this form, you confirm that the information provided is accurate
          and agree that MAAK Enterprises may contact you regarding this application.
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

        <Button type="submit" size="lg" disabled={sending} className="w-full bg-blue-900 hover:bg-blue-800">
          {sending ? <><Loader2 className="mr-2 size-4 animate-spin" />Submitting…</> : "Submit Admission Application"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-800">{label}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 rounded-lg bg-blue-900 px-4 py-2 text-center text-lg font-bold uppercase tracking-wide text-white">
      {children}
    </h3>
  );
}

