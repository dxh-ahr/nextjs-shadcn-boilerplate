"use client";

import { useEffect, useState } from "react";

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch("/api/auth");
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
