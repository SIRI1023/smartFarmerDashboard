import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DateRange {
  start: string;
  end: string;
}

interface FetchConfig {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  dateRange?: {
    column: string;
    range: DateRange;
  };
  orderBy?: { column: string; ascending?: boolean };
  cacheTime?: number;
}

interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

export function useDataFetching<T>(config: FetchConfig) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const configRef = useRef(config);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCacheKey = useCallback(() => {
    return JSON.stringify({
      table: config.table,
      select: config.select,
      filters: config.filters,
      dateRange: config.dateRange,
      orderBy: config.orderBy
    });
  }, [config]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setLoading(true);
        const cacheKey = getCacheKey();
        const cacheEntry = cache.get(cacheKey);
        const cacheTime = config.cacheTime || 30000;

        if (cacheEntry && Date.now() - cacheEntry.timestamp < cacheTime) {
          setData(cacheEntry.data);
          setLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        let query = supabase
          .from(config.table)
          .select(config.select || '*')
          .eq('user_id', user.id);

        if (config.dateRange) {
          const { column, range } = config.dateRange;
          query = query
            .gte(column, `${range.start}T00:00:00`)
            .lte(column, `${range.end}T23:59:59`);
        }

        if (config.filters) {
          Object.entries(config.filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              query = query.eq(key, value);
            }
          });
        }

        if (config.orderBy) {
          query = query.order(config.orderBy.column, {
            ascending: config.orderBy.ascending ?? false
          });
        }

        const { data: result, error } = await query;

        if (error) throw error;

        cache.set(cacheKey, {
          data: result || [],
          timestamp: Date.now()
        });

        setData(result || []);
        setError(null);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching data:', err);
        setError(err.message);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getCacheKey]);

  return { data, loading, error };
}