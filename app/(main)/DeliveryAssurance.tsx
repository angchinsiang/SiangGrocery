import Courier from "@/public/Courier.png";
import Image from "next/image";
import VehicleInfo from "./VehicleCount";
import { TbMotorbike } from "react-icons/tb";
import { FaShuttleVan, FaTruck } from "react-icons/fa";

const DeliveryAssurance = () => {
  return (
    <div className="flex flex-col gap-12 px-20 py-10 w-full">
      <div className="font-bold text-3xl self-center">
        We ensure the product is delivered to you safely.
      </div>
      <div className="grid grid-cols-2 w-full">
        <div className="max-w-4/7 flex gap-2">
          <Image
            src={Courier}
            alt="A courier holding a pack of groceries."
            className="object-fit w-full"
          />
        </div>
        <div className="flex flex-col justify-around w-full  ">
          <div className=" flex gap-18">
            <VehicleInfo icon={<TbMotorbike size={30} />} count={50} />
            <VehicleInfo icon={<FaShuttleVan size={30} />} count={15} />
            <VehicleInfo icon={<FaTruck size={30} />} count={10} />
          </div>
          <div>
            Your groceries don&apos;t just get delivered; they get handled with
            care. At SiangGrocery, we maintain a strict &apos;Safety First&apos;
            protocol, ensuring that fragile produce and temperature-sensitive
            goods arrive in the exact same condition they left our shelves.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAssurance;
