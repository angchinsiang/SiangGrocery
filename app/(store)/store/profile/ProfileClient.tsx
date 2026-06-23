"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FaRegEdit } from "react-icons/fa";
import { FaChevronRight, FaCheck } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { SignOutButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState, useTransition, useRef, useEffect } from "react";
import { updateUserName } from "@/app/actions/profile";
import Link from "next/link";

export default function ProfileClient({
  initialName,
  image,
}: {
  initialName: string;
  image: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveName = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === name) {
      setDraft(name);
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const res = await updateUserName(trimmed);
      if (res.success) {
        setName(trimmed);
      }
      setEditing(false);
    });
  };

  const cancelEdit = () => {
    setDraft(name);
    setEditing(false);
  };

  return (
    <>
      <div>
        <div className="flex flex-col items-center gap-1">
          <Avatar size="lg">
            <AvatarImage src={image} />
            <AvatarFallback>
              <Avatar className="size-7"></Avatar>
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-1 items-center">
            {editing ? (
              <div className="flex items-center gap-1">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  disabled={isPending}
                  className="font-bold text-lg bg-transparent border-b-2 border-primary outline-none text-center w-40"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveName}
                  disabled={isPending}
                  className="size-8"
                >
                  <FaCheck className="size-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  disabled={isPending}
                  className="size-8"
                >
                  <MdClose className="size-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <p className="font-bold text-lg">{name}</p>
                <Button variant="ghost" onClick={() => setEditing(true)}>
                  <FaRegEdit className="size-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="px-10 flex flex-col">
        <Button
          asChild
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          variant="ghost"
          className="flex justify-between py-6 px-0"
        >
          <div className="flex justify-between pl-0">
            <div className="font-semibold text-lg">Themes</div>
            {mounted && (
              <Switch
                id="switch-theme"
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            )}
          </div>
        </Button>
        <div>
          <Link href="/store/profile/address">
            <Button
              variant="ghost"
              className="flex justify-between text-md p-0 w-full py-6"
            >
              <div className="font-semibold text-md">Address</div>
              <FaChevronRight className="size-3" />
            </Button>
          </Link>
        </div>
        <div>
          <Button
            variant="ghost"
            className="flex justify-between text-md p-0 w-full py-6"
          >
            <div className="font-semibold text-md">Change Password</div>
            <FaChevronRight className="size-3" />
          </Button>
        </div>
        <div>
          <SignOutButton>
            <Button
              variant="ghost"
              className="flex gap-2 justify-start text-md p-0 w-full py-6"
            >
              <div className="font-semibold text-md text-red-500">Log Out</div>
              <IoExitOutline className="size-5 text-red-500" />
            </Button>
          </SignOutButton>
        </div>
      </div>
    </>
  );
}
