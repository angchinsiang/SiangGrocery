import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export function useWishlist<State, Payload>(
  optimisticValue: State,
  optimisticCallback: (prev: State, payload?: () => void) => State,
  serverAction: (
    payload: Payload & { userId: string; pathname: string },
  ) => Promise<any>,
): [State, (payload: Payload) => void, boolean] {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [optimisticWishlist, setOptimisticWishlist] = useOptimistic(
    optimisticValue,
    optimisticCallback,
  );

  const handleWishlist = (payload: Payload) => {
    if (!userId) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }
    startTransition(async () => {
      setOptimisticWishlist(undefined);
      await serverAction({ ...payload, userId, pathname });
    });
  };

  return [optimisticWishlist, handleWishlist, isPending];
}
