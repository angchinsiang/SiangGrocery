import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./NavBar";
import Footer from "@/components/server/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import { inter, itim, hennyPenny } from "./layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`${itim.variable} ${inter.variable} ${hennyPenny.variable} antialiased`}
      >
        {/* <QueryClientProvider client={queryClient}> */}
        <ClerkProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </ClerkProvider>{" "}
        {/* </QueryClientProvider> */}
      </body>
    </html>
  );
}
