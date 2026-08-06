<script setup lang="ts">
  const props = defineProps<{ post: PostItem }>();

  const { onNavigate, isPending } = useNavFeedback();

  const formattedDate = computed(() => formatPostDateYmd(props.post.publishedAt));

  const categories = computed(() => {
    if (!props.post.categories) return [];
    return props.post.categories;
  });

  const linkKey = computed(() => `post-${props.post.slug}`);
</script>

<template>
  <NuxtLink
    :to="`/posts/${post.postIdx}-${post.slug}`"
    :aria-busy="isPending(linkKey)"
    :class="
      cn(
        'group bg-card hover:bg-card-hover hover:border-border flex flex-col overflow-hidden rounded-2xl border border-transparent transition-all',
        isPending(linkKey) && 'pointer-events-none opacity-60',
      )
    "
    @click="onNavigate(linkKey)"
  >
    <div class="bg-muted h-2 w-full dark:bg-white/10"></div>
    <div class="p-5">
      <!-- Top Meta -->
      <div class="text-muted-foreground mb-3 flex items-center text-sm">
        <span>{{ categories.length > 0 ? categories[0] : 'Uncategorized' }}</span>
      </div>

      <!-- Title -->
      <h3
        class="text-foreground group-hover:text-muted-foreground mb-3 line-clamp-2 text-xl font-bold tracking-tight transition-colors"
      >
        {{ post.title }}
      </h3>

      <!-- Summary -->
      <p class="text-muted-foreground mb-5 line-clamp-2 text-sm leading-relaxed md:line-clamp-4">
        {{ post.summary || '' }}
      </p>

      <!-- Footer Meta -->
      <div class="text-muted-foreground mt-auto flex items-center text-sm">
        <Icon name="lucide:calendar" class="mr-2 size-4" />
        <time :datetime="post.publishedAt || ''">{{ formattedDate }}</time>
      </div>
    </div>
  </NuxtLink>
</template>
