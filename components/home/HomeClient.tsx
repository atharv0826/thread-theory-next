"use client";
import React, { useEffect, useState } from 'react';
import RenderComponents from './RenderComponents';
import { getHomePageRes } from '../../lib/contentstack/api';
import { onEntryChange } from '../../lib/contentstack/sdk';

export default function HomeClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onEntryChange(() => {
      const fetchUpdate = async () => {
        const res = await getHomePageRes();
        if (res) setData(res);
      };
      fetchUpdate();
    });
  }, []);

  if (!data) return null;

  return (
    <RenderComponents components={data.page_sections} />
  );
}
