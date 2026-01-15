import ClientView from "./client-view";

export default async function ManageTemplatePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <ClientView id={params.id} />;
}
