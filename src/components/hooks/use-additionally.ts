import { Additionally } from "@prisma/client";
import React from "react";
import { Api } from "../shared/services/api-client";

export const useAdditionally = (values: string[] = []) => {
  const [additionally, setAdditionally] = React.useState<Additionally[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAdditionally() {
      try {
        setLoading(true);
        const additionally = await Api.additionally.getAll();
        setAdditionally(additionally);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdditionally();
  }, []);

  return {
    additionally,
    loading,
  };
};
