
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const statuses = ["new", "reviewed", "contacted", "accepted", "rejected"] as const;

function readable(value: unknown): string {
  if (value == null || value === "") return "—";

  if (Array.isArray(value)) {
    if (!value.length) return "—";
    return value.map((item) =>
      typeof item === "object" && item !== null
        ? Object.entries(item)
            .map(([key, val]) => `${key}: ${String(val ?? "—")}`)
            .join(" · ")
        : String(item)
    ).join("\n");
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export function AdmissionApplications() {
  const queryClient = useQueryClient();

  const applications = useQuery({
    queryKey: ["admin-admission-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: typeof statuses[number];
    }) => {
      const { error } = await supabase
        .from("admission_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-admission-applications"],
      }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("admission_applications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-admission-applications"],
      }),
  });

  if (applications.isPending) {
    return <p role="status">Loading admission applications…</p>;
  }

  if (applications.isError) {
    return (
      <div className="space-y-3">
        <p role="alert">
          Admission applications could not be loaded. Please check administrator access and database permissions.
        </p>
        <Button variant="outline" onClick={() => applications.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl text-primary">Admission Applications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Total applications: {applications.data.length}
          </p>
        </div>

        <Button variant="outline" onClick={() => applications.refetch()}>
          Refresh
        </Button>
      </div>

      {updateStatus.isError && (
        <p role="alert" className="text-sm text-destructive">
          Application status could not be updated.
        </p>
      )}

      {remove.isError && (
        <p role="alert" className="text-sm text-destructive">
          Application could not be deleted.
        </p>
      )}

      {applications.data.length === 0 && (
        <p>No admission applications have been submitted yet.</p>
      )}

      <div className="grid gap-4">
        {applications.data.map((app) => (
          <article
            key={app.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  {app.applicant_name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {app.program_applied} · Submitted{" "}
                  {new Date(app.created_at).toLocaleString()}
                </p>

                <p className="mt-1 text-sm">
                  {app.phone}
                  {app.email ? ` · ${app.email}` : ""}
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm">
                Status
                <select
                  aria-label={`Application status for ${app.applicant_name}`}
                  className="rounded-md border border-input bg-background p-2"
                  value={app.status}
                  disabled={updateStatus.isPending}
                  onChange={(event) =>
                    updateStatus.mutate({
                      id: app.id,
                      status: event.target.value as typeof statuses[number],
                    })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <details className="mt-4 rounded-md bg-muted/40 p-3">
              <summary className="cursor-pointer font-medium">
                View complete application details
              </summary>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  ["Father's name", app.father_name],
                  ["Date of birth", app.date_of_birth],
                  ["CNIC / B-Form", app.cnic_bform],
                  ["Address", app.address],
                  ["Gender", app.gender],
                  ["Marital status", app.marital_status],
                  ["Session", app.session_year],
                  ["Application date", app.application_date],
                  ["Applicant signature", app.applicant_signature],
                ] as [string, string | null][]).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words text-sm">
                      {value || "—"}
                    </dd>
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-muted-foreground">
                    Academic qualifications
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
                    {readable(app.academic_qualifications)}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-muted-foreground">
                    Documents checklist
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
                    {readable(app.documents_checklist)}
                  </dd>
                </div>
              </dl>
            </details>

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={remove.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      `Permanently delete the application submitted by ${app.applicant_name}?`
                    )
                  ) {
                    remove.mutate(app.id);
                  }
                }}
              >
                Delete application
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
