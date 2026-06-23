import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Show, SignInButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import SearchBar from "./SearchBar";

const NavBar = async () => {
  const sessionUser = await currentUser();
  // console.log("\n\n UserSession: ", sessionUser, "\n");
  const image = sessionUser?.imageUrl || "https://github.com/shadcn.png";

  return (
    <nav className="w-full p-3 fixed z-[9999] dark:bg-background bg-white">
      <div className="flex justify-around items-center">
        <Link href="/store" className="font-bold text-2xl">
          Siang Grocery
        </Link>
        <div className="flex w-fit gap-[2.5em] px-[1em] items-center text-xs cursor-pointer">
          <Link href="/store">All Products</Link>
          <Link href="/store/new-arrivals">New Arrivals</Link>
          <Link href="/store/recently-popular">Recently Popular</Link>
          <Link href="/store/order-tracking">Order Tracking</Link>
        </div>
        <SearchBar />
        <div className="flex gap-3 items-center">
          <Link href="/store/cart">
            <MdOutlineShoppingCart size={28} />
          </Link>
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <Button variant="ghost" className="text-sm p-0">
                <span className="rounded-lg px-3 py-1 text-white bg-linear-to-r from-[#85DEA7] via-[#63AD7F] to-[#52916A] hover:text-transparent hover:bg-clip-text">
                  Sign In
                </span>
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-7">
                  <AvatarImage src={image} />
                  <AvatarFallback>
                    <Avatar className="size-7"></Avatar>
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="dark:text-white font-bold text-sm text-black pt-3">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link
                      className="dark:text-gray-400 dark:hover:text-white"
                      href="/store/profile"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      className="dark:text-gray-400 dark:hover:text-white"
                      href="/store/wishlist"
                    >
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <SignOutButton>
                    <DropdownMenuItem className="text-red-500">
                      Log Out
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
