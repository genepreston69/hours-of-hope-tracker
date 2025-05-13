
import { z } from "zod";

export const formSchema = z.object({
  date: z.date({
    required_error: "Service date is required",
  }),
  customerId: z.string({
    required_error: "Please select a customer",
  }),
  facilityLocationId: z.enum(["Bluefield", "Charleston", "Huntington", "Parkersburg"], {
    required_error: "Please select a location",
  }),
  hoursWorked: z.coerce
    .number()
    .positive("Hours must be greater than 0")
    .max(24, "Hours cannot exceed 24"),
  numberOfResidents: z.coerce
    .number()
    .int("Number of volunteers must be a whole number")
    .positive("Number of volunteers must be greater than 0"),
  notes: z.string().optional(),
});

export type ServiceEntryFormValues = z.infer<typeof formSchema>;
