import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Booking Created!
              </CardTitle>
              <CardDescription>Your booking has been successfully created.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The booking has been sent to warden for approval. You will receive a notification once the booking is approved. If you have any questions or need to make changes, please contact the warden directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
