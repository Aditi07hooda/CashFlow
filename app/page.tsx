import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeComponent from "@/components/home/HomeComponent";

export default async function Home() {
  const token = (await cookies()).get("jwt_token");

  if(!token) {
    redirect("/auth");
  }

  return (
    <>
      <HomeComponent />
    </>
  );
}
