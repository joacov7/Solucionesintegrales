import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-soft p-6 text-center">
      <div>
        <div className="text-6xl font-bold text-ink">404</div>
        <p className="mt-3 text-muted">La página que buscás no existe.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
