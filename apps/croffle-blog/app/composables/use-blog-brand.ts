export type BrandLink = {
  name: string;
  label: string;
  url: string;
  icon: string;
  external?: boolean;
};

export const BRAND_LOGO = '/images/croffle-logo.png';

/** Brand values from runtimeConfig (env). */
export function useBlogBrand() {
  const config = useRuntimeConfig();

  const title = computed(() => (config.public.blogTitle as string) || 'Croffle Dev. Blog');
  const description = computed(
    () =>
      (config.public.blogDescription as string) ||
      '원광대학교 컴퓨터소프트웨어공학과 개발 동아리. 만들면서 배운 것을 기록으로 남깁니다.',
  );
  const author = computed(() => (config.public.blogAuthor as string) || 'Croffle Dev.');
  const siteName = computed(() => title.value);
  const blogUrl = computed(() => (config.public.blogUrl as string) || '');

  /** 워드마크를 "Croffle Dev." + "Blog"로 쪼개 accent를 뒷단어에만 준다. */
  const wordmark = computed(() => {
    const parts = title.value.trim().split(' ');
    if (parts.length < 2) {
      return { lead: title.value, accent: '' };
    }
    return { lead: parts.slice(0, -1).join(' '), accent: parts.at(-1) ?? '' };
  });

  const links = computed<BrandLink[]>(() => {
    const items: BrandLink[] = [];
    const github = config.public.githubUrl as string;
    const homepage = config.public.homepageUrl as string;
    const discord = config.public.discordUrl as string;
    const email = config.public.emailAddress as string;

    if (github) {
      items.push({
        name: 'github',
        label: 'GitHub',
        url: github,
        icon: 'simple-icons:github',
        external: true,
      });
    }
    if (homepage) {
      items.push({
        name: 'homepage',
        label: homepage.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        url: homepage,
        icon: 'lucide:globe',
        external: true,
      });
    }
    if (discord) {
      items.push({
        name: 'discord',
        label: 'Discord',
        url: discord,
        icon: 'simple-icons:discord',
        external: true,
      });
    }
    if (email) {
      items.push({ name: 'mail', label: 'Mail', url: `mailto:${email}`, icon: 'lucide:mail' });
    }
    items.push({ name: 'rss', label: 'RSS', url: '/rss.xml', icon: 'lucide:rss', external: true });

    return items;
  });

  return { title, description, author, siteName, blogUrl, wordmark, links, logo: BRAND_LOGO };
}
