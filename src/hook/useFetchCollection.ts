import { useState, useEffect } from "react";
import { COLLECTIONS } from "../config";
import { useFetch } from "./useFetch";
export const useFetchCollection = () => {
  const [collections, setCollections] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useFetch();

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetchData(COLLECTIONS, {
          method: "GET",
          redirect: "follow" as RequestRedirect,
        });
        const result = await response.json();
        setCollections(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromAPI();
  }, []);

  return { collections, loading, error };
};
