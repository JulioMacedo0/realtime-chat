import { useLocalSearchParams } from "expo-router";
import { z } from "zod";

export function useTypedLocalSearchParams<T extends z.AnyZodObject>(schema: T) {
  const params = useLocalSearchParams();
  const res = schema.safeParse(params);
  if (res.success) {
    return res.data as z.infer<T>;
  }
  const formattedErrors = res.error.errors
    .map((error) => {
      return `${error.path.join(".")} - ${error.message}`;
    })
    .join("\n");
  throw new Error(`Invalid params:\n${formattedErrors}`);
}
