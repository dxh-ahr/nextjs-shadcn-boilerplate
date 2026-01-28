"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/features/auth/actions/type";

type ServerAction<TInput, TOutput> = (
  input: TInput
) => Promise<ActionResult<TOutput>>;

interface UseServerActionMutationOptions<
  TInput,
  TOutput,
  TError = Error,
  TContext = unknown,
> extends Omit<
  UseMutationOptions<ActionResult<TOutput>, TError, TInput, TContext>,
  "mutationFn"
> {
  action: ServerAction<TInput, TOutput>;
  onSuccessRedirect?: (result: ActionResult<TOutput>) => string | null;
}

export function useServerActionMutation<
  TInput,
  TOutput,
  TError = Error,
  TContext = unknown,
>({
  action,
  onSuccessRedirect,
  onSuccess,
  ...options
}: UseServerActionMutationOptions<TInput, TOutput, TError, TContext>) {
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (input: TInput): Promise<ActionResult<TOutput>> => {
      return action(input);
    },
    onSuccess: (result, variables, context, mutation) => {
      if (onSuccessRedirect && result.success) {
        const redirectPath = onSuccessRedirect(result);
        if (redirectPath) {
          router.push(redirectPath);
        }
      }
      onSuccess?.(result, variables, context, mutation);
    },
  });
}
