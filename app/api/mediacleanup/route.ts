import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export const GET = async (req: NextRequest) => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const utapi = new UTApi();

  const orphanedFiles = await prisma.mediaAsset.findMany({
    where: {
      status: "DRAFT",
      createdAt: { lt: yesterday },
    },
  });

  if (orphanedFiles.length === 0) {
    new Response("Storage is clean!", { status: 200 });
  }

  const fileKeys = orphanedFiles.map((file) => file.id);

  try {
    await utapi.deleteFiles(fileKeys);
    await prisma.mediaAsset.deleteMany({
      where: { id: { in: fileKeys } },
    });
    return new Response(
      `Successfully deleted ${fileKeys.length} orphaned files.`,
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    new Response("Failed to delete files", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();

  if (!id) {
    return new Response("File key is required", { status: 400 });
  }

  const utapi = new UTApi();

  const orphanedFiles = await prisma.mediaAsset.findFirst({
    where: {
      id: id,
    },
  });

  if (orphanedFiles === null) {
    new Response("File not found", { status: 404 });
  }

  try {
    await utapi.deleteFiles(id);
    await prisma.mediaAsset.delete({
      where: { id: id },
    });
    return new Response(`Successfully deleted ${id} orphaned file.`, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    new Response("Failed to delete file", { status: 500 });
  }
};
