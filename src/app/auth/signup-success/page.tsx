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
            <CardTitle>Sign Up Successful</CardTitle>
            <CardDescription>
              You have successfully signed up. Please check your email for a
              confirmation link.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            Thank you for signing up!
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
