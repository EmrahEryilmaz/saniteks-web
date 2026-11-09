import type { ColorOption, ColorOptionGroup, SpecMatrix } from "@/data/products";

/** Round colour chip. The border keeps white swatches visible; colour comes from catalogue data. */
export function Swatch({ color, size = "md" }: { color: ColorOption; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full border border-border-strong ${size === "sm" ? "size-5" : "size-8"}`}
      style={{ backgroundColor: color.hex }}
    />
  );
}

/** Fibre colour alternatives with their order codes. */
export function ColorOptionList({ group }: { group: ColorOptionGroup }) {
  return (
    <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {group.options.map((option) => (
        <li key={option.code ?? option.name} className="flex min-h-16 items-center gap-4 rounded-sm border border-border bg-surface px-4 py-3">
          <Swatch color={option} />
          <span className="min-w-0">
            <span className="block font-semibold">{option.name}</span>
            {option.code ? <span className="block text-sm tabular-nums text-muted-foreground">{option.code}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Grammage × colour availability table (raw materials). */
export function SpecMatrixTable({ matrix }: { matrix: SpecMatrix }) {
  return (
    <div className="mt-9 overflow-hidden rounded-sm border border-border bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{matrix.title}</caption>
        <thead className="bg-surface-strong">
          <tr>
            <th scope="col" className="w-36 px-4 py-3 font-semibold">
              Gramaj
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Renk seçenekleri
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {matrix.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="px-4 py-3 font-semibold tabular-nums whitespace-nowrap">
                {row.label}
              </th>
              <td className="px-4 py-3">
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {row.colors.map((color) => (
                    <li key={color.name} className="flex items-center gap-2">
                      <Swatch color={color} size="sm" />
                      <span>{color.name}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
