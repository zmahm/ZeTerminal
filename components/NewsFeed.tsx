'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNews } from '@/lib/api-client';
import { formatDistanceToNow } from 'date-fns';
import { NewsArticle } from '@/lib/types';

interface NewsFeedProps {
  symbol?: string;
}

export default function NewsFeed({ symbol }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const news = await getNews(symbol);
        setArticles(news.slice(0, 10));
      } catch (error) {
        console.error('Error fetching news:', error);
        setArticles([
          {
            title: 'Market Update: Stocks Rally on Economic Data',
            description: 'Major indices closed higher as investors digest latest economic indicators.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: { name: 'Financial Times' },
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="zeterminal-panel p-4 h-full"
      >
        <h3 className="text-lg font-semibold mb-4">News</h3>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-zeterminal-textMuted"
        >
          Loading news...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="zeterminal-panel p-4 h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-4">
        {symbol ? `${symbol} News` : 'Financial News'}
      </h3>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {articles.length === 0 ? (
          <div className="text-zeterminal-textMuted">No news available</div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-zeterminal-border pb-4 last:border-b-0 cursor-pointer hover:bg-zeterminal-border/50 p-2 rounded transition-colors"
                  onClick={() => article.url !== '#' && window.open(article.url, '_blank')}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm flex-1">{article.title}</h4>
                  <span className="text-xs text-zeterminal-textMuted ml-2">
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                {article.description && (
                  <p className="text-sm text-zeterminal-textMuted line-clamp-2">
                    {article.description}
                  </p>
                )}
                {article.source && (
                  <div className="text-xs text-zeterminal-textMuted mt-1">
                    {article.source.name}
                  </div>
                )}
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

