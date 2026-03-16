import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full px-[5%] py-[2%] bg-theme">
      <div className="grid grid-cols-2 w-full ">
        <div className="text-2xl font-semibold">Siang Grocery</div>
        <div className="flex justify-around">
          <div className="flex flex-col gap-2">
            <p className="font-bold">Business</p>
            <p className="text-muted-foreground text-sm">About Us</p>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-2">
            <p className="font-bold">Support</p>
            <p className="text-muted-foreground text-sm">Contect Us</p>
          </div>
          <Separator orientation="vertical" />
          <div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">Find Us</p>
              <p className="text-muted-foreground text-sm">
                123 Main St, Anytown, USA
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <FaInstagram className="size-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <FaFacebook className="size-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <FaWhatsapp className="size-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 w-full">
        <div className="flex gap-2 space-x-4">
          <Button variant="link" className="text-muted-foreground text-xs">
            Terms & Conditions
          </Button>
          <Button variant="link" className="text-muted-foreground text-xs">
            Privacy Policy
          </Button>
        </div>
        <p className="text-muted-foreground text-xs text-right">
          &copy; 2026 Siang Grocery. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
