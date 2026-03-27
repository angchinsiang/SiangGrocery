import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Show, SignInButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <div className="bg-theme w-full">
      <NavigationMenu className="max-w-full flex justify-between">
        <NavigationMenuList className="flex gap-10 items-center pl-20">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="text-xl font-bold">
              Siang Grocery
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">About Us</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/contact-us">
              Contact Us
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/store">Shop Now</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList className="pr-20">
          <NavigationMenuItem>
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <Button variant="ghost" className="text-sm p-0">
                  <span className="rounded-lg px-3 py-1 text-white bg-linear-to-r from-[#85DEA7] via-[#63AD7F] to-[#52916A] hover:text-transparent hover:bg-clip-text">
                    Sign In
                  </span>
                </Button>
              </SignInButton>
            </Show>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
