
import { z } from "zod";

export const formSchema = z.object({
  date: z.date({
    required_error: "Service date is required",
  }),
  customerId: z.string({
    required_error: "Please select a customer",
  }),
  facilityLocationId: z.string({
    required_error: "Please select a location",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  numberOfResidents: z.coerce
    .number()
    .int("Number of volunteers must be a whole number")
    .positive("Number of volunteers must be greater than 0"),
  notes: z.string().optional(),
}).refine(data => {
  // Validate that end time is after start time
  return data.endTime > data.startTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

export type ServiceEntryFormValues = z.infer<typeof formSchema>;
