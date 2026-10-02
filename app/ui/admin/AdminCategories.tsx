"use client";

import { useState, type FormEvent } from "react";
import { Tags } from "lucide-react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import EmptyState from "@/app/ui/EmptyState";
import ErrorState from "@/app/ui/ErrorState";
import Input from "@/app/ui/Input";
import PageHeader from "@/app/ui/PageHeader";
import { useToast } from "@/app/ui/ToastProvider";
import ListSkeleton from "@/app/ui/dashboard/ListSkeleton";
import { categoriesApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/http";
import { useAsync } from "@/hooks/useAsync";

const AdminCategories = () => {
  const toast = useToast();
  const { data: categories, error, reload } = useAsync(categoriesApi.list);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (name.trim().length < 2) {
      setFormError("Enter a category name.");
      return;
    }
    setSaving(true);
    try {
      await categoriesApi.create({
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
      });
      toast.success(`Category “${name.trim()}” created.`);
      setName("");
      setDescription("");
      reload();
    } catch (createError) {
      setFormError(getErrorMessage(createError, "We couldn't create this category."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Providers pick from these when listing gear."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <Card className="p-5">
          <h2 className="font-semibold text-slate-900">New category</h2>
          <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
            {formError && <Alert variant="error">{formError}</Alert>}
            <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
            <Input
              label="Description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button type="submit" fullWidth loading={saving}>
              Create category
            </Button>
          </form>
        </Card>

        <div>
          {error ? (
            <ErrorState
              message={error}
              action={
                <Button variant="outline" onClick={reload}>
                  Try again
                </Button>
              }
            />
          ) : !categories ? (
            <ListSkeleton rows={3} />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={Tags}
              title="No categories yet"
              description="Create the first one so providers can start listing gear."
            />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <li key={category.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">{category.name}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{category.description || "No description"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
