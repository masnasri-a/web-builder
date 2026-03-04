// Renders <link> tags that React / Next.js App Router hoists to <head>
// Works in both Server and Client components.

const SYSTEM_FONTS = ["Geist Sans"]

function toGoogleFontsUrl(name: string) {
  const family = name.replace(/ /g, "+")
  // Load regular + italic + bold weights for all invited fonts
  return `https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,400;0,600;0,700;1,400&display=swap`
}

export function FontLoader({
  fontFamily,
}: {
  // accept a single font or an array of fonts and render links for each
  fontFamily: string | string[]
}) {
  const fonts = Array.isArray(fontFamily) ? fontFamily : [fontFamily]
  const unique = Array.from(new Set(fonts))
  const toLoad = unique.filter((f) => f && !SYSTEM_FONTS.includes(f))
  if (toLoad.length === 0) return null

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {toLoad.map((f) => (
        <link
          key={f}
          rel="stylesheet"
          href={toGoogleFontsUrl(f)}
        />
      ))}
    </>
  )
}
