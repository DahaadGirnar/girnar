import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>An Error Occurred</CardTitle>
            <CardDescription>
              Please check your email for instructions on how to resolve the issue.
              If you do not receive an email, please contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              If you continue to experience issues, please try again later or contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
