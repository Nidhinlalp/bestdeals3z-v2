<script setup lang="ts">
/**
 * The signature BMW-M rectangular button: 0px radius, uppercase letterspaced label.
 * Renders as <button>, <a> or <NuxtLink> depending on props.
 */
interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'light'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  to: undefined,
  href: undefined,
})

const base =
  'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[1.5px] text-button transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none select-none'

const variants: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-ink text-on-primary border border-ink hover:bg-transparent hover:text-ink',
  outline: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-on-primary',
  ghost: 'bg-transparent text-ink border border-transparent hover:border-hairline-strong',
  danger: 'bg-m-red text-white border border-m-red hover:bg-transparent hover:text-m-red',
  // For CTAs placed over dark imagery (banners/heroes): white fill, dark label.
  light: 'bg-white text-ink border border-white hover:bg-transparent hover:text-white',
}

const sizes: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-10 px-4 text-[12px]',
  md: 'h-12 px-6',
  lg: 'h-14 px-8',
}

const classes = computed(() => [
  base,
  variants[props.variant],
  sizes[props.size],
  props.block ? 'w-full' : '',
])

const component = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
</script>

<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    :type="to || href ? undefined : type"
    :disabled="to || href ? undefined : disabled || loading"
    :class="classes"
  >
    <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
      <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
    </svg>
    <slot />
  </component>
</template>
