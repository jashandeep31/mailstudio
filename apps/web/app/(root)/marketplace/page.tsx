import { Metadata } from "next";
import ClientView from "./client-view";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Explore our collection of professionally designed, responsive email templates. Free and premium MJML templates for newsletters, transactional emails, and marketing campaigns.",
};

const page = () => {
  return <ClientView />;
};

export default page;
