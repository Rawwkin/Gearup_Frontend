"use client";

import { useState, type FormEvent } from "react";
import Alert from "@/app/ui/Alert";
import Button from "@/app/ui/Button";
import Card from "@/app/ui/Card";
import Input from "@/app/ui/Input";
import PageHeader from "@/app/ui/PageHeader";
import Textarea from "@/app/ui/Textarea";
import { useAuth } from "@/app/ui/auth/AuthProvider";
import { useToast } from "@/app/ui/ToastProvider";
import { providerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/http";

const BusinessProfileForm = () => {
  const toast = useToast();
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [businessName, setBusinessName] = useState(user?.providerProfile?.businessName ?? "");
  const [description, setDescription] = useState(user?.providerProfile?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setNameError("Enter your name.");
      return;
    }
    setNameError(undefined);

    setSaving(true);
    try {
      await providerApi.updateProfile({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        businessName: businessName.trim(),
        description: description.trim(),
      });
      await refreshUser();
      toast.success("Business profile saved.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "We couldn't save your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Business profile"
        description="This is what renters see next to your listings."
      />
      <Card className="max-w-2xl p-5 sm:p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Input
            label="Business name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="e.g. Coastline Outfitters"
          />
          <Textarea
            label="About your business"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={nameError}
              required
            />
            <Input
              label="Phone number"
              type="tel"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="lg" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BusinessProfileForm;
