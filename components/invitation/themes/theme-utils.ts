import type { ThemeConfig, Section } from "@/types"

/**
 * Resolves theme colors by merging themeConfig overrides with hardcoded defaults.
 * Themes call this at render time so user-chosen colors take precedence.
 */
export function resolveThemeColors(
  themeConfig: ThemeConfig | undefined,
  defaults: {
    primary: string
    accent: string
    bg: string
    text: string
    border?: string
    secondary?: string
  }
) {
  return {
    primary: themeConfig?.primaryColor || defaults.primary,
    accent: themeConfig?.accentColor || defaults.accent,
    bg: themeConfig?.bgColor || defaults.bg,
    text: themeConfig?.textColor || defaults.text,
    border: themeConfig?.borderColor || defaults.border || `${defaults.primary}30`,
    secondary: themeConfig?.secondaryColor || defaults.secondary || defaults.bg,
  }
}

/**
 * Returns inline style for a section, including bgImage if set by the user,
 * and scroll snap alignment.
 */
export function sectionStyle(
  section: Section,
  overrideBg?: string
): React.CSSProperties {
  const bgImage = (section.content as { bgImage?: string }).bgImage
  return {
    scrollSnapAlign: "start" as const,
    scrollSnapStop: "always" as const,
    ...(bgImage
      ? {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : overrideBg
      ? { backgroundColor: overrideBg }
      : {}),
  }
}
