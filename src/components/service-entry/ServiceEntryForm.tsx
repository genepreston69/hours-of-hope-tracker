
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
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ServiceEntryForm = () => {
  const { form, onSubmit, totalHours, customers, isSubmitting } = useServiceEntryForm();
  const isMobile = useIsMobile();

  return (
    <Card className={`w-full ${isMobile ? 'border-0 shadow-none' : ''}`}>
      <CardHeader className={isMobile ? 'px-0' : ''}>
        <CardTitle>New Service Entry</CardTitle>
        <CardDescription>
          Record hours worked by recovery volunteers for a customer.
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'px-0 pb-6' : ''}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DateField control={form.control} />
            <CustomerField control={form.control} customers={customers} />
            <LocationField control={form.control} />
            <TimeFields control={form.control} />
            <NumberFields control={form.control} />
            <TotalHoursDisplay totalHours={totalHours} />
            <NotesField control={form.control} />

            <Button 
              type="submit" 
              disabled={customers.length === 0 || isSubmitting}
              className={`w-full ${isMobile ? 'sticky bottom-4 z-10 shadow-lg' : ''}`}
              size={isMobile ? "lg" : "default"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Service Entry"
              )}
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
