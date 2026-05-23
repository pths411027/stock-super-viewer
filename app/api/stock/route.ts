// This route runs on-demand (not pre-rendered) since it reads request URL params.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    price: 100,
  });
}
