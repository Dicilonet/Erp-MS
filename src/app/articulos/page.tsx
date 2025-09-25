
'use client';

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { Package, PlusCircle, List, Search, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArticleForm } from '@/components/article-form';
import type { Article } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation('common');


  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const functions = getFunctions(app, 'europe-west1');
        const getArticles = httpsCallable(functions, 'getArticles');
        const result: any = await getArticles();
        if (result.data.success) {
          setArticles(result.data.articles);
        } else {
          throw new Error(result.data.message || 'Failed to fetch articles');
        }
      } catch (error: any) {
        toast({ variant: 'destructive', title: t('articles.toast.error.title'), description: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [toast, t]);
  
  const handleArticleCreated = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const handleArticleUpdated = (updatedArticle: Article) => {
    setArticles(prev => prev.map(a => a.articleId === updatedArticle.articleId ? updatedArticle : a));
  };


  const filteredArticles = articles.filter(article =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.articleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  const renderSkeletons = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
      </TableRow>
    ))
  );

  const renderTableContent = (items: Article[]) => {
    if (loading) return renderSkeletons();
    if (items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            {t('articles.noArticles')}
          </TableCell>
        </TableRow>
      );
    }
    return items.map(article => (
      <TableRow key={article.articleId}>
        <TableCell className="font-mono">{article.articleNumber}</TableCell>
        <TableCell className="font-medium">{article.name}</TableCell>
        <TableCell>{article.unit}</TableCell>
        <TableCell>{formatCurrency(article.priceNet)}</TableCell>
        <TableCell>{article.taxRate}%</TableCell>
        <TableCell className="text-right">
            <ArticleForm 
              articleToEdit={article}
              onArticleCreated={handleArticleCreated}
              onArticleUpdated={handleArticleUpdated}
            >
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </ArticleForm>
        </TableCell>
      </TableRow>
    ));
  };


  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0 mb-6">
        <div className="flex items-center gap-4 self-start">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('articles.title')}</h1>
            <p className="text-muted-foreground">{t('articles.description')}</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
            <ArticleForm onArticleCreated={handleArticleCreated} onArticleUpdated={handleArticleUpdated}>
              <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('articles.new')}
              </Button>
            </ArticleForm>
        </div>
      </div>

      <Card>
        <CardHeader>
           <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('articles.searchPlaceholder')}
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">{t('articles.tabs.all')}</TabsTrigger>
                    <TabsTrigger value="products">{t('articles.tabs.products')}</TabsTrigger>
                    <TabsTrigger value="services">{t('articles.tabs.services')}</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('articles.table.number')}</TableHead>
                                <TableHead>{t('articles.table.name')}</TableHead>
                                <TableHead>{t('articles.table.unit')}</TableHead>
                                <TableHead>{t('articles.table.priceNet')}</TableHead>
                                <TableHead>{t('articles.table.tax')}</TableHead>
                                <TableHead className="text-right">{t('articles.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {renderTableContent(filteredArticles)}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="products">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('articles.table.number')}</TableHead>
                                <TableHead>{t('articles.table.name')}</TableHead>
                                <TableHead>{t('articles.table.unit')}</TableHead>
                                <TableHead>{t('articles.table.priceNet')}</TableHead>
                                <TableHead>{t('articles.table.tax')}</TableHead>
                                <TableHead className="text-right">{t('articles.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                          {renderTableContent(filteredArticles.filter(a => a.type === 'product'))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="services">
                     <Table>
                        <TableHeader>
                            <TableRow>
                               <TableHead>{t('articles.table.number')}</TableHead>
                               <TableHead>{t('articles.table.name')}</TableHead>
                               <TableHead>{t('articles.table.unit')}</TableHead>
                               <TableHead>{t('articles.table.priceNet')}</TableHead>
                               <TableHead>{t('articles.table.tax')}</TableHead>
                               <TableHead className="text-right">{t('articles.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {renderTableContent(filteredArticles.filter(a => a.type === 'service'))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
