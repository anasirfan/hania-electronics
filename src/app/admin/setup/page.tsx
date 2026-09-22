import { redirect } from "next/navigation";

/** Developer-only setup moved off the admin nav. */
export default function AdminSetupRedirect() {
  redirect("/admin");
}
