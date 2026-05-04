import { redirect } from "next/navigation";

/*
 * The root "/" route is not a content page — it redirects to the demo slug.
 * Every real visitor lands on a personalised /<slug> URL sent via outreach.
 * The demo slug serves as the public-facing example / portfolio page.
 */
export default function Home() {
  redirect("/demo-hvac-dallas");
}
