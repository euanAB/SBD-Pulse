import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function InvitationDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Progress Skeleton */}
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-0.5 w-12" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-0.5 w-12" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Course Header Skeleton */}
        <Card>
          <CardHeader className="pt-16">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
          </CardHeader>
        </Card>

        {/* Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
