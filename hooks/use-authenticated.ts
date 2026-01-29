"use client";

import { API_ENDPOINTS } from "@/lib/constants";
import { useEffect, useState } from "react";

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch(API_ENDPOINTS.AUTH_CHECK);
      const data = await response.json();
      const token = data.token;
      setIsAuthenticated(token !== null);
    };
    getToken();
  }, []);

  return {
    isAuthenticated,
  };
}
