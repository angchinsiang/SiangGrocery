import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export function useWishlist<State, Payload>(
  optimisticValue: State,
  optimisticCallback: (prev: State, payload?: () => void) => State,
  serverAction: {
    mainAction: (
      payload: Payload,
    ) => Promise<Record<string, boolean>>;
    options?: { onSuccess?: () => void; onError?: () => void };
  },
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
    const { mainAction, options } = serverAction;
    const { onSuccess, onError } = options || {};

    if (!userId) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }
    startTransition(async () => {
      setOptimisticWishlist(undefined);
      const res = await mainAction(payload);
      if (res.success && onSuccess) {
        onSuccess();
      } else if (!res.success && onError) {
        onError();
      }
    });
  };

  return [optimisticWishlist, handleWishlist, isPending];
}
