import "./globals.css";
import { GlobalProvider } from '@/context/GlobalContext';

export const metadata = {
  title: "Daily Notes",
  description: "Daily Notes",
};

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <html lang="en">
        <head>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
            crossOrigin="anonymous"
          />
        </head>
        <script
          async
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
          crossOrigin="anonymous"
        ></script>
        <body>{children}</body>
      </html>
    </GlobalProvider>
  );
}
