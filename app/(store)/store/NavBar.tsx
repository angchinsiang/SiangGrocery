import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
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

const NavBar = () => {
  return (
    <nav className="w-full p-3 ring-2">
      <div className="flex justify-around">
        <Link href="/store" className="font-bold text-2xl">
          Siang Grocery
        </Link>
        <div className="flex gap-10">
          <Link href="/store">All Products</Link>
          <Link href="/store/new-arrivals">New Arrivals</Link>
          <Link href="/store/recently-popular">Recently Popular</Link>
          <Link href="/store/order-tracking">Order Tracking</Link>
        </div>
        <div className="flex gap-3">
          <Link href="/store/cart">
            <MdOutlineShoppingCart size={28} />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>User Avatar</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Log Out</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
