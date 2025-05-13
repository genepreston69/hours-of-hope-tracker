
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateField } from "./DateField";
import { CustomerField } from "./CustomerField";
import { LocationField } from "./LocationField";
import { NumberFields } from "./NumberFields";
import { TimeFields } from "./TimeFields";
import { NotesField } from "./NotesField";
import { TotalHoursDisplay } from "./TotalHoursDisplay";
import { useServiceEntryForm } from "./useServiceEntryForm";

const ServiceEntryForm = () => {
  const { form, onSubmit, totalHours, customers } = useServiceEntryForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Service Entry</CardTitle>
        <CardDescription>
          Record hours worked by recovery volunteers for a customer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DateField control={form.control} />
            <CustomerField control={form.control} customers={customers} />
            <LocationField control={form.control} />
            <TimeFields control={form.control} />
            <NumberFields control={form.control} />
            <TotalHoursDisplay totalHours={totalHours} />
            <NotesField control={form.control} />

            <Button type="submit" disabled={customers.length === 0}>
              Submit Service Entry
            </Button>
            {customers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Please add customers before entering service hours.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServiceEntryForm;
