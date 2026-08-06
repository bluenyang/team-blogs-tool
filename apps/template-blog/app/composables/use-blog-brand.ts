export type ProfileLink = {
  name: string;
  url: string;
  icon: string;
  target?: string;
};

export type ProfileData = {
  title: string;
  desc: string;
  nickname: string;
  slug: string;
  githubProfileImage: string;
  link: ProfileLink[];
};

/** Brand + profile values from runtimeConfig (env). */
export function useBlogBrand() {
  const config = useRuntimeConfig();

  const title = computed(() => (config.public.blogTitle as string) || 'Blog');
  const description = computed(() => (config.public.blogDescription as string) || '');
  const author = computed(() => (config.public.blogAuthor as string) || title.value || 'Author');
  const siteName = computed(() => title.value);

  return { title, description, author, siteName };
}

export function useProfile() {
  const config = useRuntimeConfig();
  const { description, author } = useBlogBrand();

  return computed<ProfileData>(() => {
    const homepageUrl = (config.public.homepageUrl as string) || '';
    const githubUrl = (config.public.githubUrl as string) || '';
    const profileImageUrl = (config.public.profileImageUrl as string) || '';

    const link: ProfileLink[] = [];
    if (githubUrl) {
      link.push({ name: 'github', url: githubUrl, icon: 'mdi:github', target: '_blank' });
    }
    if (homepageUrl) {
      link.push({ name: 'website', url: homepageUrl, icon: 'mdi:home', target: '_blank' });
    }
    link.push({ name: 'rss', url: '/rss.xml', icon: 'mdi:rss', target: '_blank' });

    return {
      title: 'Profile',
      desc: description.value,
      nickname: author.value,
      slug: (config.public.blogSlug as string) || '',
      githubProfileImage: profileImageUrl,
      link,
    };
  });
}
