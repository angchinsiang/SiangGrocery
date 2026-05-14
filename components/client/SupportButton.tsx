import { Button } from '@/components/ui/button'
import React from 'react'
import { RiCustomerService2Fill } from 'react-icons/ri';

const SupportButton = () => {
  return (
    <Button variant="link">
      Get Support <RiCustomerService2Fill className="size-5" />
    </Button>
  );
}

export default SupportButton