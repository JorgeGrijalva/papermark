import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";

import { errorhandler } from "@/lib/errorHandler";
import prisma from "@/lib/prisma";
import { CustomUser } from "@/lib/types";

import { authOptions } from "../../../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse, 
) {
  if (req.method === "POST") {  
    // POST /api/teams/:teamId/billing/contact
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).end("Unauthorized");
    }

    const { teamId } = req.query as { teamId: string };
    // get name, email, company, message from req.body
    const { name, email, company, message } = req.body;
    // const userId = (session.user as CustomUser).id;

    try {
      const contact = await prisma.salesContact.create({
        data: {
          name,
          email,
          company,
          message,
          teamId,
        },
      });

      return res.status(200).json({ contact });
    } catch (error) {
      errorhandler(error, res);
    }
  } else {
    // We only allow GET and POST requests
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
