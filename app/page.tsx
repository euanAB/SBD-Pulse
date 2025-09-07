import { redirect } from "next/navigation"

export default function RootRedirectPage() {
  // Temporary: send all traffic to the dev login to choose a role
  redirect("/login")
}
