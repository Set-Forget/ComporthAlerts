import { BigQuery } from "@google-cloud/bigquery";
import { NextResponse, NextRequest } from "next/server";
import LZ from "lz-string";

export async function GET(request: NextRequest) {
  const bq = new BigQuery({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      universe_domain: "googleapis.com",
    },
  });

  const { searchParams } = new URL(request.url);
  const param = searchParams.get("q");
  const query = LZ.decompressFromEncodedURIComponent(param as string);
  const data = await bq.query(query);
  return NextResponse.json(data[0]);
}