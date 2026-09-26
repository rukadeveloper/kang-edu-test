import { getAuthUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthUser()

  return (
    <div>{user.aud}</div>
  );
}
