import { useState } from "react";
import { getInitialForm } from "@/utils/courseForm";

export default function useCourseForm(initialData = null) {
  const [form, setForm] = useState(initialData || getInitialForm());

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    form,
    setForm,
    updateField,
  };
}
