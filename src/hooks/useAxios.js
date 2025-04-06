import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAxios = ({ url, method = 'GET', body = null, headers = {} }, immediate = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        url,
        method,
        data: body,
        headers,
      });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, error, loading, refetch: fetchData };
};

export default useAxios;