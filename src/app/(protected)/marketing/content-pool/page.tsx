
'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContentAsset } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import { Library, PlusCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateContentAssetForm } from '@/components/marketing/create-content-asset-form';
import { Pencil } from 'lucide-react';

const PAGE_SIZE = 8;
const INCREMENT_SIZE = 4;

export default function ContentPoolPage() {
    const { t } = useTranslation('marketing');
    const [assets, setAssets] = useState<ContentAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "contentAssets"), limit(displayLimit));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const assetsData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                assetId: doc.id,
            })) as ContentAsset[];
            setAssets(assetsData);

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastDoc(lastVisible);
            
            if (querySnapshot.docs.length < displayLimit) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setLoading(false);
        }, (error) => {
            console.error("Error fetching content assets: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [displayLimit]);

    const loadMore = () => {
        setDisplayLimit(prev => prev + INCREMENT_SIZE);
    };

    const renderSkeletons = () => {
        return Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        ));
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 self-start">
                    <div>
                        <h2 className="text-xl font-bold">{t('contentPool.title')}</h2>
                        <p className="text-muted-foreground">{t('contentPool.description')}</p>
                    </div>
                </div>
                <div className="w-full sm:w-auto">
                    <CreateContentAssetForm>
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('contentPool.createAsset')}
                        </Button>
                    </CreateContentAssetForm>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('contentPool.filterByTags')} className="pl-8" />
                        </div>
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('contentPool.filterByBrands')} className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {loading && assets.length === 0 ? renderSkeletons() : assets.map(asset => (
                            <Card key={asset.assetId} className="overflow-hidden flex flex-col">
                                <div className="relative h-40 w-full bg-secondary">
                                    {asset.content.imageUrl ? (
                                        <Image src={asset.content.imageUrl} alt={asset.name} layout="fill" objectFit="cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Library className="h-16 w-16 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg truncate">{asset.name}</CardTitle>
                                    <CardDescription className="text-xs">{asset.assetType === 'social_post' ? t('createAssetForm.socialPost') : t('createAssetForm.campaignTemplate')}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{asset.content.text}</p>
                                    <div className="flex flex-wrap gap-1 mt-4">
                                        {asset.tags.slice(0, 3).map(tag => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                     <CreateContentAssetForm asset={asset}>
                                        <Button variant="outline" className="w-full">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            {t('createAssetForm.editTitle')}
                                        </Button>
                                    </CreateContentAssetForm>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {assets.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold">{t('contentPool.noAssets')}</h3>
                            <p className="text-muted-foreground mt-2">{t('contentPool.noAssetsDescription')}</p>
                        </div>
                    )}
                     {hasMore && !loading && (
                        <div className="mt-8 text-center">
                            <Button onClick={loadMore} variant="outline">
                                {t('contentPool.loadMore', { count: INCREMENT_SIZE })}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
