import { Figtree } from "next/font/google";
import "./globals.css";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata = {
  title: "Cognitive Twin - Self-Evolving AI Learning Agent",
  description:
    "An AI that builds a live cognitive model of you and dynamically adapts how it teaches based on your understanding.",
  icons: {
    icon: "/fav-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-lt-installed={true}>
      <body className={` ${figtree.variable} antialiased bg-[#010B14]`}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
          toastStyle={{
            borderRadius: "16px",
            background: "#111827",
            color: "white",
            fontSize: "14px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
            padding: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          bodyStyle={{
            fontWeight: 600,
            letterSpacing: "0.2px",
            fontFamily: "var(--font-figtree)",
          }}
          progressStyle={{
            background: "linear-gradient(90deg, #0A69C9, #148ECD)",
          }}
        />
      </body>
    </html>
  );
}
