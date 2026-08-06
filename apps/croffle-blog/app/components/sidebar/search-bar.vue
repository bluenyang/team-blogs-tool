<script setup lang="ts">
  const router = useRouter();

  const searchValue = ref<string>('');

  function handleSearch() {
    if (!searchValue.value) return;

    router.push({
      path: '/search',
      query: { search: searchValue.value },
    });
  }
</script>

<template>
  <div class="px-2 py-4">
    <div
      class="bg-input-background focus-within:bg-input-background-focus flex h-10 items-center rounded-full ps-2 transition-colors duration-200"
    >
      <button
        type="button"
        aria-label="검색"
        class="hover:bg-input-background-focus flex size-7 items-center justify-center rounded-full p-1"
        @click="handleSearch"
      >
        <Icon name="lucide:search" class="size-5 text-gray-400" />
      </button>
      <input
        v-model="searchValue"
        type="text"
        placeholder="Search"
        class="w-full bg-none p-2 focus:outline-none"
        @keypress.enter="handleSearch"
      />
    </div>
  </div>
</template>
