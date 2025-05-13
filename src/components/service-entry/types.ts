
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
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  hoursWorked: z.coerce
    .number()
    .positive("Hours must be greater than 0")
    .max(24, "Hours cannot exceed 24")
    .optional(),
  numberOfResidents: z.coerce
    .number()
    .int("Number of volunteers must be a whole number")
    .positive("Number of volunteers must be greater than 0"),
  notes: z.string().optional(),
}).refine(data => {
  // If both times are provided, validate that end time is after start time
  if (data.startTime && data.endTime) {
    return data.endTime > data.startTime;
  }
  // If only one time is provided or none, we need hours worked
  return data.hoursWorked !== undefined && data.hoursWorked > 0;
}, {
  message: "End time must be after start time or hours must be provided",
  path: ["endTime"]
});

export type ServiceEntryFormValues = z.infer<typeof formSchema>;
