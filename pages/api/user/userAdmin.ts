import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";

import { errorhandler } from "@/lib/errorHandler";
import prisma from "@/lib/prisma";
import { CustomUser } from "@/lib/types";
import { authOptions } from "../auth/[...nextauth]";


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse, 
) {
  if (req.method === "GET") {  
    // GET /api/user/userAdmin
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).end("Unauthorized");
    }
    const user = (session.user as CustomUser).id;

    try {
      const userData = await prisma.user.findUnique({
        where: {
          id: user,
        },
        select:{
            isAdmin: true,
        }
      });
    //   console.log(userData);
      return res.status(200).json({ isAdmin: userData?.isAdmin ?? false });
    } catch (error) {
      errorhandler(error, res);
    }
  } else {
    // We only allow GET and POST requests
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
