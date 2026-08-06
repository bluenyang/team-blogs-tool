import { Feed } from 'feed';
import type { RawRssPosts } from '@croffledev/directus-blog-core';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { client, mappers } = useBlogCore();
  const { buildQuery, rss } = useQuery();

  const homepageUrl = (config.public.homepageUrl as string) || '';
  const blogUrl = (config.public.blogUrl as string) || '';
  const emailAddress = (config.public.emailAddress as string) || '';
  const blogTitle = (config.public.blogTitle as string) || 'Blog';
  const blogDescription = (config.public.blogDescription as string) || '';
  const blogAuthor = (config.public.blogAuthor as string) || blogTitle;

  const resp = await client.query<RawRssPosts>(buildQuery(rss));
  const posts = mappers.rss(resp);

  const feed = new Feed({
    title: blogTitle,
    description: blogDescription,
    id: blogUrl,
    link: homepageUrl || blogUrl,
    language: 'ko-KR',
    image: blogUrl ? `${blogUrl}/favicon.ico` : undefined,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${blogAuthor}`,
    generator: 'Nuxt Nitro',
    feedLinks: {
      rss2: blogUrl ? `${blogUrl}/rss.xml` : undefined,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.id,
      link: `${blogUrl}/posts/${post.postIdx}-${post.slug}`,
      description: post.summary || '',
      content: post.content || '',
      date: post.publishedAt,
      author: [
        {
          name: post.author,
          email: emailAddress,
          link: homepageUrl || blogUrl,
        },
      ],
    });
  });

  setHeader(event, 'content-type', 'application/xml; charset=utf-8');
  return feed.rss2();
});
